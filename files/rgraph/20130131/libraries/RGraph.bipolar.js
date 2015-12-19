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
    * The bi-polar/age frequency constructor.
    * 
    * @param string id The id of the canvas
    * @param array  left  The left set of data points
    * @param array  right The right set of data points
    * 
    * REMEMBER If ymin is implemented you need to update the .getValue() method
    */
    RGraph.Bipolar = function (id, left, right)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'bipolar';
        this.coords            = [];
        this.coordsLeft        = [];
        this.coordsRight       = [];
        this.max               = 0;
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);

        
        // The left and right data respectively
        this.left       = left;
        this.right      = right;
        this.data       = [left, right];

        this.properties = {
            'chart.margin':                 2,
            'chart.xtickinterval':          null,
            'chart.labels':                 [],
            'chart.labels.above':           false,
            'chart.text.size':              10,
            'chart.text.color':             'black', // (Simple) gradients are not supported
            'chart.text.font':              'Arial',
            'chart.title.left':             '',
            'chart.title.right':            '',
            'chart.gutter.center':          60,
            'chart.gutter.left':            25,
            'chart.gutter.right':           25,
            'chart.gutter.top':             25,
            'chart.gutter.bottom':          25,
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.colors':                 ['#0f0'],
            'chart.contextmenu':            null,
            'chart.tooltips':               null,
            'chart.tooltips.effect':         'fade',
            'chart.tooltips.css.class':      'RGraph_tooltip',
            'chart.tooltips.highlight':     true,
            'chart.tooltips.event':         'onclick',
            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',
            'chart.units.pre':              '',
            'chart.units.post':             '',
            'chart.shadow':                 false,
            'chart.shadow.color':           '#666',
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,
            'chart.shadow.blur':            3,
            'chart.annotatable':            false,
            'chart.annotate.color':         'black',
            'chart.xmax':                   null,
            'chart.scale.decimals':         null,
            'chart.scale.point':            '.',
            'chart.scale.thousand':         ',',
            'chart.axis.color':             'black',
            'chart.zoom.factor':            1.5,
            'chart.zoom.fade.in':           true,
            'chart.zoom.fade.out':          true,
            'chart.zoom.hdir':              'right',
            'chart.zoom.vdir':              'down',
            'chart.zoom.frames':            25,
            'chart.zoom.delay':             16.666,
            'chart.zoom.shadow':            true,
            'chart.zoom.background':        true,
            'chart.zoom.action':            'zoom',
            'chart.resizable':              false,
            'chart.resize.handle.adjust':   [0,0],
            'chart.resize.handle.background': null,
            'chart.strokestyle':            'rgba(0,0,0,0)',
            'chart.events.mousemove':       null,
            'chart.events.click':           null,
            'chart.linewidth':              1,
            'chart.noaxes':                 false,
            'chart.xlabels':                true,
            'chart.numyticks':              null,
            'chart.numxticks':              5
        }

        // Pad the arrays so they're the same size
        while (this.left.length < this.right.length) this.left.push(0);
        while (this.left.length > this.right.length) this.right.push(0);
        
        /**
        * Set the default for the number of Y tickmarks
        */
        this.properties['chart.numyticks'] = this.left.length;

        


        /**
        * Create the dollar objects so that functions can be added to them
        */
        var linear_data = RGraph.array_linearize(this.left, this.right);
        for (var i=0; i<linear_data.length; ++i) {
            this['$' + i] = {};
        }


        /**
        * Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        * done already
        */
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            
            this.canvas.__rgraph_aa_translated__ = true;
        }


        /**
        * Objects are now always registered so that when RGraph.Redraw()
        * is called this chart will be redrawn.
        */
        RGraph.Register(this);
    }


    /**
    * The setter
    * 
    * @param name  string The name of the parameter to set
    * @param value mixed  The value of the paraneter 
    */
    RGraph.Bipolar.prototype.Set = function (name, value)
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
    * The getter
    * 
    * @param name string The name of the parameter to get
    */
    RGraph.Bipolar.prototype.Get = function (name)
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
    * Draws the graph
    */
    RGraph.Bipolar.prototype.Draw = function ()
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


        /**
        * This is new in May 2011 and facilitates indiviual gutter settings,
        * eg chart.gutter.left
        */
        this.gutterLeft   = this.properties['chart.gutter.left'];
        this.gutterRight  = this.properties['chart.gutter.right'];
        this.gutterTop    = this.properties['chart.gutter.top'];
        this.gutterBottom = this.properties['chart.gutter.bottom'];
        


        // Reset the data to what was initially supplied
        this.left  = this.data[0];
        this.right = this.data[1];
        
        // Sequential color index
        this.sequentialColorIndex = 0;


        /**
        * Reset the coords array
        */
        this.coords = [];

        this.GetMax();
        this.DrawAxes();
        this.DrawTicks();
        this.DrawLeftBars();
        this.DrawRightBars();
        
        // Redraw the bars so that shadows on not on top
        this.RedrawBars();
        
        this.DrawAxes();

        this.DrawLabels();
        this.DrawTitles();


        /**
        * Setup the context menu if required
        */
        if (this.Get('chart.contextmenu')) {
            RGraph.ShowContext(this);
        }

        
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
    * Draws the axes
    */
    RGraph.Bipolar.prototype.DrawAxes = function ()
    {
        // Set the linewidth
        this.context.lineWidth = this.properties['chart.axis.linewidth'] + 0.001;

        // Draw the left set of axes
        this.context.beginPath();
        this.context.strokeStyle = this.Get('chart.axis.color');

        this.axisWidth  = (this.canvas.width - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2;
        this.axisHeight = this.canvas.height - this.gutterTop - this.gutterBottom;
        
        
        // This must be here so that the two above variables are calculated
        if (this.properties['chart.noaxes']) {
            return;
        }

        this.context.moveTo(this.gutterLeft, Math.round( this.canvas.height - this.gutterBottom));
        this.context.lineTo(this.gutterLeft + this.axisWidth, Math.round( this.canvas.height - this.gutterBottom));
        
        this.context.moveTo(Math.round( this.gutterLeft + this.axisWidth), this.canvas.height - this.gutterBottom);
        this.context.lineTo(Math.round( this.gutterLeft + this.axisWidth), this.gutterTop);
        
        this.context.stroke();


        // Draw the right set of axes
        this.context.beginPath();

        var x = this.gutterLeft + this.axisWidth + this.Get('chart.gutter.center');
        
        this.context.moveTo(Math.round( x), this.gutterTop);
        this.context.lineTo(Math.round( x), this.canvas.height - this.gutterBottom);
        
        this.context.moveTo(Math.round( x), Math.round( this.canvas.height - this.gutterBottom));
        this.context.lineTo(this.canvas.width - this.gutterRight, Math.round( this.canvas.height - this.gutterBottom));

        this.context.stroke();
    }


    /**
    * Draws the tick marks on the axes
    */
    RGraph.Bipolar.prototype.DrawTicks = function ()
    {
        // Set the linewidth
        this.context.lineWidth = this.properties['chart.axis.linewidth'] + 0.001;

        var numDataPoints = this.left.length;
        var barHeight     = ( (this.canvas.height - this.gutterTop - this.gutterBottom)- (this.left.length * (this.Get('chart.margin') * 2) )) / numDataPoints;

        // Store this for later
        this.barHeight = barHeight;

        // If no axes - no tickmarks
        if (this.properties['chart.noaxes']) {
            return;
        }

        // Draw the left Y tick marks
        if (this.properties['chart.numyticks'] > 0) {
            this.context.beginPath();
                for (var i=0; i<this.properties['chart.numyticks']; ++i) {
                    var y = this.properties['chart.gutter.top'] + (((this.canvas.height - this.gutterTop - this.gutterBottom) / this.properties['chart.numyticks']) * i);
                    this.context.moveTo(this.gutterLeft + this.axisWidth , y);
                    this.context.lineTo(this.gutterLeft + this.axisWidth + 3, y);
                }
            this.context.stroke();

            //Draw the right axis Y tick marks
            this.context.beginPath();
                for (var i=0; i<this.properties['chart.numyticks']; ++i) {
                    var y = this.properties['chart.gutter.top'] + (((this.canvas.height - this.gutterTop - this.gutterBottom) / this.properties['chart.numyticks']) * i);
                    this.context.moveTo(this.gutterLeft + this.axisWidth + this.properties['chart.gutter.center'], y);
                    this.context.lineTo(this.gutterLeft + this.axisWidth + this.properties['chart.gutter.center'] - 3, y);
                }
            this.context.stroke();
        }
        
        
        
        /**
        * X tickmarks
        */
        if (this.properties['chart.numxticks'] > 0) {
            var xInterval = this.axisWidth / this.properties['chart.numxticks'];
    
            // Is chart.xtickinterval specified ? If so, use that.
            if (typeof(this.Get('chart.xtickinterval')) == 'number') {
                xInterval = this.Get('chart.xtickinterval');
            }
    
            
            // Draw the left sides X tick marks
            for (i=this.gutterLeft; i<(this.gutterLeft + this.axisWidth); i+=xInterval) {
                this.context.beginPath();
                this.context.moveTo(Math.round( i), this.canvas.height - this.gutterBottom);
                this.context.lineTo(Math.round( i), (this.canvas.height - this.gutterBottom) + 4);
                this.context.closePath();
                
                this.context.stroke();
            }
    
            // Draw the right sides X tick marks
            var stoppingPoint = this.canvas.width - this.gutterRight;
    
            for (i=(this.gutterLeft + this.axisWidth + this.Get('chart.gutter.center') + xInterval); i<=stoppingPoint; i+=xInterval) {
                this.context.beginPath();
                    this.context.moveTo(Math.round(i), this.canvas.height - this.gutterBottom);
                    this.context.lineTo(Math.round(i), (this.canvas.height - this.gutterBottom) + 4);
                this.context.closePath();
                
                this.context.stroke();
            }
        }
    }


    /**
    * Figures out the maximum value, or if defined, uses xmax
    */
    RGraph.Bipolar.prototype.GetMax = function()
    {
        var max = 0;
        var dec = this.Get('chart.scale.decimals');
        
        // chart.xmax defined
        if (this.Get('chart.xmax')) {

            max = this.Get('chart.xmax');
            
            this.scale    = [];
            this.scale[0] = Number((max / 5) * 1).toFixed(dec);
            this.scale[1] = Number((max / 5) * 2).toFixed(dec);
            this.scale[2] = Number((max / 5) * 3).toFixed(dec);
            this.scale[3] = Number((max / 5) * 4).toFixed(dec);
            this.scale[4] = Number(max).toFixed(dec);

            this.max = max;
            

        // Generate the scale ourselves
        } else {
            this.leftmax  = RGraph.array_max(this.left);
            this.rightmax = RGraph.array_max(this.right);
            max = Math.max(this.leftmax, this.rightmax);

            this.scale    = RGraph.getScale(max, this);
            this.scale[0] = Number(this.scale[0]).toFixed(dec);
            this.scale[1] = Number(this.scale[1]).toFixed(dec);
            this.scale[2] = Number(this.scale[2]).toFixed(dec);
            this.scale[3] = Number(this.scale[3]).toFixed(dec);
            this.scale[4] = Number(this.scale[4]).toFixed(dec);

            this.max = this.scale[4];
        }

        // Don't need to return it as it is stored in this.max
    }


    /**
    * Function to draw the left hand bars
    */
    RGraph.Bipolar.prototype.DrawLeftBars = function ()
    {
        // Set the stroke colour
        this.context.strokeStyle = this.Get('chart.strokestyle');
        
        // Set the linewidth
        this.context.lineWidth = this.Get('chart.linewidth');

        for (i=0; i<this.left.length; ++i) {

            /**
            * Turn on a shadow if requested
            */
            if (this.Get('chart.shadow')) {
                this.context.shadowColor   = this.Get('chart.shadow.color');
                this.context.shadowBlur    = this.Get('chart.shadow.blur');
                this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
                this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
            }

            this.context.beginPath();
                
                // If chart.colors.sequential is specified - handle that
                if (this.properties['chart.colors.sequential']) {
                    this.context.fillStyle = this.properties['chart.colors'][this.sequentialColorIndex++];
                } else {
                    this.context.fillStyle = this.Get('chart.colors')[0];
                }
                
                /**
                * Work out the coordinates
                */
                var width = ( (this.left[i] / this.max) *  this.axisWidth);
                var coords = [Math.round( this.gutterLeft + this.axisWidth - width),
                              Math.round( this.gutterTop + (i * ( this.axisHeight / this.left.length)) + this.Get('chart.margin')),
                              width,
                              this.barHeight];

                // Draw the IE shadow if necessary
                if (RGraph.isOld() && this.Get('chart.shadow')) {
                    this.DrawIEShadow(coords);
                }
    
                
                if (this.left[i]) {
                    this.context.strokeRect(coords[0], coords[1], coords[2], coords[3]);
                    this.context.fillRect(coords[0], coords[1], coords[2], coords[3]);
                }

            this.context.stroke();
            this.context.fill();

            /**
            * Add the coordinates to the coords array
            */
            this.coords.push([coords[0],coords[1],coords[2],coords[3]]);
            this.coordsLeft.push([coords[0],coords[1],coords[2],coords[3]]);
        }

        /**
        * Turn off any shadow
        */
        RGraph.NoShadow(this);
        
        // Reset the linewidth
        this.context.lineWidth = 1;
    }


    /**
    * Function to draw the right hand bars
    */
    RGraph.Bipolar.prototype.DrawRightBars = function ()
    {
        // Set the stroke colour
        this.context.strokeStyle = this.Get('chart.strokestyle');
        
        // Set the linewidth
        this.context.lineWidth = this.Get('chart.linewidth');
            
        /**
        * Turn on a shadow if requested
        */
        if (this.Get('chart.shadow')) {
            this.context.shadowColor   = this.Get('chart.shadow.color');
            this.context.shadowBlur    = this.Get('chart.shadow.blur');
            this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
            this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
        }

        for (var i=0; i<this.right.length; ++i) {

            this.context.beginPath();

                // If chart.colors.sequential is specified - handle that
                if (this.properties['chart.colors.sequential']) {
                    this.context.fillStyle = this.properties['chart.colors'][this.sequentialColorIndex++];
                } else {
                    this.context.fillStyle = this.Get('chart.colors')[0];
                }
    
    
                var width = ( (this.right[i] / this.max) * this.axisWidth);
                var coords = [
                              Math.round( this.gutterLeft + this.axisWidth + this.Get('chart.gutter.center')),
                              Math.round( this.Get('chart.margin') + (i * (this.axisHeight / this.right.length)) + this.gutterTop),
                              width,
                              this.barHeight
                            ];
    
                    // Draw the IE shadow if necessary
                    if (RGraph.isOld() && this.Get('chart.shadow')) {
                        this.DrawIEShadow(coords);
                    }
                if (this.right[i]) {
                    this.context.strokeRect(Math.round( coords[0]), Math.round( coords[1]), coords[2], coords[3]);
                    this.context.fillRect(Math.round( coords[0]), Math.round( coords[1]), coords[2], coords[3]);
                }

            this.context.closePath();
        
            /**
            * Add the coordinates to the coords array
            */
            this.coords.push([coords[0],coords[1],coords[2],coords[3]]);
            this.coordsRight.push([coords[0],coords[1],coords[2],coords[3]]);
        }
        
        this.context.stroke();

        /**
        * Turn off any shadow
        */
        RGraph.NoShadow(this);
        
        // Reset the linewidth
        this.context.lineWidth = 1;
    }


    /**
    * Draws the titles
    */
    RGraph.Bipolar.prototype.DrawLabels = function ()
    {
        this.context.fillStyle = this.Get('chart.text.color');

        var labelPoints = new Array();
        var font = this.Get('chart.text.font');
        var size = this.Get('chart.text.size');
        
        var max = Math.max(this.left.length, this.right.length);
        
        for (i=0; i<max; ++i) {
            var barAreaHeight = this.canvas.height - this.gutterTop - this.gutterBottom;
            var barHeight     = barAreaHeight / this.left.length;
            var yPos          = (i * barAreaHeight) + this.gutterTop;

            labelPoints.push(this.gutterTop + (i * barHeight) + (barHeight / 2) + 5);
        }

        for (i=0; i<labelPoints.length; ++i) {
            RGraph.Text(this.context,
                        this.Get('chart.text.font'),
                        this.Get('chart.text.size'),
                        this.gutterLeft + this.axisWidth + (this.Get('chart.gutter.center') / 2),
                        labelPoints[i],
                        String(this.Get('chart.labels')[i] ? this.Get('chart.labels')[i] : ''),
                        null,
                        'center');
        }

        if (this.properties['chart.xlabels']) {
            // Now draw the X labels for the left hand side
            RGraph.Text(this.context,font,size,this.gutterLeft,this.canvas.height - this.gutterBottom + 14,RGraph.number_format(this, this.scale[4], this.Get('chart.units.pre'), this.Get('chart.units.post')),null,'center');
            RGraph.Text(this.context, font, size, this.gutterLeft + ((this.canvas.width - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2) * (1/5), this.canvas.height - this.gutterBottom + 14, RGraph.number_format(this, this.scale[3], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
            RGraph.Text(this.context, font, size, this.gutterLeft + ((this.canvas.width - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2) * (2/5), this.canvas.height - this.gutterBottom + 14, RGraph.number_format(this, this.scale[2], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
            RGraph.Text(this.context, font, size, this.gutterLeft + ((this.canvas.width - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2) * (3/5), this.canvas.height - this.gutterBottom + 14, RGraph.number_format(this, this.scale[1], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
            RGraph.Text(this.context, font, size, this.gutterLeft + ((this.canvas.width - this.Get('chart.gutter.center') - this.gutterLeft - this.gutterRight) / 2) * (4/5), this.canvas.height - this.gutterBottom + 14, RGraph.number_format(this, this.scale[0], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
    
            // Now draw the X labels for the right hand side
            RGraph.Text(this.context, font, size, this.canvas.width - this.gutterRight, this.canvas.height - this.gutterBottom + 14, RGraph.number_format(this, this.scale[4], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
            RGraph.Text(this.context, font, size, this.canvas.width - this.gutterRight - (this.axisWidth * 0.2), this.canvas.height - this.gutterBottom + 14,RGraph.number_format(this, this.scale[3], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
            RGraph.Text(this.context, font, size, this.canvas.width - this.gutterRight - (this.axisWidth * 0.4), this.canvas.height - this.gutterBottom + 14,RGraph.number_format(this, this.scale[2], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
            RGraph.Text(this.context, font, size, this.canvas.width - this.gutterRight - (this.axisWidth * 0.6), this.canvas.height - this.gutterBottom + 14,RGraph.number_format(this, this.scale[1], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
            RGraph.Text(this.context, font, size, this.canvas.width - this.gutterRight - (this.axisWidth * 0.8), this.canvas.height - this.gutterBottom + 14,RGraph.number_format(this, this.scale[0], this.Get('chart.units.pre'), this.Get('chart.units.post')), null, 'center');
        }
        
        /**
        * Draw above labels
        */
        if (this.properties['chart.labels.above']) {
            
            // Draw the left sides above labels
            for (var i=0; i<this.coordsLeft.length; ++i) {

                if (typeof(this.left[i]) != 'number') {
                    continue;
                }

                var coords = this.coordsLeft[i];
                RGraph.Text(this.context, font, size,coords[0] - 5,coords[1] + (coords[3] / 2), RGraph.number_format(this, this.left[i], this.Get('chart.units.pre'), this.Get('chart.units.post')), 'center', 'right');
            }
            
            // Draw the right sides above labels
            for (i=0; i<this.coordsRight.length; ++i) {

                if (typeof(this.right[i]) != 'number') {
                    continue;
                }

                var coords = this.coordsRight[i];
                RGraph.Text(this.context, font, size,coords[0] + coords[2] +  5,coords[1] + (coords[3] / 2), RGraph.number_format(this, this.right[i], this.Get('chart.units.pre'), this.Get('chart.units.post')), 'center', 'left');
            }
        }
    }



    /**
    * Draws the titles
    */
    RGraph.Bipolar.prototype.DrawTitles = function ()
    {
        RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size'), this.gutterLeft + 5, (this.gutterTop / 2) + 5, String(this.Get('chart.title.left')), 'center');
        RGraph.Text(this.context,this.Get('chart.text.font'), this.Get('chart.text.size'), this.canvas.width - this.gutterRight - 5, (this.gutterTop / 2) + 5, String(this.Get('chart.title.right')), 'center', 'right');
        
        // Draw the main title for the whole chart
        RGraph.DrawTitle(this, this.Get('chart.title'), this.gutterTop, null, this.Get('chart.title.size') ? this.Get('chart.title.size') : null);
    }



    /**
    * This function is used by MSIE only to manually draw the shadow
    * 
    * @param array coords The coords for the bar
    */
    RGraph.Bipolar.prototype.DrawIEShadow = function (coords)
    {
        var prevFillStyle = this.context.fillStyle;
        var offsetx = this.Get('chart.shadow.offsetx');
        var offsety = this.Get('chart.shadow.offsety');
        
        this.context.lineWidth = this.Get('chart.linewidth');
        this.context.fillStyle = this.Get('chart.shadow.color');
        this.context.beginPath();
        
        // Draw shadow here
        this.context.fillRect(coords[0] + offsetx, coords[1] + offsety, coords[2],coords[3]);

        this.context.fill();
        
        // Change the fillstyle back to what it was
        this.context.fillStyle = prevFillStyle;
    }



    /**
    * Returns the appropriate focussed bar coordinates
    * 
    * @param e object The event object
    */
    RGraph.Bipolar.prototype.getShape = 
    RGraph.Bipolar.prototype.getBar = function (e)
    {
        var canvas      = this.canvas;
        var context     = this.context;
        var mouseCoords = RGraph.getMouseXY(e);

        /**
        * Loop through the bars determining if the mouse is over a bar
        */
        for (var i=0; i<this.coords.length; i++) {

            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];
            var left   = this.coords[i][0];
            var top    = this.coords[i][1];
            var width  = this.coords[i][2];
            var height = this.coords[i][3];

            if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {
            
                var tooltip = RGraph.parseTooltipText(this.Get('chart.tooltips'), i);

                return {
                        0: this,1: left,2: top,3: width,4: height,5: i,
                        'object': this, 'x': left, 'y': top, 'width': width, 'height': height, 'index': i, 'tooltip': tooltip
                       };
            }
        }

        return null;
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Bipolar.prototype.Highlight = function (shape)
    {
        // Add the new highlight
        RGraph.Highlight.Rect(this, shape);
    }



    /**
    * When you click on the canvas, this will return the relevant value (if any)
    * 
    * REMEMBER This function will need updating if the Bipolar ever gets chart.ymin
    * 
    * @param object e The event object
    */
    RGraph.Bipolar.prototype.getValue = function (e)
    {
        var obj     = e.target.__object__;
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        
        /**
        * Left hand side
        */
        if (mouseX > this.gutterLeft && mouseX < ( (this.canvas.width / 2) - (this.Get('chart.gutter.center') / 2) )) {
            var value = (mouseX - this.Get('chart.gutter.left')) / this.axisWidth;
                value = this.max - (value * this.max);
        }
        
        /**
        * Right hand side
        */
        if (mouseX < (this.canvas.width -  this.gutterRight) && mouseX > ( (this.canvas.width / 2) + (this.Get('chart.gutter.center') / 2) )) {
            var value = (mouseX - this.Get('chart.gutter.left') - this.axisWidth - this.Get('chart.gutter.center')) / this.axisWidth;
                value = (value * this.max);
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
    RGraph.Bipolar.prototype.getObjectByXY = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);

        if (
               mouseXY[0] > this.Get('chart.gutter.left')
            && mouseXY[0] < (this.canvas.width - this.Get('chart.gutter.right'))
            && mouseXY[1] > this.Get('chart.gutter.top')
            && mouseXY[1] < (this.canvas.height - this.Get('chart.gutter.bottom'))
            ) {

            return this;
        }
    }



    /**
    * This function positions a tooltip when it is displayed
    * 
    * @param obj object    The chart object
    * @param int x         The X coordinate specified for the tooltip
    * @param int y         The Y coordinate specified for the tooltip
    * @param objec tooltip The tooltips DIV element
    */
    RGraph.Bipolar.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var coordX     = obj.coords[tooltip.__index__][0];
        var coordY     = obj.coords[tooltip.__index__][1];
        var coordW     = obj.coords[tooltip.__index__][2];
        var coordH     = obj.coords[tooltip.__index__][3];
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var gutterLeft = obj.Get('chart.gutter.left');
        var gutterTop  = obj.Get('chart.gutter.top');
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
        if ((canvasXY[0] + coordX + (coordW / 2)- (width / 2)) < 0) {
            tooltip.style.left = (canvasXY[0] + coordX - (width * 0.1)) + (coordW / 2) + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + coordX + width) > document.body.offsetWidth) {
            tooltip.style.left = canvasXY[0] + coordX - (width * 0.9) + (coordW / 2) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + coordX + (coordW / 2) - (width * 0.5)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * Redraw the bar so that the shadow is NOT on top
    */
    RGraph.Bipolar.prototype.RedrawBars = function ()
    {
        var coords = this.coords;
        var len    = coords.length;
        
        // Reset the sequentail color index
        this.sequentialColorIndex = 0;

        this.context.beginPath();

            // Turn off shadow
            RGraph.NoShadow(this);

            // Set the stroke color
            this.context.strokeStyle = this.Get('chart.strokestyle');
            
            // Set the linewidth
            this.context.lineWidth = this.Get('chart.linewidth');

            for (var i=0; i<len; ++i) {

                // No redrawing occurs if there is no value
                if (coords[i][2] > 0) {
                    
                    if (this.properties['chart.colors.sequential']) {
                        this.context.fillStyle = this.properties['chart.colors'][this.sequentialColorIndex++];
                    } else {
                        this.context.fillStyle = this.Get('chart.colors')[0];
                    }
    
                    // Draw the bar itself
                    this.context.strokeRect(coords[i][0], coords[i][1], coords[i][2], coords[i][3]);
                    this.context.fillRect(coords[i][0], coords[i][1], coords[i][2], coords[i][3]);
                } 
            }
        this.context.stroke();
        this.context.fill();
    }



    /**
    * Returns the X coords for a value. Returns two coords because there are... two scales.
    * 
    * @param number value The value to get the coord for
    */
    RGraph.Bipolar.prototype.getXCoord = function (value)
    {
        if (value > this.max || value < 0) {
            return null;
        }

        var ret = [];
        
        // The offset into the graph area
        var offset = ((value / this.max) * this.axisWidth);
        
        // Get the coords (one fo each side)
        ret[0] = (this.gutterLeft + this.axisWidth) - offset;
        ret[1] = (this.canvas.width - this.gutterRight - this.axisWidth) + offset;
        
        return ret;

    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Bipolar.prototype.parseColors = function ()
    {
        var props = this.properties;
        var colors = props['chart.colors'];

        for (var i=0; i<colors.length; ++i) {
            colors[i] = this.parseSingleColorForGradient(colors[i]);
        }
        
        props['chart.highlight.stroke'] = this.parseSingleColorForGradient(props['chart.highlight.stroke']);
        props['chart.highlight.fill']   = this.parseSingleColorForGradient(props['chart.highlight.fill']);
        props['chart.axis.color']       = this.parseSingleColorForGradient(props['chart.axis.color']);
        props['chart.strokestyle']      = this.parseSingleColorForGradient(props['chart.strokestyle']);
    }



    /**
    * This parses a single color value
    */
    RGraph.Bipolar.prototype.parseSingleColorForGradient = function (color)
    {        
        if (!color || typeof(color) != 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {
            
            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = this.context.createLinearGradient(this.properties['chart.gutter.left'],0,this.canvas.width - this.properties['chart.gutter.right'],0);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }
            
        return grad ? grad : color;
    }