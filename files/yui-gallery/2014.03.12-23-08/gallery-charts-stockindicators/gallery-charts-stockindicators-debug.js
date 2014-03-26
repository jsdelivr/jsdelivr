YUI.add('gallery-charts-stockindicators', function (Y, NAME) {

/**
 * Allows for the creation of a visualization based on financial
 * indicators..
 *
 * @module gallery-charts-stockindicators
 */
/**
 * Provides functionality for a crosshair.
 *
 * @module gallery-charts-stockindicators
 */

/**
 * Creates an updatable crosshair on the Graph which can be controlled
 * by mouse and touch events.
 *
 * @class Crosshair
 * @constructor
 * @param {Object} config Configuration parameters.
 *  <dl>
 *      <dt>dotdiameter</dt><dd>The diameter of the circle or dot.</dd>
 *      <dt>drawHorizontal</dt><dd>Indicates whether to draw the horizontal line. The default
 *      value is `false`.</dd>
 *      <dt>drawVertical</dt><dd>Indicates whether to draw the verical line. The default
 *      value is `true`.</dd>
 *      <dt>lineColor</dt><dd>The color to use for lines.</dd>
 *      <dt>lineWidth</dt><dd>The weight of the lines.</dd>
 *      <dt>useCircle</dt><dd>Determines whether to use an empty circle. The default value is
 *      `false`.</dd>
 *      <dt>useDot</dt><dd>Determines whether to use a dot. The default value is `true`.</dd>
 *  </dl>
 */
Y.Crosshair = function() {
    this.initializer.apply(this, arguments);
};
Y.Crosshair.prototype = {
    /**
     * Builds the crosshair.
     *
     * @method initializer
     * @protected
     */
    initializer: function(cfg) {
        var graphic = new Y.Graphic({
                render: cfg.render,
                autoDraw: false,
                width: cfg.width,
                height: cfg.height,
                x: cfg.x,
                y: cfg.y
            }),
            width = cfg.width,
            height = cfg.height,
            series = cfg.series,
            graph,
            category = cfg.category,
            yline,
            i,
            len = series.length;
        yline = graphic.addShape({
            shapeRendering: "crispEdges",
            type: "path",
            stroke: category.stroke
        }).moveTo(0, 0).lineTo(0, height).end();
        this._xcoords = category.coords;
        this._yline = yline;
        this.width = cfg.width;
        this.height = cfg.height;
        if(series) {
            for(i = 0; i < len; i = i + 1) {
                graph = series[i];
                if(graph.line) {
                    graph.xLine = graphic.addShape({
                        shapeRendering: "crispEdges",
                        type: "path",
                        stroke: graph.stroke,
                        fill: graph.fill
                    }).moveTo(0, 0).lineTo(width, 0).end();
                }
                if(graph.marker) {
                    graph.marker.y = graph.marker.height/-2;
                    graph.marker.x = graph.marker.width/-2;
                    graph.marker.type = graph.marker.type || graph.marker.shape;
                    graph.marker = graphic.addShape(graph.marker);
                }
            }
            this._series = series;
        }
        this._xy = graphic.getXY();
        this.graphic = graphic;
    },

    /**
     * Updates the position of the crosshair.
     *
     * @method setTarget
     * @param {Number} pageX The x-coordinate to map in which to map the crosshair.
     */
    setTarget: function(pageX, redraw) {
        var xy = this._xy,
            x = pageX - xy[0],
            y,
            series = this._series,
            graph,
            i,
            index = Math.floor((x / this.width) * this._xcoords.length),
            len = series.length;
        this._yline.set("transform", "translate(" + x + ")");
        if(series) {
            for(i = 0; i < len; i = i + 1) {
                graph = series[i];
                y = graph.coords[index];
                if(graph.marker) {
                    graph.marker.set("transform", "translate(" + x + ", " + y + ")");
                }
                if(graph.line) {
                    graph.line.set("transform", "translate(" + x + ", " + y + ")");
                }
            }
        }
        this.updateFlag = true;
        if(redraw) {
            this.graphic._redraw();
        }
    },

    /**
     * Updates the crosshair items.
     *
     * @method redraw
     */
    redraw: function() {
        if(this.updateFlag) {
            this.graphic._redraw();
            this.updateFlag = false;
        }
    },

    /**
     * Removes all elements of the crosshair.
     *
     * @method destroy
     */
    destroy: function() {
        var series = this._series,
            yline = this._yline,
            graph,
            i,
            len;
        if(series) {
            len = series.length;
            for(i = 0; i < len; i = i + 1) {
                graph = series[i];
                if(graph.marker) {
                    graph.marker.get("graphic").destroy();
                }
                if(graph.line) {
                    graph.line.get("graphic").destroy();
                }
                if(yline) {
                    yline.get("graphic").destroy();
                }
            }
        }
    }
};
/**
 * Gridlines draws gridlines on a Graph.
 *
 * @module gallery-charts-stockindicators
 * @class Gridlines
 * @constructor
 * @extends Base
 * @uses Renderer
 * @param {Object} config (optional) Configuration parameters.
 */
Y.Gridlines = Y.Base.create("gridlines", Y.Base, [Y.Renderer], {
    /**
     * Reference to the `Path` element used for drawing Gridlines.
     *
     * @property _path
     * @type Path
     * @private
     */
    _path: null,

    /**
     * Removes the Gridlines.
     *
     * @method remove
     * @private
     */
    remove: function()
    {
        var path = this._path;
        if(path)
        {
            path.destroy();
        }
    },

    /**
     * Draws the gridlines
     *
     * @method draw
     * @param {Number} width The width of the area in which the gridlines will be drawn.
     * @param {Number} height The height of the area in which the gridlines will be drawn.
     * @param {Number} startIndex The index in which to start drawing fills (if specified). The default
     * value is 0.
     * @param {Number} interval The number gaps between fills (if specified). The default value is 2. A value of 1
     * would result in a solid fill across the area.
     * @protected
     */
    draw: function()
    {
        if(this.get("axis") && this.get("graphic"))
        {
            this._drawGridlines.apply(this, arguments);
        }
    },

    /**
     * Algorithm for drawing gridlines
     *
     * @method _drawGridlines
     * @param {Number} width The width of the area in which the gridlines will be drawn.
     * @param {Number} height The height of the area in which the gridlines will be drawn.
     * @param {Number} startIndex The index in which to start drawing fills (if specified). The default
     * value is 0.
     * @param {Number} interval The number gaps between fills (if specified). The default value is 2. A value of 1
     * would result in a solid fill across the area.
     * @private
     */
    _drawGridlines: function(w, h, startIndex, interval)
    {
        var path = this._path,
            axis = this.get("axis"),
            axisPosition = axis.get("position"),
            points,
            direction = this.get("direction"),
            graphic = this.get("graphic"),
            fill = this.get("styles").fill,
            border = this.get("styles").border,
            line = this.get("styles").line,
            stroke = fill && border ? border : line,
            cfg,
            lineFunction;
        startIndex = startIndex || 0;
        interval = interval || 2;
        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {
            if(axisPosition !== "none" && axis && axis.get("tickPoints"))
            {
                points = axis.get("tickPoints");
            }
            else
            {
                points = this._getPoints(axis.get("styles").majorUnit.count, w, h);
            }
            if(path)
            {
                path.set("width", w);
                path.set("height", h);
                path.set("stroke", stroke);
                if(fill) {
                    path.set("fill", fill);
                }
            }
            else
            {
                cfg = {
                    type: "path",
                    width: w,
                    stroke: stroke,
                    height: h
                };
                if(fill) {
                    cfg.fill = fill;
                }
                path = graphic.addShape(cfg);
                path.addClass("yui3-gridlines");
                this._path = path;
            }
            if(direction === "vertical")
            {
                lineFunction = fill ? this._verticalFill : this._verticalLine;
                lineFunction(path, points, h, startIndex, interval, w);
            }
            else
            {
                lineFunction = fill ? this._horizontalFill : this._horizontalLine;
                lineFunction(path, points, w, startIndex, interval, h);
            }
            path.end();
        }
    },

    /**
     * Calculates the coordinates for the gridlines based on a count.
     *
     * @method _getPoints
     * @param {Number} count Number of gridlines
     * @return Array
     * @private
     */
    _getPoints: function(count, w, h)
    {
        var i,
            points = [],
            multiplier,
            divisor = count - 1;
        for(i = 0; i < count; i = i + 1)
        {
            multiplier = i/divisor;
            points[i] = {
                x: w * multiplier,
                y: h * multiplier
            };
        }
        return points;
    },

    /**
     * Algorithm for horizontal lines.
     *
     * @method _horizontalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} w Width of the Graph
     * @private
     */
    _horizontalLine: function(path, points, width)
    {
        var i,
            len = points.length,
            y;
        for(i = 0; i < len; i = i + 1)
        {
            y = points[i].y;
            path.moveTo(0, y);
            path.lineTo(width, y);
        }
    },

    /**
     * Algorithm for vertical lines.
     *
     * @method _verticalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} h Height of the Graph
     * @private
     */
    _verticalLine: function(path, points, height)
    {
        var i,
            len = points.length,
            x;
        for(i = 0; i < len; i = i + 1)
        {
            x = points[i].x;
            path.moveTo(x, 0);
            path.lineTo(x, height);
        }
    },

    /**
     * Algorithm for horizontal fills.
     *
     * @method _horizontalFill
     * @param {Path} path Reference to the path element
     * @param {Object} points Coordinates corresponding to a major unit of an axis.
     * @param {Number} width Width of the fill.
     * @param {Number} startIndex Indicates the index in which to start drawing fills.
     * @param {Number} interval Indicates the interval between fills.
     * @param {Number} height Height of the graph.
     * @private
     */
    _horizontalFill: function(path, points, width, startIndex, interval, height)
    {
        var i,
            y1,
            y2,
            len = points.length;
        for(i = startIndex; i < len; i = i + interval)
        {
            y1 = points[i].y;
            y2 = i < len - 1 ? points[i + 1].y : height;
            path.moveTo(0, y1);
            path.lineTo(0, y2);
            path.lineTo(width, y2);
            path.lineTo(width, y1);
            path.lineTo(0, y1);
            path.closePath();
        }
    },

    /**
     * Algorithm for vertical fills.
     *
     * @method _verticalFill
     * @param {Path} path Reference to the path element
     * @param {Object} points Coordinates corresponding to a major unit of an axis.
     * @param {Number} height Height of the fill.
     * @param {Number} startIndex Indicates the index in which to start drawing fills.
     * @param {Number} interval Indicates the interval between fills.
     * @param {Number} width Width of the graph.
     * @private
     */
    _verticalFill: function(path, points, height, startIndex, interval, width)
    {
        var i,
            x1,
            x2,
            len = points.length;
        for(i = startIndex; i < len; i = i + interval)
        {
            x1 = points[i].x;
            x2 = i < len - 1 ? points[i + 1].x : width;
            path.moveTo(x1, 0);
            path.lineTo(x2, 0);
            path.lineTo(x2, height);
            path.lineTo(x1, height);
            path.lineTo(x1, 0);
            path.closePath();
        }
    },

    /**
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        var defs = {
            line: {
                color:"#f0efe9",
                weight: 1,
                alpha: 1
            },
            fill: null
        };
        return defs;
    }
},
{
    ATTRS: {
        /**
         * Indicates the direction of the gridline.
         *
         * @attribute direction
         * @type String
         */
        direction: {},

        /**
         * Indicate the `Axis` in which to bind
         * the gridlines.
         *
         * @attribute axis
         * @type Axis
         */
        axis: {},

        /**
         * Indicates the `Graphic` in which the gridlines
         * are drawn.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {},

        /**
         * Indicates the number of gridlines to display. If no value is set, gridlines will equal the number of ticks in
         * the corresponding axis.
         *
         * @attribute count
         * @type Number
         */
        count: {}
    }
});
/**
 * Provides functionality for a legend.
 *
 * @module gallery-charts-stockindicators
 */
/**
 * Displays a legend when the user interacts with the corresponding chart
 * application.
 *
 * @class StockIndicatorsLegend
 * @constructor
 * @param {Object} config Configuration parameters.
 *  <dl>
 *      <dt>dataProvider</dt><dd>Reference to the application's `dataProvider` attribute.</dd>
 *      <dt>dateColor</dt><dd>The color to be used for the date text in the legend.</dd>
 *      <dt>delim</dt><dd>String value prefixing the display name of each legend item.</dd>
 *      <dt>dateLabelFunction</dt><dd>The function used for formatting the date label.</dd>
 *      <dt>dateLabelFormat</dt><dd>The strf format used to format the date label.</dd>
 *      <dt>dateLabelScope</dt><dd>The scope for the dateLabelFunction</dd>
 *      <dt>displayKeys</dt><dd>An array of displayKeys to be used in the legend. Each display key
 *      is the text to be displayed in the legend for the corresponding value key.</dd>
 *      <dt>displayName</dt><dd>Indicates whether to display the display name. The default
 *      value is `true`.</dd>
 *      <dt>displayValue</dt><dd>Indicates whether to display the value. The default value
 *      is `true`.</dd>
 *      <dt>drawSwatch</dt><dd>Indicates whether or no to draw a colored swatch by the display
 *      name. The default value is `true`.</dd>
 *      <dt>font</dt><dd>The font to use for all text in the legend.</dd>
 *      <dt>fontSize</dt><dd>The font size to use for all text in the legend.</dd>
 *      <dt>height</dt><dd>The height of the legend.</dd>
 *      <dt>priceDownColor</dt><dd>The color to be used for the value text when the value is negative.</dd>
 *      <dt>priceUpColor</dt><dd>The color to be used for value text when the value is positive.</dd>
 *      <dt>swatchWidth</dt><dd>The width of the swatch for each legend item.</dd>
 *      <dt>valueKeys</dt><dd>The value keys, in order, to be used in the legend.</dd>
 *      <dt>valueLabelFormat</dt><dd>Object literal indicating how to format the legend values.
 *          <dl>
 *              <dt>prefix</dt><dd>The prefix.</dd>
 *              <dt>suffix</dt><dd>The suffix.</dd>
 *              <dt>thousandsSeparator</dt><dd>The thousands separator.</dd>
 *              <dt>decimalPlaces</dt><dd>The number of decimals to display.</dd>
 *              <dt>decimalsSeparator</dt><dd>The decimal separator.</dd>
 *          </dl>
 *      </dd>
 *      <dt>width</dt><dd>The width of the legend.</dd>
 *      <dt>x</dt><dd>The x-coordinate for the legend</dd>
 *      <dt>y</dt><dd>The y-coordinate for the legend</dd>
 *  </dl>
 */
function StockIndicatorsLegend() {
    this.init.apply(this, arguments);
}
StockIndicatorsLegend.prototype = {
    init: function(cfg) {
        var i,
            myul,
            len,
            seriesQueue = cfg.valueKeys,
            displayNameQueue = cfg.displayKeys,
            displayName,
            item,
            indicator,
            items = this.items || {},
            indicatorColor;
            this.x = cfg.x;
            this.y = cfg.y;
            this.width = cfg.width;
            this.height = cfg.height;
            this.dataProvider = cfg.dataProvider;
            this.contentDiv = Y.DOM.create('<div style="position:absolute;top:' +
                cfg.y + 'px;' + cfg.x + '0px;height: ' + cfg.height + 'px; width: ' +
                cfg.width + 'px;" class="l-hbox">'
            );
            this.dateLabelFunction = cfg.dateLabelFunction;
            this.dateLabelFormat = cfg.dateLabelFormat;
            this.dateLabelScope = cfg.dateLabelScope || this;
            cfg.render.getDOMNode().appendChild(this.contentDiv);

            len = seriesQueue.length;
            myul = Y.DOM.create(
                '<ul  style="vertical-align: middle; line-height: ' + this.height +
                'px;padding:0px 0px 0px 0px;margin:0px 0px 0px 0px;" class="layout-item-modules pure-g">'
            );
            this.contentDiv.appendChild(myul);
            this.dateItem = {
                li: Y.DOM.create('<li class="layout-item-module pure-u" style="display:inline-block; margin: 0px 4px 0px 0px;">'),
                value: Y.DOM.create(
                    '<span style="border-left:' + cfg.swatchWidth + 'px solid #fff;font-size:' + cfg.fontSize + ';font-family:' + cfg.font +
                    ';" id="dateitem";font-color:' + cfg.dateColor +'" ></span>'
                )
            };
            this.dateItem.li.appendChild(this.dateItem.value);
            myul.appendChild(this.dateItem.li);
            for(i = 0; i < len; i = i + 1) {
                indicator = seriesQueue[i];
                displayName = displayNameQueue[i];
                item = {};
                indicatorColor = cfg.colors[indicator];
                item.li = Y.DOM.create(
                    '<li id="' + indicator + '" class="layout-item-module pure-u" style="display:inline-block; margin: 0px 4px 0px 0px;">'
                 );
                item.bullet = Y.DOM.create(
                    '<div style="display: inline-block;width:3px; height: ' + this.height + 'px; background-color:' + indicatorColor + ';"></div>'
                );
                item.label = Y.DOM.create(
                    '<span style="font-size:' + cfg.fontSize +
                    ';font-family:' + cfg.font + ';color:' + indicatorColor + ';display:inline:margin: 0px 0px 0px 0px;" id="' +
                    indicator + '" >' + cfg.delim + displayName +
                    ' : </span>'
                );
                item.value = Y.DOM.create(
                    '<span style="font-size:' + cfg.fontSize + ';font-family:' + cfg.font +
                    ';display:inline:margin: 0px 0px 0px 0px;" id="' + indicator + 'Value" ></span>'
                );
                myul.appendChild(item.li);
                item.li.appendChild(item.bullet);
                item.li.appendChild(item.label);
                item.li.appendChild(item.value);
                items[indicator] = item;
                item.li.style.display = "none";
            }
            this.list = myul;
            this.seriesQueue = seriesQueue;
            this.items = items;
            this.priceUpColor = cfg.priceUpColor;
            this.priceDownColor = cfg.priceDownColor;
            this.valueLabelFormat = cfg.valueLabelFormat;
            this.formatDate = cfg.formatDate;
            this._xy = Y.DOM.getXY(this.contentDiv);
    },
   
    /**
     * Removes all elements of the legend.
     *
     * @method destroy
     */
    destroy: function() {
        this._removeChildren(this.list);
        this._removeChildren(this.contentDiv);
        if(this.contentDiv && this.contentDiv.parentNode) {
            this.contentDiv.parentNode.removeChild(this.contentDiv);
        }
    },

    /**
     * Removes all DOM elements from an HTML element. Used to clear out labels during detruction
     * phase.
     *
     * @method _removeChildren
     * @private
     */
    _removeChildren: function(node)
    {
        if(node && node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },
   
    /**
     * Updates the legend.
     *
     * @method update
     * @param {Number} pageX
     * @param {Array} dataProvider
     */
    update: function(pageX, dataProvider, redraw) {
        var xy = this._xy,
            x = pageX - xy[0],
            index = Math.floor(x / this.width * dataProvider.length);
        this._dataItem = dataProvider[index];
        if(redraw) {
            this.redraw();
        }
    },

  
    /**
     * Draws the legend.
     *
     * @method redraw
     */
    redraw: function() {
        var queue = this.seriesQueue,
            key,
            len = queue.length,
            item,
            items = this.items,
            i,
            val,
            dateLabelFunction = this.dateLabelFunction,
            dateLabelScope = this.dateLabelScope,
            dateLabelFormat = this.dateLabelFormat,
            dateLabelArgs,
            dataItem = this._dataItem;
        if(dataItem) {
            val = dataItem.Date || dataItem.Timestamp;
            if(dateLabelFunction) {
                dateLabelArgs = [val];
                if(dateLabelFormat) {
                    dateLabelArgs.push(dateLabelFormat);
                }
                val = dateLabelFunction.apply(dateLabelScope, dateLabelArgs);
            }
            this.dateItem.value.innerHTML = Y.Escape.html(val);
            for(i = 0; i < len; i = i + 1) {
                key = queue[i];
                item = items[key];
                if(dataItem.hasOwnProperty(key)) {
                    item.li.style.display = "inline-block";
                    val = dataItem[key];
                    item.value.innerHTML = Y.Number.format(parseFloat(val), this.valueLabelFormat);
                    Y.DOM.setStyle(item.value, "color", val > 0 ? this.priceUpColor : this.priceDownColor);
                } else {
                    item.li.style.display = "none";
                }
            }
            dataItem = this._dataItem = null;
        }
    }
};
Y.StockIndicatorsLegend = StockIndicatorsLegend;
/**
 * Provides functionality for a chart.
 *
 * @module gallery-charts-stockindicators
 */

/**
 * StockIndicatorsChart is an application that generates a chart or charts based on a key indexed array of data and an
 * array of charts configuration data.
 *
 * @class StockIndicatorsChart
 * @constructor
 * @param {Object} config An object literal contain properties defined in the <a href="#attr_charts">charts</a> attribute.
 */
function StockIndicatorsChart() {
    StockIndicatorsChart.superclass.constructor.apply(this, arguments);
}
StockIndicatorsChart.NAME = "stockChart";
StockIndicatorsChart.ATTRS = {
    /**
     * An array of `chart` objects containing necessary data and configuration properties to generate a stock indicator
     * chart application. Each index of the array is represented in the structure below.
     *  <dl>
     *      <dt>axes</dt><dd>
     *          An object literal representing the `axes` for the chart. Each `axes` object contains a `date`
     *          and a `numeric` axis.
     *          <dl>
     *              <dt>date</dt><dd>A <a href="http://yuilibrary.com/yui/docs/api/classes/CategoryAxis.html">CategoryAxis</a>
     *              instance. Possible attributes are listed
     *              <a href="http://yuilibrary.com/yui/docs/api/classes/CategoryAxis.html#attr_appendLabelFunction">here</a>.</dd>
     *              <dt>numeric</dt><dd>A <a href="http://yuilibrary.com/yui/docs/api/classes/NumericAxis.html">NumericAxis</a>
     *              instance. Possible attributes are listed
     *              <a href="http://yuilibrary.com/yui/docs/api/classes/NumericAxis.html#attr_alwaysShowZero">here</a>.</dd>
     *          </dl>
     *      </dd>
     *      <dt>categoryKey</dt><dd>A reference to the key in the `dataProvider` that represents the values
     *      used for the date axis of the chart.</dd>
     *      <dt>colors</dt><dd>An object containing key values pairs in which the key is a reference to the values
     *      of the `dataProvider` and the value is the color associated with each key. This data is used to determine
     *      the colors for the corresponding graphs, legends and crosshair markers.</dd>
     *      <dt>crosshair</dt><dd>Configuration properties for the <a href="Crosshair.html">Crosshair</a>  display that shows when
     *      interacting with a chart. It consists of `marker` shapes that correspond with each series of the
     *      chart, and optional horizontal and vertical lines. By default, the vertical line is displayed and
     *      the horizontal line is not. The colors of each `marker` is determined by its corresponding series
     *      color. Possible configuration values are documented <a href="Crosshair.html">here</a>.</dd>
     *      <dt>dotdiameter</dt><dd>The diameter to be used for marker graphs in the chart.</dd>
     *      <dt>gridcolor</dt><dd>The color to be used for the background grid of the chart.</dd>
     *      <dt>height</dt><dd>The height of the chart including the legend, graph and date axis.</dd>
     *      <dt>indicators</dt><dd>An array of objects in which each object contains data about the financial
     *      indicator that will be represented with a financial graph. Each financial graph may be represented
     *      by one or more actual graph instances. (e.g. One financial may contain multiple line graphs as in the
     *      case of bollinger bands.) Each indicator object contains the following properties:
     *          <dl>
     *              <dt>currency</dt><dd>Reference to the currency used to measure the data.</dd>
     *              <dt>displayKey</dt><dd>A key or array of keys, depending on the indicator mapped to a valueKey
     *              from the `dataProvider` that will be displayed in the corresponding legend.</dd>
     *              <dt>groupMarkers</dt><dd>Indicates whether to draw all markers as a single dom element.</dd>
     *              <dt>indicator</dt><dd>Represents the type of indicator data that will be displayed. (e.g. `quote`,
     *              `bollinger`, `psar`)</dd>
     *              <dt>iscomp</dt><dd>Indicates whether the indicator is a comparison indicator.</dd>
     *              <dt>labels</dt><dd>An array of of values used to create labels on the x-axis.</dd>
     *              <dt>ticker</dt><dd>Indicates the stock ticker of the indicator. (e.g. `yhoo`)</dd>
     *              <dt>type</dt><dd>Indicates the type of financial graph used to display the indicator data.
     *              (e.g. `candlestick`, `line`)
     *              <dt>valueKey</dt>A key or array of keys, depending on the indicator, representing the related
     *              values from the `dataProvider`.</dd>
     *          </dl>
     *      </dd>
     *      <dt>legend</dt><dd>Configuration properties used to construct the <a href="StockIndicatorsLegend.html">StockIndicatorsLegend</a>.
     *      Possible configuration values are documented <a href="StockIndicatorsLegend.html">here</a>. The x and y properties are not
     *      configurable through this object as they are determined by the layout of the charts in this application. </dd>
     *      <dt>lineWidth</dt><dd>The weight to be used for line graphs in the chart.</dd>
     *      <dt>numBar</dt><dd>The value used to calculate the width of the columns in a graph when the `rangeType` is
     *      `daily`. By default, the column width is determined from number of data values across the x axis and the
     *      width of the graph.</dd>
     *      <dt>rangeType</dt><dd>The range type for the chart.
     *          <dl>
     *              <dt>intraday</dt><dd>The date range spans across a single day.</dd>
     *              <dt>daily</dt><dd>The date range spans across multiple days.</dd>
     *          </dl>
     *      </dd>
     *      <dt>width</dt><dd>The width of the chart.</dd>
     *      <dt>y</dt><dd>The y coordinate for the chart in relation to the application.</dd>
     *  </dl>
     *
     *  @attribute charts
     *  @type: Array
     */
    charts: {},

    /**
     * Data used to generate the charts.
     *
     * @attribute dataProvider
     * @type Array
     */
    dataProvider: {
        lazyAdd: false,

        getter: function() {
            return this._dataProvider;
        },

        setter: function(val) {
            this._dataProvider = val;
            return val;
        }
    }
};
Y.extend(StockIndicatorsChart, Y.Widget, {
    /**
     * Draws a charts based on a config object.
     *
     * @method drawCharts
     * @param {Array} An array of configuration objects for the charts.
     */
    drawCharts: function() {
        var charts = [],
            configs = this.get("charts"),
            cb = this.get("contentBox"),
            i,
            len = configs.length;
        this._removeAll();
        for(i = 0; i < len; i = i + 1) {
            charts[i] = this.drawChart(configs[i], cb);
        }
        this._charts = charts;
    },

    /**
     * Updates the position of the crosshair based on the event payload.
     *
     * @method updatesLegendsCrosshair
     * @param {Object} e Event payload
     */
    updatesLegendsCrosshair: function(e) {
        e.preventDefault();
        var crosshair,
            crosshairs = this._crosshairs,
            legends = this._legends,
            isTouch = e && e.hasOwnProperty("changedTouches"),
            pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,
            pageY = isTouch ? e.changedTouches[0].pageY : e.pageY,
            len = crosshairs.length,
            chart,
            xy,
            x,
            i;
        if(pageX % 1 === 0 && pageY % 1 === 0 && this.curX !== pageX) {
            for(i = 0; i < len; i = i + 1) {
                chart = this._charts[i];
                xy = chart.xy,
                x = pageX - xy[0];
                crosshair = this._crosshairs[i];
                crosshair.setTarget(pageX, this._autoDraw);
            }
            len = legends.length;
            for(i = 0; i < len; i = i + 1) {
                legends[i].update(pageX, this._dataProvider, this._autoDraw);
            }
        }
        this.curX = pageX;
    },

    /**
     * Starts a timeline used to manage redraws based on requestAnimationFrame.
     *
     * @method startTimeline
     */
    startTimeline: function() {
        if(!this._runTimeline) {
            this._runTimeline = true;
            this._timelineStart = (new Date()).valueOf() - 17;
            this.redraw();
        }
    },

    /**
     * Ends a timeline.
     *
     * @method stopTimeline
     */
    stopTimeline: function() {
        var args,
            timelineId = this._timelineId;
        this._runTimeline = false;
        if(timelineId) {
            args = [timelineId];
            this._timelineId = null;
        }
    },

    /**
     * Draws chart elements based on the timeline.
     *
     * @method redraw
     */
    redraw: function() {
        var scope = this,
            crosshairs = this._crosshairs,
            legends = this._legends,
            i,
            len = crosshairs.length,
            endTime = (new Date()).valueOf();
        if(endTime >= this._timelineStart + 17) {
            for(i = 0; i < len; i = i + 1) {
                crosshairs[i].redraw();
            }
            len = legends.length;
            for(i = 0; i < len; i = i + 1) {
                legends[i].redraw();
            }
            this._timelineStart = (new Date()).valueOf();
        }
        if(this._runTimeline && !this._autoDraw) {
            this._timelineId = this._onEnterFrame.apply(window, [function() {
                scope.redraw();
            }]);
        }
    },

    /**
     *
     */
    initializer: function() {
        var cb = this.get("contentBox");
        cb.setStyle("position", "relative");
        this._axes = [];
        this._graphs = [];
        this._graphics = [];
        this._crosshairs = [];
        this._hotspots = [];
        this._legends = [];
        this._runTimeline = false;
        this._onEnterFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;
        this._autoDraw = this._onEnterFrame ? false : true;
        StockIndicatorsChart.superclass.initializer.apply(this, arguments);
    },

    /**
     * Maps string values to a graph class.
     *
     * @property _graphMap
     * @type Object
     * @private
     */
    _graphMap: {
        line: Y.LineSeries,
        marker: Y.MarkerSeries,
        column: Y.ColumnSeries,
        candlestick: Y.CandlestickSeries
    },

    /**
     * Returns the correct graph class based on a value. If a class is passed,
     * it will be returned. If a string is passed, the appropriate class
     * will be returned.
     *
     * @method _getGraph
     * @param {Object} Graph type needed.
     * @return SeriesBase
     * @private
     */
    _getGraph: function(type) {
        return this._graphMap[type];
    },

    /**
     * Creates an array of series configuration arguments for each graph in a chart.
     *
     * @method _getSeriesCollection
     * @param {Object} config The chart configuration object.
     * @return Array
     * @private
     */
    _getSeriesCollection: function(config) {
        var seriesCollection = [],
            indicator,
            indicators = config.indicators,
            indicatorType,
            indIter,
            indLen = indicators.length,
            valueIter,
            valueLen,
            valueKey,
            groupMarkers;
        for(indIter = 0; indIter < indLen; indIter = indIter + 1) {
            indicator = indicators[indIter];
            valueKey = indicator.valueKey;
            indicatorType = indicator.type;
            if(indicatorType === "candlestick" || typeof valueKey === "string") {
                groupMarkers = indicatorType !== "candlestick" &&
                                indicatorType !== "line" &&
                                indicator.groupMarkers;
                seriesCollection.push({
                    groupMarkers: groupMarkers,
                    type: indicator.type,
                    xKey: config.categoryKey,
                    yKey: indicator.valueKey
                });
            } else {
               valueLen = valueKey.length;
               for(valueIter = 0; valueIter < valueLen; valueIter = valueIter + 1) {
                    indicatorType = indicator.type;
                    groupMarkers = indicatorType !== "line" && indicator.groupMarkers;
                    seriesCollection.push({
                        groupMarkers: groupMarkers,
                        type: typeof indicatorType === "string" ? indicatorType : indicatorType[valueIter],
                        xKey: config.categoryKey,
                        yKey: indicator.valueKey[valueIter]
                    });
               }
            }
        }
        return seriesCollection;
    },

    /**
     * Adds styles to each item in an array of graph object literals used as the configuration argument of their
     * respective series instance.
     *
     * @method _getSeriesStyles
     * @param {Array} seriesCollection An array of series configuration objects.
     * @param {Object} config The chart configuration object.
     * @return Array
     * @private
     */
    _getSeriesStyles: function(seriesCollection, config) {
        var series,
            colors = config.colors,
            dotDiameter,
            columnWidth,
            dataProvider,
            rangeType,
            i,
            len = seriesCollection.length;
        for(i = 0; i < len; i = i + 1) {
            series = seriesCollection[i];
            switch(series.type) {
                case "line" :
                    series.styles = {
                        line: {
                            weight: config.lineWidth,
                            color: colors[series.yKey]
                        }
                    };
                break;
                case "candlestick" :
                    series.styles = {
                        upcandle: {
                            fill: {
                                color: colors.priceUp
                            }
                        },
                        downcandle: {
                            fill: {
                                color: colors.priceDown
                            }
                        }
                    };
                break;
                case "marker" :
                    dataProvider = this.get("dataProvider");
                    dotDiameter = Math.min(config.dotDiameter, config.width/dataProvider.length);
                    series.styles = {
                        marker: {
                            width: dotDiameter,
                            height: dotDiameter,
                            border: {
                                color: colors[series.yKey],
                                weight: 0
                            },
                            fill: {
                                color: colors[series.yKey]
                            }
                        }
                    };
                break;
                case "column" :
                    dataProvider = this.get("dataProvider");
                    rangeType = config.rangeType;
                    //columnWidth = rangeType !== "intraday" && rangeType !== "fiveday" ? config.width/dataProvider.length : config.numBars;
                    columnWidth = config.width/dataProvider.length;
                    columnWidth = Math.min(10, Math.round(columnWidth - (columnWidth * 0.4)));
                    columnWidth -= 2;
                    columnWidth = Math.max(1, columnWidth);
                    series.styles = {
                        marker: {
                            width: columnWidth,
                            border: {
                                weight: 0
                            },
                            fill: {
                                color: colors[series.yKey]
                            }
                        }
                    };
                break;
            }
        }
        return seriesCollection;
    },

    /**
     * Renders graph instances into the chart.
     *
     * @method _drawGraphs
     * @param {Object} config The chart configuration object.
     * @param {Object} axes Object containing references to the date and numeric axes of the chart.
     * @param {Graphic} graphic Reference to the graphic instance in which the graphs will be rendered.
     * @return Array
     * @private
     */
    _drawGraphs: function(config, axes, graphic) {
        var seriesCollection = this._getSeriesStyles(this._getSeriesCollection(config), config),
            series,
            seriesKey,
            graph,
            graphs = {},
            dateAxis = axes.date,
            numericAxis = axes.numeric,
            GraphClass,
            i,
            len = seriesCollection.length;
        for(i = 0; i < len; i = i + 1) {
            series = seriesCollection[i];
            series.xAxis = dateAxis;
            series.yAxis = numericAxis;
            series.graphic = graphic;
            GraphClass = this._getGraph(series.type);
            graph = new GraphClass(series);
            graph.draw();
            seriesKey = series.yKey;
            if(typeof seriesKey !== "string") {
                seriesKey = "quote";
            }
            graphs[seriesKey] = graph;
        }

        this._graphs.push(graph);
        return graphs;
    },

    /**
     * Draws gridline background for a chart and returns an object literal with references to
     * the `horizontal` and `vertical` gridlines.
     *
     * @method _drawGridlines
     * @param {Object} config The chart configuration object.
     * @param {Object} axes Object containing references to the date and numeric axes of the chart.
     * @param {Graphic} graphic Reference to the graphic instance in which the graphs will be rendered.
     * @return Object
     * @private
     */
    _drawGridlines: function(config, axes, graphic) {
        var width = graphic.get("width"),
            height = graphic.get("height"),
            horizontalGridlines = new Y.Gridlines({
                graphic:graphic,
                direction: "horizontal",
                axis: axes.numeric
            }),
            verticalGridlines = new Y.Gridlines({
                graphic: graphic,
                direction: "vertical",
                axis: axes.date,
                styles: {
                    fill: {
                        color: config.gridColor
                    },
                    border: {
                        weight: 0
                    }
                }
            });
        horizontalGridlines.draw(width, height);
        verticalGridlines.draw(width, height, config.rangeType === 'intraday' ? 0 : 1);
        horizontalGridlines._path.toBack();
        verticalGridlines._path.toBack();
        return {
            horizontal: horizontalGridlines,
            vertical: verticalGridlines
        };
    },

   /**
    * Maps axis class to key.
    *
    * @property _axesClassMap
    * @type AxisBase
    * @private
    */
    _axesClassMap: {
        numeric: Y.NumericAxis,
        numericbase: Y.NumericAxisBase,
        category: Y.CategoryAxis,
        categorybase: Y.CategoryAxisBase
    },

    /**
     * Add the axes to the chart and returns an object literal with references to the
     * `date` and `numeric` axes.
     *
     * @method _drawAxes
     * @param {Object} config The chart configuration object.
     * @param {Node} cb Reference to the node in which the axes will be rendered.
     * @return Object
     * @private
     */
    _drawAxes: function(config, cb) {
        var axes,
            bb,
            numericConfig = config.axes.numeric,
            dateConfig = config.axes.date,
            numericAxis,
            dateAxis,
            NumericClass = this._axesClassMap[numericConfig.type],
            DateClass = this._axesClassMap[dateConfig.type];
        numericConfig.render = cb;
        numericConfig.y = config.y + config.legend.height;
        numericConfig.x = config.width - numericConfig.width;
        numericConfig.height = config.height - dateConfig.height - config.legend.height;
        dateConfig.render = cb;
        dateConfig.y = config.y + config.height - dateConfig.height;
        dateConfig.width = config.width;
        numericAxis = new NumericClass(numericConfig);
        dateAxis = new DateClass(dateConfig);
        bb = dateAxis.get("boundingBox");
        bb.setStyle("left", 0 + "px");
        bb.setStyle("top", (config.y + config.height - dateConfig.height) + "px");
        bb = numericAxis.get("boundingBox");
        bb.setStyle("left", numericConfig.x + "px");
        bb.setStyle("top", (config.y + config.legend.height) + "px");
        axes = {
            numeric: numericAxis,
            date: dateAxis
        };
        this._axes.push(axes);
        return axes;
    },

    /**
     * Adds an interactive layer for the chart.
     *
     * @method _drawHotspot
     * @param {Object} config The chart configuration object.
     * @param {Node} cb Reference to the node in which the hotspot will be rendered.
     * @return Node
     * @private
     */
    _drawHotspot: function(config, cb) {
        var hotspot = Y.Node.create(
            '<div class="yui3-hotspot" id="fincharthotspot_' + this._hotspots.length +
            '" style="width:' + config.width + 'px;height:' + (config.height - config.legend.height - config.axes.date.height) +
            'px;position:absolute;left:0px;top:' + (config.y + config.legend.height) + 'px;opacity:0;background:#fff;z-index:4"></div>'
        );
        hotspot.setStyle("opacity", 0);
        cb.append(hotspot);
        this._hotspots.push(hotspot);
    },

    /**
     * Creates a graphic instance that will be used to render the gridlines and graphs for the chart.
     *
     * @method _createGraphic
     * @param {Object} config The chart configuration object.
     * @param {Node} cb Reference to the node in which the hotspot will be rendered.
     * @return Graphic
     * @private
     */
    _createGraphic: function(config, cb) {
        var graphic = new Y.Graphic({
                render: cb,
                width: this.get("width"),
                height: config.height - config.legend.height - config.axes.date.height,
                x: 0,
                y: config.y + config.legend.height,
                autoDraw: false
            });
        this._graphics.push(graphic);
        return graphic;
    },

    /**
     * Creates a crosshair to display when the user interacts with the chart.
     *
     * @method _addCrosshair
     * @param {Object} config The chart configuration object.
     * @param {Object} An object literal containing references to the graphs in the chart.
     * @param {Node} cb Reference to the node in which the hotspot will be rendered.
     * @return Crosshair
     * @private
     */
    _addCrosshair: function(config, graphs,  cb) {
        var crosshair,
            crosshairConfig = config.crosshair,
            crosshaircategory = {
                stroke: {
                    color: crosshairConfig.lineColor,
                    weight: crosshairConfig.lineWidth
                }
            },
            crosshairseries = [],
            graph,
            key,
            colors = config.colors;
        for(key in graphs) {
            if(graphs.hasOwnProperty(key)) {
                graph = graphs[key];
                crosshairseries.push({
                    marker: {
                        shape: "circle",
                        width: crosshairConfig.dotDiameter,
                        height: crosshairConfig.dotDiameter,
                        fill: {
                            color: colors[key === "quote" ? "close" : key]
                        },
                        stroke: {
                            weight: 0
                        }
                    },
                    coords: key === "quote" ? graph.get("ycoords").close : graph.get("ycoords")
                });
                crosshaircategory.coords = graph.get("xcoords");
            }
        }
        crosshair = new Y.Crosshair({
            width: config.width,
            height: config.height - config.axes.date.height - config.legend.height,
            x: 0,
            y: config.y + config.legend.height,
            render: cb,
            series: crosshairseries,
            category: crosshaircategory
        });
        this._crosshairs.push(crosshair);
        return crosshair;
    },

    /**
     * Creates a legend for the chart.
     *
     * @method _addLegend
     * @param {Object} config The chart configuration object.
     * @param {Node} cb Reference to the node in which the hotspot will be rendered.
     * @return StockIndicatorsLegend
     * @private
     */
    _addLegend: function(config, cb) {
        var legend,
             legendConfig = config.legend;
        legendConfig.colors = config.colors;
        legendConfig.render = cb;
        legendConfig.y = config.y;
        legend = new Y.StockIndicatorsLegend(legendConfig);
        this._legends.push(legend);
        return legend;
    },

    /**
     * Generates all elements needed to create a finance chart application using
     * charts.
     *
     * @method drawChart
     * @param {Object} config Data from the chart api
     * @return Array
     */
    drawChart: function(config, cb) {
        var chart,
            axes = this._drawAxes(config, cb),
            graphic = this._createGraphic(config, cb),
            gridlines = this._drawGridlines(config, axes, graphic),
            graphs = this._drawGraphs(config, axes, graphic),
            hotspot = this._drawHotspot(config, cb),
            crosshair = this._addCrosshair(config, graphs, cb),
            legend = this._addLegend(config, cb);
        chart = {
            axes: axes,
            graphic: graphic,
            gridlines: gridlines,
            graphs: graphs,
            hotspot: hotspot,
            crosshair: crosshair,
            legend: legend,
            xy: graphic.getXY()
        };
        //repaint the gridlines and graph
        graphic._redraw();
        return chart;
    },

    _destroyCrosshairs: function() {
        var i,
            len = this._charts.length,
            target;
        while(this._crosshairs.length > 0) {
            target = this._crosshairs.pop();
            target.destroy();
        }
        for(i = 0; i < len; i = i + 1) {
            delete this._charts[i].crosshair;
        }
    },

    _destroyHotspots: function() {
        var i,
            len = this._charts.length,
            target;
        while(this._hotspots.length > 0) {
            target = this._hotspots.pop();
            target.empty();
            target.remove(true);
        }
        for(i = 0; i < len; i = i + 1) {
            delete this._charts[i].hotspot;
        }
    },

    _destroyAxes: function() {
        var i,
            len = this._charts.length,
            target;
        while(this._axes.length > 0) {
            target = this._axes.pop();
            target.date.destroy(true);
            target.numeric.destroy(true);
        }
        for(i = 0; i < len; i = i + 1) {
            delete this._charts[i].axes;
        }
    },

    _destroyGraphs: function() {
        var i,
            len = this._charts.length,
            target;
        while(this._graphs.length > 0) {
            target = this._graphs.pop();
            target.destroy(true);
        }
        for(i = 0; i < len; i = i + 1) {
            delete this._charts[i].graph;
        }
    },

    _destroyLegends: function() {
        var i,
            len = this._charts.length,
            target;
        while(this._legends.length > 0) {
            target = this._legends.pop();
            target.destroy();
        }
        for(i = 0; i < len; i = i + 1) {
            delete this._charts[i].legend;
        }
    },

    _destroyGraphics: function() {
        var i,
            len = this._charts.length,
            target;
        while(this._graphics.length > 0) {
            target = this._graphics.pop();
            target.destroy();
        }
        for(i = 0; i < len; i = i + 1) {
            delete this._charts[i].graphic;
        }
    },

    _removeAll: function() {
        var chart,
            key;
        if(this._charts) {
            this._destroyCrosshairs();
            this._destroyHotspots();
            this._destroyLegends();
            this._destroyGraphs();
            this._destroyAxes();
            this._destroyGraphics();
            while(this._charts.length > 0) {
                chart = this._charts.pop();
                for(key in chart) {
                    if(chart.hasOwnProperty(key)) {
                        delete chart[key];
                    }
                }
            }
        }
    },

    destructor: function() {
        this._removeAll();
    }
});
Y.StockIndicatorsChart = StockIndicatorsChart;
/**
 * Creates a spark graph.
 *
 * @module gallery-charts-stockindicators
 * @class StockIndicatorsSpark
 * @constructor
 */
Y.StockIndicatorsSpark = function() {
    this._init.apply(this, arguments);
    return this;
};

Y.StockIndicatorsSpark.prototype = {
    /**
     * Maps keys to corresponding class.
     *
     * @property _graphMap
     * @type Object
     * @private
     */
    _graphMap:  {
        line: Y.LineSeries,
        marker: Y.MarkerSeries,
        column: Y.ColumnSeries,
        area: Y.AreaSeries
    },

    /**
     * Maps keys to the property of a style attribute
     * of the corresponding `SeriesBase` instance.
     *
     * @property _styleMap
     * @type Object
     * @private
     */
    _styleMap: {
        line: "line",
        marker: "marker",
        column: "marker",
        area: "area"
    },

    /**
     *  Sets properties for the graph.
     *
     *  @method _init
     *  @param {Object} config Properties for the graph.
     *  @private
     */
    _init: function(config) {
        var styles = config.styles,
            bb = document.createElement('div'),
            cb = document.createElement('div'),
            render = config.render,
            type = config.type || "line",
            style = type === "column" ? "marker" : type,
            SparkClass = this._graphMap[type];
        this.dataProvider = config.dataProvider;
        this.xKey = config.xKey;
        this.yKey = config.yKey;
        if(!styles) {
            styles = {};
            if(config[style]) {
                styles[style] = config[style];
            } else {
                styles[style] = {};
                if(config.color) {
                    styles.line.color = config.color;
                }
                if(config.alpha) {
                    styles.line.alpha = config.alpha;
                }
                if(type === "line") {
                    styles.line.weight = isNaN(config.weight) ? 1 : config.weight;
                }
            }
        }
        this.xAxis = new Y.CategoryAxisBase({
            dataProvider: this.dataProvider,
            keys: [this.xKey]
        });
        this.yAxis = new Y.NumericAxisBase({
            dataProvider: this.dataProvider,
            keys: [this.yKey],
            alwaysShowZero: false
        });
        bb.style.position = "absolute";
        Y.DOM.setStyle(bb, "inlineBlock");
        cb.style.position = "relative";
        render = document.getElementById(render);
        render.appendChild(bb);
        bb.appendChild(cb);
        cb.style.width = Y.DOM.getComputedStyle(render, "width");
        cb.style.height = Y.DOM.getComputedStyle(render, "height");
        this.graphic = new Y.Graphic({
            render: cb,
            autoDraw: false
        });
        this.graph = new SparkClass({
            rendered: true,
            dataProvider: config.dataProvider,
            graphic: this.graphic,
            styles: styles,
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            xKey: this.xKey,
            yKey: this.yKey
        });
        this.contentBox = cb;
        this.boundingBox = bb;
        this.graph.validate();
        this.graphic._redraw();
    },

    /**
     * Removes all elements of the spark.
     *
     * @method destroy
     */
    destroy: function() {
        var parentNode;
        if(this.xAxis) {
            this.xAxis.destroy(true);
        }
        if(this.yAxis) {
            this.yAxis.destroy(true);
        }
        if(this.graph) {
            this.graph.destroy();
        }
        if(this.graphic) {
            this.graphic.destroy();
        }
        if(this.contentBox) {
            parentNode = this.contentBox.parentNode;
            if(parentNode) {
                parentNode.removeChild(this.contentBox);
            }
        }
        if(this.boundingBox) {
            parentNode = this.boundingBox.parentNode;
            if(parentNode) {
                parentNode.removeChild(this.boundingBox);
            }
        }
    }
};


}, 'gallery-2014.01.28-00-45', {
    "requires": [
        "escape",
        "graphics-group",
        "axis-numeric",
        "axis-category",
        "series-line",
        "series-marker",
        "series-column",
        "series-candlestick",
        "series-area"
    ]
});
