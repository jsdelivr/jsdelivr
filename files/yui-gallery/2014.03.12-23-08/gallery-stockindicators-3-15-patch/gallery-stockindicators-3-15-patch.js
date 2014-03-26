YUI.add('gallery-stockindicators-3-15-patch', function (Y, NAME) {

var defaultAxisLabelFormat = {
    value: null
};

Y.CategoryAxisBase.ATTRS.labelFormat = defaultAxisLabelFormat;
Y.CategoryAxis.ATTRS.labelFormat = defaultAxisLabelFormat;

if(Y.SeriesBase) {
    Y.SeriesBase.prototype.destructor = function() {
        var marker,
            markers = this.get("markers");
        if(this.get("rendered"))
        {
            if(this._stylesChangeHandle)
            {
                this._stylesChangeHandle.detach();
            }
            if(this._widthChangeHandle)
            {
                this._widthChangeHandle.detach();
            }
            if(this._heightChangeHandle)
            {
                this._heightChangeHandle.detach();
            }
            if(this._visibleChangeHandle)
            {
                this._visibleChangeHandle.detach();
            }
        }
        while(markers && markers.length > 0)
        {
            marker = markers.shift();
            if(marker && marker instanceof Y.Shape)
            {
                marker.destroy();
            }
        }
        if(this._path)
        {
            this._path.destroy();
            this._path = null;
        }
        if(this._lineGraphic)
        {
            this._lineGraphic.destroy();
            this._lineGraphic = null;
        }
        if(this._groupMarker)
        {
            this._groupMarker.destroy();
            this._groupMarker = null;
        }
    };
}

//patch CartesianSeries destructor bug
if(Y.CartesianSeries) {
    Y.CartesianSeries.prototype.destructor = function() {
        if(this.get("rendered"))
        {
            if(this._xDataReadyHandle)
            {
                this._xDataReadyHandle.detach();
            }
            if(this._xDataUpdateHandle)
            {
                this._xDataUpdateHandle.detach();
            }
            if(this._yDataReadyHandle)
            {
                this._yDataReadyHandle.detach();
            }
            if(this._yDataUpdateHandle)
            {
                this._yDataUpdateHandle.detach();
            }
            if(this._xAxisChangeHandle)
            {
                this._xAxisChangeHandle.detach();
            }
            if(this._yAxisChangeHandle)
            {
                this._yAxisChangeHandle.detach();
            }
        }
    };
}
if(Y.SVGDrawing) {
    Y.SVGDrawing.prototype_closePath = function()
    {
        var pathArray,
            segmentArray,
            pathType,
            len,
            val,
            i,
            path = "",
            left = parseFloat(this._left),
            top = parseFloat(this._top),
            fill = this.get("fill");
        if(this._pathArray)
        {
            pathArray = this._pathArray.concat();
            while(pathArray && pathArray.length > 0)
            {
                segmentArray = pathArray.shift();
                len = segmentArray.length;
                pathType = segmentArray[0];
                if(pathType === "A")
                {
                    path += pathType + segmentArray[1] + "," + segmentArray[2];
                }
                else if(pathType === "z" || pathType === "Z")
                {
                    path += " z ";
                }
                else if(pathType === "C" || pathType === "c")
                {
                    path += pathType + (segmentArray[1] - left)+ "," + (segmentArray[2] - top);
                }
                else
                {
                    path += " " + pathType + parseFloat(segmentArray[1] - left);
                }
                switch(pathType)
                {
                    case "L" :
                    case "l" :
                    case "M" :
                    case "m" :
                    case "Q" :
                    case "q" :
                        for(i = 2; i < len; ++i)
                        {
                            val = (i % 2 === 0) ? top : left;
                            val = segmentArray[i] - val;
                            path += ", " + parseFloat(val);
                        }
                    break;
                    case "A" :
                        val = " " + parseFloat(segmentArray[3]) + " " + parseFloat(segmentArray[4]);
                        val += "," + parseFloat(segmentArray[5]) + " " + parseFloat(segmentArray[6] - left);
                        val += "," + parseFloat(segmentArray[7] - top);
                        path += " " + val;
                    break;
                    case "C" :
                    case "c" :
                        for(i = 3; i < len - 1; i = i + 2)
                        {
                            val = parseFloat(segmentArray[i] - left);
                            val = val + ", ";
                            val = val + parseFloat(segmentArray[i + 1] - top);
                            path += " " + val;
                        }
                    break;
                }
            }
            if(fill && fill.color)
            {
                path += 'z';
            }
            Y.Lang.trim(path);
            if(path)
            {
                this._nodeAttrFlags.d = path;
            }

            this._path = path;
            this._fillChangeHandler();
            this._strokeChangeHandler();
            this._updateTransform();
        }
    };
	
    Y.SVGShape.prototype.initializer = function(cfg)
	{
		var host = this,
            graphic = cfg.graphic,
            data = this.get("data");
		this._nodeAttrFlags = {};
        this._nodeCSSFlags = {};
        host.createNode();
		if(graphic)
        {
            host._setGraphic(graphic);
        }
        if(data)
        {
            host._parsePathData(data);
        }
        host._updateHandler();
	};
	
    Y.SVGShape.prototype.createNode = function()
	{
		var host = this,
            getClassName = Y.ClassNameManager.getClassName,
            node = Y.config.doc.createElementNS("http://www.w3.org/2000/svg", "svg:" + this._type),
			id = host.get("id"),
            name = host.name,
            concat = host._camelCaseConcat,
			pointerEvents = host.get("pointerEvents");
		host.node = node;
		host.addClass(
            getClassName("shape") +
            " " +
            getClassName(concat("svg", "shape")) +
            " " +
            getClassName(name) +
            " " +
            getClassName(concat("svg", name))
        );
        if(id)
		{
			this._nodeAttrFlags.id = id;
		}
		if(pointerEvents)
		{
			this._nodeAttrFlags["pointer-events"] = pointerEvents;
		}
        if(!host.get("visible"))
        {
            this._nodeCSSFlags.visibility = "hidden";
        }
        this._nodeAttrFlags["shape-rendering"] = this.get("shapeRendering");
	};
	Y.SVGShape.prototype._strokeChangeHandler = function()
	{
		var stroke = this.get("stroke"),
			strokeOpacity,
			dashstyle,
			dash,
			linejoin;
		if(stroke && stroke.weight && stroke.weight > 0)
		{
			linejoin = stroke.linejoin || "round";
			strokeOpacity = parseFloat(stroke.opacity);
			dashstyle = stroke.dashstyle || "none";
			dash = Y.Lang.isArray(dashstyle) ? dashstyle.toString() : dashstyle;
			stroke.color = stroke.color || "#000000";
			stroke.weight = stroke.weight || 1;
			stroke.opacity = Y.Lang.isNumber(strokeOpacity) ? strokeOpacity : 1;
			stroke.linecap = stroke.linecap || "butt";
			this._nodeAttrFlags["stroke-dasharray"] = dash;
			this._nodeAttrFlags.stroke = stroke.color;
			this._nodeAttrFlags["stroke-linecap"] = stroke.linecap;
			this._nodeAttrFlags["stroke-width"] = stroke.weight;
			this._nodeAttrFlags["stroke-opacity"] = stroke.opacity;
			if(linejoin === "round" || linejoin === "bevel")
			{
				this._nodeAttrFlags["stroke-linejoin"] = linejoin;
			}
			else
			{
				linejoin = parseInt(linejoin, 10);
				if(Y.Lang.isNumber(linejoin))
				{
					this._nodeAttrFlags["stroke-miterlimit"] = Math.max(linejoin, 1);
					this._nodeAttrFlags["stroke-linejoin"] = "miter";
				}
			}
		}
		else
		{
			this._nodeAttrFlags.stroke = "none";
		}
	};

	Y.SVGShape.prototype._fillChangeHandler = function()
	{
		var fill = this.get("fill"),
			fillOpacity,
			type;
		if(fill)
		{
			type = fill.type;
			if(type === "linear" || type === "radial")
			{
				this._setGradientFill(fill);
				this._nodeAttrFlags.fill =  "url(#grad" + this.get("id") + ")";
			}
			else if(!fill.color)
			{
				this._nodeAttrFlags.fill = "none";
			}
			else
			{
                fillOpacity = parseFloat(fill.opacity);
				fillOpacity = Y.Lang.isNumber(fillOpacity) ? fillOpacity : 1;
				this._nodeAttrFlags.fill = fill.color;
				this._nodeAttrFlags["fill-opacity"] = fillOpacity;
			}
		}
		else
		{
			this._nodeAttrFlags.fill =  "none";
		}
	};
	
    Y.SVGShape.prototype._updateTransform = function()
	{
		var isPath = this._type === "path",
			key,
			transform,
			transformOrigin,
			x,
			y,
            tx,
            ty,
            matrix = this.matrix,
            normalizedMatrix = this._normalizedMatrix,
            i,
            len = this._transforms.length;

        if(isPath || (this._transforms && this._transforms.length > 0))
		{
            x = this._x;
            y = this._y;
            transformOrigin = this.get("transformOrigin");
            tx = x + (transformOrigin[0] * this.get("width"));
            ty = y + (transformOrigin[1] * this.get("height"));
            //need to use translate for x/y coords
            if(isPath)
            {
                //adjust origin for custom shapes
                if(!(this instanceof Y.SVGPath))
                {
                    tx = this._left + (transformOrigin[0] * this.get("width"));
                    ty = this._top + (transformOrigin[1] * this.get("height"));
                }
                normalizedMatrix.init({dx: x + this._left, dy: y + this._top});
            }
            normalizedMatrix.translate(tx, ty);
            for(i = 0; i < len; ++i)
            {
                key = this._transforms[i].shift();
                if(key)
                {
                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);
                    matrix[key].apply(matrix, this._transforms[i]);
                }
                if(isPath)
                {
                    this._transforms[i].unshift(key);
                }
			}
            normalizedMatrix.translate(-tx, -ty);
            transform = "matrix(" + normalizedMatrix.a + "," +
                            normalizedMatrix.b + "," +
                            normalizedMatrix.c + "," +
                            normalizedMatrix.d + "," +
                            normalizedMatrix.dx + "," +
                            normalizedMatrix.dy + ")";
		}
        this._graphic.addToRedrawQueue(this);
        if(transform)
		{
            this._nodeAttrFlags.transform = transform;
        }
        if(!isPath)
        {
            this._transforms = [];
        }
	};
	
    Y.SVGShape.prototype._updateTransform = function()
	{
		var isPath = this._type === "path",
			key,
			transform,
			transformOrigin,
			x,
			y,
            tx,
            ty,
            matrix = this.matrix,
            normalizedMatrix = this._normalizedMatrix,
            i,
            len = this._transforms.length;

        if(isPath || (this._transforms && this._transforms.length > 0))
		{
            x = this._x;
            y = this._y;
            transformOrigin = this.get("transformOrigin");
            tx = x + (transformOrigin[0] * this.get("width"));
            ty = y + (transformOrigin[1] * this.get("height"));
            //need to use translate for x/y coords
            if(isPath)
            {
                //adjust origin for custom shapes
                if(!(this instanceof Y.SVGPath))
                {
                    tx = this._left + (transformOrigin[0] * this.get("width"));
                    ty = this._top + (transformOrigin[1] * this.get("height"));
                }
                normalizedMatrix.init({dx: x + this._left, dy: y + this._top});
            }
            normalizedMatrix.translate(tx, ty);
            for(i = 0; i < len; ++i)
            {
                key = this._transforms[i].shift();
                if(key)
                {
                    normalizedMatrix[key].apply(normalizedMatrix, this._transforms[i]);
                    matrix[key].apply(matrix, this._transforms[i]);
                }
                if(isPath)
                {
                    this._transforms[i].unshift(key);
                }
			}
            normalizedMatrix.translate(-tx, -ty);
            transform = "matrix(" + normalizedMatrix.a + "," +
                            normalizedMatrix.b + "," +
                            normalizedMatrix.c + "," +
                            normalizedMatrix.d + "," +
                            normalizedMatrix.dx + "," +
                            normalizedMatrix.dy + ")";
		}
        this._graphic.addToRedrawQueue(this);
        if(transform)
		{
            this._nodeAttrFlags.transform = transform;
        }
        if(!isPath)
        {
            this._transforms = [];
        }
	};
	Y.SVGShape.prototype._draw = function()
	{
		this._nodeAttrFlags.width = this.get("width");
		this._nodeAttrFlags.height = this.get("height");
		this._nodeAttrFlags.x = this._x;
		this._nodeAttrFlags.y = this._y;
		this._nodeCSSFlags.left = this._x + "px";
		this._nodeCSSFlags.top = this._y + "px";
		this._fillChangeHandler();
		this._strokeChangeHandler();
		this._updateTransform();
	};

    Y.SVGShape.prototype._clearFlags = function() {
        var key;
        for(key in this._nodeAttrFlags) {
            if(this._nodeAttrFlags.hasOwnProperty(key)) {
                this.node.setAttribute(key, this._nodeAttrFlags[key]);
            }
        }
        for(key in this._nodeCSSFlags) {
            if(this._nodeCSSFlags.hasOwnProperty(key)) {
                Y.DOM.setStyle(this.node, key, this._nodeCSSFlags[key]);
                //this.node.style[key] = this._nodeCSSFlags[key];
            }
        }
        this._nodeAttrFlags = {};
        this._nodeCSSFlags = {};
    };

    Y.SVGShape.ATTRS.id = {
		valueFn: function()
		{
			return Y.guid();
		},

		setter: function(val)
		{
			var node = this.node;
			if(node)
			{
				this._nodeAttrFlags.id = val;
			}
			return val;
		}
	};

    Y.SVGShape.ATTRS.pointerEvents = {
		valueFn: function()
		{
			var val = "visiblePainted",
				node = this.node;
			if(node)
			{
				this._nodeAttrFlags["pointer-events"] = val;
			}
			return val;
		},

		setter: function(val)
		{
			var node = this.node;
			if(node)
			{
				this._nodeAttrFlags["pointer-events"] = val;
			}
			return val;
		}
    };
    Y.SVGCircle.prototype._draw = function() {
        var x = this.get("x"),
            y = this.get("y"),
            radius = this.get("radius"),
            cx = x + radius,
            cy = y + radius;
        this._nodeAttrFlags.r = radius;
        this._nodeAttrFlags.cx = cx;
        this._nodeAttrFlags.cy = cy;
        this._fillChangeHandler();
        this._strokeChangeHandler();
        this._updateTransform();
    };

    Y.SVGGraphic.prototype._redraw = function() {
        var autoSize = this.get("autoSize"),
            preserveAspectRatio = this.get("preserveAspectRatio"),
            box = this.get("resizeDown") ? this._getUpdatedContentBounds() : this._contentBounds,
            left = box.left,
            right = box.right,
            top = box.top,
            bottom = box.bottom,
            width = right - left,
            height = bottom - top,
            computedWidth,
            computedHeight,
            computedLeft,
            computedTop,
            node,
            key,
            shapes = this._shapes;
        if(autoSize)
        {
            if(autoSize === "sizeContentToGraphic")
            {
                node = this._node;
                computedWidth = parseFloat(Y.DOM.getComputedStyle(node, "width"));
                computedHeight = parseFloat(Y.DOM.getComputedStyle(node, "height"));
                computedLeft = computedTop = 0;
                this._contentNode.setAttribute("preserveAspectRatio", preserveAspectRatio);
            }
            else
            {
                computedWidth = width;
                computedHeight = height;
                computedLeft = left;
                computedTop = top;
                this._state.width = width;
                this._state.height = height;
                if(this._node)
                {
                    this._node.style.width = width + "px";
                    this._node.style.height = height + "px";
                }
            }
        }
        else
        {
                computedWidth = width;
                computedHeight = height;
                computedLeft = left;
                computedTop = top;
        }
        for(key in shapes) {
            if(shapes.hasOwnProperty(key)) {
                shapes[key]._clearFlags();
            }
        }
        if(this._contentNode)
        {
            this._contentNode.style.left = computedLeft + "px";
            this._contentNode.style.top = computedTop + "px";
            this._contentNode.setAttribute("width", computedWidth);
            this._contentNode.setAttribute("height", computedHeight);
            this._contentNode.style.width = computedWidth + "px";
            this._contentNode.style.height = computedHeight + "px";
            this._contentNode.setAttribute("viewBox", "" + left + " " + top + " " + width + " " + height + "");
        }
        if(this._frag)
        {
            if(this._contentNode)
            {
                this._contentNode.appendChild(this._frag);
            }
            this._frag = null;
        }
    };
}

//addresses canvas chaining bug
if(Y.CanvasPath) {
    Y.CanvasPath.prototype.end = function() {
        this._draw();
        return this;
    };
}



}, 'gallery-2014.01.28-00-45');
