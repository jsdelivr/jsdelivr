/**
 * jQuery Nested v1.01
 *
 * For a (total) gap free, multi column, grid layout experience.
 * http://suprb.com/apps/nested/
 * By Andreas Pihlström and additional brain activity by Jonas Blomdin
 *
 * Licensed under the MIT license.
 */

// Debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
// Copy pasted from http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/

(function ($, sr) {
    var debounce = function (func, threshold, execAsap) {
        var timeout;
        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap) func.apply(obj, args);
                timeout = null;
            };
            if (timeout) clearTimeout(timeout);
            else if (execAsap) func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 150);
        };
    };
    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };

})(jQuery, 'smartresize');

// Simple count object properties

if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [],
            k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}

// The Nested magic

(function ($) {

    $.Nested = function (options, element) {
        this.element = $(element);
        this._init(options);
    };

    $.Nested.settings = {
        selector: '.box',
        minWidth: 50,
        minColumns: 1,
        gutter: 1,
        resizeToFit: true, // will resize block bigger than the gap
        resizeToFitOptions: {
            resizeAny: true // will resize any block to fit the gap         
        },
        animate: true,
        animationOptions: {
            speed: 20,
            duration: 100,
            queue: true,
            complete: function () {}
        }
    };

    $.Nested.prototype = {

        _init: function (options) {
            var container = this;
            this.box = this.element;
            this.options = $.extend(true, {}, $.Nested.settings, options);
            this.elements = [];
            this._isResizing = false;
            this._update = true;
            this.maxy = new Array();

            // add smartresize
            $(window).smartresize(function () {
                container.resize();
            });

            // build box dimensions
            this._setBoxes();
        },

        _setBoxes: function ($els, method) {
            var self = this;
            this.idCounter = 0;
            this.counter = 0;
            this.t = 0;
            this.maxHeight = 0;

            //this.total = !$els ? this.box.find(this.options.selector) : $els;
            this.total = this.box.find(this.options.selector);
            this.matrix = {};
            this.gridrow = new Object;
            this.columns = Math.max(this.options.minColumns, parseInt(this.box.innerWidth() / (this.options.minWidth + this.options.gutter)) + 1);

            // build columns
            var minWidth = this.options.minWidth;
            var gutter = this.options.gutter;
            var display = "block";

            $els = this.box.find(this.options.selector);

            $.each($els, function () {

                var dim = parseInt($(this).attr('class').replace(/^.*size([0-9]+).*$/, '$1')).toString().split('');
                var x = (dim[0] == "N") ? 1 : parseFloat(dim[0]);
                var y = (dim[1] == "a") ? 1 : parseFloat(dim[1]);

                var currWidth = minWidth * x + gutter * (x - 1);
                var currHeight = minWidth * y + gutter * (y - 1);

                $(this).css({
                    'display': display,
                    'position': 'absolute',
                    'width': currWidth,
                    'height': currHeight,
                    'top': $(this).offset().top,
                    'left': $(this).offset().left
                }).removeClass('nested-moved').attr('data-box', self.idCounter).attr('data-width', currWidth);

                self.idCounter++;

                // render grid
                self._renderGrid($(this), method);

            });

            // position grid
            if (self.counter == self.total.length) {

                // if option resizeToFit is true
                if (self.options.resizeToFit) {
                    self.elements = self._fillGaps();
                }
                self._renderItems(self.elements);
                // reset elements
                self.elements = [];
            }
        },

        _addMatrixRow: function (y) {
            if (this.matrix[y]) {
                return false;
            } else this.matrix[y] = {};

            for (var c = 0; c < (this.columns - 1); c++) {
                var x = c * (this.options.minWidth + this.options.gutter);
                this.matrix[y][x] = 'false';
            }
        },

        _updateMatrix: function (el) {
            var height = 0;
            var t = parseInt(el['y']) - this.box.offset().top;
            var l = parseInt(el['x']) - this.box.offset().left;
            for (var h = 0; h < el['height']; h += (this.options.minWidth + this.options.gutter)) {
                for (var w = 0; w < el['width']; w += (this.options.minWidth + this.options.gutter)) {
                    var x = l + w;
                    var y = t + h;
                    if (!this.matrix[y]) {
                        this._addMatrixRow(y);
                    }
                    this.matrix[y][x] = 'true';
                }
            }
        },

        _getObjectSize: function (obj) { // Helper to get size of object, should probably be moved
            var size = 0;
            $.each(obj, function (p, v) {
                size++;
            });
            return size;
        },


        _fillGaps: function () {
            var self = this;
            var box = {};

            $.each(this.elements, function (index, el) {
                self._updateMatrix(el);
            });

            var arr = this.elements;
            arr.sort(function (a, b) {
                return a.y - b.y;
            });
            arr.reverse();

            // Used to keep the highest y value for a box in memory
            var topY = arr[0]['y'];

            // Used for current y with added offset
            var actualY = 0;

            // Current number of rows in matrix
            var rowsLeft = this._getObjectSize(this.matrix);

            $.each(this.matrix, function (y, row) {
                rowsLeft--;
                actualY = parseInt(y) + parseInt(self.box.offset().top);
                $.each(row, function (x, col) {

                    if (col === 'false' && actualY < topY) {
                        if (!box.y) box.y = y;
                        if (!box.x) box.x = x;
                        if (!box.w) box.w = 0;
                        if (!box.h) box.h = self.options.minWidth;
                        box.w += (box.w) ? (self.options.minWidth + self.options.gutter) : self.options.minWidth;

                        var addonHeight = 0;
                        for (var row = 1; row < rowsLeft; row++) {
                            var z = parseInt(y) + parseInt(row * (self.options.minWidth + self.options.gutter));
                            if (self.matrix[z] && self.matrix[z][x] == 'false') {
                                addonHeight += (self.options.minWidth + self.options.gutter);
                                self.matrix[z][x] = 'true';
                            } else break;
                        }

                        box.h + (parseInt(addonHeight) / (self.options.minWidth + self.options.gutter) == rowsLeft) ? 0 : parseInt(addonHeight);
                        box.ready = true;

                    } else if (box.ready) {

                        $.each(arr, function (i, el) {
                            if (box.y <= arr[i]['y'] && (self.options.resizeToFitOptions.resizeAny || box.w <= arr[i]['width'] && box.h <= arr[i]['height'])) {
                                arr.splice(i, 1);
                                $(el['$el']).addClass('nested-moved');
                                self.elements.push({
                                    $el: $(el['$el']),
                                    x: parseInt(box.x) + self.box.offset().left,
                                    y: parseInt(box.y) + self.box.offset().top,
                                    col: i,
                                    width: parseInt(box.w),
                                    height: parseInt(box.h)
                                });

                                return false;
                            }
                        });
                        box = {};
                    }
                });

            });

            self.elements = arr;
            return self.elements;

        },

        _renderGrid: function ($box, method) {

            this.counter++;
            var ypos, gridy = ypos = 0;
            var tot = 0;
            var direction = !method ? "append" : "prepend";

            // Width & height
            var width = $box.width();
            var height = $box.height();

            // Calculate row and col
            var col = Math.ceil(width / (this.options.minWidth + this.options.gutter));
            var row = Math.ceil(height / (this.options.minWidth + this.options.gutter));

            // lock widest box to match minColumns
            if (col > this.options.minColumns) {
                this.options.minColumns = col;
            }

            while (true) {

                for (var y = col; y >= 0; y--) {
                    if (this.gridrow[gridy + y]) break;
                    this.gridrow[gridy + y] = new Object;
                    for (var x = 0; x < this.columns; x++) {
                        this.gridrow[gridy + y][x] = false;
                    }
                }

                for (var column = 0; column < (this.columns - col); column++) {

                    // Add default empty matrix, used to calculate and update matrix for each box
                    matrixY = gridy * (this.options.minWidth + this.options.gutter);
                    this._addMatrixRow(matrixY);

                    var fits = true;

                    for (var y = 0; y < row; y++) {
                        for (var x = 0; x < col; x++) {

                            if (!this.gridrow[gridy + y]) {
                                break;
                            }

                            if (this.gridrow[gridy + y][column + x]) {
                                fits = false;
                                break;
                            }
                        }
                        if (!fits) {
                            break;
                        }
                    }
                    if (fits) {
                        // Set as taken
                        for (var y = 0; y < row; y++) {
                            for (var x = 0; x < col; x++) {

                                if (!this.gridrow[gridy + y]) {
                                    break;
                                }
                                this.gridrow[gridy + y][column + x] = true;
                            }
                        }

                        // Push to elements array
                        this._pushItem($box, column * (this.options.minWidth + this.options.gutter), gridy * (this.options.minWidth + this.options.gutter), width, height, col, row, direction);
                        return;
                    }
                }
                gridy++;
            }
        },

        _pushItem: function ($el, x, y, w, h, cols, rows, method) {

            if (method == "prepend") {
                this.elements.unshift({
                    $el: $el,
                    x: x + this.box.offset().left,
                    y: y + this.box.offset().top,
                    width: w,
                    height: h,
                    cols: cols,
                    rows: rows
                });
            } else {
                this.elements.push({
                    $el: $el,
                    x: x + this.box.offset().left,
                    y: y + this.box.offset().top,
                    width: w,
                    height: h,
                    cols: cols,
                    rows: rows
                });
            }
        },

        _setHeight: function ($els) {
            var self = this;
            $.each($els, function (index, value) {
                // set maxHeight
                var colY = (value['y'] + value['height']) - self.box.offset().top;
                if (colY > self.maxHeight) {
                    self.maxHeight = colY;
                }
            });
            return self.maxHeight;
        },

        _renderItems: function ($els) {
            var self = this;

            // set container height
            this.box.css('height', this._setHeight($els));

            $els.reverse();
            var speed = this.options.animationOptions.speed;
            var effect = this.options.animationOptions.effect;
            var duration = this.options.animationOptions.duration;
            var queue = this.options.animationOptions.queue;
            var animate = this.options.animate;
            var complete = this.options.animationOptions.complete;
            var item = this;
            var i = 0;
            var t = 0;

            $.each($els, function (index, value) {

                $currLeft = $(value['$el']).offset().left;
                $currTop = $(value['$el']).offset().top;
                $currWidth = $(value['$el']).width();
                $currHeight = $(value['$el']).width();


                value['$el'].attr('data-y', $currTop).attr('data-x', $currLeft);
                //if animate and queue
                if (animate && queue && ($currLeft != value['x'] || $currTop != value['y'])) {
                    setTimeout(function () {
                        value['$el'].css({
                            'display': 'block',
                            'width': value['width'],
                            'height': value['height']
                        }).animate({
                            'left': value['x'],
                            'top': value['y']
                        }, duration);
                        t++;
                        if (t == $els.length) {
                            complete.call(undefined, $els)
                        }
                    }, i * speed);
                    i++;
                }

                //if animate and no queue
                if (animate && !queue && ($currLeft != value['x'] || $currTop != value['y'])) {
                    setTimeout(function () {
                        value['$el'].css({
                            'display': 'block',
                            'width': value['width'],
                            'height': value['height']
                        }).animate({
                            'left': value['x'],
                            'top': value['y']
                        }, duration);
                        t++;
                        if (t == $els.length) {
                            complete.call(undefined, $els)
                        }
                    }, i);
                    i++;
                }

                //if no animation and no queue
                if (!animate && ($currLeft != value['x'] || $currTop != value['y'])) {
                    value['$el'].css({
                        'display': 'block',
                        'width': value['width'],
                        'height': value['height'],
                        'left': value['x'],
                        'top': value['y']
                    });
                    t++;
                    if (t == $els.length) {
                        complete.call(undefined, $els)
                    }
                }
            });
        },

        append: function ($els) {
            this._isResizing = true;
            this._setBoxes($els, 'append');
            this._isResizing = false;
        },

        prepend: function ($els) {
            this._isResizing = true;
            this._setBoxes($els, 'prepend');
            this._isResizing = false;
        },

        resize: function ($els) {
            if (Object.keys(this.matrix[0]).length % Math.floor(this.element.width() / (this.options.minWidth + this.options.gutter)) > 0) {
                this._isResizing = true;
                this._setBoxes(this.box.find(this.options.selector));
                this._isResizing = false;
            }
        }
    }

    $.fn.nested = function (options, e) {
        if (typeof options === 'string') {
            this.each(function () {
                var container = $.data(this, 'nested');
                container[options].apply(container, [e]);
            });
        } else {
            this.each(function () {
                $.data(this, 'nested', new $.Nested(options, this));
            });
        }
        return this;
    }

})(jQuery);