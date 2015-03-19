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
    * |                      http://www.rgraph.net/LICENSE.txt                       |
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
    * first argument.
    * 
    * @param string id    The canvas tag ID
    * @param number x     The X coordinate of the clock
    * @param number y     The Y coordinate of the clock
    * @param number r     The radius of the clock
    */
    RGraph.Drawing.Clock = function (id, x, y, r)
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
        this.type = 'drawing.clock';


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
            'chart.hour':               true,
            'chart.minute':             true,
            'chart.second':             true,
            'chart.events.click':       null,
            'chart.events.mousemove':   null,
            'chart.shadow':             false,
            'chart.shadow.color':       'gray',
            'chart.shadow.offsetx':     3,
            'chart.shadow.offsety':     3,
            'chart.shadow.blur':        5,
            'chart.tooltips':           null,
            'chart.tooltips.highlight': true,
            'chart.tooltips.event':     'onclick',
            'chart.linewidth':          1,
            'chart.highlight.stroke':   'transparent',
            'chart.highlight.fill':     'rgba(255,255,255,0.7)',
            'chart.text.size':          10,
            'chart.text.visible':       true,
            'chart.text.font':          'Segoe UI',
            'chart.shadow':             false,
            'chart.shadow.offsetx':     0,
            'chart.shadow.offsety':     0,
            'chart.shadow.blur':        15,
            'chart.shadow.color':       '#aaa',
            'chart.animated':           true
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.CLOCK] No canvas support');
            return;
        }
        
        /**
        * This can be used to store the coordinates of the clock
        */
        this.coords     = [[x, y, r]];



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
    RGraph.Drawing.Clock.prototype.Set = function (name, value)
    {
        this.properties[name.toLowerCase()] = value;
    }




    /**
    * A getter method for retrieving graph properties. It can be used like this: obj.Get('chart.strokestyle');
    * 
    * @param name  string The name of the property to get
    */
    RGraph.Drawing.Clock.prototype.Get = function (name)
    {
        return this.properties[name.toLowerCase()];
    }




    /**
    * Draws the circle
    */
    RGraph.Drawing.Clock.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');
        
        /**
        * DRAW THE CLOCK
        */

        /**
        * Store the time
        */
        this.date    = new Date();
        this.seconds = this.date.getSeconds();
        this.minutes = this.date.getMinutes();
        this.hours   = this.date.getHours();

        // Draw the outline
        if (this.properties['chart.shadow']) {
            RGraph.SetShadow(this, this.properties['chart.shadow.color'],
                                   this.properties['chart.shadow.offsetx'],
                                   this.properties['chart.shadow.offsety'],
                                   this.properties['chart.shadow.blur']);
        }

        this.context.beginPath();
            this.context.strokeStyle = 'gray';
            this.context.fillStyle = RGraph.RadialGradient(this,
                                                           this.centerx,
                                                           this.centery,
                                                           0,
                                                           this.centerx,
                                                           this.centery,
                                                           this.radius * 2,
                                                           'white',
                                                           '#eee');
            this.context.arc(this.centerx, this.centery, this.radius, 0, TWOPI, false);
        this.context.fill();
        RGraph.NoShadow(this);
        this.context.stroke();

        // Draw the smaller ticks
        this.context.beginPath();
            
            var cx = this.centerx;
            var cy = this.centery;
            var r  = this.radius - 5;
            this.context.lineWidth = 0.5;

            for (var i=0; i<60; ++i) {
                var XY_from = RGraph.getRadiusEndPoint(cx, cy, (TWOPI / 60) * i, r);
                var XY_to   = RGraph.getRadiusEndPoint(cx, cy, (TWOPI / 60) * i, r - (r * 0.1));
                this.context.moveTo(XY_from[0], XY_from[1]);
                this.context.lineTo(XY_to[0], XY_to[1]);
            }
        this.context.stroke();
        
        // Draw the bigger ticks
        this.context.beginPath();
            
            var cx = this.centerx;
            var cy = this.centery;
            var r  = this.radius - 5;
            this.context.lineWidth = 2;

            for (var i=0; i<12; ++i) {
                var XY_from = RGraph.getRadiusEndPoint(cx, cy, (TWOPI / 12) * i, r);
                var XY_to   = RGraph.getRadiusEndPoint(cx, cy, (TWOPI / 12) * i, r - (r * 0.2));

                this.context.moveTo(XY_from[0], XY_from[1]);
                this.context.lineTo(XY_to[0], XY_to[1]);
            }
        this.context.stroke();
        
        // Draw the numbers if necessary
        if (this.properties['chart.text.visible']) {
            var text_size = this.properties['chart.text.size'];
            this.context.fillStyle = 'black';
    
            for (var i=0; i<12; ++i) {

                var XY = RGraph.getRadiusEndPoint(cx, cy, ((TWOPI / 12) * i) - HALFPI, r - (r * 0.2) - this.properties['chart.text.size']);

                RGraph.Text(this.context,
                            this.properties['chart.text.font'],
                            text_size,
                            XY[0],
                            XY[1],
                            i ==0 ? '12' : i.toString(),
                            'center',
                            'center');
            }
        }
        
        // Draw the hands if necessary
        this.DrawHour();
        this.DrawMinute();
        this.DrawSecond();
        
        // Draw the centerpin
        this.context.beginPath();
            this.context.strokeStyle = 'gray';
            this.context.fillStyle = 'white';

            this.context.arc(this.centerx, this.centery, 5, 0, TWOPI, false);
        this.context.fill();
        this.context.stroke();
        
        /**
        * This makes the clock update itself
        */
        var cvs = this.canvas;
        var uid = this.uid;
    
        //The second hand isn't shown for MSIE 7/8
        setTimeout(function () {RGraph.Clear(cvs);RGraph.Redraw();}, RGraph.isOld() ? 10000: 250);
        
        
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
    RGraph.Drawing.Clock.prototype.getObjectByXY = function (e)
    {
        if (this.getShape(e)) {
            return this;
        }
    }



    /**
    * Not used by the class during creating the shape, but is used by event handlers
    * to get the coordinates (if any) of the clock
    * 
    * @param object e The event object
    */
    RGraph.Drawing.Clock.prototype.getShape = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];

        if (RGraph.getHypLength(this.centerx, this.centery, mouseX, mouseY) <= this.radius) {
            
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
    RGraph.Drawing.Clock.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var width      = tooltip.offsetWidth;
        var height     = tooltip.offsetHeight;

        // Set the top position
        tooltip.style.left = 0;
        tooltip.style.top  = canvasXY[1] + obj.centery - height - 7 + 'px';// + coordY + (coordH / 2) - height - 7 + 'px';
        
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
    RGraph.Drawing.Clock.prototype.Highlight = function (shape)
    {
        // highlight the clock
    }



    /**
    * Draw the hour hand
    */
    RGraph.Drawing.Clock.prototype.DrawHour = function ()
    {
        var coords = [
                      RGraph.getRadiusEndPoint(this.centerx, this.centery, ((this.hours/12) * TWOPI) - HALFPI, this.radius * 0.3),
                      RGraph.getRadiusEndPoint(this.centerx, this.centery, ((this.hours/12) * TWOPI) - HALFPI + PI, this.radius * 0.1)
                     ];
        
        // Nullify the tail if i's not required
        if (this.properties['chart.needle.hour.tail'] == false) {
            coords[1] = null;
        }

        for (var i=0; i<2; ++i) {
            if (coords[i]) {
                this.context.beginPath();
                    this.context.lineCap = 'round';
                    this.context.lineWidth = 3;
                    this.context.strokeStyle = 'black';
                    this.context.moveTo(coords[i][0], coords[i][1]);
                    this.context.lineTo(this.centerx, this.centery);
                this.context.stroke();
            }
        }
        
        
        this.context.lineWidth = 1;
    }



    /**
    * Draw the minute hand
    */
    RGraph.Drawing.Clock.prototype.DrawMinute = function ()
    {
        var coords = [
                      RGraph.getRadiusEndPoint(this.centerx, this.centery, ((this.minutes/60) * TWOPI) - HALFPI, (this.radius) * 0.7 - (this.properties['chart.text.size'] * 0.5)),
                      RGraph.getRadiusEndPoint(this.centerx, this.centery, ((this.minutes/60) * TWOPI) - HALFPI + PI, this.radius * 0.2)
                     ];

        // Nullify the tail if i's not required
        if (this.properties['chart.needle.minute.tail'] == false) {
            coords[1] = null;
        }

        for (var i=0; i<2; ++i) {
            if (coords[i]) {
                this.context.beginPath();
                    this.context.lineWidth = 2;
                    this.context.lineCap = 'round';
                    this.context.strokeStyle = 'black';
                    this.context.moveTo(coords[i][0], coords[i][1]);
                    this.context.lineTo(this.centerx, this.centery);
                this.context.stroke();
            }
        }
        
        
        this.context.lineWidth = 1;
    }



    /**
    * Draw the second hand
    */
    RGraph.Drawing.Clock.prototype.DrawSecond = function ()
    {
        if (this.properties['chart.needle.second']) {
            // Draw the main part of the second hand
            var coords = [
                          RGraph.getRadiusEndPoint(this.centerx, this.centery, ((this.seconds/60) * TWOPI) - HALFPI, this.radius * 0.8),
                          RGraph.getRadiusEndPoint(this.centerx, this.centery, ((this.seconds/60) * TWOPI) - HALFPI + PI, this.radius * 0.2)
                         ];
    
            // Nullify the tail if i's not required
            if (this.properties['chart.needle.second.tail'] == false) {
                coords[1] = null;
            }
    
            for (var i=0; i<2; ++i) {
                if (coords[i]) {
                    this.context.beginPath();
                        this.context.strokeStyle = 'black';
                        this.context.moveTo(coords[i][0], coords[i][1]);
                        this.context.lineTo(this.centerx, this.centery);
                    this.context.stroke();
                }
            }
        }
    }