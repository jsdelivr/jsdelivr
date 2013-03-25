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
    * @param number text The text used - should be a single character (unless you've significantly increased
    *                    the size of the marker.
    */
    RGraph.Drawing.Marker1 = function (id, x, y, radius, text)
    {
        this.id      = id;
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.colorsParsed = false;


        /**
        * Store the properties
        */
        this.centerx = x;
        this.centery = y;
        this.radius  = radius;
        this.text    = text;


        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.marker1';


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
            'chart.strokestyle':        'black',
            'chart.fillstyle':          'white',
            'chart.linewidth':          2,
            'chart.text.color':         'black',
            'chart.text.size':          12,
            'chart.text.font':          'Arial',
            'chart.events.click':       null,
            'chart.events.mousemove':   null,
            'chart.shadow':             true,
            'chart.shadow.color':       '#aaa',
            'chart.shadow.offsetx':     0,
            'chart.shadow.offsety':     0,
            'chart.shadow.blur':       15,
            'chart.highlight.stroke':   'rgba(0,0,0,0)',
            'chart.highlight.fill':     'rgba(255,255,255,0.7)',
            'chart.tooltips':           null,
            'chart.tooltips.highlight': true,
            'chart.tooltips.event':     'onclick',
            'chart.align':              'center'
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.MARKER1] No canvas support');
            return;
        }


        /**
        * Create the dollar object so that functions can be added to them
        */
        this.$0 = {};


        /**
        * This can be used to store the coordinates of shapes on the canvas
        */
        this.coords = [];



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
    RGraph.Drawing.Marker1.prototype.Set = function (name, value)
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
    RGraph.Drawing.Marker1.prototype.Get = function (name)
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
    RGraph.Drawing.Marker1.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');
        
        var r = this.radius;

        if (this.properties['chart.align'] == 'left') {

            this.markerCenterx = this.centerx - r - r - 3;
            this.markerCentery = this.centery - r - r - 3;
        
        } else if (this.properties['chart.align'] == 'right') {
            
            this.markerCenterx = this.centerx + r + r + 3;
            this.markerCentery = this.centery - r - r - 3;

        } else {

            this.markerCenterx = this.centerx;
            this.markerCentery = this.centery - r - r - 3;
        }

        /**
        * Parse the colors. This allows for simple gradient syntax
        */
        if (!this.colorsParsed) {

            this.parseColors();

            // Don't want to do this again
            this.colorsParsed = true;
        }


        /**
        * DRAW THE MARKER HERE
        */
        this.context.beginPath();
        
            if (this.properties['chart.shadow']) {
                RGraph.SetShadow(this, this.properties['chart.shadow.color'], this.properties['chart.shadow.offsetx'], this.properties['chart.shadow.offsety'], this.properties['chart.shadow.blur']);
            }
        
            this.context.lineWidth   = this.properties['chart.linewidth'];
            this.context.strokeStyle = this.properties['chart.strokestyle'];
            this.context.fillStyle   = this.properties['chart.fillstyle'];
        
            // This function draws the actual marker
            this.DrawMarker();
        
        
        this.context.stroke();
        this.context.fill();
        
        // Turn the shadow off
        RGraph.NoShadow(this);
        
        // Now draw the text on the marker
        this.context.fillStyle = this.properties['chart.text.color'];
        
        // Draw the text on the marker
        RGraph.Text(this.context,
                    this.properties['chart.text.font'],
                    this.properties['chart.text.size'],
                    this.coords[0][0] - 1,
                    this.coords[0][1] - 1,
                    this.text,
                    'center',
                    'center');

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
    RGraph.Drawing.Marker1.prototype.getObjectByXY = function (e)
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
    RGraph.Drawing.Marker1.prototype.getShape = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];

        /**
        * Path the marker but DON'T STROKE OR FILL it
        */
        this.context.beginPath();
        this.DrawMarker();

        if (this.context.isPointInPath(mouseXY[0], mouseXY[1])) {

            return {
                    0: this, 1: this.coords[0][0], 2: this.coords[0][1], 3: this.coords[0][2], 4: 0,
                    'object': this, 'x': this.coords[0][0], 'y': this.coords[0][1], 'radius': this.coords[0][2], 'index': 0, 'tooltip': this.properties['chart.tooltips'] ? this.properties['chart.tooltips'][0] : null
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
    RGraph.Drawing.Marker1.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var width      = tooltip.offsetWidth;
        var height     = tooltip.offsetHeight;

        // Set the top position
        tooltip.style.left = 0;
        tooltip.style.top  = canvasXY[1] + this.coords[0][1] - height - 7 - this.radius + 'px';

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
            tooltip.style.left = canvasXY[0] + this.markerCenterx - (width * 0.1) + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + this.coords[0][0] + (this.coords[0][2] / 2) + (width / 2)) > document.body.offsetWidth) {
            tooltip.style.left = canvasXY[0] + this.markerCenterx - (width * 0.9) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + this.markerCenterx - (width * 0.5)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Drawing.Marker1.prototype.Highlight = function (shape)
    {
        this.context.beginPath();
            this.context.strokeStyle = this.properties['chart.highlight.stroke'];
            this.context.fillStyle = this.properties['chart.highlight.fill'];
            this.DrawMarker();
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
    }



    /**
    * This function is used to encapsulate the actual drawing of the marker. It
    * intentional does not start a path or set colors.
    */
    RGraph.Drawing.Marker1.prototype.DrawMarker = function ()
    {
        var r = this.radius;
        
        if (this.properties['chart.align'] == 'left') {

            var x = this.markerCenterx;
            var y = this.markerCentery;
    
            this.context.arc(x, y, r, HALFPI, TWOPI, false);
            
           // special case for MSIE 7/8
            if (RGraph.isOld()) {
                this.context.moveTo(x + r + r, y+r+r);
                this.context.quadraticCurveTo(
                                  x + r,
                                  y + r,
                                  x + r + 1,
                                  y
                                 );
                this.context.moveTo(x + r + r, y+r+r);
            } else {
                this.context.quadraticCurveTo(
                                              x + r,
                                              y + r,
                                              x + r + r,
                                              y + r + r
                                             );
            }

            this.context.quadraticCurveTo(
                                          x + r,
                                          y + r,
                                          x,
                                          y + r + (RGraph.isOld() ? 1 : 0)
                                         );
        } else if (this.properties['chart.align'] == 'right') {

            var x = this.markerCenterx;
            var y = this.markerCentery;
    
            this.context.arc(x, y, r, HALFPI, PI, true);

           // special case for MSIE 7/8
            if (RGraph.isOld()) {
                this.context.moveTo(x - r - r, y+r+r);
                this.context.quadraticCurveTo(
                                  x - r,
                                  y + r,
                                  x - r - 1,
                                  y
                                 );
                this.context.moveTo(x - r - r, y+r+r);
            } else {
                this.context.quadraticCurveTo(
                                              x - r,
                                              y + r,
                                              x - r - r,
                                              y + r + r
                                             );
            }

            this.context.quadraticCurveTo(
                                          x - r,
                                          y + r,
                                          x,
                                          y + r + (RGraph.isOld() ? 1 : 0)
                                         );

        // Default is center
        } else {

            var x = this.markerCenterx;
            var y = this.markerCentery;

            this.context.arc(x, y, r, HALFPI / 2, PI - (HALFPI / 2), true);
            
            // special case for MSIE 7/8
            if (RGraph.isOld()) {
                this.context.moveTo(x, y+r+r-2);
                this.context.quadraticCurveTo(
                                  x,
                                  y + r + (r / 4),
                                  x - (Math.cos(HALFPI / 2) * r),
                                  y + (Math.sin(HALFPI / 2) * r)
                                 );
                this.context.moveTo(x, y+r+r-2);
            } else {
                this.context.quadraticCurveTo(
                                  x,
                                  y + r + (r / 4),
                                  x,
                                  y + r + r - 2 // The two is so that the marker is not touching the point
                                 );
            }

            this.context.quadraticCurveTo(
                              x,
                              y + r + (r / 4),
                              x + (Math.cos(HALFPI / 2) * r),
                              y + (Math.sin(HALFPI / 2) * r)
                             );
        }

        this.coords[0] = [x, y, r];
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Drawing.Marker1.prototype.parseColors = function ()
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
    RGraph.Drawing.Marker1.prototype.parseSingleColorForGradient = function (color)
    {
        var canvas  = this.canvas;
        var context = this.context;
        
        if (!color || typeof(color) != 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = context.createRadialGradient(this.markerCenterx, this.markerCentery, 0, this.markerCenterx, this.markerCentery, this.radius);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }

        return grad ? grad : color;
    }