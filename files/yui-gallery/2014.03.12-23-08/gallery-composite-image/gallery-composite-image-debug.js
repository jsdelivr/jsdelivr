YUI.add('gallery-composite-image', function (Y, NAME) {

/**
@module gallery-composite-image
@author Steven Olmsted
*/
(function (Y) {
    'use strict';

    var _string_f32 = 'f32',
        _string_f64 = 'f64',
        _string_number = 'number',
        _string_s16 = 's16',
        _string_s32 = 's32',
        _string_s8 = 's8',
        _string_u16 = 'u16',
        _string_u32 = 'u32',
        _string_u8 = 'u8',
        _true = true,

        _ArrayBuffer = ArrayBuffer,
        _DataView = DataView,
        _Lang = Y.Lang,
        _Object = Object,
        _YArray = Y.Array,

        _cached = Y.cached,
        _defineProperties = _Object.defineProperties,
        _each = _YArray.each,
        _flatten = _YArray.flatten,
        _freeze = _Object.freeze,
        _isArray = _Lang.isArray,
        _map = _YArray.map,
        _reduce = _YArray.reduce,

        /**
        Y.Composite.Image is an interface for manipulating multi-dimensional
        arrays of uncompressed binary data.  It is primarily designed for
        working with images and its internal data is compatible with the RGBA
        image format used by the canvas context2d object.  Above and beyond
        two-dimensional images, Y.Composite.Image is theoretically capable of
        supporting unlimited pixel dimensions and unlimited data channels.  This
        opens up a wide range of potential uses including working with
        compositing layers, animation or video, or voxel data sets like those
        used for 3D rendering simulations or a world map in games like
        Minecraft.

        Y.Composite.Image internally stores and interacts with its data by using
        typed arrays.  It uses some relatively new features of typed arrays
        including DataView and Uint8ClampedArray.  There is no support for older
        browsers without these features.

        The Y.Composite.Image constructor accepts an optional configuration
        object with the following optional parameters:

        * `channels`: Every pixel within an image may contain one or more
          values.  These are called channels.  A default image has four channels
          referred to as RGBA.  The first channel stores the red component of
          the pixel's color, the second channel stores the green component, then
          blue is third, and the alpha channel is last.  These channels are all
          unsigned 8-bit integers.  In other words the value can be an integer
          from 0 to 255.

          When creating a new image, these default channels may be used or
          custom channels may be defined.  There must be at least one channel
          but there is no upper limit on the number of channels an image may
          have.  Channels may also be a data type other than unsigned 8-bit
          integers; they may be any numerical type used by typed arrays.

          To specify custom channels, pass in an array.  The length of the array
          will determine the number of channels and the value of each item in
          the array will denote the data type of that channel.  The accepted
          types are:

          * 'f32' - 32-bit floating point number
          * 'f64' - 64-bit floating point number
          * 's16' - Signed 16-bit integer
          * 's32' - Signed 32-bit integer
          * 's8' - Signed 8-bit integer
          * 'u16' - Unsigned 16-bit integer
          * 'u32' - Unsigned 32-bit integer
          * 'u8' - Unsigned 8-bit integer

          If left undefined, channels is set to ['u8', 'u8', 'u8', 'u8']

          It is permitted to use channels of different types such as
          ['u8', 's16', 'f64', 's8', 'f32'] but due to technical and boring
          reasons including byte alignment and endianness this is much less
          efficient than using homogeneous channel types.

          Also note that the total byte size and number of channels can have
          a huge impact on memory usage.

        * `data`: The initial data to populate the image with.  If this is left
          undefined, the image will be entirely initialized with zeros.  Data
          may be passed in as either an ArrayBuffer or a regular Array.  If a
          regular array is passed in, nothing is done to validate the data or
          the size of the array.  An invalid array will probably yield undesired
          results.

        * `dimensions`: An image is basically just a multi-dimensional array and
          the dimensions determine the size, shape, and number of pixels in the
          image.  If left undefined, dimensions defaults to the two-dimensional
          square [512, 512].  For standard two-dimensional images, think of this
          as [width, height]

          There must be at least one dimension but there is no upper limit on
          the number of dimensions an image may have.  Each dimension must have
          at least one pixel but there is no upper limit on the number of pixels
          a dimension may have.

          For example a really long line could be defined with the dimensions
          [9999999999] or a 3D box could be defined with the dimensions
          [24, 37, 42] or a 4D hypercube could be defined with the dimensions
          [21, 21, 21, 21]

          This API standardizes on the term `pixel` to mean an element of a
          multi-dimensional array even when there are more dimensions and a term
          like voxel might be more technically correct.

          Also note that the total size and number of dimensions can have a huge
          impact on memory usage.

        * `littleEndian`: This boolean option defaults to false and it only
          matters when there are channels of mixed types and at least one of
          them is bigger than 8 bits.  In most common uses, it can be ignored.

        The internal data structure of Y.Composite.Image is an ArrayBuffer,
        which is like a single-dimensional array of binary numbers.  The
        dimensions and channels are sequentially stacked behind each other.  For
        example, for an image with three channels and dimensions [2, 3] the
        binary data is arranged like this:

        * pixel 0 at (0, 0) channel 0
        * pixel 0 at (0, 0) channel 1
        * pixel 0 at (0, 0) channel 2
        * pixel 1 at (1, 0) channel 0
        * pixel 1 at (1, 0) channel 1
        * pixel 1 at (1, 0) channel 2
        * pixel 2 at (0, 1) channel 0
        * pixel 2 at (0, 1) channel 1
        * pixel 2 at (0, 1) channel 2
        * pixel 3 at (1, 1) channel 0
        * pixel 3 at (1, 1) channel 1
        * pixel 3 at (1, 1) channel 2
        * pixel 4 at (0, 2) channel 0
        * pixel 4 at (0, 2) channel 1
        * pixel 4 at (0, 2) channel 2
        * pixel 5 at (1, 2) channel 0
        * pixel 5 at (1, 2) channel 1
        * pixel 5 at (1, 2) channel 2

        Notice that there are two ways to identify a pixel.  A pixel can be
        identified by its dimensional location or by its unique array index.
        This API refers to these values as pixelLocation and pixelIndex.  In
        some places the API may accept them interchangeably.  Accessing pixels
        by pixelIndex is generally more efficient.
        @class Image
        @constructor
        @namespace Composite
        @param {Object} [configuration] A configuration object with the
        following optional parameters:
        @param {[String]} [configuration.channels]
        @param {ArrayBuffer|[Number]} [configuration.data]
        @param {[Number]} [configuration.dimensions]
        @param {Boolean} [configuration.littleEndian]
        */
        _Class = function () {
            this._init.apply(this, arguments);
        };

    Y.namespace('Composite').Image = Y.mix(_Class, {
        /**
        A static list of all the valid channel data types.
        @property dataTypes
        @final
        @static
        @type Object
        */
        dataTypes: {
            f32: _string_f32,
            f64: _string_f64,
            s16: _string_s16,
            s32: _string_s32,
            s8: _string_s8,
            u16: _string_u16,
            u32: _string_u32,
            u8: _string_u8
        },
        /**
        The channels value to use when custom channels are not passed in to the
        constructor.
        @property defaultChannels
        @static
        @type [String]
        */
        defaultChannels: [
            _string_u8,
            _string_u8,
            _string_u8,
            _string_u8
        ],
        /**
        The dimensions value to use when custom dimensions are not passed in to
        the constructor.
        @property defaultDimensions
        @static
        @type [Number]
        */
        defaultDimensions: [
            512,
            512
        ],
        prototype: {
            /**
            Reset all channel values of all pixels to zero.
            @method clear
            @chainable
            */
            clear: function () {
                var me = this;

                me._data = new _ArrayBuffer(me.pixelCount * me._pixelSize);

                return me;
            },
            /**
            Returns an exact copy of this image.
            @method clone
            @return {Composite.Image}
            */
            clone: function () {
                var me = this;

                return new _Class({
                    channels: me.channels,
                    data: me._data.slice(0),
                    dimensions: me.dimensions,
                    littleEndian: me._littleEndian
                });
            },
            /**
            Call an iteration function for each pixel index in the image.  This
            method is more efficient than `eachPixelLocation` but it does not
            provide pixel locations.
            @method eachPixelIndex
            @chainable
            @param {Function} iterationFunction The iteration function receives
            two arguments:
            @param {Number} iterationFunction.pixelIndex The pixel's unique
            index within the image.
            @param {Composite.Image} iterationFunction.image This image.
            */
            eachPixelIndex: function (iterationFunction) {
                var me = this,
                    pixelCount = me.pixelCount,
                    pixelIndex = 0;

                for (; pixelIndex < pixelCount; pixelIndex += 1) {
                    iterationFunction(pixelIndex, me);
                }

                return me;
            },
            /**
            Call an iteration function for each pixel location in the image.
            @method eachPixelLocation
            @chainable
            @param {Function} iterationFunction The iteration function receives
            three arguments:
            @param {[Number]} iterationFunction.pixelLocation An array of
            dimension indicies.  The length of this array will match the number
            of dimensions in the image.
            @param {Number} iterationFunction.pixelIndex The pixel's unique
            index within the image.
            @param {Composite.Image} iterationFunction.image This image.
            */
            eachPixelLocation: function (iterationFunction) {
                var me = this,
                    dimensions = me.dimensions,

                    dimensionCount = dimensions.length,
                    dimensionIndex = 0,
                    pixelCount = me.pixelCount,
                    pixelIndex = 0,
                    pixelLocation = [];

                for (; dimensionIndex < dimensionCount; dimensionIndex += 1) {
                    pixelLocation[dimensionIndex] = 0;
                }

                for (; pixelIndex < pixelCount; pixelIndex += 1) {
                    iterationFunction(pixelLocation.slice(), pixelIndex, me);

                    for (dimensionIndex = 0; dimensionIndex < dimensionCount; dimensionIndex += 1) {
                        pixelLocation[dimensionIndex] += 1;

                        if (pixelLocation[dimensionIndex] < dimensions[dimensionIndex]) {
                            break;
                        }

                        pixelLocation[dimensionIndex] = 0;
                    }
                }

                return me;
            },
            /**
            Returns a copy of the image data as a regular JavaScript array.
            @method getDataArray
            @return {[Number]}
            */
            getDataArray: function () {
                var me = this,

                    dataView = me._dataView;

                return dataView instanceof _DataView ? (function () {
                    var channelCount = me.channels.length,
                        dataArray = [];

                    me.eachPixelIndex(function (pixelIndex) {
                        for (var channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
                            dataArray.push(me._getValue(pixelIndex, channelIndex));
                        }
                    });

                    return dataArray;
                }()) : _YArray(dataView);
            },
            /**
            Returns the pixel index for the given dimension indices.
            @method getPixelIndex
            @param {Number|[Number]} dimensionIndices* The dimensionIndices may
            be provided either as positional arguments or as a single array.
            The number of indices must match the number of dimensions in the
            image.
            @return {Number}
            */
            getPixelIndex: function () {
                return this._getPixelIndex.apply(this, _flatten(arguments));
            },
            /**
            Returns an array of channel values for a specific pixel.
            @method getPixelValues
            @param {Number|[Number]} pixelIndexOrLocation This may be either the
            pixel's unique index within the image or an array of dimension
            indicies.  The length of this array must match the number of
            dimensions in the image.
            @param {[Number]} [channelIndices] By default, all channel values
            are returned in order.  Specific channels may be excluded,
            rearranged, or duplicated by passing in an array of channel indices.
            For example, if the image has four channels, the array [3, 2, 1, 0]
            would retrieve them in reverse order and the array [0, 1, 2] would
            retrieve the first three channels and ignore the fourth.
            @return {[Number]}
            */
            getPixelValues: function (pixelIndexOrLocation, channelIndices) {
                var me = this;

                return _map(channelIndices || me.channels, channelIndices ? function (channelIndex) {
                    return me.getValue(pixelIndexOrLocation, channelIndex);
                } : function (channelDataType, channelIndex) {
                    return me.getValue(pixelIndexOrLocation, channelIndex);
                });
            },
            /**
            Returns the value from a specific channel of a specific pixel.
            @method getValue
            @param {Number|[Number]} pixelIndexOrLocation This may be either the
            pixel's unique index within the image or an array of dimension
            indicies.  The length of this array must match the number of
            dimensions in the image.
            @param {Number} channelIndex The specific channel index to get.
            @return {Number}
            */
            getValue: function (pixelIndexOrLocation, channelIndex) {
                return this._getValue(typeof pixelIndexOrLocation === _string_number ? pixelIndexOrLocation : this.getPixelIndex(pixelIndexOrLocation), channelIndex);
            },
            /**
            Sets the image data from a regular JavaScript array.  Nothing is
            done to validate the data or the size of the array.  An invalid
            array will probably yield undesired results.
            @method setDataArray
            @chainable
            @param {[Number]} dataArray
            */
            setDataArray: function (dataArray) {
                var me = this,

                    channelCount = me.channels.length,
                    valueIndex = 0;

                return me.eachPixelIndex(function (pixelIndex) {
                    for (var channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
                        me._setValue(pixelIndex, channelIndex, dataArray[valueIndex]);
                        valueIndex += 1;
                    }
                });
            },
            /**
            Set channel values for a specific pixel.
            @method setPixelValues
            @chainable
            @param {Number|[Number]} pixelIndexOrLocation This may be either the
            pixel's unique index within the image or an array of dimension
            indicies.  The length of this array must match the number of
            dimensions in the image.
            @param {[Number]} pixelValues The values to set.
            @param {[Number]} [channelIndices] By default, all channels are set
            in order.  Specific channels may be excluded or rearranged by
            passing in an array of channel indices.  For example, if the image
            has four channels, the array [3, 2, 1, 0] would set them in reverse
            order and the array [2, 3] would set the third and fourth channels
            but ignore the first two.  If a channel is duplicated in this array,
            later values will overwrite previous values.
            */
            setPixelValues: function (pixelIndexOrLocation, pixelValues, channelIndices) {
                var me = this;

                _each(channelIndices || pixelValues, channelIndices ? function (channelIndex, pixelValueIndex) {
                    me.setValue(pixelIndexOrLocation, channelIndex, pixelValues[pixelValueIndex]);
                } : function (pixelValue, channelIndex) {
                    me.setValue(pixelIndexOrLocation, channelIndex, pixelValue);
                });

                return me;
            },
            /**
            Sets the value of a specific channel of a specific pixel.
            @method setValue
            @chainable
            @param {Number|[Number]} pixelIndexOrLocation This may be either the
            pixel's unique index within the image or an array of dimension
            indicies.  The length of this array must match the number of
            dimensions in the image.
            @param {Number} channelIndex The specific channel index to set.
            @param {Number} value The value to set.
            */
            setValue: function (pixelIndexOrLocation, channelIndex, value) {
                return this._setValue(typeof pixelIndexOrLocation === _string_number ? pixelIndexOrLocation : this.getPixelIndex(pixelIndexOrLocation), channelIndex, value);
            },
            /**
            Returns a serializable object.  This object can be passed to the
            Y.Composite.Image constructor to recreate this image.
            @method toJSON
            @return {Object}
            */
            toJSON: function () {
                var me = this,

                    littleEndian = me._littleEndian,
                    object = {
                        channels: me.channels,
                        data: me.getDataArray(),
                        dimensions: me.dimensions
                    };

                if (littleEndian) {
                    object.littleEndian = littleEndian;
                }

                return object;
            },
            /**
            Returns a string describing this image.
            @method toString
            @return {String}
            */
            toString: function () {
                return 'image[' + this.dimensions.join('x') + '] ' + this.channels;
            },
            /**
            Returns true if the ArrayBuffer has the correct byteLength for this
            image.
            @method validate
            @param {ArrayBuffer} [data] The ArrayBuffer to test.  If left
            undefined, this image's internal ArrayBuffer is used.
            @return {Boolean}
            */
            validate: function (data) {
                data = data || this._data;
                return data instanceof _ArrayBuffer && data.byteLength === this.pixelCount * this._pixelSize;
            },
            /**
            This method is called by the constructor.  It is here so that the
            initialization process can be hooked, overridden, or extended.
            @method _init
            @param {Object} configuration See the constructor's documentation
            for details.
            @protected
            */
            _init: function (configuration) {
                configuration = configuration || {};

                var me = this,

                    channels = _freeze((configuration.channels || _Class.defaultChannels).slice()),
                    channelOffsets = [],
                    dataType,
                    dimensions = _freeze((configuration.dimensions || _Class.defaultDimensions).slice()),
                    pixelCount = _reduce(dimensions, 1, function (pixelCount, dimension) {
                        return pixelCount * dimension;
                    }),
                    pixelSize = _reduce(channels, 0, function (pixelSize, channelDataType) {
                        channelOffsets.push(pixelSize);

                        if (!dataType && dataType !== null) {
                            dataType = channelDataType;
                        } else if (dataType && dataType !== channelDataType) {
                            dataType = null;
                        }

                        return pixelSize + (+channelDataType.substr(1)) / 8;
                    }),

                    configurationData = configuration.data,
                    data;

                _defineProperties(me, {
                    /**
                    The channels property is an array of strings representing
                    each channel's data type.  The number of channels in the
                    image is determined by the length of this array.  This is a
                    read only copy of the channels array that was passed to the
                    constructor.
                    @property channels
                    @final
                    @type [String]
                    */
                    channels: {
                        enumerable: _true,
                        value: channels
                    },
                    /**
                    The dimensions property is an array of numbers representing
                    the length of each dimension.  The number of dimensions in
                    the image is determined by the length of this array.  This
                    is a read only copy of the dimensions array that was passed
                    to the constructor.
                    @property dimensions
                    @final
                    @type [Number]
                    */
                    dimensions: {
                        enumerable: _true,
                        value: dimensions
                    },
                    /**
                    The total number of pixels in the image.
                    @property pixelCount
                    @final
                    @type Number
                    */
                    pixelCount: {
                        enumberable: _true,
                        value: pixelCount
                    },
                    /**
                    The _channelOffsets property is a read only array of numbers
                    describing the byte offset of each specific channel from the
                    beginning of a pixel.
                    @property _channelOffsets
                    @final
                    @protected
                    @type [Number]
                    */
                    _channelOffsets: {
                        enumerable: _true,
                        value: _freeze(channelOffsets)
                    },
                    /**
                    The ArrayBuffer that stores the image's data.
                    @property _data
                    @protected
                    @type ArrayBuffer
                    */
                    _data: {
                        enumerable: _true,
                        get: function () {
                            return data;
                        },
                        set: function (newData) {
                            data = newData;

                            /**
                            The ArrayBufferView used to access the image's data.
                            If the image's channel types are homogeneous, this
                            will be an instance of the specific ArrayBufferView
                            class that matches the data type.  This will be an
                            instance of DataView if the image's channel types
                            are mixed.
                            @property _dataView
                            @protected
                            @type ArrayBufferView
                            */
                            me._dataView = _Class._getDataView(data, dataType);
                        }
                    },
                    /**
                    If the image's channel types are homogeneous, this will be
                    the common channel type.  This will be null if the image's
                    channel types are mixed.
                    @property _dataType
                    @final
                    @protected
                    @type String
                    */
                    _dataType: {
                        enumerable: _true,
                        value: dataType
                    },
                    /**
                    The size of each pixel in bytes.
                    @property _pixelSize
                    @final
                    @protected
                    @type Number
                    */
                    _pixelSize: {
                        enumerable: _true,
                        value: pixelSize
                    }
                });

                /**
                Returns the pixel index for the given dimension indices.
                @method _getPixelIndex
                @param {Number} dimensionIndices* The number of arguments must
                match the number of dimensions in the image.
                @protected
                @return {Number}
                */
                me._getPixelIndex = _Class._getGetPixelIndexMethod.apply(me, dimensions);

                /**
                Returns the value from a specific channel of a specific pixel.
                @method _getValue
                @param {Number} pixelIndex
                @param {Number} channelIndex
                @protected
                @return {Number}
                */
                me._getValue = _Class._getGetValueMethod(channelOffsets, pixelSize, dataType);

                /**
                Sets the value of a specific channel of a specific pixel.
                @method _setValue
                @chainable
                @param {Number} pixelIndex
                @param {Number} channelIndex
                @param {Number} value
                @protected
                */
                me._setValue = _Class._getSetValueMethod(channelOffsets, pixelSize, dataType);

                if (me.validate(configurationData)) {
                    me._data = configurationData;
                } else {
                    me.clear();

                    if (_isArray(configurationData)) {
                        me.setDataArray(configurationData);
                    }
                }

                /**
                The boolean value of the littleEndian parameter that will be
                passed to a DataView's accessor methods.
                @property _littleEndian
                @final
                @protected
                @type Boolean
                */
                me._littleEndian = !!configuration.littleEndian;
            }
        },
        /**
        Returns the correct ArrayBufferView object for the given ArrayBuffer and
        dataType.
        @method _getDataView
        @param {ArrayBuffer} data
        @param {String} dataType
        @protected
        @return {ArrayBufferView}
        @static
        */
        _getDataView: function (data, dataType) {
            return new (_Class._getDataViewConstructor(dataType))(data);
        },
        /**
        Returns the correct ArrayBufferView constructor function for the given
        dataType.
        @method _getDataViewConstructor
        @param {String} dataType
        @protected
        @return {Function}
        @static
        */
        _getDataViewConstructor: _cached(function (dataType) {
            switch (dataType) {
                case _string_f32:
                    return Float32Array;
                case _string_f64:
                    return Float64Array;
                case _string_s16:
                    return Int16Array;
                case _string_s32:
                    return Int32Array;
                case _string_s8:
                    return Int8Array;
                case _string_u16:
                    return Uint16Array;
                case _string_u32:
                    return Uint32Array;
                case _string_u8:
                    return Uint8ClampedArray;
            }

            return _DataView;
        }),
        /**
        Returns a getPixelIndex function that works with the given image
        dimensions.
        @method _getGetPixelIndexMethod
        @param {Number} dimensionLength*
        @protected
        @return {Function}
        @static
        */
        _getGetPixelIndexMethod: _cached(function () {
            var dimensionLengths = arguments,

                dimensionCount = dimensionLengths.length;

            return _cached(function () {
                var dimensionIndices = arguments,
                    i,
                    index = 0,
                    j,
                    offset;

                for (i = 0; i < dimensionCount; i += 1) {
                    offset = dimensionIndices[i];

                    for (j = i - 1; j >= 0; j -= 1) {
                        offset *= dimensionLengths[j];
                    }

                    index += offset;
                }

                return index;
            });
        }),
        /**
        Returns a getValue function that works with the given channelOffsets,
        pixelSize, and dataType.
        @method _getGetValueMethod
        @param {[Number]} channelOffsets
        @param {Number} pixelSize
        @param {String} dataType
        @protected
        @return {Function}
        @static
        */
        _getGetValueMethod: _cached(function (channelOffsets, pixelSize, dataType) {
            var channelCount = channelOffsets.length;

            return dataType ? function (pixelIndex, channelIndex) {
                return this._dataView[pixelIndex * channelCount + channelIndex];
            } : function (pixelIndex, channelIndex) {
                return this._dataView['get' + _Class._getTypeName(this.channels[channelIndex])](pixelIndex * pixelSize + channelOffsets[channelIndex], this.littleEndian);
            };
        }),
        /**
        Returns a setValue function that works with the given channelOffsets,
        pixelSize, and dataType.
        @method _getSetValueMethod
        @param {[Number]} channelOffsets
        @param {Number} pixelSize
        @param {String} dataType
        @protected
        @return {Function}
        @static
        */
        _getSetValueMethod: _cached(function (channelOffsets, pixelSize, dataType) {
            var channelCount = channelOffsets.length;

            return dataType ? function (pixelIndex, channelIndex, value) {
                this._dataView[pixelIndex * channelCount + channelIndex] = value;
                return this;
            } : function (pixelIndex, channelIndex, value) {
                var me = this;
                me._dataView['set' + _Class._getTypeName(me.channels[channelIndex])](pixelIndex * pixelSize + channelOffsets[channelIndex], value, me.littleEndian);
                return me;
            };
        }),
        /**
        Returns a type name that matches a DataView accessor method for the
        given dataType.
        @method _getTypeName
        @param {String} dataType
        @protected
        @return {String}
        @static
        */
        _getTypeName: _cached(function (dataType) {
            var type = dataType.charAt(0);
            return (type === 'f' ? 'Float' : (type === 's' ? 'Int' : 'Uint')) + dataType.substr(1);
        })
    }, _true);
}(Y));

}, 'gallery-2013.05.29-23-38', {"requires": ["array-extras"]});
