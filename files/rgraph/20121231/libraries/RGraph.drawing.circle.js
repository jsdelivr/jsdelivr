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
    * @param number x  The X position of the circle
    * @param number y  The Y position of the circle
    * @param number r  The radius of the circle
    */
    RGraph.Drawing.Circle = function (id, x, y, r)
    {
        this.id      = id;
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;


        /**
        * Store the properties
        */
        this.centerx = x;
        this.centery = y;
        this.radius  = r;


        /**
        * This puts a reference to this object on to the canvas.
        */
        this.canvas.__object__ = this;

        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.circle';


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
            'chart.strokestyle':      'transparent',
            'chart.fillstyle':          'red',
            'chart.events.click':       null,
            'chart.events.mousemove':   null,
            'chart.shadow':             false,
            'chart.shadow.color':       'gray',
            'chart.shadow.offsetx':     3,
            'chart.shadow.offsety':     3,
            'chart.shadow.blur':        5,
            'chart.highlight.stroke':   'black',
            'chart.highlight.fill':     'rgba(255,255,255,0.7)',
            'chart.tooltips':           null,
            'chart.tooltips.highlight': true,
            'chart.tooltips.event':     'onclick',
            'chart.linewidth':          2
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.CIRCLE] No canvas support');
            return;
        }
        
        /**
        * This can be used to store the coordinates of shapes on the graph
        */
        this.coords = [[x, y, r]];


        /**
        * Create the dollar object so that functions can be added to them
        */
        this.$0 = {};



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
    RGraph.Drawing.Circle.prototype.Set = function (name, value)
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
    RGraph.Drawing.Circle.prototype.Get = function (name)
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
    * Draws the circle
    */
    RGraph.Drawing.Circle.prototype.Draw = function ()
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
            this.context.fillStyle = this.properties['chart.fillstyle'];
            this.context.lineWidth = this.properties['chart.linewidth'];
            
            if (this.properties['chart.shadow']) {
                RGraph.SetShadow(this, this.properties['chart.shadow.color'], this.properties['chart.shadow.offsetx'], this.properties['chart.shadow.offsety'], this.properties['chart.shadow.blur']);
            }

            this.context.arc(this.coords[0][0], this.coords[0][1], this.radius, 0, TWOPI, false);

        this.context.fill();
        this.context.stroke();
        
        // Must turn the shadow off before the fill is done
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
    RGraph.Drawing.Circle.prototype.getObjectByXY = function (e)
    {
        if (this.getShape(e)) {
            return this;
        }
    }



    /**
    * Not used by the class during creating the shape, but is used by event handlers
    * to get the coordinates (if any) of the selected bar
    * 
    * @param object e The event object
    * @param object   OPTIONAL You can pass in the bar object instead of the
    *                          function using "this"
    */
    RGraph.Drawing.Circle.prototype.getShape = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];

        if (RGraph.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]) <= this.radius) {
            
            return {
                    0: this, 1: this.centerx, 2: this.centery, 3: this.radius, 4: null, 5: 0,
                    'object': this, 'x': this.centerx, 'y': this.centery, 'radius': this.radius, 'index': 0, 'tooltip': this.properties['chart.tooltips'] ? this.properties['chart.tooltips'][0] : null
                   };
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
    RGraph.Drawing.Circle.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var width      = tooltip.offsetWidth;
        var height     = tooltip.offsetHeight;
        var radius     = this.radius;

        // Set the top position
        tooltip.style.left = 0;
        tooltip.style.top  = canvasXY[1] + obj.centery - height - 7 - radius + 'px';
        
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
        if ((canvasXY[0] + obj.centerx - (width / 2)) < 10) {
            tooltip.style.left = (canvasXY[0] + this.centerx - (width * 0.1))  + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + obj.centerx + (width / 2)) > document.body.offsetWidth) {
            tooltip.style.left = canvasXY[0] + this.centerx - (width * 0.9) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + this.centerx - (width * 0.5)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Drawing.Circle.prototype.Highlight = function (shape)
    {
        this.context.beginPath();
            this.context.strokeStyle = this.properties['chart.highlight.stroke'];
            this.context.fillStyle = this.properties['chart.highlight.fill'];
            this.context.arc(this.centerx, this.centery, this.radius + 0.5, 0, TWOPI, false);
        this.context.fill();
        this.context.stroke();
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Drawing.Circle.prototype.parseColors = function ()
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
    RGraph.Drawing.Circle.prototype.parseSingleColorForGradient = function (color)
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