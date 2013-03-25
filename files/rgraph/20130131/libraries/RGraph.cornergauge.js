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
    
    if (typeof(RGraph) == 'undefined') RGraph = {};

    /**
    * The constructor
    * 
    * @param object id    The canvas tag ID
    * @param array  min   The minimum value
    * @param array  max   The maximum value
    * @param array  value The indicated value
    */
    RGraph.CornerGauge = function (id, min, max, value)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'cornergauge';
        this.min               = min;
        this.max               = max;
        this.value             = value;
        this.angles            = {};
        this.angles.needle     = [];
        this.centerpin         = {};
        this.isRGraph          = true;
        this.currentValue      = null;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();

        /**
        * Range checking
        */
        if (typeof(this.value) == 'object') {
            for (var i=0; i<this.value.length; ++i) {
                if (this.value[i] > this.max) this.value[i] = max;
                if (this.value[i] < this.min) this.value[i] = min;
            }
        } else {
            if (this.value > this.max) this.value = max;
            if (this.value < this.min) this.value = min;
        }



        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);


        // Various config type stuff
        this.properties = {
                            'chart.centerx':        null,
                            'chart.centery':        null,
                            'chart.radius':         null,
                            'chart.gutter.left':    25,
                            'chart.gutter.right':   25,
                            'chart.gutter.top':     25,
                            'chart.gutter.bottom':  25,
                            'chart.strokestyle':    'black',
                            'chart.linewidth':      2,
                            'chart.title':          '',
                            'chart.title.vpos':     0.5,
                            'chart.title.size':     null,
                            'chart.title.x':        null,
                            'chart.title.y':        null,
                            'chart.title.bold':     true,
                            'chart.text.font':      'Arial',
                            'chart.text.color':     '#666',
                            'chart.text.size':      10,
                            'chart.background.gradient.color1': '#ddd',
                            'chart.background.gradient.color2': 'white',
                            'chart.shadow':           true,
                            'chart.shadow.color':     'gray',
                            'chart.shadow.offsetx':   0,
                            'chart.shadow.offsety':   0,
                            'chart.shadow.blur':      15,
                            'chart.scale.decimals': 0,
                            'chart.scale.point':    '.',
                            'chart.scale.thousand': ',',
                            'chart.units.pre':      '',
                            'chart.units.post':     '',
                            'chart.resizable':       false,
                            'chart.chart.resize.handle.background':       null,
                            'chart.adjustable':       false,
                            'chart.annotatable':      false,
                            'chart.annotate.color':       'black',
                            'chart.colors.ranges':    null,
                            'chart.red.start':        min + (0.9 * (this.max - min)),
                            'chart.green.end':        min + (0.7 * (this.max - min)),
                            'chart.red.color':        'red',
                            'chart.yellow.color':     'yellow',
                            'chart.green.color':      '#0f0',
                            'chart.value.text':       true,
                            'chart.value.text.units.pre':  '',
                            'chart.value.text.units.post': '',
                            'chart.value.text.boxed': true,
                            'chart.value.text.font': 'Arial',
                            'chart.value.text.size': null,
                            'chart.value.text.bold': false,
                            'chart.value.text.decimals': 0,
                            'chart.centerpin.stroke':  'rgba(0,0,0,0)',
                            'chart.centerpin.fill':    null, // Set in the DrawCenterpin function
                            'chart.centerpin.color':    'blue',
                            'chart.needle.colors':   ['#ccc', '#D5604D', 'red', 'green', 'yellow'],
                            'chart.zoom.factor':            1.5,
                            'chart.zoom.fade.in':           true,
                            'chart.zoom.fade.out':          true,
                            'chart.zoom.hdir':              'right',
                            'chart.zoom.vdir':              'down',
                            'chart.zoom.frames':            25,
                            'chart.zoom.delay':             16.666,
                            'chart.zoom.shadow':            true,
                            'chart.zoom.background':        true
        }


        /**
        * Register the object
        */
        RGraph.Register(this);
    }



    /**
    * An all encompassing accessor
    * 
    * @param string name The name of the property
    * @param mixed value The value of the property
    */
    RGraph.CornerGauge.prototype.Set = function (name, value)
    {
        name = name.toLowerCase();

        /**
        * This should be done first - prepend the property name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        this.properties[name] = value;
    }


    /**
    * An all encompassing accessor
    * 
    * @param string name The name of the property
    */
    RGraph.CornerGauge.prototype.Get = function (name)
    {
        /**
        * This should be done first - prepend the property name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        return this.properties[name];
    }


    /**
    * The function you call to draw the line chart
    */
    RGraph.CornerGauge.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');


        /**
        * Store the value (for animation primarily
        */
        this.currentValue = this.value;


        this.gutterLeft   = this.properties['chart.gutter.left'];
        this.gutterRight  = this.properties['chart.gutter.right'];
        this.gutterTop    = this.properties['chart.gutter.top'];
        this.gutterBottom = this.properties['chart.gutter.bottom'];



        /**
        * Work out the radius first
        */
        this.radius  = Math.min(
                                ((this.canvas.width - this.gutterLeft - this.gutterRight)),
                                ((this.canvas.height - this.gutterTop - this.gutterBottom))
                               );

        if (typeof(this.properties['chart.radius']) == 'number')  this.radius  = this.properties['chart.radius'];



        /**
        * Now use the radius in working out the centerX/Y
        */
        this.centerx = (this.canvas.width / 2) - (this.radius / 2) + Math.max(30, this.radius * 0.1);
        this.centery = (this.canvas.height / 2) + (this.radius / 2) - (this.radius * 0.1);

        if (typeof(this.properties['chart.centerx']) == 'number') this.centerx = this.properties['chart.centerx'];
        if (typeof(this.properties['chart.centery']) == 'number') this.centery = this.properties['chart.centery'];



        /**
        * Parse the colors for gradients. Its down here so that the center X/Y can be used
        */
        if (!this.colorsParsed) {

            this.parseColors();

            // Don't want to do this again
            this.colorsParsed = true;
        }



        /**
        * Start with the background
        */
        this.DrawBackGround();



        /**
        * Draw the tickmarks
        */
        this.DrawTickmarks();
        
        
        /**
        * Draw the color bands
        */
        this.DrawColorBands();
        
        
        /**
        * Draw the label/value in text
        */
        this.DrawLabel();


        /**
        * Start with the labels/scale
        */
        this.DrawLabels();


        /**
        * Draw the needle(s)
        */
        if (typeof(this.value) == 'object') {

            for (var i=0; i<this.value.length; ++i) {
                this.DrawNeedle(
                                i,
                                this.value[i],
                                this.radius - 65
                               );
            }
        } else {
            this.DrawNeedle(0, this.value, this.radius - 65);
        }

        /**
        * Draw the centerpin of the needle
        */
        this.DrawCenterpin();


        /**
        * Draw the title
        */
        var size = this.properties['chart.title.size'] ? this.properties['chart.title.size'] : this.Get('chart.text.size') + 2
        this.properties['chart.title.y'] = this.centery + 20 - this.radius - ((1.5 * size) / 2);
        RGraph.DrawTitle(this,
                         this.properties['chart.title'],
                         this.guttertop,
                         this.centerx + (this.radius / 2),
                         size);


        /**
        * Setup the context menu if required
        */
        if (this.properties['chart.contextmenu']) {
            RGraph.ShowContext(this);
        }



        /**
        * This function enables resizing
        */
        if (this.properties['chart.resizable']) {
            RGraph.AllowResizing(this);
        }


        /**
        * This installs the event listeners
        */
        RGraph.InstallEventListeners(this);

        
        /**
        * Fire the RGraph ondraw event
        */
        RGraph.FireCustomEvent(this, 'ondraw');
    }






    /**
    * Draw the background
    */
    RGraph.CornerGauge.prototype.DrawBackGround = function ()
    {
        if (this.properties['chart.shadow']) {
            RGraph.SetShadow(this, this.properties['chart.shadow.color'], this.properties['chart.shadow.offsetx'], this.properties['chart.shadow.offsety'], this.properties['chart.shadow.blur']);
        }

        this.context.strokeStyle = this.properties['chart.strokestyle'];
        this.context.lineWidth   = this.properties['chart.linewidth'] ? this.properties['chart.linewidth'] : 0.0001;

        /**
        * Draw the corner circle first
        */
        this.context.beginPath();
            this.context.arc(this.centerx,this.centery,30,0,TWOPI,false);
        this.context.stroke();

        /**
        * Draw the quarter circle background
        */
        this.context.beginPath();
            this.context.moveTo(this.centerx - 20, this.centery + 20);
            this.context.arc(this.centerx - 20,this.centery + 20,this.radius,PI + HALFPI,TWOPI,false);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();


        // ==================================================================================================================== //
        
        
        RGraph.NoShadow(this);


        this.context.strokeStyle = this.properties['chart.strokestyle'];
        this.context.lineWidth   = this.properties['chart.linewidth'] ? this.properties['chart.linewidth'] : 0.0001;

        /**
        * Draw the quarter circle background
        */
        this.context.beginPath();
            this.context.moveTo(this.centerx - 20, this.centery + 20);
            this.context.arc(this.centerx - 20,this.centery + 20,this.radius,PI + HALFPI,TWOPI,false);
        this.context.closePath();
        this.context.stroke();


        // ==================================================================================================================== //


        /**
        * Draw the background background again but with no shadow on
        */
        RGraph.NoShadow(this);

        this.context.lineWidth = 0;
        this.context.fillStyle = RGraph.RadialGradient(this, this.centerx,this.centery, 0,
                                                             this.centerx, this.centery, this.radius * 0.5,
                                                             this.properties['chart.background.gradient.color1'],
                                                             this.properties['chart.background.gradient.color2']);

        // Go over the bulge again in the gradient
        this.context.beginPath();
            this.context.moveTo(this.centerx, this.centery);
            this.context.arc(this.centerx,this.centery,30,0,TWOPI,0);
        this.context.closePath();
        this.context.fill();

        // Go over the main part of the gauge with just the fill
        this.context.beginPath();
            this.context.moveTo(this.centerx - 20, this.centery + 20);
            this.context.lineTo(this.centerx - 20, this.centery + 20 - this.radius);
            this.context.arc(this.centerx - 20,this.centery + 20,this.radius,PI + HALFPI,TWOPI,false);
        this.context.closePath();
        this.context.fill();
        
        // Draw the gray background lines.
        this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.strokeStyle = '#eee';
            for (var i=0; i<=5; ++i) {
                var p1 = RGraph.getRadiusEndPoint(this.centerx, this.centery, (HALFPI / 5 * i) + PI + HALFPI, 30);
                var p2 = RGraph.getRadiusEndPoint(this.centerx, this.centery, (HALFPI / 5 * i) + PI + HALFPI, this.radius - 90);

                this.context.moveTo(p1[0], p1[1]);
                this.context.lineTo(p2[0], p2[1]);
            }
            
        this.context.stroke();
    }



    /**
    * Draw the needle
    */
    RGraph.CornerGauge.prototype.DrawNeedle = function (index, value, radius)
    {
        var grad = RGraph.RadialGradient(this, this.centerx, this.centery, 0,
                                               this.centerx, this.centery, 20,
                                               'rgba(0,0,0,0)', this.properties['chart.needle.colors'][index])

        this.angles.needle[index] = (((value - this.min) / (this.max - this.min)) * HALFPI) + PI + HALFPI;
        this.context.lineWidth    = 1
        this.context.strokeStyle  = 'rgba(0,0,0,0)';
        this.context.fillStyle    = grad;


        this.context.beginPath();

            this.context.moveTo(this.centerx, this.centery);

            this.context.arc(this.centerx,
                             this.centery,
                             10,
                             this.angles.needle[index] - HALFPI,
                             this.angles.needle[index] - HALFPI + 0.000001,
                             false);

            this.context.arc(this.centerx,
                             this.centery,
                             radius - 30,
                             this.angles.needle[index],
                             this.angles.needle[index] + 0.000001,
                             false);

            this.context.arc(this.centerx,
                             this.centery,
                             10,
                             this.angles.needle[index] + HALFPI,
                             this.angles.needle[index] + HALFPI + 0.000001,
                             false);

        this.context.stroke();
        this.context.fill();

    }








    /**
    * Draw the centerpin for the needle
    */
    RGraph.CornerGauge.prototype.DrawCenterpin = function ()
    {

        if (!this.properties['chart.centerpin.fill']) {
            this.properties['chart.centerpin.fill'] = RGraph.RadialGradient(this, this.centerx + 5,
                                                                                  this.centery - 5,
                                                                                  0,
                                                                                  this.centerx + 5,
                                                                                  this.centery - 5,
                                                                                  20,
                                                                                  'white',
                                                                                  this.properties['chart.centerpin.color'])
        }

        this.context.strokeStyle = this.properties['chart.centerpin.stroke'];
        this.context.fillStyle   = this.properties['chart.centerpin.fill'];

        this.context.beginPath();
            this.context.lineWidth = 2;
            this.context.arc(this.centerx,this.centery, 15,0,TWOPI,false);
        this.context.stroke();
        this.context.fill();
    }








    /**
    * Drawthe labels
    */
    RGraph.CornerGauge.prototype.DrawLabels = function ()
    {
        var numLabels = 5;
        
        this.context.fillStyle = this.properties['chart.text.color'];

        for (var i=0; i<numLabels; ++i) {
            this.context.beginPath();

                var num  = Number(this.min + ((this.max - this.min) * (i / (numLabels - 1)))).toFixed(this.properties['chart.scale.decimals']);
                    num = RGraph.number_format(this, num, this.properties['chart.units.pre'], this.properties['chart.units.post']);
                var angle = (i * 22.5) / (180 / PI);

                RGraph.Text(this.context,
                            this.properties['chart.text.font'],
                            this.properties['chart.text.size'],
                            this.centerx + Math.sin(angle) * (this.radius - 53),
                            this.centery - Math.cos(angle) * (this.radius - 53),
                            String(num),
                            'top',
                            'center',
                            null,
                            90 * (i / (numLabels - 1)));
            this.context.fill();
        }
    }








    /**
    * Drawthe tickmarks
    */
    RGraph.CornerGauge.prototype.DrawTickmarks = function ()
    {
        var bigTicks   = 5;
        var smallTicks = 25;

        /**
        * Draw the smaller tickmarks
        */
        for (var i=0; i<smallTicks; ++i) {
            this.context.beginPath();
            var angle = (HALFPI / (smallTicks - 1)) * i
            this.context.lineWidth = 1;

            this.context.arc(this.centerx,
                             this.centery,
                             this.radius - 44,
                             PI + HALFPI + angle,
                             PI + HALFPI + angle + 0.0001,
                             false);
            this.context.arc(this.centerx,
                             this.centery,
                             this.radius - 46,
                             PI + HALFPI + angle,
                             PI + HALFPI + angle + 0.0001,
                             false);
            this.context.stroke();
        }

        /**
        * Now draw the larger tickmarks
        */
        for (var i=0; i<bigTicks; ++i) {
            this.context.beginPath();
            var angle = (HALFPI / (bigTicks - 1)) * i
            this.context.lineWidth = 1;
            this.context.arc(this.centerx,
                             this.centery,
                             this.radius - 43,
                             PI + HALFPI + angle,
                             PI + HALFPI + angle + 0.0001,
                             false);
            this.context.arc(this.centerx,
                             this.centery,
                             this.radius - 47,
                             PI + HALFPI + angle,
                             PI + HALFPI + angle + 0.0001,
                             false);
            this.context.stroke();
        }
    }




    /**
    * This draws the green background to the tickmarks
    */
    RGraph.CornerGauge.prototype.DrawColorBands = function ()
    {
        if (RGraph.is_array(this.Get('chart.colors.ranges'))) {

            var ranges = this.Get('chart.colors.ranges');

            for (var i=0; i<ranges.length; ++i) {

                this.context.fillStyle = ranges[i][2];
                this.context.lineWidth = 0;

                this.context.beginPath();
                    this.context.arc(this.centerx,
                                     this.centery,
                                     this.radius - 54 - (this.Get('chart.text.size') * 1.5),
                                     (((ranges[i][0] - this.min) / (this.max - this.min)) * HALFPI) + (PI + HALFPI),
                                     (((ranges[i][1] - this.min) / (this.max - this.min)) * HALFPI) + (PI + HALFPI),
                                     false);

                    this.context.arc(this.centerx,
                                     this.centery,
                                     this.radius - 54 - 10 - (this.Get('chart.text.size') * 1.5),
                                     (((ranges[i][1] - this.min) / (this.max - this.min)) * HALFPI) + (PI + HALFPI),
                                     (((ranges[i][0] - this.min) / (this.max - this.min)) * HALFPI) + (PI + HALFPI),
                                     true);
                this.context.closePath();
                this.context.fill();
            }

            return;
        }




        /**
        * Draw the GREEN region
        */
        this.context.strokeStyle = this.Get('chart.green.color');
        this.context.fillStyle = this.Get('chart.green.color');
        
        var greenStart = PI + HALFPI;
        var greenEnd   = greenStart + (TWOPI - greenStart) * ((this.Get('chart.green.end') - this.min) / (this.max - this.min))

        this.context.beginPath();
            this.context.arc(this.centerx, this.centery, this.radius - 54 - (this.Get('chart.text.size') * 1.5), greenStart, greenEnd, false);
            this.context.arc(this.centerx, this.centery, this.radius - 54 - (this.Get('chart.text.size') * 1.5) - 10, greenEnd, greenStart, true);
        this.context.fill();


        /**
        * Draw the YELLOW region
        */
        this.context.strokeStyle = this.Get('chart.yellow.color');
        this.context.fillStyle = this.Get('chart.yellow.color');
        
        var yellowStart = greenEnd;
        var yellowEnd   = (((this.Get('chart.red.start') - this.min) / (this.max - this.min)) * HALFPI) + PI + HALFPI;

        this.context.beginPath();
            this.context.arc(this.centerx, this.centery, this.radius - 54 - (this.Get('chart.text.size') * 1.5), yellowStart, yellowEnd, false);
            this.context.arc(this.centerx, this.centery, this.radius - 54 - (this.Get('chart.text.size') * 1.5) - 10, yellowEnd, yellowStart, true);
        this.context.fill();


        /**
        * Draw the RED region
        */
        this.context.strokeStyle = this.Get('chart.red.color');
        this.context.fillStyle = this.Get('chart.red.color');
        
        var redStart = yellowEnd;
        var redEnd   = TWOPI;

        this.context.beginPath();
            this.context.arc(this.centerx, this.centery, this.radius - 54 - (this.Get('chart.text.size') * 1.5), redStart, redEnd, false);
            this.context.arc(this.centerx, this.centery, this.radius - 54 - (this.Get('chart.text.size') * 1.5) - 10, redEnd, redStart, true);
        this.context.fill();
    }








    /**
    * Draw the value in text
    */
    RGraph.CornerGauge.prototype.DrawLabel = function ()
    {
        if (this.properties['chart.value.text']) {

            this.context.strokeStyle = this.properties['chart.text.color'];
            this.context.fillStyle   = this.properties['chart.text.color'];
            
            var value = typeof(this.value) == 'number' ? this.value.toFixed(this.properties['chart.value.text.decimals']) : this.value;

            if (typeof(value) == 'object') {
                for (var i=0; i<value.length; ++i) {
                    value[i] = Number(value[i]).toFixed(this.properties['chart.value.text.decimals']);
                }
                
                value = value.toString();
            }

            RGraph.Text(this.context,
                        this.properties['chart.value.text.font'],
                        typeof(this.properties['chart.value.text.size']) == 'number' ? this.properties['chart.value.text.size'] : this.properties['chart.text.size'],
                        this.centerx + (Math.cos((PI / 180) * 45) * (this.radius / 3)),
                        this.centery - (Math.sin((PI / 180) * 45) * (this.radius / 3)),
                        RGraph.number_format(this, String(value), this.properties['chart.value.text.units.pre'], this.properties['chart.value.text.units.post']),
                        'center',
                        'center',
                        this.properties['chart.value.text.boxed'] ? true : false,
                        null,
                        null,
                        this.properties['chart.value.text.bold'],
                        false);
        }
    }








    /**
    * A placeholder function
    * 
    * @param object The event object
    */
    RGraph.CornerGauge.prototype.getShape = function (e)
    {
    }








    /**
    * A getValue method
    * 
    * @param object e An event object
    */
    RGraph.CornerGauge.prototype.getValue = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];

        var angle = RGraph.getAngleByXY(this.centerx, this.centery, mouseX, mouseY);

        if (angle > TWOPI && angle < (PI + HALFPI)) {
            return null;
        }

        var value = ((angle - (PI + HALFPI)) / (TWOPI - (PI + HALFPI))) * (this.max - this.min);
            value = value + this.min;

        if (value < this.min) {
            value = this.min
        }

        if (value > this.max) {
            value = this.max
        }
        
        // Special case for this chart
        if (mouseX > this.centerx && mouseY > this.centery) {
            value = this.max;
        }

        return value;
    }



    /**
    * The getObjectByXY() worker method. Don't call this call:
    * 
    * RGraph.ObjectRegistry.getObjectByXY(e)
    * 
    * @param object e The event object
    */
    RGraph.CornerGauge.prototype.getObjectByXY = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);

        if (
               mouseXY[0] > (this.centerx - 5)
            && mouseXY[0] < (this.centerx + this.radius)
            && mouseXY[1] > (this.centery - this.radius)
            && mouseXY[1] < (this.centery + 5)
            && RGraph.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]) <= this.radius
            ) {
            return this;
        }
    }



    /**
    * This method handles the adjusting calculation for when the mouse is moved
    * 
    * @param object e The event object
    */
    RGraph.CornerGauge.prototype.Adjusting_mousemove = function (e)
    {
        /**
        * Handle adjusting for the Bar
        */
        if (RGraph.Registry.Get('chart.adjusting') && RGraph.Registry.Get('chart.adjusting').uid == this.uid) {
            this.value = this.getValue(e);
            RGraph.Clear(this.canvas);
            RGraph.RedrawCanvas(this.canvas);
            RGraph.FireCustomEvent(this, 'onadjust');
        }
    }








    /**
    * This method returns the appropriate angle for a value
    * 
    * @param number value The value to get the angle for
    */
    RGraph.CornerGauge.prototype.getAngle = function (value)
    {
        if (value < this.min || value > this.max) {
            return null;
        }
        
        var angle  = ((value - this.min) / (this.max - this.min)) * HALFPI
            angle += (PI + HALFPI);
            
        return angle;
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.CornerGauge.prototype.parseColors = function ()
    {
        var props = this.properties;
        
        if (!RGraph.is_null(this.properties['chart.colors.ranges'])) {
            for (var i=0; i<this.properties['chart.colors.ranges'].length; ++i) {
                this.properties['chart.colors.ranges'][i][2] = this.parseSingleColorForGradient(this.properties['chart.colors.ranges'][i][2]);
            }
        } else {
            this.properties['chart.green.color']  = this.parseSingleColorForGradient(this.properties['chart.green.color']);
            this.properties['chart.yellow.color'] = this.parseSingleColorForGradient(this.properties['chart.yellow.color']);
            this.properties['chart.red.color']    = this.parseSingleColorForGradient(this.properties['chart.red.color']);
        }
    }



    /**
    * This parses a single color value
    */
    RGraph.CornerGauge.prototype.parseSingleColorForGradient = function (color)
    {
        var canvas  = this.canvas;
        var context = this.context;
        
        if (!color || typeof(color) != 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            var radius_start = this.radius - 54 - this.properties['chart.text.size'];
            var radius_end   = radius_start - 15;

            // Create the gradient
            var grad = context.createRadialGradient(
                                                    this.centerx,
                                                    this.centery,
                                                    radius_start,
                                                    this.centerx,
                                                    this.centery,
                                                    radius_end
                                                   );


            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }

        return grad ? grad : color;
    }