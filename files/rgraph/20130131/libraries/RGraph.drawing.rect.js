    /**
    * o------------------------------------------------------------------------------o
    * | This file is part of the RGraph package - you can learn more at:             |
    * |                                                                              |
    * |                          http://www.rgraph.net                               |
    * |                                                                              |
    * | This package is licensed under the RGraph license. For all kinds of business |
    * | purposes there is a small one-time licensing fee to pay and for non          |
    * | commercial  purposes it is free to use. You can read the full license here:  |
    * |                                                                              |
    * |                      http://www.rgraph.net/license                           |
    * o------------------------------------------------------------------------------o
    */


    
    /**
    * Having this here means that the RGraph libraries can be included in any order, instead of you having
    * to include the common core library first.
    */
    if (typeof(RGraph) == 'undefined') RGraph = {};
    if (typeof(RGraph.Drawing) == 'undefined') RGraph.Drawing = {};




    /**
    * The constructor. This function sets up the object. It takes the ID (the HTML attribute) of the canvas as the
    * first argument and the data as the second. If you need to change this, you can.
    * 
    * @param string id    The canvas tag ID
    * @param number x  The X position of the rectangle
    * @param number y  The Y position of the rectangle
    * @param number w  The width of the rectangle
    * @param number h  The height of the rectangle
    */
    RGraph.Drawing.Rect = function (id, x, y, w, h)
    {
        this.id      = id;
        this.canvas       = document.getElementById(id);
        this.context      = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.colorsParsed = false;

        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.rect';


        /**
        * This facilitates easy object identification, and should always be true
        */
        this.isRGraph = true;


        /**
        * This adds a uid to the object that you can use for identification purposes
        */
        this.uid = RGraph.CreateUID();


        /**
        * This adds a UID to the canvas for identification purposes
        */
        this.canvas.uid = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();


        /**
        * This does a few things, for example adding the .fillText() method to the canvas 2D context when
        * it doesn't exist. This facilitates the graphs to be still shown in older browser (though without
        * text obviously). You'll find the function in RGraph.common.core.js
        */
        RGraph.OldBrowserCompat(this.context);


        /**
        * Some example background properties
        */
        this.properties =
        {
            'chart.strokestyle':      'rgba(0,0,0,0)',
            'chart.fillstyle':        'red',
            'chart.events.click':     null,
            'chart.events.mousemove': null,
            'chart.shadow':           false,
            'chart.shadow.color':     'gray',
            'chart.shadow.offsetx':   3,
            'chart.shadow.offsety':   3,
            'chart.shadow.blur':      5,
            'chart.highlight.stroke':   'black',
            'chart.highlight.fill':   'rgba(255,255,255,0.7)',
            'chart.tooltips':          null,
            'chart.tooltips.effect':   'fade',
            'chart.tooltips.css.class':'RGraph_tooltip',
            'chart.tooltips.event':    'onclick',
            'chart.tooltips.highlight':true,
            'chart.tooltips.coords.page': false
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.RECT] No canvas support');
            return;
        }
        
        /**
        * This can be used to store the coordinates of shapes on the graph
        */
        this.coords = [[Math.round(x), Math.round(y), w, h]];
        
        /**
        * Create the dollar object so that functions can be added to them
        */
        this.$0 = {};


        /**
        * Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        * done already
        */
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            
            this.canvas.__rgraph_aa_translated__ = true;
        }



        /**
        * Objects are now always registered so that the chart is redrawn if need be.
        */
        RGraph.Register(this);
    }




    /**
    * A setter method for setting graph properties. It can be used like this: obj.Set('chart.strokestyle', '#666');
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.Drawing.Rect.prototype.Set = function (name, value)
    {
        name = name.toLowerCase();

        /**
        * This should be done first - prepend the propertyy name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        this.properties[name] = value;
    }




    /**
    * A getter method for retrieving graph properties. It can be used like this: obj.Get('chart.strokestyle');
    * 
    * @param name  string The name of the property to get
    */
    RGraph.Drawing.Rect.prototype.Get = function (name)
    {
        /**
        * This should be done first - prepend the property name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        return this.properties[name.toLowerCase()];
    }




    /**
    * Draws the rectangle
    */
    RGraph.Drawing.Rect.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');


        /**
        * Parse the colors. This allows for simple gradient syntax
        */
        if (!this.colorsParsed) {

            this.parseColors();

            // Don't want to do this again
            this.colorsParsed = true;
        }


        this.context.beginPath();

            this.context.strokeStyle = this.properties['chart.strokestyle'];
            this.context.fillStyle   = this.properties['chart.fillstyle'];
            
            if (this.properties['chart.shadow']) {
                RGraph.SetShadow(this, this.properties['chart.shadow.color'], this.properties['chart.shadow.offsetx'], this.properties['chart.shadow.offsety'], this.properties['chart.shadow.blur']);
            }

            this.context.rect(this.coords[0][0], this.coords[0][1], this.coords[0][2], this.coords[0][3]);

        this.context.stroke();
        this.context.fill();
        
        // Turn the shadow off
        RGraph.NoShadow(this);


        /**
        * This installs the event listeners
        */
        RGraph.InstallEventListeners(this);


        /**
        * Fire the ondraw event
        */
        RGraph.FireCustomEvent(this, 'ondraw');
    }



    /**
    * The getObjectByXY() worker method
    */
    RGraph.Drawing.Rect.prototype.getObjectByXY = function (e)
    {
        if (this.getShape(e)) {
            return this;
        }
    }


    /**
    * Not used by the class during creating the graph, but is used by event handlers
    * to get the coordinates (if any) of the selected bar
    * 
    * @param object e The event object
    * @param object   OPTIONAL You can pass in the bar object instead of the
    *                          function using "this"
    */
    RGraph.Drawing.Rect.prototype.getShape = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];  

        for (var i=0; i<this.coords.length; i++) {

            var left   = this.coords[i][0];
            var top    = this.coords[i][1];
            var width  = this.coords[i][2];
            var height = this.coords[i][3];

            if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height)) {
                
                return {
                        0: this, 1: left, 2: top, 3: width, 4: height, 5: 0,
                        'object': this, 'x': left, 'y': top, 'width': width, 'height': height, 'index': 0, 'tooltip': this.properties['chart.tooltips'] ? this.properties['chart.tooltips'][0] : null
                       };
            }
        }
        
        return null;
    }



    /**
    * This function positions a tooltip when it is displayed
    * 
    * @param obj object    The chart object
    * @param int x         The X coordinate specified for the tooltip
    * @param int y         The Y coordinate specified for the tooltip
    * @param objec tooltip The tooltips DIV element
    */
    RGraph.Drawing.Rect.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var coordX     = obj.coords[0][0];
        var coordY     = obj.coords[0][1];
        var coordW     = obj.coords[0][2];
        var coordH     = obj.coords[0][3];
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var width      = tooltip.offsetWidth;
        var height     = tooltip.offsetHeight;

        // Set the top position
        tooltip.style.left = 0;
        tooltip.style.top  = canvasXY[1] + coordY - height - 7 + 'px';
        
        // By default any overflow is hidden
        tooltip.style.overflow = '';

        // The arrow
        var img = new Image();
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAFCAYAAACjKgd3AAAARUlEQVQYV2NkQAN79+797+RkhC4M5+/bd47B2dmZEVkBCgcmgcsgbAaA9GA1BCSBbhAuA/AagmwQPgMIGgIzCD0M0AMMAEFVIAa6UQgcAAAAAElFTkSuQmCC';
            img.style.position = 'absolute';
            img.id = '__rgraph_tooltip_pointer__';
            img.style.top = (tooltip.offsetHeight - 2) + 'px';
        tooltip.appendChild(img);
        
        // Reposition the tooltip if at the edges:
        
        // LEFT edge
        if ((canvasXY[0] + coordX + (coordW / 2) - (width / 2)) < 10) {
            tooltip.style.left = (canvasXY[0] + coordX - (width * 0.1)) + (coordW / 2) + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + coordX + (width / 2)) > document.body.offsetWidth) {
            tooltip.style.left = canvasXY[0] + coordX - (width * 0.9) + (coordW / 2) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + coordX + (coordW / 2) - (width * 0.5)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Drawing.Rect.prototype.Highlight = function (shape)
    {
        // Add the new highlight
        RGraph.Highlight.Rect(this, shape);
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Drawing.Rect.prototype.parseColors = function ()
    {
        /**
        * Parse various properties for colors
        */
        this.properties['chart.fillstyle']        = this.parseSingleColorForGradient(this.properties['chart.fillstyle']);
        this.properties['chart.strokestyle']      = this.parseSingleColorForGradient(this.properties['chart.strokestyle']);
        this.properties['chart.highlight.stroke'] = this.parseSingleColorForGradient(this.properties['chart.highlight.stroke']);
        this.properties['chart.highlight.fill']   = this.parseSingleColorForGradient(this.properties['chart.highlight.fill']);
    }



    /**
    * This parses a single color value
    */
    RGraph.Drawing.Rect.prototype.parseSingleColorForGradient = function (color)
    {
        var canvas  = this.canvas;
        var context = this.context;
        
        if (!color) {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = context.createLinearGradient(0,0,canvas.width,0);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }

        return grad ? grad : color;
    }