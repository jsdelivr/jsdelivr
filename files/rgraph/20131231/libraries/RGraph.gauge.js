    /**
    * o-------------------------------------------------------------------------------o
    * | This file is part of the RGraph package. RGraph is Free software, licensed    |
    * | under the MIT license - so it's free to use for all purposes. Extended        |
    * | support is available if required and donations are always welcome! You can    |
    * | read more here:                                                               |
    * |                         http://www.rgraph.net/support                         |
    * o-------------------------------------------------------------------------------o
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
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
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
        this.coordsText        = [];

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




        /*
        * Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        * done already
        */
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            
            this.canvas.__rgraph_aa_translated__ = true;
        }




        ///////////////////////////////// SHORT PROPERTIES /////////////////////////////////




        var RG   = RGraph;
        var ca   = this.canvas;
        var co   = ca.getContext('2d');
        var prop = this.properties;
        //var $jq  = jQuery;




        //////////////////////////////////// METHODS ///////////////////////////////////////




        /**
        * An all encompassing accessor
        * 
        * @param string name The name of the property
        * @param mixed value The value of the property
        */
        this.Set = function (name, value)
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
    
            prop[name] = value;
    
            return this;
        }




        /**
        * An all encompassing accessor
        * 
        * @param string name The name of the property
        */
        this.Get = function (name)
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
    
            return prop[name];
        }




        /**
        * The function you call to draw the line chart
        * 
        * @param bool An optional bool used internally to ditinguish whether the
        *             line chart is being called by the bar chart
        */
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.FireCustomEvent(this, 'onbeforedraw');
    
    
    
            /**
            * Store the value (for animation primarily
            */
            this.currentValue = this.value;
    
    
            /**
            * This is new in May 2011 and facilitates indiviual gutter settings,
            * eg chart.gutter.left
            */
            this.gutterLeft   = prop['chart.gutter.left'];
            this.gutterRight  = prop['chart.gutter.right'];
            this.gutterTop    = prop['chart.gutter.top'];
            this.gutterBottom = prop['chart.gutter.bottom'];
            
            this.centerx = ((ca.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;
            this.centery = ((ca.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop;
            this.radius  = Math.min(
                                    ((ca.width - this.gutterLeft - this.gutterRight) / 2),
                                    ((ca.height - this.gutterTop - this.gutterBottom) / 2)
                                   );
            this.startAngle = prop['chart.angles.start'] ? prop['chart.angles.start'] : (HALFPI / 3) + HALFPI;
            this.endAngle   = prop['chart.angles.end'] ? prop['chart.angles.end'] : TWOPI + HALFPI - (HALFPI / 3);
    
    
    
            /**
            * You can now override the positioning and radius if you so wish.
            */
            if (typeof(prop['chart.centerx']) == 'number') this.centerx = prop['chart.centerx'];
            if (typeof(prop['chart.centery']) == 'number') this.centery = prop['chart.centery'];
            if (typeof(prop['chart.radius']) == 'number')  this.radius  = prop['chart.radius'];
    
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
            
            if (typeof(prop['chart.centerpin.radius']) == 'number') {
                this.centerpinRadius = prop['chart.centerpin.radius'];
            }
    
    
    
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
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
                    this.DrawNeedle(this.value[i], prop['chart.needle.colors'][i], i);
                }
            } else {
                this.DrawNeedle(this.value, prop['chart.needle.colors'][0], 0);
            }
    
            this.DrawCenterpin();
            
            /**
            * This function enables resizing
            */
            if (prop['chart.resizable']) {
                RG.AllowResizing(this);
            }
    
    
            /**
            * This installs the event listeners
            */
            RG.InstallEventListeners(this);
    
            
            /**
            * Fire the RGraph ondraw event
            */
            RG.FireCustomEvent(this, 'ondraw');
            
            return this;
        }




        /**
        * Draw the background
        */
        this.DrawBackGround = function ()
        {
            // Shadow //////////////////////////////////////////////
            if (prop['chart.shadow']) {
                RG.SetShadow(this, prop['chart.shadow.color'], prop['chart.shadow.offsetx'], prop['chart.shadow.offsety'], prop['chart.shadow.blur']);
            }
            
            co.beginPath();
                co.fillStyle = prop['chart.background.color'];
                //co.moveTo(this.centerx, this.centery)
                co.arc(this.centerx, this.centery, this.radius, 0, TWOPI, 0);
            co.fill();
            
            // Turn off the shadow
            RG.NoShadow(this);
            // Shadow //////////////////////////////////////////////
    
    
            var grad = co.createRadialGradient(this.centerx + 50, this.centery - 50, 0, this.centerx + 50, this.centery - 50, 150);
            grad.addColorStop(0, '#eee');
            grad.addColorStop(1, 'white');
    
            var borderWidth = prop['chart.border.width'];
    
            co.beginPath();
                co.fillStyle = prop['chart.background.color'];
                co.arc(this.centerx, this.centery, this.radius, 0, TWOPI, 0);
            co.fill();
    
            /**
            * Draw the gray circle
            */
            co.beginPath();
                co.fillStyle = prop['chart.border.outer'];
                co.arc(this.centerx, this.centery, this.radius, 0, TWOPI, 0);
            co.fill();
    
            /**
            * Draw the light gray inner border
            */
            co.beginPath();
                co.fillStyle = prop['chart.border.inner'];
                co.arc(this.centerx, this.centery, this.radius - borderWidth, 0, TWOPI, 0);
            co.fill();
    
    
    
            // Draw the white circle inner border
            co.beginPath();
                co.fillStyle = prop['chart.background.color'];
                co.arc(this.centerx, this.centery, this.radius - borderWidth - 4, 0, TWOPI, 0);
            co.fill();
    
    
    
            // Draw the circle background. Can be any colour now.
            co.beginPath();
                co.fillStyle = prop['chart.background.color'];
                co.arc(this.centerx, this.centery, this.radius - borderWidth - 4, 0, TWOPI, 0);
            co.fill();
    
            if (prop['chart.background.gradient']) {

                // Draw a partially transparent gradient that sits on top of the background
                co.beginPath();
                    co.fillStyle = RG.RadialGradient(this,
                                                     this.centerx,
                                                     this.centery,
                                                     0,
                                                     this.centerx,
                                                     this.centery,
                                                     this.radius,
                                                     'rgba(255,255,255,0.6)',
                                                     'rgba(255,255,255,0.1)');
                    co.arc(this.centerx, this.centery, this.radius - borderWidth - 4, 0, TWOPI, 0);
                co.fill();
            }
    
    
    
            // Draw a black border around the chart
            co.beginPath();
                co.strokeStyle = prop['chart.border.outline'];
                co.arc(this.centerx, this.centery, this.radius, 0, TWOPI, 0);
            co.stroke();
        }




        /**
        * This function draws the smaller tickmarks
        */
        this.DrawSmallTickmarks = function ()
        {
            var numTicks = prop['chart.tickmarks.small'];
            co.lineWidth = 1;
    
            for (var i=0; i<=numTicks; ++i) {
                co.beginPath();
                    co.strokeStyle = prop['chart.tickmarks.small.color'];
                    var a = (((this.endAngle - this.startAngle) / numTicks) * i) + this.startAngle;
                    co.arc(this.centerx, this.centery, this.radius - prop['chart.border.width'] - 10, a, a + 0.00001, 0);
                    co.arc(this.centerx, this.centery, this.radius - prop['chart.border.width'] - 10 - 5, a, a + 0.00001, 0);
                co.stroke();
            }
        }




        /**
        * This function draws the medium sized tickmarks
        */
        this.DrawMediumTickmarks = function ()
        {
            if (prop['chart.tickmarks.medium']) {
    
                var numTicks = prop['chart.tickmarks.medium'];
                co.lineWidth = 3;
                co.lineCap   = 'round';
                co.strokeStyle = prop['chart.tickmarks.medium.color'];
        
                for (var i=0; i<=numTicks; ++i) {
                    co.beginPath();
                        var a = (((this.endAngle - this.startAngle) / numTicks) * i) + this.startAngle + (((this.endAngle - this.startAngle) / (2 * numTicks)));
                        
                        if (a > this.startAngle && a< this.endAngle) {
                            co.arc(this.centerx, this.centery, this.radius - prop['chart.border.width'] - 10, a, a + 0.00001, 0);
                            co.arc(this.centerx, this.centery, this.radius - prop['chart.border.width'] - 10 - 6, a, a + 0.00001, 0);
                        }
                    co.stroke();
                }
            }
        }




        /**
        * This function draws the large, bold tickmarks
        */
        this.DrawBigTickmarks = function ()
        {
            var numTicks = prop['chart.tickmarks.big'];
            co.lineWidth = 3;
            co.lineCap   = 'round';
    
            for (var i=0; i<=numTicks; ++i) {
                co.beginPath();
                    co.strokeStyle = prop['chart.tickmarks.big.color'];
                    var a = (((this.endAngle - this.startAngle) / numTicks) * i) + this.startAngle;
                    co.arc(this.centerx, this.centery, this.radius - prop['chart.border.width'] - 10, a, a + 0.00001, 0);
                    co.arc(this.centerx, this.centery, this.radius - prop['chart.border.width'] - 10 - 10, a, a + 0.00001, 0);
                co.stroke();
            }
        }




        /**
        * This function draws the centerpin
        */
        this.DrawCenterpin = function ()
        {
            var offset = 6;
    
            var grad = co.createRadialGradient(this.centerx + offset, this.centery - offset, 0, this.centerx + offset, this.centery - offset, 25);
            grad.addColorStop(0, '#ddf');
            grad.addColorStop(1, prop['chart.centerpin.color']);
    
            co.beginPath();
                co.fillStyle = grad;
                co.arc(this.centerx, this.centery, this.centerpinRadius, 0, TWOPI, 0);
            co.fill();
        }




        /**
        * This function draws the labels
        */
        this.DrawLabels = function ()
        {
            co.fillStyle = prop['chart.text.color'];
            var font = prop['chart.text.font'];
            var size = prop['chart.text.size'];
            var num  = prop['chart.labels.specific'] ? (prop['chart.labels.specific'].length - 1) : prop['chart.labels.count'];
    
            co.beginPath();
                for (var i=0; i<=num; ++i) {
                    var hyp = (this.radius - 25 - prop['chart.border.width']) - prop['chart.labels.offset'];
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
                    if (prop['chart.labels.centered']) {
                        hAlign = 'center';
                        vAlign = 'center';
                    }
    
    
                    RG.Text2(this, {'font':font,
                                    'size':size,
                                    'x':x,
                                    'y':y,
                                    'text':prop['chart.labels.specific'] ? prop['chart.labels.specific'][i] : RG.number_format(this, (((this.max - this.min) * (i / num)) + this.min).toFixed(prop['chart.scale.decimals']), prop['chart.units.pre'], prop['chart.units.post']),
                                    'halign':hAlign,
                                    'valign':vAlign,
                                    'tag': prop['chart.labels.specific'] ? 'labels.specific' : 'labels'
                                   });
                }
            co.fill();
    
    
            /**
            * Draw the textual value if requested
            */
            if (prop['chart.value.text']) {
    
                var x = this.centerx;
                var y = this.centery + (prop['chart.value.text.y.pos'] * this.radius);
                
                var units_pre  = typeof(prop['chart.value.text.units.pre']) == 'string' ? prop['chart.value.text.units.pre'] : prop['chart.units.pre'];
                var units_post = typeof(prop['chart.value.text.units.post']) == 'string' ? prop['chart.value.text.units.post'] : prop['chart.units.post'];
            
                RG.Text2(this, {'font':font,
                               'size':size + 2,
                               'x':x,
                               'y':y,
                               'text':RG.number_format(this, this.value.toFixed(prop['chart.scale.decimals']), units_pre, units_post),
                               'halign':'center',
                               'valign':'center',
                               'bounding':true,
                               'boundingFill':'white',
                               'tag': 'value.text'
                              });
            }
        }




        /**
        * This function draws the top title
        */
        this.DrawTopTitle = function ()
        {
            var x = this.centerx;
            var y = this.centery - 25;
            
            // Totally override the calculated positioning
            if (typeof(prop['chart.title.top.pos']) == 'number') {
                y = this.centery - (this.radius * prop['chart.title.top.pos']);
            }
    
            if (prop['chart.title.top']) {
                co.fillStyle = prop['chart.title.top.color'];
                RG.Text2(this, {'font':prop['chart.title.top.font'],
                                'size':prop['chart.title.top.size'],
                                'x':x,
                                'y':y,
                                'text':String(prop['chart.title.top']),
                                'halign':'center',
                                'valign':'bottom',
                                'bold':prop['chart.title.top.bold'],
                                'tag': 'title.top'
                               });
            }
        }




        /**
        * This function draws the bottom title
        */
        this.DrawBottomTitle = function ()
        {
            var x = this.centerx;
            var y = this.centery + this.centerpinRadius + 10;
    
            // Totally override the calculated positioning
            if (typeof(prop['chart.title.bottom.pos']) == 'number') {
                y = this.centery + (this.radius * prop['chart.title.bottom.pos']);
            }
    
            if (prop['chart.title.bottom']) {
                co.fillStyle = prop['chart.title.bottom.color'];
    
                RG.Text2(this, {'font':prop['chart.title.bottom.font'],
                                'size':prop['chart.title.bottom.size'],
                                'x':x,
                                'y':y,
                                'text':String(prop['chart.title.bottom']),
                                'halign':'center',
                                'valign':'top',
                                'bold':prop['chart.title.bottom.bold'],
                                'tag': 'title.bottom'
                               });
            }
        }




        /**
        * This function draws the Needle
        * 
        * @param number value The value to draw the needle for
        */
        this.DrawNeedle = function (value, color, index)
        {
            var type = prop['chart.needle.type'];
    
            co.lineWidth   = 0.5;
            co.strokeStyle = 'gray';
            co.fillStyle   = color;
    
            var angle = (this.endAngle - this.startAngle) * ((value - this.min) / (this.max - this.min));
                angle += this.startAngle;
    
    
            // Work out the size of the needle
            if (   typeof(prop['chart.needle.size']) == 'object'
                && prop['chart.needle.size']
                && typeof(prop['chart.needle.size'][index]) == 'number') {
    
                var size = prop['chart.needle.size'][index];
    
            } else if (typeof(prop['chart.needle.size']) == 'number') {
                var size = prop['chart.needle.size'];
    
            } else {
                var size = this.radius - 25 - prop['chart.border.width'];
            }
    
            
    
            if (type == 'line') {
    
                co.beginPath();
                
                    co.lineWidth = 7;
                    co.strokeStyle = color;
                    
                    co.arc(this.centerx,
                                     this.centery,
                                     size,
                                     angle,
                                     angle + 0.0001,
                                     false);
                    
                    co.lineTo(this.centerx, this.centery);
                    
                    if (prop['chart.needle.tail']) {
                        co.arc(this.centerx, this.centery, this.radius * 0.2  , angle + PI, angle + 0.00001 + PI, false);
                    }
                    
                    co.lineTo(this.centerx, this.centery);
        
                co.stroke();
                //co.fill();
    
            } else {
        
                co.beginPath();
                    co.arc(this.centerx, this.centery, size, angle, angle + 0.00001, false);
                    co.arc(this.centerx, this.centery, this.centerpinRadius * 0.5, angle + HALFPI, angle + 0.00001 + HALFPI, false);
                    
                    if (prop['chart.needle.tail']) {
                        co.arc(this.centerx, this.centery, this.radius * 0.2  , angle + PI, angle + 0.00001 + PI, false);
                    }
        
                    co.arc(this.centerx, this.centery, this.centerpinRadius * 0.5, angle - HALFPI, angle - 0.00001 - HALFPI, false);
                co.stroke();
                co.fill();
                
                /**
                * Store the angle in an object variable
                */
                this.angle = angle;
            }
        }




        /**
        * This draws the green background to the tickmarks
        */
        this.DrawColorBands = function ()
        {
            if (RG.is_array(prop['chart.colors.ranges'])) {
    
                var ranges = prop['chart.colors.ranges'];
    
                for (var i=0; i<ranges.length; ++i) {
    
                    //co.strokeStyle = prop['chart.strokestyle'] ? prop['chart.strokestyle'] : ranges[i][2];
                    co.fillStyle = ranges[i][2];
                    co.lineWidth = 0;//prop['chart.linewidth.segments'];
    
                    co.beginPath();
                        co.arc(this.centerx,
                                         this.centery,
                                         this.radius - 10 - prop['chart.border.width'],
                                         (((ranges[i][0] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
                                         (((ranges[i][1] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
                                         false);
    
                        co.arc(this.centerx,
                                         this.centery,
                                         this.radius - 20 - prop['chart.border.width'],
                                         (((ranges[i][1] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
                                         (((ranges[i][0] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
                                         true);
                    co.closePath();
                    co.fill();
                }
    
                return;
            }
    
    
    
    
            /**
            * Draw the GREEN region
            */
            co.strokeStyle = prop['chart.green.color'];
            co.fillStyle = prop['chart.green.color'];
            
            var greenStart = this.startAngle;
            var greenEnd   = this.startAngle + (this.endAngle - this.startAngle) * ((prop['chart.green.end'] - this.min) / (this.max - this.min))
    
            co.beginPath();
                co.arc(this.centerx, this.centery, this.radius - 10 - prop['chart.border.width'], greenStart, greenEnd, false);
                co.arc(this.centerx, this.centery, this.radius - 20 - prop['chart.border.width'], greenEnd, greenStart, true);
            co.fill();
    
    
    
    
    
            /**
            * Draw the YELLOW region
            */
            co.strokeStyle = prop['chart.yellow.color'];
            co.fillStyle = prop['chart.yellow.color'];
            
            var yellowStart = greenEnd;
            var yellowEnd   = this.startAngle + (this.endAngle - this.startAngle) * ((prop['chart.red.start'] - this.min) / (this.max - this.min))
    
            co.beginPath();
                co.arc(this.centerx, this.centery, this.radius - 10 - prop['chart.border.width'], yellowStart, yellowEnd, false);
                co.arc(this.centerx, this.centery, this.radius - 20 - prop['chart.border.width'], yellowEnd, yellowStart, true);
            co.fill();
    
    
    
    
    
            /**
            * Draw the RED region
            */
            co.strokeStyle = prop['chart.red.color'];
            co.fillStyle = prop['chart.red.color'];
            
            var redStart = yellowEnd;
            var redEnd   = this.startAngle + (this.endAngle - this.startAngle) * ((this.max - this.min) / (this.max - this.min))
    
            co.beginPath();
                co.arc(this.centerx, this.centery, this.radius - 10 - prop['chart.border.width'], redStart, redEnd, false);
                co.arc(this.centerx, this.centery, this.radius - 20 - prop['chart.border.width'], redEnd, redStart, true);
            co.fill();
        }




        /**
        * A placeholder function
        * 
        * @param object The event object
        */
        this.getShape = function (e)
        {
        }




        /**
        * A getValue method
        * 
        * @param object e An event object
        */
        this.getValue = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
    
            var angle = RG.getAngleByXY(this.centerx, this.centery, mouseX, mouseY);
    
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
        this.getObjectByXY = function (e)
        {
            var mouseXY = RGraph.getMouseXY(e);
    
            if (
                   mouseXY[0] > (this.centerx - this.radius)
                && mouseXY[0] < (this.centerx + this.radius)
                && mouseXY[1] > (this.centery - this.radius)
                && mouseXY[1] < (this.centery + this.radius)
                && RG.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]) <= this.radius
                ) {
    
                return this;
            }
        }




        /**
        * This draws the gradient that goes around the Gauge chart
        */
        this.DrawGradient = function ()
        {
            if (prop['chart.border.gradient']) {
                
                co.beginPath();
        
                    var grad = co.createRadialGradient(this.centerx, this.centery, this.radius, this.centerx, this.centery, this.radius - 15);
                    grad.addColorStop(0, 'gray');
                    grad.addColorStop(1, 'white');
        
                    co.fillStyle = grad;
                    co.arc(this.centerx, this.centery, this.radius, 0, TWOPI, false)
                    co.arc(this.centerx, this.centery, this.radius - 15, TWOPI,0, true)
                co.fill();
            }
        }




        /**
        * This method handles the adjusting calculation for when the mouse is moved
        * 
        * @param object e The event object
        */
        this.Adjusting_mousemove = function (e)
        {
            /**
            * Handle adjusting for the Bar
            */
            if (prop['chart.adjustable'] && RG.Registry.Get('chart.adjusting') && RG.Registry.Get('chart.adjusting').uid == this.uid) {
                this.value = this.getValue(e);
                RG.Clear(this.canvas);
                RG.RedrawCanvas(this.canvas);
                RG.FireCustomEvent(this, 'onadjust');
            }
        }




        /**
        * This method returns an appropriate angle for the given value (in RADIANS)
        * 
        * @param number value The value to get the angle for
        */
        this.getAngle = function (value)
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
        this.parseColors = function ()
        {
            prop['chart.background.color'] = this.parseSingleColorForGradient(prop['chart.background.color']);
            prop['chart.red.color']        = this.parseSingleColorForGradient(prop['chart.red.color']);
            prop['chart.yellow.color']     = this.parseSingleColorForGradient(prop['chart.yellow.color']);
            prop['chart.green.color']      = this.parseSingleColorForGradient(prop['chart.green.color']);
            prop['chart.border.inner']     = this.parseSingleColorForGradient(prop['chart.border.inner']);
            prop['chart.border.outer']     = this.parseSingleColorForGradient(prop['chart.border.outer']);
            
            // Parse the chart.color.ranges value
            if (prop['chart.colors.ranges']) {
                
                var ranges = prop['chart.colors.ranges'];
    
                for (var i=0; i<ranges.length; ++i) {
                    ranges[i][2] = this.parseSingleColorForGradient(ranges[i][2]);
                }
            }
    
            // Parse the chart.needle.colors value
            if (prop['chart.needle.colors']) {
                
                var colors = prop['chart.needle.colors'];
    
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }
        }




        /**
        * This parses a single color value
        */
        this.parseSingleColorForGradient = function (color)
        {
            if (!color || typeof(color) != 'string') {
                return color;
            }
    
            if (color.match(/^gradient\((.*)\)$/i)) {
                
                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = co.createRadialGradient(this.centerx,this.centery,0,this.centerx,this.centery,this.radius);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }

            return grad ? grad : color;
        }




        /**
        * Register the object
        */
        RG.Register(this);
    }