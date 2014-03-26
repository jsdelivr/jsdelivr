YUI.add('gallery-graphics-canvas', function(Y) {

/**
 * Graphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class Graphic
 * @constructor
 */
function Graphic(config) {
    
    this.initializer.apply(this, arguments);
}

Graphic.prototype = {
    /**
     * Indicates whether or not the instance will size itself based on its contents.
     *
     * @property autoSize 
     * @type String
     */
    autoSize: true,
    
    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function(config) {
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this.node = Y.config.doc.createElement('div');
        this.setSize(w, h);
        if(config.render)
        {
            this.render(config.render);
        }
    },

    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    setSize: function(w, h) {
        if(this.autoSize)
        {
            if(w > this.node.getAttribute("width"))
            {
                this.node.style.width = w + "px";
                this.node.setAttribute("width", w);
            }
            if(h > this.node.getAttribute("height"))
            {
                this.node.style.height = h + "px";
                this.node.setAttribute("height", h);
            }
        }
    },

    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
     */
    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
        this.setSize(w, h);
    },

    /**
     * Sets the positon of the graphics object.
     *
     * @method setPosition
     * @param {Number} x x-coordinate for the object.
     * @param {Number} y y-coordinate for the object.
     */
    setPosition: function(x, y)
    {
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(render) {
        var node = this.node,
            parentNode = Y.one(render),
            w = parentNode.get("width") || parentNode.get("offsetWidth"),
            h = parentNode.get("height") || parentNode.get("offsetHeight");
        node.style.display = "block";
        node.style.position = "absolute";
        node.style.left = Y.one(node).getStyle("left");
        node.style.top = Y.one(node).getStyle("top");
        node.style.pointerEvents = "visiblePainted";
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
        return this;
    },
    
    /**
     * Shows and and hides a the graphic instance.
     *
     * @method toggleVisible
     * @param val {Boolean} indicates whether the instance should be visible.
     */
    toggleVisible: function(val)
    {
        this.node.style.visibility = val ? "visible" : "hidden";
    },

    /**
     * Adds a shape instance to the graphic instance.
     *
     * @method addShape
     * @param {Shape} shape The shape instance to be added to the graphic.
     */
    addShape: function(shape)
    {
        var node = shape.get("node");
        this.node.appendChild(node);
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        this._graphicsList.push(node);
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this._removeChildren(this.node);
        if(this.node && this.node.parentNode)
        {
            this.node.parentNode.removeChild(this.node);
        }
    },
    
    /**
     * Removes all child nodes.
     *
     * @method _removeChildren
     * @param {HTMLElement} node
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    }
};

Y.Graphic = Graphic;

var _dummy;
/**
 * Creates dom element used for converting color string to rgb
 *
 * @method _createDummy
 * @private
 */
function _createDummy() 
{
    if(!_dummy)
    {
        _dummy = Y.config.doc.createElement('div');
    }
    _dummy.style.height = 0;
    _dummy.style.width = 0;
    _dummy.style.overflow = 'hidden';
    Y.config.doc.documentElement.appendChild(_dummy);
    return _dummy;
}


/**
 * Set of drawing apis for canvas based classes.
 *
 * @class Drawing
 * @constructor
 */
function Drawing()
{
}

Drawing.prototype = {
    /**
     * Regex expression used for converting hex strings to rgb
     *
     * @property _reHex
     * @private
     */
    _reHex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,

    /**
     * Parses hex color string and alpha value to rgba
     *
     * @method _2RGBA
     * @private
     */
    _2RGBA: function(val, alpha) {
        alpha = (alpha !== undefined) ? alpha : 1;
        if (this._reHex.exec(val)) {
            val = 'rgba(' + [
                parseInt(RegExp.$1, 16),
                parseInt(RegExp.$2, 16),
                parseInt(RegExp.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        return val;
    },

    /**
     * Converts color to rgb format
     *
     * @method _2RGB
     * @private 
     */
    _2RGB: function(val) {
        var dummy = _createDummy();
        dummy.style.background = val;
        return dummy.style.backgroundColor;
    },

    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    setSize: function(w, h) {
        if(this.get("autoSize"))
        {
            if(w > this.node.getAttribute("width"))
            {
                this.node.style.width = w + "px";
                this.node.setAttribute("width", w);
            }
            if(h > this.node.getAttribute("height"))
            {
                this.node.style.height = h + "px";
                this.node.setAttribute("height", h);
            }
        }
    },

    _updatePosition: function(x, y)
    {
        this._updateCoords(x, y);
        if(x <= this._left)
        {
            this._left = x;
        }
        else if(x >= this._right)
        {
            this._right = x;
        }
        if(y <= this._top)
        {
            this._top = y;
        }
        else if(y >= this._bottom)
        {
            this._bottom = y;
        }
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
    },
    
    _updateCoords: function(x, y)
    {
        this._xcoords.push(x);
        this._ycoords.push(y);
    },

    _clearAndUpdateCoords: function()
    {
        var x = this._xcoords.pop() || 0,
            y = this._ycoords.pop() || 0;
        this._updateCoords(x, y);
    },

    _updateNodePosition: function()
    {
        var node = this.get("node"),
            x = this.get("x"),
            y = this.get("y"); 
        node.style.position = "absolute";
        node.style.left = (x + this._left) + "px";
        node.style.top = (y + this._top) + "px";
    },

    /**
     * Holds queue of methods for the target canvas.
     * 
     * @property _methods
     * @type Object
     * @private
     */
    _methods: null,

    /**
     * Holds queue of properties for the target canvas.
     *
     * @property _properties
     * @type Object
     * @private
     */
    _properties: null,
    
    /**
     * Adds a method to the drawing queue
     */
    _updateDrawingQueue: function(val)
    {
        if(!this._methods)
        {
            this._methods = [];
        }
        this._methods.push(val);
    },
    
    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function(point1, point2, etc) {
        var args = arguments, 
            i, len;
        if(!this._lineToMethods)
        {
            this._lineToMethods = [];
        }
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }

        for (i = 0, len = args.length; i < len; ++i) {
            this._updateDrawingQueue(["lineTo", args[i][0], args[i][1]]);
            this._lineToMethods[this._lineToMethods.length] = this._methods[this._methods.length - 1];
            this._updateShapeProps.apply(this, args[i]);
            this._updatePosition(args[i][0], args[i][1]);
        }
        this._drawingComplete = false;
        return this;
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    moveTo: function(x, y) {
        this._updateDrawingQueue(["moveTo", x, y]);
        this._updateShapeProps(x, y);
        this._updatePosition(x, y);
        this._drawingComplete = false;
        return this;
    },
    
    /**
     * Draws a bezier curve.
     *
     * @method curveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        var hiX,
            hiY,
            loX,
            loY;
        this._updateDrawingQueue(["bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y]);
        this._drawingComplete = false;
        this._updateShapeProps(x, y);
        hiX = Math.max(x, Math.max(cp1x, cp2x));
        hiY = Math.max(y, Math.max(cp1y, cp2y));
        loX = Math.min(x, Math.min(cp1x, cp2x));
        loY = Math.min(y, Math.min(cp1y, cp2y));
        this._updatePosition(hiX, hiY);
        this._updatePosition(loX, loY);
        return this;
    },

    /**
     * Draws a quadratic bezier curve.
     *
     * @method quadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    quadraticCurveTo: function(cpx, cpy, x, y) {
        var hiX,
            hiY,
            loX,
            loY;
        this._updateDrawingQueue(["quadraticCurveTo", cpx, cpy, x, y]);
        this._drawingComplete = false;
        this._updateShapeProps(x, y);
        hiX = Math.max(x, cpx);
        hiY = Math.max(y, cpy);
        loX = Math.min(x, cpx);
        loY = Math.min(y, cpy);
        this._updatePosition(hiX, hiY);
        this._updatePosition(loX, loY);
        return this;
    },

    /**
     * Draws a circle.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     */
	drawCircle: function(x, y, radius) {
        var startAngle = 0,
            endAngle = 2 * Math.PI,
            circum = radius * 2;
        this._shape = {
            x:x,
            y:y,
            w:circum,
            h:circum
        };
        this._drawingComplete = false;
        this._updatePosition(x + circum, y + circum);
        this._updateDrawingQueue(["arc", x + radius, y + radius, radius, startAngle, endAngle, false]);
        return this;
    },

    /**
     * Draws an ellipse.
     *
     * @method drawEllipse
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
	drawEllipse: function(x, y, w, h) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        if(this._stroke && this._strokeWeight > 0)
        {
            w -= this._strokeWeight * 2;
            h -= this._strokeWeight * 2;
            x += this._strokeWeight;
            y += this._strokeWeight;
        }
        var l = 8,
            theta = -(45/180) * Math.PI,
            angle = 0,
            angleMid,
            radius = w/2,
            yRadius = h/2,
            i = 0,
            centerX = x + radius,
            centerY = y + yRadius,
            ax, ay, bx, by, cx, cy;

        ax = centerX + Math.cos(0) * radius;
        ay = centerY + Math.sin(0) * yRadius;
        this.moveTo(ax, ay);
        for(; i < l; i++)
        {
            angle += theta;
            angleMid = angle - (theta / 2);
            bx = centerX + Math.cos(angle) * radius;
            by = centerY + Math.sin(angle) * yRadius;
            cx = centerX + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
            cy = centerY + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
            this.quadraticCurveTo(cx, cy, bx, by);
        }
        this._trackPos(x, y);
        this._trackSize(x + w, y + h);
        return this;
    },

    /**
     * Draws a rectangle.
     *
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
    drawRect: function(x, y, w, h) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._drawingComplete = false;
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        return this;
    },

    /**
     * Draws a rectangle with rounded corners.
     * 
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @param {Number} ew width of the ellipse used to draw the rounded corners
     * @param {Number} eh height of the ellipse used to draw the rounded corners
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._drawingComplete = false;
        this._updateDrawingQueue(["moveTo", x, y + eh]);
        this._updateDrawingQueue(["lineTo", x, y + h - eh]);
        this._updateDrawingQueue(["quadraticCurveTo", x, y + h, x + ew, y + h]);
        this._updateDrawingQueue(["lineTo", x + w - ew, y + h]);
        this._updateDrawingQueue(["quadraticCurveTo", x + w, y + h, x + w, y + h - eh]);
        this._updateDrawingQueue(["lineTo", x + w, y + eh]);
        this._updateDrawingQueue(["quadraticCurveTo", x + w, y, x + w - ew, y]);
        this._updateDrawingQueue(["lineTo", x + ew, y]);
        this._updateDrawingQueue(["quadraticCurveTo", x, y, x, y + eh]);
        this._trackPos(x, y);
        this._trackSize(w, h);
        this._paint();
        return this;
    },
    
    /**
     * @private
     * Draws a wedge.
     * 
     * @param x				x component of the wedge's center point
     * @param y				y component of the wedge's center point
     * @param startAngle	starting angle in degrees
     * @param arc			sweep of the wedge. Negative values draw clockwise.
     * @param radius		radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param yRadius		[optional] y radius for wedge.
     */
    drawWedge: function(cfg)
    {
        var x = cfg.x,
            y = cfg.y,
            startAngle = cfg.startAngle,
            arc = cfg.arc,
            radius = cfg.radius,
            yRadius = cfg.yRadius,
            segs,
            segAngle,
            theta,
            angle,
            angleMid,
            ax,
            ay,
            bx,
            by,
            cx,
            cy,
            i = 0;

        this._drawingComplete = false;
        // move to x,y position
        this._updateRenderQueue(["moveTo", x, y]);
        
        yRadius = yRadius || radius;
        
        // limit sweep to reasonable numbers
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        angle = -(startAngle / 180) * Math.PI;
        
        // draw the curve in segments no larger than 45 degrees.
        if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            ay = y + Math.sin(-startAngle / 180 * Math.PI) * yRadius;
            this.lineTo(ax, ay);
            // Loop for drawing curve segments
            for(; i < segs; ++i)
            {
                angle += theta;
                angleMid = angle - (theta / 2);
                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                this._updateRenderQueue(["quadraticCurveTo", cx, cy, bx, by]);
            }
            // close the wedge by drawing a line to the center
            this._updateRenderQueue(["lineTo", x, y]);
        }
        this._trackPos(x, y);
        this._trackSize(radius, radius);
        this._paint();
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        this._paint();
        return this;
    },

    /**
     * Clears all values
     *
     * @method _initProps
     * @private
     */
    _initProps: function() {
        var context = this._context;
        this._methods = [];
        this._lineToMethods = [];
        this._xcoords = [0];
        this._ycoords = [0];
        this._width = 0;
        this._height = 0;
        this._left = 0;
        this._top = 0;
        this._right = 0;
        this._bottom = 0;
        this._x = 0;
        this._y = 0;
    },
   
    /**
     * @private
     */
    _drawingComplete: false,

    /**
     * Creates canvas element
     *
     * @method _createGraphic
     * @private
     */
    _createGraphic: function(config) {
        var graphic = Y.config.doc.createElement('canvas');
        return graphic;
    },
    
    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
     */
    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
    },

    /**
     * Updates the position of the current drawing
     *
     * @method _trackPos
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @private
     */
    _trackPos: function(x, y) {
        if (x > this._x) {
            this._x = x;
        }
        if (y > this._y) {
            this._y = y;
        }
    },

    /**
     * Updates the position and size of the current drawing
     *
     * @method _updateShapeProps
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @private
     */
    _updateShapeProps: function(x, y)
    {
        var w,h;
        if(!this._shape)
        {
            this._shape = {};
        }
        if(!this._shape.x)
        {
            this._shape.x = x;
        }
        else
        {
            this._shape.x = Math.min(this._shape.x, x);
        }
        if(!this._shape.y)
        {
            this._shape.y = y;
        }
        else
        {
            this._shape.y = Math.min(this._shape.y, y);
        }
        w = Math.abs(x - this._shape.x);
        if(!this._shape.w)
        {
            this._shape.w = w;
        }
        else
        {
            this._shape.w = Math.max(w, this._shape.w);
        }
        h = Math.abs(y - this._shape.y);
        if(!this._shape.h)
        {
            this._shape.h = h;
        }
        else
        {
            this._shape.h = Math.max(h, this._shape.h);
        }
    }
};

Y.Drawing = Drawing;
/**
 * Base class for creating shapes.
 *
 * @class Shape
 */
 Y.Shape = Y.Base.create("shape", Y.Base, [Y.Drawing], {
    /**
     * Left edge of the path
     *
     * @private
     */
    _left: 0,

    /**
     * Right edge of the path
     *
     * @private
     */
    _right: 0,
    
    /**
     * Top edge of the path
     *
     * @private
     */
    _top: 0, 
    
    /**
     * Bottom edge of the path
     *
     * @private
     */
    _bottom: 0,

    /**
     * Initializes the shape
     *
     * @private
     * @method _initialize
     */
    initializer: function()
    {
        this._xcoords = [0];
        this._ycoords = [0];
        this.get("stroke");
        this.get("fill");
        this._addListeners();
        var node = this.get("node");
        node.setAttribute("width", this.get("width"));
        node.setAttribute("height", this.get("height"));
        this._draw();
    },
   
    /**
     * Creates the dom node for the shape.
     *
     * @private
     * @return HTMLElement
     */
    _getNode: function()
    {
        var node = Y.config.doc.createElement('canvas');
        this._context = node.getContext('2d');
        return node;
    },

    /**
     * Adds change listeners to the shape.
     *
     * @private
     * @method _addListeners
     */
    _addListeners: function()
    {
        this.after("strokeChange", this._updateHandler);
        this.after("fillChange", this._updateHandler);
        this.after("widthChange", this._updateHandler);
        this.after("heightChange", this._updateHandler);
    },
    
    /**
     * Adds a stroke to the shape node.
     *
     * @method _strokeChangeHandler
     * @private
     */
    _setStrokeProps: function(stroke)
    {
        var color = stroke.color,
            weight = stroke.weight,
            alpha = stroke.alpha,
            linejoin = stroke.linejoin || "round",
            linecap = stroke.linecap || "butt",
            dashstyle = stroke.dashstyle;
        this._miterlimit = null;
        this._dashstyle = (dashstyle && Y.Lang.isArray(dashstyle) && dashstyle.length > 1) ? dashstyle : null;
        this._strokeWeight = weight;

        if (weight) 
        {
            this._stroke = 1;
        } 
        else 
        {
            this._stroke = 0;
        }
        if (alpha) {
            this._strokeStyle = this._2RGBA(color, alpha);
        }
        else
        {
            this._strokeStyle = color;
        }
        this._linecap = linecap;
        if(linejoin == "round" || linejoin == "square")
        {
            this._linejoin = linejoin;
        }
        else
        {
            linejoin = parseInt(linejoin, 10);
            if(Y.Lang.isNumber(linejoin))
            {
                this._miterlimit =  Math.max(linejoin, 1);
                this._linejoin = "miter";
            }
        }
    },
    
    /**
     * Adds a fill to the shape node.
     *
     * @method _fillChangeHandler
     * @private
     */
    _setFillProps: function(fill)
    {
        var color = fill.color,
            alpha = fill.alpha;
        if(color)
        {
            if (alpha) 
            {
               color = this._2RGBA(color, alpha);
            } 
            else 
            {
                color = this._2RGB(color);
            }

            this._fillColor = color;
            this._fillType = 'solid';
        }
        else
        {
            this._fillColor = null;
        }
    },

    /**
     * Applies translate transformation.
     *
     * @method translate
     * @param {Number} x The x-coordinate
     * @param {Number} y The y-coordinate
     * @protected
     */
    translate: function(x, y)
    {
        var node = this.get("node"),
            translate = "translate(" + x + "px, " + y + "px)";
        this._updateTransform("translate", /translate\(.*\)/, translate);
    },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewX: function(x)
     {
     },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewY: function(y)
     {
     },

     /**
      * Applies a rotation.
      *
      * @method rotate
      * @param
      */
     rotate: function(deg, translate)
     {
        var rotate = "rotate(" + deg + "deg)";
        this._updateTransform("rotate", /rotate\(.*\)/, rotate);
     },

    /**
     * Applies a scale transform
     *
     * @method scale
     * @param {Number} val
     */
    scale: function(val)
    {
    },

    /**
     * Applies a matrix transformation
     *
     * @method matrix
     */
    matrix: function(a, b, c, d, e, f)
    {
    },

    /**
     * @private
     */
    _updateTransform: function(type, test, val)
    {
        var node = this.get("node"),
            transform = node.style.MozTransform || node.style.webkitTransform || node.style.msTransform || node.style.OTransform;

        if(transform && transform.length > 0)
        {
            if(transform.indexOf(type) > -1)
            {
                transform = transform.replace(test, val);
            }
            else
            {
                transform += " " + val;
            }
        }
        else
        {
            transform = val;
        }
        node.style.MozTransform = transform;
        node.style.webkitTransform = transform;
        node.style.msTransform = transform;
        node.style.OTransform = transform;
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        this._draw();
    },
    
    /**
     * @private
     */
    _draw: function()
    {
        this._paint();
    },

    /**
     * Completes a shape or drawing
     *
     * @method _paint
     * @private
     */
    _paint: function()
    {
        if(!this._methods)
        {
            return;
        }
        var node = this.get("node"),
            w = this.get("width") || this._width,
            h = this.get("height") || this._height,
            context = this._context,
            methods = [],
            cachedMethods = this._methods.concat(),
            i = 0,
            j,
            method,
            args,
            len = 0,
            right = this._right,
            left = this._left,
            top = this._top,
            bottom = this._bottom;
       if(this._methods)
       {
            len = cachedMethods.length;
            if(!len || len < 1)
            {
                return;
            }
            for(; i < len; ++i)
            {
                methods[i] = cachedMethods[i].concat();
                args = methods[i];
                for(j = 1; j < args.length; ++j)
                {
                    if(j % 2 === 0)
                    {
                        args[j] = args[j] - this._top;
                    }
                    else
                    {
                        args[j] = args[j] - this._left;
                    }
                }
            }
            node.setAttribute("width", w);
            node.setAttribute("height", h);
            context.beginPath();
            for(i = 0; i < len; ++i)
            {
                args = methods[i];
                if(args && args.length > 0)
                {
                    method = args.shift();
                    if(method)
                    {
                        if(method && method == "lineTo" && this._dashstyle)
                        {
                            args.unshift(this._xcoords[i] - this._left, this._ycoords[i] - this._top);
                            this._drawDashedLine.apply(this, args);
                        }
                        else
                        {
                            context[method].apply(context, args); 
                        }
                    }
                }
            }


            if (this._fillType) {
                context.fillStyle = this._fillColor;
                context.closePath();
            }

            if (this._fillType) {
                context.fill();
            }

            if (this._stroke) {
                if(this._strokeWeight)
                {
                    context.lineWidth = this._strokeWeight;
                }
                context.lineCap = this._linecap;
                context.lineJoin = this._linejoin;
                if(this._miterlimit)
                {
                    context.miterLimit = this._miterlimit;
                }
                context.strokeStyle = this._strokeStyle;
                context.stroke();
            }
            this._drawingComplete = true;
            this._clearAndUpdateCoords();
            this._updateNodePosition();
            this._methods = cachedMethods;
        }
    },

    /**
     * Draws a dashed line between two points.
     * 
     * @method _drawDashedLine
     * @param {Number} xStart	The x position of the start of the line
     * @param {Number} yStart	The y position of the start of the line
     * @param {Number} xEnd		The x position of the end of the line
     * @param {Number} yEnd		The y position of the end of the line
     * @private
     */
    _drawDashedLine: function(xStart, yStart, xEnd, yEnd)
    {
        var context = this._context,
            dashsize = this._dashstyle[0],
            gapsize = this._dashstyle[1],
            segmentLength = dashsize + gapsize,
            xDelta = xEnd - xStart,
            yDelta = yEnd - yStart,
            delta = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)),
            segmentCount = Math.floor(Math.abs(delta / segmentLength)),
            radians = Math.atan2(yDelta, xDelta),
            xCurrent = xStart,
            yCurrent = yStart,
            i;
        xDelta = Math.cos(radians) * segmentLength;
        yDelta = Math.sin(radians) * segmentLength;
        
        for(i = 0; i < segmentCount; ++i)
        {
            context.moveTo(xCurrent, yCurrent);
            context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
            xCurrent += xDelta;
            yCurrent += yDelta;
        }
        
        context.moveTo(xCurrent, yCurrent);
        delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
        
        if(delta > dashsize)
        {
            context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
        }
        else if(delta > 0)
        {
            context.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
        }
        
        context.moveTo(xEnd, yEnd);
    },

    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        var w = this.get("width"),
            h = this.get("height");
        this._initProps();
        this._context.clearRect(0, 0, w, h);
        return this;
    }
 }, {
    ATTRS: {
        /**
         * Dom node of the shape
         *
         * @attribute node
         * @type HTMLElement
         * @readOnly
         */
        node: {
            readOnly: true,

            valueFn: "_getNode" 
        },

        /**
         * 
         * @attribute width
         */
        width: {},

        /**
         * 
         * @attribute height
         */
        height: {},

        /**
         * The x-coordinate for the shape.
         */
        x: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.style.left = (val + this._left) + "px";
                return val;
            }
        },

        /**
         * The x-coordinate for the shape.
         */
        y: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.style.top = (val + this._top) + "px";
                return val;
            }
        },

        /**
         * Indicates whether the shape is visible.
         *
         * @attribute visible
         * @type Boolean
         */
        visible: {
            value: true,

            setter: function(val){
                var visibility = val ? "visible" : "hidden";
                this.get("node").style.visibility = visibility;
                return val;
            }
        },

        /**
         * Contains information about the fill of the shape. 
         *  <dl>
         *      <dt>color</dt><dd>The color of the fill.</dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>
         *  </dl>
         *
         * @attribute fill
         * @type Object 
         */
        fill: {
            setter: function(val)
            {
                var tmpl = this.get("fill") || this._getAttrCfg("fill").defaultValue;
                val = (val) ? Y.merge(tmpl, val) : null;
                this._setFillProps(val);
                return val;
            }
        },

        /**
         * Contains information about the stroke of the shape.
         *  <dl>
         *      <dt>color</dt><dd>The color of the stroke.</dd>
         *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>
         *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to "none", a solid stroke is drawn. When set to an array, the first index indicates the
         *      length of the dash. The second index indicates the length of gap.
         *  </dl>
         *
         * @attribute stroke
         * @type Object
         */
        stroke: {
            valueFn: function() {
                return {
                    weight: 1,
                    dashstyle: null,
                    color: "#000",
                    alpha: 1.0
                };
            },

            setter: function(val)
            {
                var tmpl = this.get("stroke") || this._getAttrCfg("stroke").defaultValue;
                val = (val) ? Y.merge(tmpl, val) : null;
                this._setStrokeProps(val);
                return val;
            }
        },
        
        /**
         * Indicates whether or not the instance will size itself based on its contents.
         *
         * @attribute autoSize 
         * @type Boolean
         */
        autoSize: {
            value: false
        },

        /**
         * Determines whether the instance will receive mouse events.
         * 
         * @attribute pointerEvents
         * @type string
         */
        pointerEvents: {
            value: "visiblePainted"
        }
    }
});

/**
 * The Path class creates a graphic object with editable 
 * properties.
 *
 * @class Path
 * @extends Shape
 */
Y.Path = Y.Base.create("path", Y.Shape, [], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "path",

    /**
     * @private
     */
    _addListeners: function() {},

    /**
     * @private
     */
    _draw: function()
    {
        this._paint();
    },

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._draw();
    }
}, {
    ATTRS: {
        /**
         * 
         * @attribute width
         */
        width: {
            getter: function()
            {
                return this._width;
            },

            setter: function(val)
            {
                this._width = val;
                return val;
            }
        },

        /**
         * 
         * @attribute height
         */
        height: {
            getter: function()
            {
                return this._height;
            },

            setter: function(val)
            {
                this._height = val;
                return val;
            }
        },
        
        /**
         * Indicates the path used for the node.
         *
         * @attribute path
         * @type String
         */
        path: {
            getter: function()
            {
                return this._path;
            },

            setter: function(val)
            {
                this._path = val;
                return val;
            }
        }
    }
});
/**
 * Draws rectangles
 */
 Y.Rect = Y.Base.create("rect", Y.Shape, [], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "rect",

    /**
     * @private
     */
    _draw: function()
    {
        var x = this.get("x"),
            y = this.get("y"),
            w = this.get("width"),
            h = this.get("height"),
            fill = this.get("fill"),
            stroke = this.get("stroke");
        this.drawRect(x, y, w, h);
        this._paint();
    }
 });
/**
 * Draws ellipses
 */
 Y.Ellipse = Y.Base.create("ellipse", Y.Shape, [], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "ellipse",

    /**
     * @private
     */
    _draw: function()
    {
        var w = this.get("width"),
            h = this.get("height"),
            fill = this.get("fill"),
            stroke = this.get("stroke");
        this.drawEllipse(0, 0, w, h);
        this._paint();
    }
 });
/**
 * Draws circles
 */
 Y.Circle = Y.Base.create("circle", Y.Base, [Y.Shape], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "circle",

    /**
     * @private
     */
    _draw: function()
    {
        var radius = this.get("radius"),
            fill = this.get("fill"),
            stroke = this.get("stroke");
        if(radius)
        {
            this.drawCircle(0, 0, radius);
            this._paint();
        }
    },

    /**
     * @private
     */
    _addListeners: function()
    {
        this.after("radiusChange", this._updateHandler);
        Y.Shape.prototype._addListeners.apply(this, arguments);
    }
 }, {
    ATTRS: {
        /**
         * 
         * @attribute width
         * @readOnly
         */
        width: {
            readOnly:true,

            getter: function()
            {
                return this.get("radius") * 2;
            }
        },

        /**
         * 
         * @attribute height
         * @readOnly
         */
        height: {
            readOnly:true,

            getter: function()
            {
                return this.get("radius") * 2;
            }
        },

        /**
         * Radius of the circle
         *
         * @attribute radius
         */
        radius: {
            lazyAdd: false,

            setter: function(val)
            {
                var node = this.get("node"),
                    circum = val * 2;
                node.setAttribute("width", circum);
                node.setAttribute("height", circum);
                return val;
            }
        }
    }
 });


}, 'gallery-2012.12.05-21-01' ,{requires:['graphics'], skinnable:false});
