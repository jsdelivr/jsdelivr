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
    * The line chart constructor
    * 
    * @param object canvas The cxanvas object
    * @param array  data   The chart data
    * @param array  ...    Other lines to plot
    */
    RGraph.Gauge = function (id, min, max, value)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'gauge';
        this.min               = min;
        this.max               = max;
        this.value             = value;
        this.isRGraph          = true;
        this.currentValue      = null;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;

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
            'chart.angles.start':  null,
            'chart.angles.end':    null,
            'chart.centerx':       null,
            'chart.centery':       null,
            'chart.radius':        null,
            'chart.gutter.left':   15,
            'chart.gutter.right':  15,
            'chart.gutter.top':    15,
            'chart.gutter.bottom': 15,
            'chart.border.width':  10,
            'chart.title.top':     '',
            'chart.title.top.font':'Arial',
            'chart.title.top.size':14,
            'chart.title.top.color':'#333',
            'chart.title.top.bold':false,
            'chart.title.top.pos': null,
            'chart.title.bottom':  '',
            'chart.title.bottom.font':'Arial',
            'chart.title.bottom.size':14,
            'chart.title.bottom.color':'#333',
            'chart.title.bottom.bold':false,
            'chart.title.bottom.pos':null,
            'chart.text.font':    'Arial',
            'chart.text.align':    'top',
            'chart.text.x':         null,
            'chart.text.y':         null,
            'chart.text.color':     '#666',
            'chart.text.size':      10,
            'chart.background.color': 'white',
            'chart.background.gradient': false,
            'chart.scale.decimals': 0,
            'chart.scale.point':    '.',
            'chart.scale.thousand': ',',
            'chart.units.pre':      '',
            'chart.units.post':     '',
            'chart.value.text':     false,
            'chart.value.text.y.pos': 0.5,
            'chart.value.text.units.pre': null,
            'chart.value.text.units.post': null,
            'chart.red.start':      0.9 * this.max,
            'chart.red.color':      '#DC3912',
            'chart.yellow.color':   '#FF9900',
            'chart.green.end':      0.7 * this.max,
            'chart.green.color':    'rgba(0,0,0,0)',
            'chart.colors.ranges':  null,
            'chart.needle.size':    null,
            'chart.needle.tail':    false,
            'chart.needle.colors':   ['#D5604D', 'red', 'green', 'yellow'],
            'chart.needle.type':     'triangle',
            'chart.border.outer':     '#ccc',
            'chart.border.inner':     '#f1f1f1',
            'chart.border.outline':   'black',
            'chart.centerpin':         true,
            'chart.centerpin.color':  'blue',
            'chart.centerpin.radius': null,
            'chart.zoom.background':  true,
            'chart.zoom.action':      'zoom',
            'chart.tickmarks.small':  25,
            'chart.tickmarks.small.color': 'black',
            'chart.tickmarks.medium': 0,
            'chart.tickmarks.medium.color': 'black',
            'chart.tickmarks.big':    5,
            'chart.tickmarks.big.color': 'black',
            'chart.labels.count':     5,
            'chart.labels.centered':  false,
            'chart.labels.offset':    0,
            'chart.border.gradient':  false,
            'chart.adjustable':       false,
            'chart.shadow':           true,
            'chart.shadow.color':     'gray',
            'chart.shadow.offsetx':   0,
            'chart.shadow.offsety':   0,
            'chart.shadow.blur':      15
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
    RGraph.Gauge.prototype.Set = function (name, value)
    {
        name = name.toLowerCase();

        /**
        * This should be done first - prepend the propertyy name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        /**
        * Title compatibility
        */
        if (name == 'chart.title')       name = 'chart.title.top';
        if (name == 'chart.title.font')  name = 'chart.title.top.font';
        if (name == 'chart.title.size')  name = 'chart.title.top.size';
        if (name == 'chart.title.color') name = 'chart.title.top.color';
        if (name == 'chart.title.bold')  name = 'chart.title.top.bold';

        // BC
        if (name == 'chart.needle.color') {
            name = 'chart.needle.colors';
        }

        this.properties[name] = value;
    }


    /**
    * An all encompassing accessor
    * 
    * @param string name The name of the property
    */
    RGraph.Gauge.prototype.Get = function (name)
    {
        /**
        * This should be done first - prepend the property name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        // BC
        if (name == 'chart.needle.color') {
            name = 'chart.needle.colors';
        }

        return this.properties[name];
    }


    /**
    * The function you call to draw the line chart
    * 
    * @param bool An optional bool used internally to ditinguish whether the
    *             line chart is being called by the bar chart
    */
    RGraph.Gauge.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');



        /**
        * Store the value (for animation primarily
        */
        this.currentValue = this.value;


        /**
        * This is new in May 2011 and facilitates indiviual gutter settings,
        * eg chart.gutter.left
        */
        this.gutterLeft   = this.Get('chart.gutter.left');
        this.gutterRight  = this.Get('chart.gutter.right');
        this.gutterTop    = this.Get('chart.gutter.top');
        this.gutterBottom = this.Get('chart.gutter.bottom');
        
        this.centerx = ((this.canvas.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;
        this.centery = ((this.canvas.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop;
        this.radius  = Math.min(
                                ((this.canvas.width - this.gutterLeft - this.gutterRight) / 2),
                                ((this.canvas.height - this.gutterTop - this.gutterBottom) / 2)
                               );
        this.startAngle = this.properties['chart.angles.start'] ? this.properties['chart.angles.start'] : (HALFPI / 3) + HALFPI;
        this.endAngle   = this.properties['chart.angles.end'] ? this.properties['chart.angles.end'] : TWOPI + HALFPI - (HALFPI / 3);



        /**
        * You can now override the positioning and radius if you so wish.
        */
        if (typeof(this.Get('chart.centerx')) == 'number') this.centerx = this.Get('chart.centerx');
        if (typeof(this.Get('chart.centery')) == 'number') this.centery = this.Get('chart.centery');
        if (typeof(this.Get('chart.radius')) == 'number')  this.radius = this.Get('chart.radius');

        /**
        * Parse the colors. This allows for simple gradient syntax
        */
        if (!this.colorsParsed) {
            this.parseColors();
            
            // Don't want to do this again
            this.colorsParsed = true;
        }


        // This has to be in the constructor
        this.centerpinRadius = 0.16 * this.radius;
        
        if (typeof(this.Get('chart.centerpin.radius')) == 'number') {
            this.centerpinRadius = this.Get('chart.centerpin.radius');
        }



        /**
        * Setup the context menu if required
        */
        if (this.Get('chart.contextmenu')) {
            RGraph.ShowContext(this);
        }



        // DRAW THE CHART HERE
        this.DrawBackGround();
        this.DrawGradient();
        this.DrawColorBands();
        this.DrawSmallTickmarks();
        this.DrawMediumTickmarks();
        this.DrawBigTickmarks();
        this.DrawLabels();
        this.DrawTopTitle();
        this.DrawBottomTitle();

        if (typeof(this.value) == 'object') {
            for (var i=0; i<this.value.length; ++i) {
                this.DrawNeedle(this.value[i], this.Get('chart.needle.colors')[i], i);
            }
        } else {
            this.DrawNeedle(this.value, this.Get('chart.needle.colors')[0], 0);
        }

        this.DrawCenterpin();
        
        /**
        * This function enables resizing
        */
        if (this.Get('chart.resizable')) {
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
    RGraph.Gauge.prototype.DrawBackGround = function ()
    {
        // Shadow //////////////////////////////////////////////
        if (this.Get('chart.shadow')) {
            RGraph.SetShadow(this, this.Get('chart.shadow.color'), this.Get('chart.shadow.offsetx'), this.Get('chart.shadow.offsety'), this.Get('chart.shadow.blur'));
        }
        
        this.context.beginPath();
            this.context.fillStyle = this.Get('chart.background.color');
            //this.context.moveTo(this.centerx, this.centery)
            this.context.arc(this.centerx, this.centery, this.radius, 0, TWOPI, 0);
        this.context.fill();
        
        // Turn off the shadow
        RGraph.NoShadow(this);
        // Shadow //////////////////////////////////////////////


        var grad = this.context.createRadialGradient(this.centerx + 50, this.centery - 50, 0, this.centerx + 50, this.centery - 50, 150);
        grad.addColorStop(0, '#eee');
        grad.addColorStop(1, 'white');

        var borderWidth = this.Get('chart.border.width');

        this.context.beginPath();
            this.context.fillStyle = this.Get('chart.background.color');
            this.context.arc(this.centerx, this.centery, this.radius, 0, TWOPI, 0);
        this.context.fill();

        /**
        * Draw the gray circle
        */
        this.context.beginPath();
            this.context.fillStyle = this.Get('chart.border.outer');
            this.context.arc(this.centerx, this.centery, this.radius, 0, TWOPI, 0);
        this.context.fill();

        /**
        * Draw the light gray inner border
        */
        this.context.beginPath();
            this.context.fillStyle = this.Get('chart.border.inner');
            this.context.arc(this.centerx, this.centery, this.radius - borderWidth, 0, TWOPI, 0);
        this.context.fill();



        // Draw the white circle inner border
        this.context.beginPath();
            this.context.fillStyle = this.properties['chart.background.color'];
            this.context.arc(this.centerx, this.centery, this.radius - borderWidth - 4, 0, TWOPI, 0);
        this.context.fill();



        // Draw the circle background. Can be any colour now.
        this.context.beginPath();
            this.context.fillStyle = this.Get('chart.background.color');
            this.context.arc(this.centerx, this.centery, this.radius - borderWidth - 4, 0, TWOPI, 0);
        this.context.fill();

        if (this.Get('chart.background.gradient')) {
            // Draw a partially transparent gradient that sits on top of the background
            this.context.beginPath();
                this.context.fillStyle = RGraph.RadialGradient(this,
                                                               this.centerx,
                                                               this.centery,
                                                               0,
                                                               this.centerx,
                                                               this.centery,
                                                               this.radius,
                                                               'rgba(255,255,255,0.4)',
                                                               'rgba(255,255,255,0.1)');
                this.context.arc(this.centerx, this.centery, this.radius - borderWidth - 4, 0, TWOPI, 0);
            this.context.fill();
        }



        // Draw a black border around the chart
        this.context.beginPath();
            this.context.strokeStyle = this.Get('chart.border.outline');
            this.context.arc(this.centerx, this.centery, this.radius, 0, TWOPI, 0);
        this.context.stroke();
    }


    /**
    * This function draws the smaller tickmarks
    */
    RGraph.Gauge.prototype.DrawSmallTickmarks = function ()
    {
        var numTicks = this.Get('chart.tickmarks.small');
        this.context.lineWidth = 1;

        for (var i=0; i<=numTicks; ++i) {
            this.context.beginPath();
                this.context.strokeStyle = this.Get('chart.tickmarks.small.color');
                var a = (((this.endAngle - this.startAngle) / numTicks) * i) + this.startAngle;
                this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10, a, a + 0.00001, 0);
                this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10 - 5, a, a + 0.00001, 0);
            this.context.stroke();
        }
    }


    /**
    * This function draws the medium sized tickmarks
    */
    RGraph.Gauge.prototype.DrawMediumTickmarks = function ()
    {
        if (this.Get('chart.tickmarks.medium')) {

            var numTicks = this.Get('chart.tickmarks.medium');
            this.context.lineWidth = 3;
            this.context.lineCap   = 'round';
            this.context.strokeStyle = this.Get('chart.tickmarks.medium.color');
    
            for (var i=0; i<=numTicks; ++i) {
                this.context.beginPath();
                    var a = (((this.endAngle - this.startAngle) / numTicks) * i) + this.startAngle + (((this.endAngle - this.startAngle) / (2 * numTicks)));
                    
                    if (a > this.startAngle && a< this.endAngle) {
                        this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10, a, a + 0.00001, 0);
                        this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10 - 6, a, a + 0.00001, 0);
                    }
                this.context.stroke();
            }
        }
    }


    /**
    * This function draws the large, bold tickmarks
    */
    RGraph.Gauge.prototype.DrawBigTickmarks = function ()
    {
        var numTicks = this.Get('chart.tickmarks.big');
        this.context.lineWidth = 3;
        this.context.lineCap   = 'round';

        for (var i=0; i<=numTicks; ++i) {
            this.context.beginPath();
                this.context.strokeStyle = this.Get('chart.tickmarks.big.color');
                var a = (((this.endAngle - this.startAngle) / numTicks) * i) + this.startAngle;
                this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10, a, a + 0.00001, 0);
                this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10 - 10, a, a + 0.00001, 0);
            this.context.stroke();
        }
    }


    /**
    * This function draws the centerpin
    */
    RGraph.Gauge.prototype.DrawCenterpin = function ()
    {
        var offset = 6;

        var grad = this.context.createRadialGradient(this.centerx + offset, this.centery - offset, 0, this.centerx + offset, this.centery - offset, 25);
        grad.addColorStop(0, '#ddf');
        grad.addColorStop(1, this.Get('chart.centerpin.color'));

        this.context.beginPath();
            this.context.fillStyle = grad;
            this.context.arc(this.centerx, this.centery, this.centerpinRadius, 0, TWOPI, 0);
        this.context.fill();
    }


    /**
    * This function draws the labels
    */
    RGraph.Gauge.prototype.DrawLabels = function ()
    {
        this.context.fillStyle = this.Get('chart.text.color');
        var font = this.Get('chart.text.font');
        var size = this.Get('chart.text.size');
        var num  = this.properties['chart.labels.specific'] ? (this.properties['chart.labels.specific'].length - 1) : this.Get('chart.labels.count');

        this.context.beginPath();
            for (var i=0; i<=num; ++i) {
                var hyp = (this.radius - 25 - this.Get('chart.border.width')) - this.properties['chart.labels.offset'];
                var a   = (this.endAngle - this.startAngle) / num
                    a   = this.startAngle + (i * a);
                    a  -= HALFPI;

                var x = this.centerx - (Math.sin(a) * hyp);
                var y = this.centery + (Math.cos(a) * hyp);

                var hAlign = x > this.centerx ? 'right' : 'left';
                var vAlign = y > this.centery ? 'bottom' : 'top';
                
                // This handles the label alignment when the label is on a PI/HALFPI boundary
                if (a == HALFPI) {
                    vAlign = 'center';
                } else if (a == PI) {
                    hAlign = 'center';
                } else if (a == (HALFPI + PI) ) {
                    vAlign = 'center';
                }
                
                /**
                * Can now force center alignment
                */
                if (this.properties['chart.labels.centered']) {
                    hAlign = 'center';
                    vAlign = 'center';
                }

                RGraph.Text(this.context,
                            font,
                            size,
                            x,
                            y,
                            this.properties['chart.labels.specific'] ? this.properties['chart.labels.specific'][i] : RGraph.number_format(this, (((this.max - this.min) * (i / num)) + this.min).toFixed(this.Get('chart.scale.decimals')), this.Get('chart.units.pre'), this.Get('chart.units.post')),
                            vAlign,
                            hAlign);
            }
        this.context.fill();


        /**
        * Draw the textual value if requested
        */
        if (this.Get('chart.value.text')) {

            var x = this.centerx;
            var y = this.centery + (this.Get('chart.value.text.y.pos') * this.radius);
            
            var units_pre  = typeof(this.Get('chart.value.text.units.pre')) == 'string' ? this.Get('chart.value.text.units.pre') : this.Get('chart.units.pre');
            var units_post = typeof(this.Get('chart.value.text.units.post')) == 'string' ? this.Get('chart.value.text.units.post') : this.Get('chart.units.post');
        
            this.context.beginPath();
                RGraph.Text(this.context,
                            font,
                            size + 2,
                            x,
                            y,
                            RGraph.number_format(this, this.value.toFixed(this.Get('chart.scale.decimals')), units_pre, units_post),
                            'center',
                            'center',
                            true,
                            null,
                            'white');
            this.context.fill();
        }
    }


    /**
    * This function draws the top title
    */
    RGraph.Gauge.prototype.DrawTopTitle = function ()
    {
        var x = this.centerx;
        var y = this.centery - 25;
        
        // Totally override the calculated positioning
        if (typeof(this.Get('chart.title.top.pos')) == 'number') {
            y = this.centery - (this.radius * this.Get('chart.title.top.pos'));
        }

        if (this.Get('chart.title.top')) {
            this.context.fillStyle = this.Get('chart.title.top.color');

            this.context.beginPath();
                RGraph.Text(this.context,
                            this.Get('chart.title.top.font'),
                            this.Get('chart.title.top.size'),
                            x,
                            y,
                            String(this.Get('chart.title.top')),
                            'bottom',
                            'center',
                            null,
                            null,
                            null,
                            this.Get('chart.title.top.bold'));
            this.context.fill();
        }
    }


    /**
    * This function draws the bottom title
    */
    RGraph.Gauge.prototype.DrawBottomTitle = function ()
    {
        var x = this.centerx;
        var y = this.centery + this.centerpinRadius + 10;

        // Totally override the calculated positioning
        if (typeof(this.Get('chart.title.bottom.pos')) == 'number') {
            y = this.centery + (this.radius * this.Get('chart.title.bottom.pos'));
        }

        if (this.Get('chart.title.bottom')) {
            this.context.fillStyle = this.Get('chart.title.bottom.color');

            this.context.beginPath();
                RGraph.Text(this.context,
                            this.Get('chart.title.bottom.font'),
                            this.Get('chart.title.bottom.size'),
                            x,
                            y,
                            String(this.Get('chart.title.bottom')),
                            'top',
                            'center',
                            null,
                            null,
                            null,
                            this.Get('chart.title.bottom.bold'));
            this.context.fill();
        }
    }


    /**
    * This function draws the Needle
    * 
    * @param number value The value to draw the needle for
    */
    RGraph.Gauge.prototype.DrawNeedle = function (value, color, index)
    {
        var type = this.Get('chart.needle.type');

        this.context.lineWidth   = 0.5;
        this.context.strokeStyle = 'gray';
        this.context.fillStyle   = color;

        var angle = (this.endAngle - this.startAngle) * ((value - this.min) / (this.max - this.min));
            angle += this.startAngle;


        // Work out the size of the needle
        if (   typeof(this.Get('chart.needle.size')) == 'object'
            && this.Get('chart.needle.size')
            && typeof(this.Get('chart.needle.size')[index]) == 'number') {

            var size = this.Get('chart.needle.size')[index];

        } else if (typeof(this.Get('chart.needle.size')) == 'number') {
            var size = this.Get('chart.needle.size');

        } else {
            var size = this.radius - 25 - this.Get('chart.border.width');
        }

        

        if (type == 'line') {

            this.context.beginPath();
            
                this.context.lineWidth = 7;
                this.context.strokeStyle = color;
                
                this.context.arc(this.centerx,
                                 this.centery,
                                 size,
                                 angle,
                                 angle + 0.0001,
                                 false);
                
                this.context.lineTo(this.centerx, this.centery);
                
                if (this.Get('chart.needle.tail')) {
                    this.context.arc(this.centerx, this.centery, this.radius * 0.2  , angle + PI, angle + 0.00001 + PI, false);
                }
                
                this.context.lineTo(this.centerx, this.centery);
    
            this.context.stroke();
            //this.context.fill();

        } else {
    
            this.context.beginPath();
                this.context.arc(this.centerx, this.centery, size, angle, angle + 0.00001, false);
                this.context.arc(this.centerx, this.centery, this.centerpinRadius * 0.5, angle + HALFPI, angle + 0.00001 + HALFPI, false);
                
                if (this.Get('chart.needle.tail')) {
                    this.context.arc(this.centerx, this.centery, this.radius * 0.2  , angle + PI, angle + 0.00001 + PI, false);
                }
    
                this.context.arc(this.centerx, this.centery, this.centerpinRadius * 0.5, angle - HALFPI, angle - 0.00001 - HALFPI, false);
            this.context.stroke();
            this.context.fill();
            
            /**
            * Store the angle in an object variable
            */
            this.angle = angle;
        }
    }


    /**
    * This draws the green background to the tickmarks
    */
    RGraph.Gauge.prototype.DrawColorBands = function ()
    {
        if (RGraph.is_array(this.Get('chart.colors.ranges'))) {

            var ranges = this.Get('chart.colors.ranges');

            for (var i=0; i<ranges.length; ++i) {

                //this.context.strokeStyle = this.Get('chart.strokestyle') ? this.Get('chart.strokestyle') : ranges[i][2];
                this.context.fillStyle = ranges[i][2];
                this.context.lineWidth = 0;//this.Get('chart.linewidth.segments');

                this.context.beginPath();
                    this.context.arc(this.centerx,
                                     this.centery,
                                     this.radius - 10 - this.Get('chart.border.width'),
                                     (((ranges[i][0] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
                                     (((ranges[i][1] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
                                     false);

                    this.context.arc(this.centerx,
                                     this.centery,
                                     this.radius - 20 - this.Get('chart.border.width'),
                                     (((ranges[i][1] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
                                     (((ranges[i][0] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
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
        
        var greenStart = this.startAngle;
        var greenEnd   = this.startAngle + (this.endAngle - this.startAngle) * ((this.Get('chart.green.end') - this.min) / (this.max - this.min))

        this.context.beginPath();
            this.context.arc(this.centerx, this.centery, this.radius - 10 - this.Get('chart.border.width'), greenStart, greenEnd, false);
            this.context.arc(this.centerx, this.centery, this.radius - 20 - this.Get('chart.border.width'), greenEnd, greenStart, true);
        this.context.fill();


        /**
        * Draw the YELLOW region
        */
        this.context.strokeStyle = this.Get('chart.yellow.color');
        this.context.fillStyle = this.Get('chart.yellow.color');
        
        var yellowStart = greenEnd;
        var yellowEnd   = this.startAngle + (this.endAngle - this.startAngle) * ((this.Get('chart.red.start') - this.min) / (this.max - this.min))

        this.context.beginPath();
            this.context.arc(this.centerx, this.centery, this.radius - 10 - this.Get('chart.border.width'), yellowStart, yellowEnd, false);
            this.context.arc(this.centerx, this.centery, this.radius - 20 - this.Get('chart.border.width'), yellowEnd, yellowStart, true);
        this.context.fill();


        /**
        * Draw the RED region
        */
        this.context.strokeStyle = this.Get('chart.red.color');
        this.context.fillStyle = this.Get('chart.red.color');
        
        var redStart = yellowEnd;
        var redEnd   = this.startAngle + (this.endAngle - this.startAngle) * ((this.max - this.min) / (this.max - this.min))

        this.context.beginPath();
            this.context.arc(this.centerx, this.centery, this.radius - 10 - this.Get('chart.border.width'), redStart, redEnd, false);
            this.context.arc(this.centerx, this.centery, this.radius - 20 - this.Get('chart.border.width'), redEnd, redStart, true);
        this.context.fill();
    }



    /**
    * A placeholder function
    * 
    * @param object The event object
    */
    RGraph.Gauge.prototype.getShape = function (e)
    {
    }



    /**
    * A getValue method
    * 
    * @param object e An event object
    */
    RGraph.Gauge.prototype.getValue = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];

        var angle = RGraph.getAngleByXY(this.centerx, this.centery, mouseX, mouseY);

        if (angle >= 0 && angle <= HALFPI) {
            angle += TWOPI;
        }

        var value = ((angle - this.startAngle) / (this.endAngle - this.startAngle)) * (this.max - this.min);
            value = value + this.min;

        if (value < this.min) {
            value = this.min
        }

        if (value > this.max) {
            value = this.max
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
    RGraph.Gauge.prototype.getObjectByXY = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);

        if (
               mouseXY[0] > (this.centerx - this.radius)
            && mouseXY[0] < (this.centerx + this.radius)
            && mouseXY[1] > (this.centery - this.radius)
            && mouseXY[1] < (this.centery + this.radius)
            && RGraph.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]) <= this.radius
            ) {

            return this;
        }
    }



    /**
    * This draws the gradient that goes around the Gauge chart
    */
    RGraph.Gauge.prototype.DrawGradient = function ()
    {
        if (this.Get('chart.border.gradient')) {
            var context = this.context;
            
            context.beginPath();
    
                var grad = context.createRadialGradient(this.centerx, this.centery, this.radius, this.centerx, this.centery, this.radius - 15);
                grad.addColorStop(0, 'gray');
                grad.addColorStop(1, 'white');
    
                context.fillStyle = grad;
                context.arc(this.centerx, this.centery, this.radius, 0, TWOPI, false)
                context.arc(this.centerx, this.centery, this.radius - 15, TWOPI,0, true)
            context.fill();
        }
    }



    /**
    * This method handles the adjusting calculation for when the mouse is moved
    * 
    * @param object e The event object
    */
    RGraph.Gauge.prototype.Adjusting_mousemove = function (e)
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
    * This method returns an appropriate angle for the given value (in RADIANS)
    * 
    * @param number value The value to get the angle for
    */
    RGraph.Gauge.prototype.getAngle = function (value)
    {
        // Higher than max
        if (value > this.max || value < this.min) {
            return null;
        }

        //var value = ((angle - this.startAngle) / (this.endAngle - this.startAngle)) * (this.max - this.min);
            //value = value + this.min;

        var angle = (((value - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle;
        
        return angle;
    }



    /**
    * This allows for easy specification of gradients. Could optimise this not to repeatedly call parseSingleColors()
    */
    RGraph.Gauge.prototype.parseColors = function ()
    {
        this.properties['chart.background.color'] = this.parseSingleColorForGradient(this.properties['chart.background.color']);
        this.properties['chart.red.color']        = this.parseSingleColorForGradient(this.properties['chart.red.color']);
        this.properties['chart.yellow.color']     = this.parseSingleColorForGradient(this.properties['chart.yellow.color']);
        this.properties['chart.green.color']      = this.parseSingleColorForGradient(this.properties['chart.green.color']);
        this.properties['chart.border.inner']     = this.parseSingleColorForGradient(this.properties['chart.border.inner']);
        this.properties['chart.border.outer']     = this.parseSingleColorForGradient(this.properties['chart.border.outer']);
        
        // Parse the chart.color.ranges value
        if (this.properties['chart.colors.ranges']) {
            
            var ranges = this.properties['chart.colors.ranges'];

            for (var i=0; i<ranges.length; ++i) {
                ranges[i][2] = this.parseSingleColorForGradient(ranges[i][2]);
            }
        }

        // Parse the chart.needle.colors value
        if (this.properties['chart.needle.colors']) {
            
            var colors = this.properties['chart.needle.colors'];

            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForGradient(colors[i]);
            }
        }
    }



    /**
    * This parses a single color value
    */
    RGraph.Gauge.prototype.parseSingleColorForGradient = function (color)
    {        
        if (!color || typeof(color) != 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {
            
            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = this.context.createRadialGradient(this.centerx,this.centery,0,this.centerx,this.centery,this.radius);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }
            
        return grad ? grad : color;
    }