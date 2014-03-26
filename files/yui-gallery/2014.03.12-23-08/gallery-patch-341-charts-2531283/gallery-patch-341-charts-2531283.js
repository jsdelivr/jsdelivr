YUI.add('gallery-patch-341-charts-2531283', function(Y) {

var Y_Lang = Y.Lang,
    Y_StackedColumnSeries = Y.StackedColumnSeries,
    Y_StackedBarSeries = Y.StackedBarSeries;
Y_StackedColumnSeries.prototype.drawSeries = function()
{
    if(this.get("xcoords").length < 1) 
    {
        return;
    }
    var isNumber = Y_Lang.isNumber,
        style = Y.clone(this.get("styles").marker), 
        w = style.width,
        h = style.height,
        xcoords = this.get("xcoords"),
        ycoords = this.get("ycoords"),
        i = 0,
        len = xcoords.length,
        top = ycoords[0],
        type = this.get("type"),
        graph = this.get("graph"),
        seriesCollection = graph.seriesTypes[type],
        ratio,
        order = this.get("order"),
        graphOrder = this.get("graphOrder"),
        left,
        marker,
        fillColors,
        borderColors,
        lastCollection,
        negativeBaseValues,
        positiveBaseValues,
        useOrigin = order === 0,
        totalWidth = len * w;
    if(Y_Lang.isArray(style.fill.color))
    {
        fillColors = style.fill.color.concat(); 
    }
    if(Y_Lang.isArray(style.border.color))
    {
        borderColors = style.border.colors.concat();
    }
    this._createMarkerCache();
    if(totalWidth > this.get("width"))
    {
        ratio = this.width/totalWidth;
        w *= ratio;
        w = Math.max(w, 1);
    }
    if(!useOrigin)
    {
        lastCollection = seriesCollection[order - 1];
        negativeBaseValues = lastCollection.get("negativeBaseValues");
        positiveBaseValues = lastCollection.get("positiveBaseValues");
        if(!negativeBaseValues || !positiveBaseValues)
        {
            useOrigin = true;
            positiveBaseValues = [];
            negativeBaseValues = [];
        }
    }
    else
    {
        negativeBaseValues = [];
        positiveBaseValues = [];
    }
    this.set("negativeBaseValues", negativeBaseValues);
    this.set("positiveBaseValues", positiveBaseValues);
    for(i = 0; i < len; ++i)
    {
        left = xcoords[i];
        top = ycoords[i];
        
        if(!isNumber(top) || !isNumber(left))
        {
            if(useOrigin)
            {
                negativeBaseValues[i] = this._bottomOrigin;
                positiveBaseValues[i] = this._bottomOrigin;
            }
            this._markers.push(null); 
            continue;
        }
        if(useOrigin)
        {
            h = Math.abs(this._bottomOrigin - top);
            if(top < this._bottomOrigin)
            {
                positiveBaseValues[i] = top;
                negativeBaseValues[i] = this._bottomOrigin;
            }
            else if(top > this._bottomOrigin)
            {
                positiveBaseValues[i] = this._bottomOrigin;
                negativeBaseValues[i] = top;
                top -= h;
            }
            else
            {
                positiveBaseValues[i] = top;
                negativeBaseValues[i] = top;
            }
        }
        else 
        {
            if(top > this._bottomOrigin)
            {
                top += (negativeBaseValues[i] - this._bottomOrigin);
                h = top - negativeBaseValues[i];
                negativeBaseValues[i] = top;
                top -= h;
            }
            else if(top <= this._bottomOrigin)
            {
                top = positiveBaseValues[i] - (this._bottomOrigin - top);
                h = positiveBaseValues[i] - top;
                positiveBaseValues[i] = top;
            }
        }
        if(!isNaN(h) && h > 0)
        {
            left -= w/2;
            style.width = w;
            style.height = h;
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
        else
        {
            this._markers.push(null);
        }
    }
    this._clearMarkerCache();
};

Y_StackedColumnSeries.prototype.updateMarkerState = function(type, i)
{
    if(this._markers[i])
    {
        var styles,
            markerStyles,
            state = this._getState(type),
            xcoords = this.get("xcoords"),
            marker = this._markers[i],
            offset = 0;        
        styles = Y.clone(this.get("styles").marker);
        offset = styles.width * 0.5;
        markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
        markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
        markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
        markerStyles.height = marker.get("height");
        markerStyles.x = (xcoords[i] - offset);
        markerStyles.y = marker.get("y");
        markerStyles.id = marker.get("id");
        marker.set(markerStyles);
    }
};

Y_StackedBarSeries.prototype.drawSeries = function()
{
    if(this.get("xcoords").length < 1) 
    {
        return;
    }

    var isNumber = Y_Lang.isNumber,
        style = Y.clone(this.get("styles").marker),
        w = style.width,
        h = style.height,
        xcoords = this.get("xcoords"),
        ycoords = this.get("ycoords"),
        i = 0,
        len = xcoords.length,
        top = ycoords[0],
        type = this.get("type"),
        graph = this.get("graph"),
        seriesCollection = graph.seriesTypes[type],
        ratio,
        order = this.get("order"),
        graphOrder = this.get("graphOrder"),
        left,
        marker,
        lastCollection,
        negativeBaseValues,
        positiveBaseValues,
        fillColors,
        borderColors,
        useOrigin = order === 0,
        totalHeight = len * h;
    if(Y_Lang.isArray(style.fill.color))
    {
        fillColors = style.fill.color.concat(); 
    }
    if(Y_Lang.isArray(style.border.color))
    {
        borderColors = style.border.colors.concat();
    }
    this._createMarkerCache();
    if(totalHeight > this.get("height"))
    {
        ratio = this.height/totalHeight;
        h *= ratio;
        h = Math.max(h, 1);
    }
    if(!useOrigin)
    {
        lastCollection = seriesCollection[order - 1];
        negativeBaseValues = lastCollection.get("negativeBaseValues");
        positiveBaseValues = lastCollection.get("positiveBaseValues");
        if(!negativeBaseValues || !positiveBaseValues)
        {
            useOrigin = true;
            positiveBaseValues = [];
            negativeBaseValues = [];
        }
    }
    else
    {
        negativeBaseValues = [];
        positiveBaseValues = [];
    }
    this.set("negativeBaseValues", negativeBaseValues);
    this.set("positiveBaseValues", positiveBaseValues);
    for(i = 0; i < len; ++i)
    {
        top = ycoords[i];
        left = xcoords[i];
        if(!isNumber(top) || !isNumber(left))
        {
            if(useOrigin)
            {
                positiveBaseValues[i] = this._leftOrigin;
                negativeBaseValues[i] = this._leftOrigin;
            }
            this._markers.push(null);
            continue;
        }
        if(useOrigin)
        {
            w = Math.abs(left - this._leftOrigin);
            if(left > this._leftOrigin)
            {
                positiveBaseValues[i] = left;
                negativeBaseValues[i] = this._leftOrigin;
                left -= w;
            }
            else if(left < this._leftOrigin)
            {   
                positiveBaseValues[i] = this._leftOrigin;
                negativeBaseValues[i] = left;
            }
            else
            {
                positiveBaseValues[i] = left;
                negativeBaseValues[i] = this._leftOrigin;
            }
        }
        else
        {
            if(left < this._leftOrigin)
            {
                left = negativeBaseValues[i] - (this._leftOrigin - xcoords[i]);
                w = negativeBaseValues[i] - left;
                negativeBaseValues[i] = left;
            }
            else if(left >= this._leftOrigin)
            {
                left += (positiveBaseValues[i] - this._leftOrigin);
                w = left - positiveBaseValues[i];
                positiveBaseValues[i] = left;
                left -= w;
            }
        }
        if(!isNaN(w) && w > 0)
        {
            top -= h/2;        
            style.width = w;
            style.height = h;
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
        else
        {
            this._markers.push(null);
        }
    }
    this._clearMarkerCache();
};

Y_StackedBarSeries.prototype.updateMarkerState = function(type, i)
{
    if(this._markers[i])
    {
        var state = this._getState(type),
            ycoords = this.get("ycoords"),
            marker = this._markers[i],
            styles = Y.clone(this.get("styles").marker),
            h = styles.height,
            markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
        markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
        markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
        markerStyles.y = (ycoords[i] - h/2);
        markerStyles.x = marker.get("x");
        markerStyles.width = marker.get("width");
        markerStyles.id = marker.get("id");
        marker.set(markerStyles);
    }
};


}, 'gallery-2011.10.12-20-24' ,{requires:['charts']});
