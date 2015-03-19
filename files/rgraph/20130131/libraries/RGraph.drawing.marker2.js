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
    * @param number x    The X position of the label
    * @param number y    The Y position of the label
    * @param number text The text used
    */
    RGraph.Drawing.Marker2 = function (id, x, y, text)
    {
        this.id           = id;
        this.canvas       = document.getElementById(id);
        this.context      = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.colorsParsed = false;


        /**
        * Store the properties
        */
        this.x    = x;
        this.y    = y;
        this.text = text;


        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.marker2';


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
            'chart.strokestyle':      'black',
            'chart.fillstyle':        'white',
            'chart.text.color':         'black',
            'chart.text.size':          12,
            'chart.text.font':          'Arial',
            'chart.events.click':       null,
            'chart.events.mousemove':   null,
            'chart.shadow':             true,
            'chart.shadow.color':       'gray',
            'chart.shadow.offsetx':     3,
            'chart.shadow.offsety':     3,
            'chart.shadow.blur':        5,
            'chart.highlight.stroke':   'rgba(0,0,0,0)',
            'chart.highlight.fill':     'rgba(255,255,255,0.7)',
            'chart.tooltips':           null,
            'chart.tooltips.highlight': true,
            'chart.tooltips.event':     'onclick',
            'chart.voffset':            20
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.MARKER2] No canvas support');
            return;
        }
        
        /**
        * This can be used to store the coordinates of shapes on the graph
        */
        this.coords = [];


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
    RGraph.Drawing.Marker2.prototype.Set = function (name, value)
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
    RGraph.Drawing.Marker2.prototype.Get = function (name)
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
    * Draws the marker
    */
    RGraph.Drawing.Marker2.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');


        this.metrics = RGraph.MeasureText(this.text, this.properties['chart.text.bold'], this.properties['chart.text.font'], this.properties['chart.text.size']);


        /**
        * Parse the colors. This allows for simple gradient syntax
        */
        if (!this.colorsParsed) {

            this.parseColors();

            // Don't want to do this again
            this.colorsParsed = true;
        }


        /**
        * Need to right align the text?
        */
        this.positionLeft =  (this.x + this.metrics[0]) >= this.canvas.width ? true: false;

        if (this.positionLeft) {
            this.x = this.x - this.metrics[0] - 6;
        }

        /**
        * Draw the box
        */
        this.context.beginPath();

            if (this.properties['chart.shadow']) {
                RGraph.SetShadow(this, this.properties['chart.shadow.color'], this.properties['chart.shadow.offsetx'], this.properties['chart.shadow.offsety'], this.properties['chart.shadow.blur']);
            }

            this.context.fillStyle   = this.properties['chart.fillstyle'];
            this.context.fillRect(Math.round(this.x),
                                  Math.round(this.y - this.metrics[1] - 6 - this.properties['chart.voffset']),
                                  this.metrics[0] + 6,
                                  this.metrics[1] + 6);
        this.context.fill();
        
        // Store these coords as the coords of the label
        this.coords[0] = [Math.round(this.x),Math.round(this.y - this.metrics[1] - 6 - this.properties['chart.voffset']),this.metrics[0] + 6,this.metrics[1] + 6]

        RGraph.NoShadow(this);


        /**
        * Draw the stick
        */
        this.context.beginPath();
            this.context.moveTo(Math.round(this.x + (this.positionLeft ? this.metrics[0] + 6 : 0) ), this.y - this.properties['chart.voffset']);
            this.context.lineTo(Math.round(this.x + (this.positionLeft ? this.metrics[0] + 6 : 0)), this.y - 3);
        this.context.stroke();


        /**
        * Stroke the box
        */
        this.context.beginPath();
            this.context.strokeStyle = this.properties['chart.strokestyle'];
            this.context.strokeRect(Math.round(this.x),
                                    Math.round(this.y - this.metrics[1] - 6 - this.properties['chart.voffset']),
                                    this.metrics[0] + 6,
                                    this.metrics[1] + 6);
        this.context.stroke();




        this.context.beginPath();
            this.context.fillStyle = this.properties['chart.text.color'];
                this.context.font = (this.properties['chart.text.bold'] ? 'Bold ' : '') + this.properties['chart.text.size'] + 'pt ' + this.properties['chart.text.font'];
                this.context.textBaseline = 'bottom';
                this.context.fillText(this.text,this.x + 3,this.y - 3 - this.properties['chart.voffset']);
        this.context.fill();
        this.context.stroke();
        
        // Must turn the shadow off
        RGraph.NoShadow(this);



        /**
        * Reset the testBaseline
        */
        this.context.textBaseline = 'alphabetic';


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
    RGraph.Drawing.Marker2.prototype.getObjectByXY = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);

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
    RGraph.Drawing.Marker2.prototype.getShape = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];

        if (   mouseX >= this.coords[0][0]
            && mouseX <= (this.coords[0][0] + this.coords[0][2])
            && mouseY >= this.coords[0][1]
            && mouseY <= (this.coords[0][1] + this.coords[0][3])) {

            return {
                    0: this, 1: this.coords[0][0], 2: this.coords[0][1], 3: this.coords[0][2], 4: this.coords[0][3], 5: 0,
                    'object': this, 'x': this.coords[0][0], 'y': this.coords[0][1], 'width': this.coords[0][2], 'height': this.coords[0][3], 'index': 0, 'tooltip': this.properties['chart.tooltips'] ? this.properties['chart.tooltips'][0] : null
                   };
        }
        
        return null;
    }



    /**
    * This function positions a tooltip when it is displayed
    * 
    * @param obj object     The chart object
    * @param int x          The X coordinate specified for the tooltip
    * @param int y          The Y coordinate specified for the tooltip
    * @param object tooltip The tooltips DIV element
    * @param number idx     The index of the tooltip
    */
    RGraph.Drawing.Marker2.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var textDimensions = RGraph.MeasureText(this.text, false, this.properties['chart.text.font'], this.properties['chart.text.size']);

        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var width      = tooltip.offsetWidth;
        var height     = tooltip.offsetHeight;

        // Set the top position
        tooltip.style.left = 0;
        tooltip.style.top  = canvasXY[1] + this.coords[0][1] - height - 9 + 'px';

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
        if ((canvasXY[0] + obj.coords[0][0] + (obj.coords[0][2] / 2) - (width / 2)) < 10) {
            tooltip.style.left = (canvasXY[0] + this.coords[0][0] + (this.coords[0][2] / 2) - (width * 0.1)) + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + this.coords[0][0] + (this.coords[0][2] / 2) + (width / 2)) > document.body.offsetWidth) {
            tooltip.style.left = (canvasXY[0] + this.coords[0][0] + (this.coords[0][2] / 2) - (width * 0.9)) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + this.coords[0][0] + (this.coords[0][2] / 2) - (width * 0.5)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Drawing.Marker2.prototype.Highlight = function (shape)
    {
        this.context.beginPath();
            this.context.strokeStyle = this.properties['chart.highlight.stroke'];
            this.context.fillStyle = this.properties['chart.highlight.fill'];
            this.context.strokeRect(this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3]);
            this.context.fillRect(this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3]);
        this.context.fill();
        this.context.stroke();
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Drawing.Marker2.prototype.parseColors = function ()
    {
        /**
        * Parse various properties for colors
        */
        this.properties['chart.fillstyle']        = this.parseSingleColorForGradient(this.properties['chart.fillstyle']);
        this.properties['chart.strokestyle']      = this.parseSingleColorForGradient(this.properties['chart.strokestyle']);
        this.properties['chart.highlight.stroke'] = this.parseSingleColorForGradient(this.properties['chart.highlight.stroke']);
        this.properties['chart.highlight.fill']   = this.parseSingleColorForGradient(this.properties['chart.highlight.fill']);
        this.properties['chart.text.color']       = this.parseSingleColorForGradient(this.properties['chart.text.color']);
    }



    /**
    * This parses a single color value
    */
    RGraph.Drawing.Marker2.prototype.parseSingleColorForGradient = function (color)
    {
        var canvas  = this.canvas;
        var context = this.context;
        
        if (!color || typeof(color) != 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = context.createLinearGradient(this.x, this.y, this.x + this.metrics[0], this.y);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }

        return grad ? grad : color;
    }