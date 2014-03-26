YUI.add('gallery-conway', function(Y) {

/**
 * A simulator for Conway's Game of Life.
 * @module gallery-conway
 */
(function (Y, moduleName) {
    'use strict';

    var _null = null,
        _string_cellChange = 'cellChange',
        _string_grid = 'grid',
        _string_height = 'height',
        _string_initOnly = 'initOnly',
        _string_width = 'width',
        _true = true,

        _Array = Y.Array,
        _Async = Y.Async,
        _Base = Y.Base,
        _Lang = Y.Lang,
        _Math = Math,

        _each = Y.each,
        _filter = _Array.filter,
        _floor = _Math.floor,
        _indexOf = _Array.indexOf,
        _isArray = _Lang.isArray,
        _isFunction = _Lang.isFunction,
        _isValue = _Lang.isValue,
        _makeItAnArray = function (array) {
            return _isArray(array) ? array : [
                array
            ];
        },
        _max = _Math.max,
        _min = _Math.min,
        _soon = Y.soon;

    /**
     * @class Conway
     * @constructor
     * @extends Base
     * @param {Object} config Configuration Object.
     */
    Y.Conway = _Base.create(moduleName, _Base, [], {
        destructor: function () {
            delete this._history;
        },
        /**
         * Returns the value of a specific cell.  The cell may be specified with
         * x and y coordinates or with a single array index.
         * (index = x + y * width)
         * @method getCell
         * @param {Number} x The x coordinate or the array index.
         * @param {Number} [y] Optional.  The y coordinate.
         * @return {Boolean} A truthy value means the cell is currently alive.
         */
        getCell: function (x, y) {
            return this.get(_string_grid)[_isValue(y) ? x + y * this.get(_string_width) : x];
        },
        initializer: function () {
            var me = this,

                grid = me.get(_string_grid),
                i = 0,
                length = me.get(_string_height) * me.get(_string_width);

            /**
             * If this event is prevented, the cell's value will not be changed.
             * @event cellChange
             * @param {Boolean} cell The current value of the cell.  Note that
             * the cell's value is changed by the default function so the value
             * of this property will be different between on and after
             * subscriptions.
             * @param {Number} height The current height of the grid.
             * @param {Number} index The cell's array index.
             * @param {Boolean} toroidal True if the grid is currently toroidal.
             * @param {Number} width The current width of the grid.
             * @param {Number} x The cell's x coordinate.
             * @param {Number} y The cell's y coordinate.
             */
            me.publish(_string_cellChange, {
                defaultFn: me._cellChange
            });

            while (i < length) {
                grid.push(false);
                i += 1;
            }

            /**
             * This object's keys are the indices of cells that have changed
             * value since the previous step of the simulation.  This is used to
             * improve performance while resolving the next step of the
             * simulation.
             * @property _history
             * @protected
             * @type Object
             */
            me._history = {};
        },
        /**
         * Sets the value of a specific cell.  The cell may be specified with x
         * and y coordinates or with a single array index.
         * (index = x + y * width)
         * @method setCell
         * @chainable
         * @param {Number} x The x coordinate orthe array index.
         * @param {Number} [y] Optional.  The y coordinate.
         * @param {Boolean} value The new value for the cell.  A truthy value means
         * the cell is currently alive.
         */
        setCell: function (x, y, value) {
            var cell,
                index,
                me = this,
                width = me.get(_string_width);

            if (_isValue(value)) {
                index = x + y * width;
            } else {
                index = x;
                value = y;
                x = index % width;
                y = _floor(index / width);
            }

            cell = me.get(_string_grid)[index];

            if (cell !== value) {
                me.fire(_string_cellChange, {
                    cell: cell,
                    height: me.get(_string_height),
                    index: index,
                    toroidal: me.get('toroidal'),
                    width: width,
                    x: x,
                    y: y
                });
            }

            return me;
        },
        /**
         * Runs one step of the simulation.  The simulation is resolved
         * asynchronously and will call the callback function when it completes.
         * Once this method is called, it should not be called again until the
         * first call is complete.  Calling getCell, setCell, or step while the
         * simulation is still being resolved may cause unexpected side effects.
         * If you wish to ensure that unexpected side effects never occur and
         * don't mind incurring a small overhead cost, use gallery-mutex to
         * obtain an exclusive lock when calling these methods.
         * @method step
         * @chainable
         * @param {Function} [callbackFunction] Optional.  This function will be
         * called once the simulation is resolved.  This function will be passed
         * a single argument, an array.  For each cell that changed value during
         * the simulation, there will be an object in the array with the
         * following properties:
         * <dl>
         *     <dt>
         *          cell
         *     </dt>
         *     <dd>
         *         Boolean.  The current value of the cell.
         *     </dd>
         *     <dt>
         *         index
         *     </dt>
         *     <dd>
         *         Number.  The cell's array index.
         *     </dd>
         *     <dt>
         *         x
         *     </dt>
         *     <dd>
         *         Number.  The cell's x coordinate.
         *     </dd>
         *     <dt>
         *         y
         *     </dt>
         *     <dd>
         *         Number.  The cell's y coordinate.
         *     </dd>
         * </dl>
         */
        step: function (callbackFunction) {
            var me = this,

                attributes = me.getAttrs(),
                birth = attributes.birth,
                grid = attributes.grid.slice(),
                height = attributes.height,
                history = me._history,
                life = attributes.life,
                run = [],
                toroidal = attributes.toroidal,
                width = attributes.width;

            _each(history, function (value, index) {
                run.push(function (success) {
                    _soon(function () {
                        success(me._cellStep(grid, height, width, index, birth, life, toroidal));
                    });
                });
            });

            _Async.runQueue(run).on('complete', function (eventFacade) {
                var value = _filter(eventFacade.value, function (value) {
                    if (value) {
                        me.fire(_string_cellChange, {
                            cell: value.cell,
                            height: height,
                            index: value.index,
                            toroidal: toroidal,
                            width: width,
                            x: value.x,
                            y: value.y
                        });
                    }

                    return value;
                });

                if (_isFunction(callbackFunction)) {
                    callbackFunction(value);
                }
            });

            me._history = {};

            return me;
        },
        /**
         * Default function for the cellChange event.
         * @method _cellChange
         * @chainable
         * @param {Object} eventFacade
         * @protected
         */
        _cellChange: function (eventFacade) {
            var me = this,

                cell = !eventFacade.cell,
                height = eventFacade.height,
                history = me._history,
                i,
                iEdge,
                j,
                jEdge,
                width = eventFacade.width,
                x = eventFacade.x,
                y = eventFacade.y,
                yEdge;

            me.get(_string_grid)[eventFacade.index] = cell;
            eventFacade.cell = cell;

            if (eventFacade.toroidal) {
                for (j = y - 1; j <= y + 1; j += 1) {
                    yEdge = (j < 0 ? height - 1 : j >= height ? 0 : j) * width;

                    for (i = x - 1; i <= x + 1; i += 1) {
                        history[(i < 0 ? width - 1 : i >= width ? 0 : i) + yEdge] = _true;
                    }
                }
            } else {
                iEdge = _min(x + 1, width - 1);
                jEdge = _min(y + 1, height - 1);

                for (j = _max(y - 1, 0); j <= jEdge; j += 1) {
                    yEdge = j * width;

                    for (i = _max(x - 1, 0); i <= iEdge; i += 1) {
                        history[i + yEdge] = _true;
                    }
                }
            }

            return me;
        },
        /**
         * Determines the outcome of one step of the simulation for one cell.
         * @method _cellStep
         * @param {[Boolean]} grid
         * @param {Number} height
         * @param {Number} width
         * @param {Number} index
         * @param {[Number]} birth
         * @param {[Number]} life
         * @param {Boolean} toroidal
         * @protected
         * @return {Object} If the cell changed, returns an object with the
         * following properties:
         * <dl>
         *     <dt>
         *          cell
         *     </dt>
         *     <dd>
         *         Boolean.  The current value of the cell.
         *     </dd>
         *     <dt>
         *         index
         *     </dt>
         *     <dd>
         *         Number.  The cell's array index.
         *     </dd>
         *     <dt>
         *         x
         *     </dt>
         *     <dd>
         *         Number.  The cell's x coordinate.
         *     </dd>
         *     <dt>
         *         y
         *     </dt>
         *     <dd>
         *         Number.  The cell's y coordinate.
         *     </dd>
         * </dl>
         * otherwise returns null.
         */
        _cellStep: function (grid, height, width, index, birth, life, toroidal) {
            var cell = grid[index],
                i,
                iEdge,
                j,
                jEdge,
                neighbors = 0,
                x = index % width,
                y = _floor(index / width),
                yEdge;

            if (toroidal) {
                for (j = y - 1; j <= y + 1; j += 1) {
                    yEdge = (j < 0 ? height - 1 : j >= height ? 0 : j) * width;

                    for (i = x - 1; i <= x + 1; i += 1) {
                        if ((i !== x || j !== y) && grid[(i < 0 ? width - 1 : i >= width ? 0 : i) + yEdge]) {
                            neighbors += 1;
                        }
                    }
                }
            } else {
                iEdge = _min(x + 1, width - 1);
                jEdge = _min(y + 1, height - 1);

                for (j = _max(y - 1, 0); j <= jEdge; j += 1) {
                    yEdge = j * width;

                    for (i = _max(x - 1, 0); i <= iEdge; i += 1) {
                        if ((i !== x || j !== y) && grid[i + yEdge]) {
                            neighbors += 1;
                        }
                    }
                }
            }

            if (cell && _indexOf(life, neighbors) === -1 || !cell && _indexOf(birth, neighbors) !== -1) {
                return {
                    cell: cell,
                    index: index,
                    x: x,
                    y: y
                };
            }

            return _null;
        }
    }, {
        ATTRS: {
            /**
             * In Conway's Game of Life, a cell is born (becomes alive) if it is
             * not currently alive and if it has exactly three living neighbors.
             * This is the default functionality but it can be modified.  For
             * example, if this attribute is set to [1,4,6] a cell will be born
             * if it is not currently alive and if it has exactly one, four, or
             * six living neighbors.
             * @attribute birth
             * @default [3]
             * @type [Number]
             */
            birth: {
                setter: _makeItAnArray,
                value: [
                    3
                ]
            },
            /**
             * The grid of cell values.  The array values should never be
             * manipulated directly; doing so may cause unexpected side effects.
             * @attribute grid
             * @readonly
             * @type [Boolean]
             */
            grid: {
                readOnly: _true,
                value: []
            },
            /**
             * The height of the grid.
             * @attribute height
             * @initonly
             * @type Number
             */
            height: {
                value: _null,
                writeOnce: _string_initOnly
            },
            /**
             * In Conway's Game of Life, a living cell remains alive if it
             * currently has exactly two or three living neighbors.  Otherwise
             * the cell will die either from loneliness or overcrowding.  This
             * is the default functionality but it can be modified.  For
             * example, if this attribute is set to [1,3,5] a living cell
             * will remain alive if it has exactly one, three, or five living
             * neighbors.
             * @attribute life
             * @default [2,3]
             * @type [Number]
             */
            life: {
                setter: _makeItAnArray,
                value: [
                    2,
                    3
                ]
            },
            /**
             * Since the grid is a fixed size, there is a good chance that the
             * simulation will have to interact with the boundaries of the grid.
             * By default, the grid exists on an infinite two-dimensional plane
             * but all cells beyond the limits of the grid are considered to be
             * dead.  When this attribute is set to a truthy value, the universe
             * of the simulation will become a three-dimensional torus instead
             * of a two-dimensional plane.  The grid will represent the entire
             * surface area of the torus.  Basically all this means is, when the
             * grid is toroidal, the left and right edges of the grid will be
             * connected and the top and bottom edges of the grid will be
             * connected, so while there is still a finite area there are no
             * real boundaries.
             * @attribute toroidal
             * @default false
             * @type Boolean
             */
            toroidal: {
                value: false
            },
            /**
             * The width of the grid.
             * @attribute width
             * @initonly
             * @type Number
             */
            width: {
                value: _null,
                writeOnce: _string_initOnly
            }
        }
    });
}(Y, arguments[1]));


}, 'gallery-2012.07.11-21-38' ,{requires:['array-extras', 'gallery-async', 'gallery-soon'], skinnable:false});
