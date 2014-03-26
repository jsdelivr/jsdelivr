YUI.add('gallery-stockindicators-3-14-patch', function (Y, NAME) {

var ISARRAY = Y.Lang.isArray,
    DOCUMENT = Y.config.doc,
    _getClassName = Y.ClassNameManager.getClassName,
    SERIES_MARKER = _getClassName("seriesmarker"),
    COPYOBJECT = function(obj) {
        var newObj = {},
            key,
            val;
        for(key in obj)
        {
            if(obj.hasOwnProperty(key))
            {
                val = obj[key];
                if(typeof val === "object" && !ISARRAY(val))
                {
                    newObj[key] = this._copyObject(val);
                }
                else
                {
                    newObj[key] = val;
                }
            }
        }
        return newObj;
    },
    CREATEMARKER = function(styles)
    {
        var graphic = this.get("graphic"),
            marker,
            cfg = this._copyObject(styles);
        cfg.type = cfg.shape;
        marker = graphic.addShape(cfg);
        marker.addClass(SERIES_MARKER);
        return marker;
    },
    DRAWAXIS,
    GETDEFAULTAXISSTYLES,
    GETAXISLABEL,
    GETNUMERICCOORDFROMVALUE,
    GETCATEGORYCOORDFROMVALUE;
    if(Y.CanvasGraphic) {
        Y.CanvasGraphic.prototype.render = function(render) {
            var parentNode = render || DOCUMENT.body,
                node = this._node,
                w,
                h;
            if(render instanceof Y.Node)
            {
                parentNode = render._node;
            }
            else if(Y.Lang.isString(render))
            {
                parentNode = Y.Selector.query(render, DOCUMENT.body, true);
            }
            w = this.get("width") || parseInt(Y.DOM.getComputedStyle(parentNode, "width"), 10);
            h = this.get("height") || parseInt(Y.DOM.getComputedStyle(parentNode, "height"), 10);
            parentNode.appendChild(node);
            node.style.display = "block";
            node.style.position = "absolute";
            node.style.left = this.get("x") + "px";
            node.style.top = this.get("y") + "px";
            this.set("width", w);
            this.set("height", h);
            this.parentNode = parentNode;
            return this;
        };
    }
    if(Y.Axis) {
        GETCATEGORYCOORDFROMVALUE = function(min, max, length, dataValue, offset)
        {
            var range,
                multiplier,
                valuecoord;
            if(Y.Lang.isNumber(dataValue))
            {
                range = max - min;
                multiplier = length/range;
                valuecoord = (dataValue - min) * multiplier;
                valuecoord = offset + valuecoord;
            }
            else
            {
                valuecoord = NaN;
            }
            return valuecoord;
        };
        Y.CategoryAxisBase.prototype._getCoordFromValue = GETCATEGORYCOORDFROMVALUE;
        Y.CategoryAxis.prototype._getCoordFromValue = GETCATEGORYCOORDFROMVALUE;
        Y.CategoryAxis.prototype._getLabelData = function(
            constantVal,
            staticCoord,
            dynamicCoord,
            min,
            max,
            edgeOffset,
            layoutLength,
            count,
            dataValues
        )
        {
            var labelValue,
                i,
                points = [],
                values = [],
                point,
                labelIndex,
                data = this.get("data"),
                offset = edgeOffset;
            dataValues = dataValues || data;
            for(i = 0; i < count; i = i + 1)
            {
                labelValue = dataValues[i];
                labelIndex = Y.Array.indexOf(data, labelValue);
                if(Y.Lang.isNumber(labelIndex) && labelIndex > -1)
                {
                    point = {};
                    point[staticCoord] = constantVal;
                    point[dynamicCoord] = this._getCoordFromValue(
                        min,
                        max,
                        layoutLength,
                        labelIndex,
                        offset
                    );
                    points.push(point);
                    values.push(labelValue);
                }
            }
            return {
                points: points,
                values: values
            };
        };
        
        GETNUMERICCOORDFROMVALUE = function(min, max, length, dataValue, offset, reverse)
        {
            var range,
                multiplier,
                valuecoord,
                isNumber = Y.Lang.isNumber;
            dataValue = parseFloat(dataValue);
            if(isNumber(dataValue))
            {
                if(this.get("scaleType") === "logarithmic" && min > 0)
                {
                    min = Math.log(min);
                    max = Math.log(max);
                    dataValue = Math.log(dataValue);
                }
                range = max - min;
                multiplier = length/range;
                valuecoord = (dataValue - min) * multiplier;
                valuecoord = reverse ? offset - valuecoord : offset + valuecoord;
            }
            else
            {
                valuecoord = NaN;
            }
            return valuecoord;
        };
        
        Y.NumericAxisBase.prototype._getCoordFromValue = GETNUMERICCOORDFROMVALUE;
        Y.NumericAxis.prototype._getCoordFromValue = GETNUMERICCOORDFROMVALUE;
        
        Y.NumericAxis.prototype._getDataValuesByCount = function(count, min, max)
        {
            var dataValues = [],
                dataValue = min,
                len = count - 1,
                range = max - min,
                increm = range/len,
                i;
            for(i = 0; i < len; i = i + 1)
            {
                dataValues.push(dataValue);
                dataValue = dataValue + increm;
            }
            dataValues.push(max);
            return dataValues;
        };

        Y.NumericAxis.prototype._getLabelData = function(
            constantVal,
            staticCoord,
            dynamicCoord,
            min,
            max,
            edgeOffset,
            layoutLength,
            count,
            dataValues
        )
        {
            var dataValue,
                i,
                points = [],
                values = [],
                point,
                isVertical = staticCoord === "x",
                offset = isVertical ? layoutLength + edgeOffset : edgeOffset;
            dataValues = dataValues || this._getDataValuesByCount(count, min, max);
            for(i = 0; i < count; i = i + 1)
            {
                dataValue = parseFloat(dataValues[i]);
                if(dataValue <= max && dataValue >= min)
                {
                    point = {};
                    point[staticCoord] = constantVal;
                    point[dynamicCoord] = this._getCoordFromValue(
                        min,
                        max,
                        layoutLength,
                        dataValue,
                        offset,
                        isVertical
                    );
                    points.push(point);
                    values.push(dataValue);
                }
            }
            return {
                points: points,
                values: values
            };
        };
       
        Y.BottomAxisLayout.prototype.positionLabel = function(label, pt, styles, i)
        {
            var host = this,
                offset = parseFloat(styles.label.offset),
                tickOffset = host.get("bottomTickOffset"),
                labelStyles = styles.label,
                margin = 0,
                props = host._labelRotationProps,
                rot = props.rot,
                absRot = props.absRot,
                leftOffset = Math.round(pt.x),
                topOffset = Math.round(pt.y),
                labelWidth = host._labelWidths[i],
                labelHeight = host._labelHeights[i];
            if(labelStyles.margin && labelStyles.margin.top)
            {
                margin = labelStyles.margin.top;
            }
            if(rot === 90)
            {
                topOffset -= labelHeight/2 * rot/90;
                leftOffset = leftOffset + labelHeight/2 - (labelHeight * offset);
            }
            else if(rot === -90)
            {
                topOffset -= labelHeight/2 * absRot/90;
                leftOffset = leftOffset - labelWidth + labelHeight/2 - (labelHeight * offset);
            }
            else if(rot > 0)
            {
                leftOffset = leftOffset + labelHeight/2 - (labelHeight * offset);
                topOffset -= labelHeight/2 * rot/90;
            }
            else if(rot < 0)
            {
                leftOffset = leftOffset - labelWidth + labelHeight/2 - (labelHeight * offset);
                topOffset -= labelHeight/2 * absRot/90;
            }
            else
            {
                leftOffset -= labelWidth * offset;
            }
            topOffset += margin;
            topOffset += tickOffset;
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            props.x = leftOffset;
            props.y = topOffset;
            host._rotate(label, props);
        };
       
        Y.LeftAxisLayout.prototype.positionLabel = function(label, pt, styles, i)
        {
            var host = this,
                offset = parseFloat(styles.label.offset),
                tickOffset = host.get("leftTickOffset"),
                totalTitleSize = this._totalTitleSize,
                leftOffset = pt.x + totalTitleSize - tickOffset,
                topOffset = pt.y,
                props = this._labelRotationProps,
                rot = props.rot,
                absRot = props.absRot,
                maxLabelSize = host._maxLabelSize,
                labelWidth = this._labelWidths[i],
                labelHeight = this._labelHeights[i];
            if(rot === 0)
            {
                leftOffset -= labelWidth;
                topOffset -= labelHeight * offset;
            }
            else if(rot === 90)
            {
                leftOffset -= labelWidth * 0.5;
                topOffset = topOffset + labelWidth/2 - (labelWidth * offset);
            }
            else if(rot === -90)
            {
                leftOffset -= labelWidth * 0.5;
                topOffset = topOffset - labelHeight + labelWidth/2 - (labelWidth * offset);
            }
            else
            {
                leftOffset -= labelWidth + (labelHeight * absRot/360);
                topOffset -= labelHeight * offset;
            }
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            props.x = Math.round(maxLabelSize + leftOffset);
            props.y = Math.round(topOffset);
            this._rotate(label, props);
        };

        Y.TopAxisLayout.prototype.positionLabel = function(label, pt, styles, i)
        {
            var host = this,
                offset = parseFloat(styles.label.offset),
                totalTitleSize = this._totalTitleSize,
                maxLabelSize = host._maxLabelSize,
                leftOffset = pt.x,
                topOffset = pt.y + totalTitleSize + maxLabelSize,
                props = this._labelRotationProps,
                rot = props.rot,
                absRot = props.absRot,
                labelWidth = this._labelWidths[i],
                labelHeight = this._labelHeights[i];
            if(rot === 0)
            {
                leftOffset -= labelWidth * offset;
                topOffset -= labelHeight;
            }
            else
            {
                if(rot === 90)
                {
                    leftOffset = leftOffset - labelWidth + labelHeight/2 - (labelHeight * offset);
                    topOffset -= (labelHeight * 0.5);
                }
                else if (rot === -90)
                {
                    leftOffset = leftOffset + labelHeight/2 - (labelHeight * offset);
                    topOffset -= (labelHeight * 0.5);
                }
                else if(rot > 0)
                {
                    leftOffset = leftOffset - labelWidth + labelHeight/2 - (labelHeight * offset);
                    topOffset -= labelHeight - (labelHeight * rot/180);
                }
                else
                {
                    leftOffset = leftOffset + labelHeight/2 - (labelHeight * offset);
                    topOffset -= labelHeight - (labelHeight * absRot/180);
                }
            }
            props.x = Math.round(leftOffset);
            props.y = Math.round(topOffset);
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            this._rotate(label, props);
        };

        Y.RightAxisLayout.prototype.positionLabel = function(label, pt, styles, i)
        {
            var host = this,
                offset = parseFloat(styles.label.offset),
                tickOffset = host.get("rightTickOffset"),
                labelStyles = styles.label,
                margin = 0,
                leftOffset = pt.x,
                topOffset = pt.y,
                props = this._labelRotationProps,
                rot = props.rot,
                absRot = props.absRot,
                labelWidth = this._labelWidths[i],
                labelHeight = this._labelHeights[i];
            if(labelStyles.margin && labelStyles.margin.left)
            {
                margin = labelStyles.margin.left;
            }
            if(rot === 0)
            {
                topOffset -= labelHeight * offset;
            }
            else if(rot === 90)
            {
                leftOffset -= labelWidth * 0.5;
                topOffset = topOffset - labelHeight + labelWidth/2 - (labelWidth * offset);
            }
            else if(rot === -90)
            {
                topOffset = topOffset + labelWidth/2 - (labelWidth * offset);
                leftOffset -= labelWidth * 0.5;
            }
            else
            {
                topOffset -= labelHeight * offset;
                leftOffset += labelHeight/2 * absRot/90;
            }
            leftOffset += margin;
            leftOffset += tickOffset;
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            props.x = Math.round(leftOffset);
            props.y = Math.round(topOffset);
            this._rotate(label, props);
        };
        DRAWAXIS = function ()
        {
            if(this._drawing)
            {
                this._callLater = true;
                return;
            }
            this._drawing = true;
            this._callLater = false;
            if(this._layout)
            {
                var styles = this.get("styles"),
                    line = styles.line,
                    labelStyles = styles.label,
                    majorTickStyles = styles.majorTicks,
                    drawTicks = majorTickStyles.display !== "none",
                    len,
                    i = 0,
                    layout = this._layout,
                    layoutLength,
                    lineStart,
                    label,
                    labelWidth,
                    labelHeight,
                    labelFunction = this.get("labelFunction"),
                    labelFunctionScope = this.get("labelFunctionScope"),
                    labelFormat = this.get("labelFormat"),
                    graphic = this.get("graphic"),
                    path = this.get("path"),
                    tickPath,
                    explicitlySized,
                    position = this.get("position"),
                    labelData,
                    labelValues,
                    point,
                    points,
                    firstPoint,
                    lastPoint,
                    firstLabel,
                    lastLabel,
                    staticCoord,
                    dynamicCoord,
                    edgeOffset,
                    explicitLabels = this._labelValuesExplicitlySet ? this.get("labelValues") : null,
                    direction = (position === "left" || position === "right") ? "vertical" : "horizontal";
                this._labelWidths = [];
                this._labelHeights = [];
                graphic.set("autoDraw", false);
                path.clear();
                path.set("stroke", {
                    weight: line.weight,
                    color: line.color,
                    opacity: line.alpha
                });
                this._labelRotationProps = this._getTextRotationProps(labelStyles);
                this._labelRotationProps.transformOrigin = layout._getTransformOrigin(this._labelRotationProps.rot);
                layout.setTickOffsets.apply(this);
                layoutLength = this.getLength();

                len = this.getTotalMajorUnits();
                edgeOffset = this.getEdgeOffset(len, layoutLength);
                this.set("edgeOffset", edgeOffset);
                lineStart = layout.getLineStart.apply(this);

                if(direction === "vertical")
                {
                    staticCoord = "x";
                    dynamicCoord = "y";
                }
                else
                {
                    staticCoord = "y";
                    dynamicCoord = "x";
                }

                labelData = this._getLabelData(
                    lineStart[staticCoord],
                    staticCoord,
                    dynamicCoord,
                    this.get("minimum"),
                    this.get("maximum"),
                    edgeOffset,
                    layoutLength - edgeOffset - edgeOffset,
                    len,
                    explicitLabels
                );

                points = labelData.points;
                labelValues = labelData.values;
                len = points.length;
                if(!this._labelValuesExplicitlySet)
                {
                    this.set("labelValues", labelValues, {src: "internal"});
                }

                //Don't create the last label or tick.
                if(this.get("hideFirstMajorUnit"))
                {
                    firstPoint = points.shift();
                    firstLabel = labelValues.shift();
                    len = len - 1;
                }

                //Don't create the last label or tick.
                if(this.get("hideLastMajorUnit"))
                {
                    lastPoint = points.pop();
                    lastLabel = labelValues.pop();
                    len = len - 1;
                }

                if(len < 1)
                {
                    this._clearLabelCache();
                }
                else
                {
                    this.drawLine(path, lineStart, this.getLineEnd(lineStart));
                    if(drawTicks)
                    {
                        tickPath = this.get("tickPath");
                        tickPath.clear();
                        tickPath.set("stroke", {
                            weight: majorTickStyles.weight,
                            color: majorTickStyles.color,
                            opacity: majorTickStyles.alpha
                        });
                        for(i = 0; i < len; i = i + 1)
                        {
                            point = points[i];
                            if(point)
                            {
                                layout.drawTick.apply(this, [tickPath, points[i], majorTickStyles]);
                            }
                        }
                    }
                    this._createLabelCache();
                    this._maxLabelSize = 0;
                    this._totalTitleSize = 0;
                    this._titleSize = 0;
                    this._setTitle();
                    explicitlySized = layout.getExplicitlySized.apply(this, [styles]);
                    for(i = 0; i < len; i = i + 1)
                    {
                        point = points[i];
                        if(point)
                        {
                            label = this.getLabel(labelStyles);
                            this._labels.push(label);
                            this.get("appendLabelFunction")(label, labelFunction.apply(labelFunctionScope, [labelValues[i], labelFormat]));
                            labelWidth = Math.round(label.offsetWidth);
                            labelHeight = Math.round(label.offsetHeight);
                            if(!explicitlySized)
                            {
                                this._layout.updateMaxLabelSize.apply(this, [labelWidth, labelHeight]);
                            }
                            this._labelWidths.push(labelWidth);
                            this._labelHeights.push(labelHeight);
                        }
                    }
                    this._clearLabelCache();
                    if(this.get("overlapGraph"))
                    {
                       layout.offsetNodeForTick.apply(this, [this.get("contentBox")]);
                    }
                    layout.setCalculatedSize.apply(this);
                    if(this._titleTextField)
                    {
                        this._layout.positionTitle.apply(this, [this._titleTextField]);
                    }
                    len = this._labels.length;
                    for(i = 0; i < len; ++i)
                    {
                        layout.positionLabel.apply(this, [this.get("labels")[i], points[i], styles, i]);
                    }
                    if(firstPoint)
                    {
                        points.unshift(firstPoint);
                    }
                    if(lastPoint)
                    {
                        points.push(lastPoint);
                    }
                    if(firstLabel)
                    {
                        labelValues.unshift(firstLabel);
                    }
                    if(lastLabel)
                    {
                        labelValues.push(lastLabel);
                    }
                    this._tickPoints = points;
                }
            }
            this._drawing = false;
            if(this._callLater)
            {
                this._drawAxis();
            }
            else
            {
                this._updatePathElement();
                this.fire("axisRendered");
            }
        };

        GETDEFAULTAXISSTYLES = function() {
            var axisstyles = {
                majorTicks: {
                    display:"inside",
                    length:4,
                    color:"#dad8c9",
                    weight:1,
                    alpha:1
                },
                minorTicks: {
                    display:"none",
                    length:2,
                    color:"#dad8c9",
                    weight:1
                },
                line: {
                    weight:1,
                    color:"#dad8c9",
                    alpha:1
                },
                majorUnit: {
                    determinant:"count",
                    count:11,
                    distance:75
                },
                top: "0px",
                left: "0px",
                width: "100px",
                height: "100px",
                label: {
                    color:"#808080",
                    alpha: 1,
                    fontSize:"85%",
                    rotation: 0,
                    offset: 0.5,
                    margin: {
                        top: undefined,
                        right: undefined,
                        bottom: undefined,
                        left: undefined
                    }
                },
                title: {
                    color:"#808080",
                    alpha: 1,
                    fontSize:"85%",
                    rotation: undefined,
                    margin: {
                        top: undefined,
                        right: undefined,
                        bottom: undefined,
                        left: undefined
                    }
                },
                hideOverlappingLabelTicks: false
            };

            return Y.merge(Y.Renderer.prototype._getDefaultStyles(), axisstyles);
        };
        GETAXISLABEL =  function(styles)
        {
            var i,
                label,
                labelCache = this._labelCache,
                customStyles = {
                    rotation: "rotation",
                    margin: "margin",
                    alpha: "alpha"
                };
            if(labelCache && labelCache.length > 0)
            {
                label = labelCache.shift();
            }
            else
            {
                label = DOCUMENT.createElement("span");
                label.className = Y.Lang.trim([label.className, "axisLabel"].join(' '));
                this.get("contentBox").append(label);
            }
            if(!DOCUMENT.createElementNS)
            {
                if(label.style.filter)
                {
                    label.style.filter = null;
                }
            }
            label.style.display = "block";
            label.style.whiteSpace = "nowrap";
            label.style.position = "absolute";
            for(i in styles)
            {
                if(styles.hasOwnProperty(i) && !customStyles.hasOwnProperty(i))
                {
                    label.style[i] = styles[i];
                }
            }
            return label;
        };
        Y.CategoryAxis.prototype._getDefaultStyles = GETDEFAULTAXISSTYLES;
        Y.NumericAxis.prototype._getDefaultStyles = GETDEFAULTAXISSTYLES;
        Y.CategoryAxis.prototype._drawAxis = DRAWAXIS;
        Y.NumericAxis.prototype._drawAxis = DRAWAXIS;
        Y.CategoryAxis.prototype.getLabel = GETAXISLABEL;
        Y.NumericAxis.prototype.getLabel = GETAXISLABEL;
    }

    if(Y.MarkerSeries) {
        Y.MarkerSeries.prototype._copyObject = COPYOBJECT;
        Y.MarkerSeries.prototype._createMarker = CREATEMARKER;
       
        Y.MarkerSeries.prototype.drawPlots = function()
        {
            if(!this.get("xcoords") || this.get("xcoords").length < 1)
            {
                return;
            }
            var isNumber = Y.Lang.isNumber,
                style = this._copyObject(this.get("styles").marker),
                w = style.width,
                h = style.height,
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                i = 0,
                len = xcoords.length,
                top = ycoords[0],
                left,
                marker,
                offsetWidth = w/2,
                offsetHeight = h/2,
                xvalues,
                yvalues,
                fillColors = null,
                borderColors = null,
                graphOrder = this.get("graphOrder"),
                groupMarkers = this.get("groupMarkers");
            if(groupMarkers)
            {
                xvalues = [];
                yvalues = [];
                for(; i < len; ++i)
                {
                    xvalues.push(parseFloat(xcoords[i] - offsetWidth));
                    yvalues.push(parseFloat(ycoords[i] - offsetHeight));
                }
                this._createGroupMarker({
                    xvalues: xvalues,
                    yvalues: yvalues,
                    fill: style.fill,
                    border: style.border,
                    dimensions: {
                        width: w,
                        height: h
                    },
                    graphOrder: graphOrder,
                    shape: style.shape
                });
                return;
            }
            if(ISARRAY(style.fill.color))
            {
                fillColors = style.fill.color.concat();
            }
            if(ISARRAY(style.border.color))
            {
                borderColors = style.border.color.concat();
            }
            this._createMarkerCache();
            for(; i < len; ++i)
            {
                top = parseFloat(ycoords[i] - offsetHeight);
                left = parseFloat(xcoords[i] - offsetWidth);
                if(!isNumber(left) || !isNumber(top))
                {
                    this._markers.push(null);
                    continue;
                }
                if(fillColors)
                {
                    style.fill.color = fillColors[i % fillColors.length];
                }
                if(borderColors)
                {
                    style.border.color = borderColors[i % borderColors.length];
                }

                style.x = left;
                style.y = top;
                marker = this.getMarker(style, graphOrder, i);
            }
            this._clearMarkerCache();
        };
       
        Y.MarkerSeries.prototype.updateMarkerState = function(type, i)
        {
            if(this._markers && this._markers[i])
            {
                var w,
                    h,
                    styles = this._copyObject(this.get("styles").marker),
                    state = this._getState(type),
                    xcoords = this.get("xcoords"),
                    ycoords = this.get("ycoords"),
                    marker = this._markers[i],
                    markerStyles = state === "off" || !styles[state] ? styles : styles[state];
                    markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                    markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                    markerStyles.stroke = markerStyles.border;
                    marker.set(markerStyles);
                    w = markerStyles.width;
                    h = markerStyles.height;
                    marker.set("x", (xcoords[i] - w/2));
                    marker.set("y",  (ycoords[i] - h/2));
                    marker.set("visible", this.get("visible"));
                    marker.get("graphic")._redraw();
            }
        };
    }

    if(Y.ColumnSeries) {
        Y.ColumnSeries.prototype._copyObject = COPYOBJECT;
        Y.ColumnSeries.prototype._createMarker = CREATEMARKER;
        Y.ColumnSeries.prototype.drawSeries = function()
        {
            if(this.get("xcoords").length < 1)
            {
                return;
            }
            var style = this._copyObject(this.get("styles").marker),
                graphic = this.get("graphic"),
                setSize,
                calculatedSize,
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                i = 0,
                len = xcoords.length,
                top = ycoords[0],
                seriesTypeCollection = this.get("seriesTypeCollection"),
                seriesLen = seriesTypeCollection ? seriesTypeCollection.length : 0,
                seriesSize = 0,
                totalSize = 0,
                offset = 0,
                ratio,
                renderer,
                order = this.get("order"),
                graphOrder = this.get("graphOrder"),
                left,
                marker,
                setSizeKey,
                calculatedSizeKey,
                config,
                fillColors = null,
                borderColors = null,
                xMarkerPlane = [],
                yMarkerPlane = [],
                xMarkerPlaneLeft,
                xMarkerPlaneRight,
                yMarkerPlaneTop,
                yMarkerPlaneBottom,
                dimensions = {
                    width: [],
                    height: []
                },
                xvalues = [],
                yvalues = [],
                groupMarkers = this.get("groupMarkers");
            if(Y.Lang.isArray(style.fill.color))
            {
                fillColors = style.fill.color.concat();
            }
            if(Y.Lang.isArray(style.border.color))
            {
                borderColors = style.border.color.concat();
            }
            if(this.get("direction") === "vertical")
            {
                setSizeKey = "height";
                calculatedSizeKey = "width";
            }
            else
            {
                setSizeKey = "width";
                calculatedSizeKey = "height";
            }
            setSize = style[setSizeKey];
            calculatedSize = style[calculatedSizeKey];
            this._createMarkerCache();
            this._maxSize = graphic.get(setSizeKey);
            if(seriesTypeCollection && seriesLen > 1)
            {
                for(; i < seriesLen; ++i)
                {
                    renderer = seriesTypeCollection[i];
                    seriesSize += renderer.get("styles").marker[setSizeKey];
                    if(order > i)
                    {
                        offset = seriesSize;
                    }
                }
                totalSize = len * seriesSize;
                if(totalSize > this._maxSize)
                {
                    ratio = graphic.get(setSizeKey)/totalSize;
                    seriesSize *= ratio;
                    offset *= ratio;
                    setSize *= ratio;
                    setSize = Math.max(setSize, 1);
                    this._maxSize = setSize;
                }
            }
            else
            {
                seriesSize = style[setSizeKey];
                totalSize = len * seriesSize;
                if(totalSize > this._maxSize)
                {
                    seriesSize = this._maxSize/len;
                    this._maxSize = seriesSize;
                }
            }
            offset -= seriesSize/2;
            for(i = 0; i < len; ++i)
            {
                xMarkerPlaneLeft = xcoords[i] - seriesSize/2;
                xMarkerPlaneRight = xMarkerPlaneLeft + seriesSize;
                yMarkerPlaneTop = ycoords[i] - seriesSize/2;
                yMarkerPlaneBottom = yMarkerPlaneTop + seriesSize;
                xMarkerPlane.push({start: xMarkerPlaneLeft, end: xMarkerPlaneRight});
                yMarkerPlane.push({start: yMarkerPlaneTop, end: yMarkerPlaneBottom});
                if(!groupMarkers && (isNaN(xcoords[i]) || isNaN(ycoords[i])))
                {
                    this._markers.push(null);
                    continue;
                }
                config = this._getMarkerDimensions(xcoords[i], ycoords[i], calculatedSize, offset);
                if(!isNaN(config.calculatedSize) && config.calculatedSize > 0)
                {
                    top = config.top;
                    left = config.left;

                    if(groupMarkers)
                    {
                        dimensions[setSizeKey][i] = setSize;
                        dimensions[calculatedSizeKey][i] = config.calculatedSize;
                        xvalues.push(left);
                        yvalues.push(top);
                    }
                    else
                    {
                        style[setSizeKey] = setSize;
                        style[calculatedSizeKey] = config.calculatedSize;
                        style.x = left;
                        style.y = top;
                        if(fillColors)
                        {
                            style.fill.color = fillColors[i % fillColors.length];
                        }
                        if(borderColors)
                        {
                            style.border.color = borderColors[i % borderColors.length];
                        }
                        marker = this.getMarker(style, graphOrder, i);
                    }

                }
                else if(!groupMarkers)
                {
                    this._markers.push(null);
                }
            }
            this.set("xMarkerPlane", xMarkerPlane);
            this.set("yMarkerPlane", yMarkerPlane);
            if(groupMarkers)
            {
                this._createGroupMarker({
                    fill: style.fill,
                    border: style.border,
                    dimensions: dimensions,
                    xvalues: xvalues,
                    yvalues: yvalues,
                    shape: style.shape
                });
            }
            else
            {
                this._clearMarkerCache();
            }
        };
 
        Y.ColumnSeries.prototype.updateMarkerState = function(type, i)
        {
            if(this._markers && this._markers[i])
            {
                var styles = this._copyObject(this.get("styles").marker),
                    markerStyles,
                    state = this._getState(type),
                    xcoords = this.get("xcoords"),
                    ycoords = this.get("ycoords"),
                    marker = this._markers[i],
                    markers,
                    seriesStyles,
                    seriesCollection = this.get("seriesTypeCollection"),
                    seriesLen = seriesCollection ? seriesCollection.length : 0,
                    seriesSize = 0,
                    offset = 0,
                    renderer,
                    n = 0,
                    xs = [],
                    order = this.get("order"),
                    config;
                markerStyles = state === "off" || !styles[state] ? this._copyObject(styles) : this._copyObject(styles[state]);
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                config = this._getMarkerDimensions(xcoords[i], ycoords[i], styles.width, offset);
                markerStyles.height = config.calculatedSize;
                markerStyles.width = Math.min(this._maxSize, markerStyles.width);
                marker.set(markerStyles);
                for(; n < seriesLen; ++n)
                {
                    xs[n] = xcoords[i] + seriesSize;
                    seriesStyles = seriesCollection[n].get("styles").marker;
                    seriesSize += Math.min(this._maxSize, seriesStyles.width);
                    if(order > n)
                    {
                        offset = seriesSize;
                    }
                    offset -= seriesSize/2;
                }
                for(n = 0; n < seriesLen; ++n)
                {
                    markers = seriesCollection[n].get("markers");
                    if(markers)
                    {
                        renderer = markers[i];
                        if(renderer && renderer !== undefined)
                        {
                            renderer.set("x", (xs[n] - seriesSize/2));
                        }
                    }
                }
                marker.get("graphic")._redraw();
            }
        };
    }

    if(Y.CandlestickSeries) {
        Y.RangeSeries.prototype._getDefaultStyles = function()
        {
            var styles = {
                spacing: 3
            };
            return this._mergeStyles(styles, Y.RangeSeries.superclass._getDefaultStyles());
        };
        Y.CandlestickSeries.prototype._calculateMarkerWidth = function(width, count, spacing)
        {
            var val = 0;
            while(val < 3 && spacing > -1)
            {
                spacing = spacing - 1;
                val = Math.round(width/count - spacing);
                if(val % 2 === 0) {
                    val = val - 1;
                }
            }
            return Math.max(1, val);
        };
        Y.CandlestickSeries.prototype.drawSeries = function()
        {
            var xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                styles = this.get("styles"),
                padding = styles.padding,
                len = xcoords.length,
                dataWidth = this.get("width") - (padding.left + padding.right),
                keys = this.get("ohlckeys"),
                opencoords = ycoords[keys.open],
                highcoords = ycoords[keys.high],
                lowcoords = ycoords[keys.low],
                closecoords = ycoords[keys.close],
                width = this._calculateMarkerWidth(dataWidth, len, styles.spacing),
                halfwidth = width/2;
            this._drawMarkers(xcoords, opencoords, highcoords, lowcoords, closecoords, len, width, halfwidth, styles);
        };
        Y.CandlestickSeries.prototype._drawMarkers = function(xcoords, opencoords, highcoords, lowcoords, closecoords, len, width, halfwidth, styles)
        {
            var upcandle = this.get("upcandle"),
                downcandle = this.get("downcandle"),
                candle,
                wick = this.get("wick"),
                wickStyles = styles.wick,
                wickWidth = wickStyles.width,
                cx,
                opencoord,
                highcoord,
                lowcoord,
                closecoord,
                left,
                right,
                top,
                bottom,
                height,
                leftPadding = styles.padding.left,
                up,
                i,
                isNumber = Y.Lang.isNumber;
            upcandle.set(styles.upcandle);
            downcandle.set(styles.downcandle);
            wick.set({
                fill: wickStyles.fill,
                stroke: wickStyles.stroke,
                shapeRendering: wickStyles.shapeRendering
            });
            upcandle.clear();
            downcandle.clear();
            wick.clear();
            for(i = 0; i < len; i = i + 1)
            {
                cx = Math.round(xcoords[i] + leftPadding);
                left = cx - halfwidth;
                right = cx + halfwidth;
                opencoord = Math.round(opencoords[i]);
                highcoord = Math.round(highcoords[i]);
                lowcoord = Math.round(lowcoords[i]);
                closecoord = Math.round(closecoords[i]);
                up = opencoord > closecoord;
                top = up ? closecoord : opencoord;
                bottom = up ? opencoord : closecoord;
                height = bottom - top;
                candle = up ? upcandle : downcandle;
                if(candle && isNumber(left) && isNumber(top) && isNumber(width) && isNumber(height))
                {
                    candle.drawRect(left, top, width, height);
                }
                if(isNumber(cx) && isNumber(highcoord) && isNumber(lowcoord))
                {
                    wick.drawRect(cx - wickWidth/2, highcoord, wickWidth, lowcoord - highcoord);
                }
            }
            upcandle.end();
            downcandle.end();
            wick.end();
            wick.toBack();
        };
        Y.CandlestickSeries.prototype._getDefaultStyles = function()
        {
            var styles = {
                upcandle: {
                    shapeRendering: "crispEdges",
                    fill: {
                        color: "#00aa00",
                        alpha: 1
                    },
                    stroke: {
                        color: "#000000",
                        alpha: 1,
                        weight: 0
                    }
                },
                downcandle: {
                    shapeRendering: "crispEdges",
                    fill: {
                        color: "#aa0000",
                        alpha: 1
                    },
                    stroke: {
                        color: "#000000",
                        alpha: 1,
                        weight: 0
                    }
                },
                wick: {
                    shapeRendering: "crispEdges",
                    width: 1,
                    fill: {
                        color: "#000000",
                        alpha: 1
                    },
                    stroke: {
                        color: "#000000",
                        alpha: 1,
                        weight: 0
                    }
                }
            };
            return this._mergeStyles(styles, Y.CandlestickSeries.superclass._getDefaultStyles());
        };
    }



}, 'gallery-2014.01.28-00-45');
