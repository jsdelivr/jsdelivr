YUI.add('gallery-isoline', function(Y) {

/**
 * @module gallery-isoline
 */
(function (Y) {
    'use strict';
    
    var _string_dataCellHeight = 'dataCellHeight',
        _string_dataCellWidth = 'dataCellWidth',
        
        _Shape = Y.Shape,
    
        _ceil = Math.ceil,
        _max = Math.max,
        _min = Math.min,
        _parseInt = parseInt,
        
        _class = function () {
            _class.superclass.constructor.apply(this, arguments);
        };
    
    /**
     * @class Isoline
     * @constructor
     * @extends Shape
     * @param {Object} config object
     */
    Y.Isoline = Y.extend(_class, _Shape, {
        /**
         * @method redraw
         * @chainable
         */
        redraw: function () {
            this._draw();
            return this;
        },
        /**
         * @method _draw
         * @protected
         */
        _draw: function () {
            var me = this,
            
                dataCellHeight = me.get(_string_dataCellHeight) || 1,
                dataCellWidth = me.get(_string_dataCellWidth) || 1,
                
                halfDataCellHeight = dataCellHeight / 2,
                halfDataCellWidth = dataCellWidth / 2,
                
                height = me.get('height'),
                width = me.get('width'),
                
                dataFn = me.get('dataFn'),
                
                dataMaxX = _min(me.get('dataMaxX') || width, width),
                dataMaxY = _min(me.get('dataMaxY') || height, height),
                
                dataMinX = _max(me.get('dataMinX') || 0, 0),
                dataMinY = _max(me.get('dataMinY') || 0, 0),
                
                dataCellCountX = _ceil((dataMaxX - dataMinX) / dataCellWidth),
                dataCellCountY = _ceil((dataMaxY - dataMinY) / dataCellHeight),
                
                dataCellValue,
                
                dataCellX,
                dataCellY = 0,
                
                x,
                y;
            
            me.clear();
            
            for (; dataCellY < dataCellCountY; dataCellY += 1) {
                for (dataCellX = 0; dataCellX < dataCellCountX; dataCellX += 1) {
                    dataCellValue = '';
                    
                    x = dataMinX + dataCellX * dataCellWidth;
                    y = dataMinY + dataCellY * dataCellHeight;
                    
                    dataCellValue += dataFn(x - halfDataCellWidth, y - halfDataCellHeight) ? 1 : 0;
                    dataCellValue += dataFn(x + halfDataCellWidth, y - halfDataCellHeight) ? 1 : 0;
                    dataCellValue += dataFn(x + halfDataCellWidth, y + halfDataCellHeight) ? 1 : 0;
                    dataCellValue += dataFn(x - halfDataCellWidth, y + halfDataCellHeight) ? 1 : 0;
                    
                    dataCellValue = _parseInt(dataCellValue, 2);
                    
                    if ((dataCellValue === 5 || dataCellValue === 10) && !dataFn(x, y)) {
                        dataCellValue *= 4;
                    }
                    
                    switch (dataCellValue) {
                        case 1:
                        case 14:
                            me.moveTo(x - halfDataCellWidth, y);
                            me.lineTo(x, y + halfDataCellHeight);
                            break;
                        case 2:
                        case 13:
                            me.moveTo(x, y + halfDataCellHeight);
                            me.lineTo(x + halfDataCellWidth, y);
                            break;
                        case 3:
                        case 12:
                            me.moveTo(x - halfDataCellWidth, y);
                            me.lineTo(x + halfDataCellWidth, y);
                            break;
                        case 4:
                        case 11:
                            me.moveTo(x, y - halfDataCellHeight);
                            me.lineTo(x + halfDataCellWidth, y);
                            break;
                        case 5:
                        case 40:
                            me.moveTo(x - halfDataCellWidth, y);
                            me.lineTo(x, y - halfDataCellHeight);
                            me.moveTo(x, y + halfDataCellHeight);
                            me.lineTo(x + halfDataCellWidth, y);
                            break;
                        case 6:
                        case 9:
                            me.moveTo(x, y - halfDataCellHeight);
                            me.lineTo(x, y + halfDataCellHeight);
                            break;
                        case 7:
                        case 8:
                            me.moveTo(x - halfDataCellWidth, y);
                            me.lineTo(x, y - halfDataCellHeight);
                            break;
                        case 10:
                        case 20:
                            me.moveTo(x, y - halfDataCellHeight);
                            me.lineTo(x + halfDataCellWidth, y);
                            me.moveTo(x - halfDataCellWidth, y);
                            me.lineTo(x, y + halfDataCellHeight);
                            break;
                    }
                }
            }
            
            me.end();
        }
    }, {
        ATTRS: Y.mix({
            /**
             * @attribute dataCellHeight
             * @default 1
             * @type Number
             */
            dataCellHeight: {
                value: 1
            },
            /**
             * Setting dataCellSize will set dataCellHeight and dataCellWidth to
             * the same value.  It is just here as a convenience for setting a
             * square cell size.
             * @attribute dataCellSize
             * @type Number
             */
            dataCellSize: {
                setter: function (dataCellSize) {
                    this._set(_string_dataCellHeight, dataCellSize);
                    this._set(_string_dataCellWidth, dataCellSize);
                    return dataCellSize;
                },
                value: 1
            },
            /**
             * @attribute dataCellWidth
             * @default 1
             * @type Number
             */
            dataCellWidth: {
                value: 1
            },
            /**
             * This function defines a two-dimensional scalar field and the
             * threshold at which the isoline is drawn.  This function will be
             * passed x and y as arguments.  This function should return either
             * true or false.
             * @attribute dataFn
             * @type Function
             */
            dataFn: {
                value: function () {
                    return false;
                }
            },
            /**
             * The maximum X value to process.  If set to null, the data will be
             * processed up the the edge of this shape.
             * @attribute dataMaxX
             * @default null
             * @type Number
             */
            dataMaxX: {
                value: null
            },
            /**
             * The maximum Y value to process.  If set to null, the data will be
             * processed up the the edge of this shape.
             * @attribute dataMaxY
             * @default null
             * @type Number
             */
            dataMaxY: {
                value: null
            },
            /**
             * The minimum X value to process.  If set to null, the data will be
             * processed up the the edge of this shape.
             * @attribute dataMinX
             * @default null
             * @type Number
             */
            dataMinX: {
                value: null
            },
            /**
             * The minimum Y value to process.  If set to null, the data will be
             * processed up the the edge of this shape.
             * @attribute dataMinY
             * @default null
             * @type Number
             */
            dataMinY: {
                value: null
            }
        }, _Shape.ATTRS)
    });
}(Y));


}, 'gallery-2012.06.27-20-10' ,{requires:['graphics'], skinnable:false});
