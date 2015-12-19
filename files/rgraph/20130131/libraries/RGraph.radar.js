    /**
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
    
    if (typeof(RGraph) == 'undefined') RGraph = {};

    /**
    * The traditional radar chart constructor
    * 
    * @param string id   The ID of the canvas
    * @param array  data An array of data to represent
    */
    RGraph.Radar = function (id, data)
    {
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'radar';
        this.coords            = [];
        this.isRGraph          = true;
        this.data              = [];
        this.max               = 0;
        this.original_data     = [];
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;

        for (var i=1; i<arguments.length; ++i) {
            this.original_data.push(RGraph.array_clone(arguments[i]));
            this.data.push(RGraph.array_clone(arguments[i]));
            this.max = Math.max(this.max, RGraph.array_max(arguments[i]));
        }

        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);

        
        this.properties = {
            'chart.strokestyle':           '#aaa',
            'chart.gutter.left':           25,
            'chart.gutter.right':          25,
            'chart.gutter.top':            25,
            'chart.gutter.bottom':         25,
            'chart.linewidth':             1,
            'chart.colors':                ['rgba(255,255,0,0.25)','rgba(0,255,255,0.25)','rgba(255,0,0,0.5)', 'red', 'green', 'blue', 'pink', 'aqua','brown','orange','grey'],
            'chart.colors.alpha':          null,
            'chart.circle':                0,
            'chart.circle.fill':           'red',
            'chart.circle.stroke':         'black',
            'chart.labels':                [],
            'chart.labels.offset':         10,
            'chart.background.circles':    true,
            'chart.background.circles.color': '#ddd',
            'chart.background.circles.poly':  true,
            'chart.text.size':             10,
            'chart.text.font':             'Arial',
            'chart.text.color':            'black',
            'chart.title':                 '',
            'chart.title.background':      null,
            'chart.title.hpos':            null,
            'chart.title.vpos':            null,
            'chart.title.color':           'black',
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.linewidth':             1,
            'chart.key':                   null,
            'chart.key.background':        'white',
            'chart.key.shadow':            false,
            'chart.key.shadow.color':       '#666',
            'chart.key.shadow.blur':        3,
            'chart.key.shadow.offsetx':     2,
            'chart.key.shadow.offsety':     2,
            'chart.key.position':          'graph',
            'chart.key.halign':             'right',
            'chart.key.position.gutter.boxed': true,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.contextmenu':           null,
            'chart.annotatable':           false,
            'chart.annotate.color':        'black',
            'chart.zoom.factor':           1.5,
            'chart.zoom.fade.in':          true,
            'chart.zoom.fade.out':         true,
            'chart.zoom.hdir':             'right',
            'chart.zoom.vdir':             'down',
            'chart.zoom.frames':            25,
            'chart.zoom.delay':             16.666,
            'chart.zoom.shadow':           true,
            'chart.zoom.background':        true,
            'chart.zoom.action':            'zoom',
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.event':         'onmousemove',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.highlight':     true,
            'chart.highlight.stroke':       'gray',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',
            'chart.highlight.point.radius': 2,
            'chart.resizable':              false,
            'chart.resize.handle.adjust':   [0,0],
            'chart.resize.handle.background': null,
            'chart.labels.axes':            '',
            'chart.labels.background.fill': 'white',
            'chart.labels.boxed':           false,
            'chart.ymax':                   null,
            'chart.accumulative':           false,
            'chart.radius':                 null,
            'chart.events.click':           null,
            'chart.events.mousemove':       null,
            'chart.scale.decimals':         0,
            'chart.scale.point':            '.',
            'chart.scale.thousand':         ',',
            'chart.units.pre':              '',
            'chart.units.post':             '',
            'chart.tooltips':             null,
            'chart.tooltips.event':       'onmousemove',
            'chart.centerx':              null,
            'chart.centery':              null,
            'chart.radius':               null,
            'chart.numxticks':            5,
            'chart.numyticks':            5,
            'chart.axes.color':           'rgba(0,0,0,0)',
            'chart.highlights':           false,
            'chart.highlights.stroke':    '#ddd',
            'chart.highlights.fill':      null,
            'chart.highlights.radius':    3,

            'chart.fill.click':           null,
            'chart.fill.mousemove':       null,
            'chart.fill.tooltips':        null,
            'chart.fill.click.highlight': true,
            'chart.fill.mousemove.highlight': false,
            'chart.fill.highlight.fill':   'rgba(255,255,255,0.7)',
            'chart.fill.highlight.stroke': 'rgba(0,0,0,0)',
            'chart.fill.mousemove.redraw': false,
            'chart.animation.trace.clip': 1
        }
        
        // Must have at least 3 points
        for (var dataset=0; dataset<this.data.length; ++dataset) {
            if (this.data[dataset].length < 3) {
                alert('[RADAR] You must specify at least 3 data points');
                return;
            }
        }
        
        
        /**
        * Linearize the data and then create the $ objects
        */
        var idx = 0;
        for (var dataset=0; dataset<this.data.length; ++dataset) {
            for (var i=0; i<this.data[dataset].length; ++i) {
                this['$' + (idx++)] = {};
            }
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
        * Always register the object
        */
        RGraph.Register(this);
    }


    /**
    * A simple setter
    * 
    * @param string name  The name of the property to set
    * @param string value The value of the property
    */
    RGraph.Radar.prototype.Set = function (name, value)
    {
        name = name.toLowerCase();

        /**
        * This should be done first - prepend the propertyy name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        if (name == 'chart.text.diameter') {
            name = 'chart.text.size';
        }

        this.properties[name] = value;

        /**
        * If the name is chart.color, set chart.colors too
        */
        if (name == 'chart.color') {
            this.properties['chart.colors'] = [value];
        }
    }


    /**
    * A simple hetter
    * 
    * @param string name  The name of the property to get
    */
    RGraph.Radar.prototype.Get = function (name)
    {
        /**
        * This should be done first - prepend the property name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        if (name == 'chart.text.diameter') {
            name = 'chart.text.size';
        }

        return this.properties[name];
    }


    /**
    * The draw method which does all the brunt of the work
    */
    RGraph.Radar.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');
        
        // NB: Colors are parsed further down

        // Reset the coords array to stop it growing
        this.coords  = [];
        this.coords2 = [];

        /**
        * Reset the data to the original_data
        */
        this.data = RGraph.array_clone(this.original_data);
        
        // Loop thru the data array if chart.accumulative is enable checking to see if all the
        // datasets have the same number of elements.
        if (this.Get('chart.accumulative')) {
            for (var i=0; i<this.data.length; ++i) {
                if (this.data[i].length != this.data[0].length) {
                    alert('[RADAR] Error! When the radar has chart.accumulative set to true all the datasets must have the same number of elements');
                }
            }
        }
        
        /**
        * This is new in May 2011 and facilitates indiviual gutter settings,
        * eg chart.gutter.left
        */
        this.gutterLeft   = this.Get('chart.gutter.left');
        this.gutterRight  = this.Get('chart.gutter.right');
        this.gutterTop    = this.Get('chart.gutter.top');
        this.gutterBottom = this.Get('chart.gutter.bottom');

        this.centerx  = ((this.canvas.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;
        this.centery  = ((this.canvas.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop;
        this.radius   = Math.min(this.canvas.width - this.gutterLeft - this.gutterRight, this.canvas.height - this.gutterTop - this.gutterBottom) / 2;



        /**
        * Allow these to be set by hand
        */
        if (typeof(this.Get('chart.centerx')) == 'number') this.centerx = 2 * this.Get('chart.centerx');
        if (typeof(this.Get('chart.centery')) == 'number') this.centery = 2 * this.Get('chart.centery');
        if (typeof(this.Get('chart.radius')) == 'number') this.radius   = this.Get('chart.radius');


        /**
        * Parse the colors for gradients. Its down here so that the center X/Y can be used
        */
        if (!this.colorsParsed) {

            this.parseColors();

            // Don't want to do this again
            this.colorsParsed = true;
        }


        // Work out the maximum value and the sum
        if (!this.Get('chart.ymax')) {

            // this.max is calculated in the constructor

            // Work out this.max again if the chart is (now) set to be accumulative
            if (this.Get('chart.accumulative')) {
                
                var accumulation = [];
                var len = this.original_data[0].length

                for (var i=1; i<this.original_data.length; ++i) {
                    if (this.original_data[i].length != len) {
                        alert('[RADAR] Error! Stacked Radar chart datasets must all be the same size!');
                    }
                    
                    for (var j=0; j<this.original_data[i].length; ++j) {
                        this.data[i][j] += this.data[i - 1][j];
                        this.max = Math.max(this.max, this.data[i][j]);
                    }
                }
            }

            this.scale = RGraph.getScale(this.max, this);
            this.max = this.scale[4];
        
        } else {
            var ymax = this.Get('chart.ymax');

            this.scale = [
                          ymax * 0.2,
                          ymax * 0.4,
                          ymax * 0.6,
                          ymax * 0.8,
                          ymax * 1
                         ];
            this.max = this.scale[4];
        }

        this.DrawBackground();
        this.DrawAxes();
        this.DrawCircle();
        this.DrawAxisLabels();
        this.DrawLabels();
        
        /**
        * Allow clipping
        */
        this.context.save();
            this.context.beginPath();
                this.context.arc(this.centerx, this.centery, this.radius * 2, -HALFPI, (TWOPI * this.properties['chart.animation.trace.clip']) - HALFPI, false);
                this.context.lineTo(this.centerx, this.centery);
            this.context.closePath();
            this.context.clip();

            this.DrawChart();
            this.DrawHighlights();

        this.context.restore();
        
        // Draw the title
        if (this.Get('chart.title')) {
            RGraph.DrawTitle(this, this.Get('chart.title'), this.gutterTop, null, this.Get('chart.title.diameter') ? this.Get('chart.title.diameter') : null)
        }

        // Draw the key if necessary
        // obj, key, colors
        if (this.Get('chart.key')) {
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));
        }

        /**
        * Show the context menu
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
        * This installs the Radar chart specific area listener
        */
        if ( (this.properties['chart.fill.click'] || this.properties['chart.fill.mousemove'] || !RGraph.is_null(this.properties['chart.fill.tooltips'])) && !this.__fill_click_listeners_installed__) {
            this.AddFillListeners();
            this.__fill_click_listeners_installed__ = true;
        }
        
        /**
        * Fire the RGraph ondraw event
        */
        RGraph.FireCustomEvent(this, 'ondraw');
    }


    /**
    * Draws the background circles
    */
    RGraph.Radar.prototype.DrawBackground = function ()
    {
        var color   = this.Get('chart.background.circles.color');
        var poly    = this.Get('chart.background.circles.poly');
        var spacing = this.Get('chart.background.circles.spacing');





        // Set the linewidth for the grid (so that repeated redrawing works OK)
        this.context.lineWidth = 1;




        /**
        * Draws the background circles
        */
        if (this.Get('chart.background.circles') && poly == false) {





            // Draw the concentric circles
            this.context.strokeStyle = color;
           this.context.beginPath();
               for (var r=0; r<=this.radius; r+=(this.radius / 5)) {
                    this.context.moveTo(this.centerx, this.centery);
                    this.context.arc(this.centerx, this.centery,r, 0, TWOPI, false);
                }
            this.context.stroke();




    
            /**
            * Draw the diagonals/spokes
            */
            this.context.strokeStyle = color;

            for (var i=0; i<360; i+=15) {
                this.context.beginPath();
                    this.context.arc(this.centerx,
                                     this.centery,
                                     this.radius,
                                     (i / 360) * TWOPI,
                                     ((i+0.001) / 360) * TWOPI,
                                     false); // The 0.01 avoids a bug in Chrome 6
                    this.context.lineTo(this.centerx, this.centery);
                this.context.stroke();
            }






        /**
        * The background"circles" are actually drawn as a poly based on how many points there are
        * (ie hexagons if there are 6 points, squares if the are four etc)
        */
        } else if (this.Get('chart.background.circles') && poly == true) {

            /**
            * Draw the diagonals/spokes
            */
            this.context.strokeStyle = color;
            var increment = 360 / this.data[0].length

            for (var i=0; i<360; i+=increment) {
                this.context.beginPath();
                    this.context.arc(this.centerx,
                                     this.centery,
                                     this.radius,
                                     ((i / 360) * TWOPI) - HALFPI,
                                     (((i + 0.001) / 360) * TWOPI) - HALFPI,
                                     false); // The 0.001 avoids a bug in Chrome 6
                    this.context.lineTo(this.centerx, this.centery);
                this.context.stroke();
            }


            /**
            * Draw the lines that go around the Radar chart
            */
            this.context.strokeStyle = color;
                for (var r=0; r<=this.radius; r+=(this.radius / 5)) {
                    this.context.beginPath();
                        for (var a=0; a<=360; a+=(360 / this.data[0].length)) {
                            this.context.arc(this.centerx,
                                             this.centery,
                                             r,
                                             RGraph.degrees2Radians(a) - HALFPI,
                                             RGraph.degrees2Radians(a) + 0.001 - HALFPI,
                                             false);
                        }
                    this.context.closePath();
                    this.context.stroke();
                }
        }
    }



    /**
    * Draws the axes
    */
    RGraph.Radar.prototype.DrawAxes = function ()
    {
        this.context.strokeStyle = this.Get('chart.axes.color');

        var halfsize = this.radius;

        this.context.beginPath();
            /**
            * The Y axis
            */
            this.context.moveTo(Math.round(this.centerx), this.centery + this.radius);
            this.context.lineTo(Math.round(this.centerx), this.centery - this.radius);
            
    
            // Draw the bits at either end of the Y axis
            this.context.moveTo(this.centerx - 5, Math.round(this.centery + this.radius));
            this.context.lineTo(this.centerx + 5, Math.round(this.centery + this.radius));
            this.context.moveTo(this.centerx - 5, Math.round(this.centery - this.radius));
            this.context.lineTo(this.centerx + 5, Math.round(this.centery - this.radius));

            // Draw Y axis tick marks
            for (var y=(this.centery - this.radius); y<(this.centery + this.radius); y+=(this.radius/this.properties['chart.numyticks'])) {
                this.context.moveTo(this.centerx - 3, Math.round(y));
                this.context.lineTo(this.centerx + 3, Math.round(y));
            }
    
            /**
            * The X axis
            */
            this.context.moveTo(this.centerx - this.radius, Math.round(this.centery));
            this.context.lineTo(this.centerx + this.radius, Math.round(this.centery));
    
            // Draw the bits at the end of the X axis
            this.context.moveTo(Math.round(this.centerx - this.radius), this.centery - 5);
            this.context.lineTo(Math.round(this.centerx - this.radius), this.centery + 5);
            this.context.moveTo(Math.round(this.centerx + this.radius), this.centery - 5);
            this.context.lineTo(Math.round(this.centerx + this.radius), this.centery + 5);
    
            // Draw X axis tick marks
            for (var x=(this.centerx - this.radius); x<(this.centerx + this.radius); x+=(this.radius/this.properties['chart.numxticks'])) {
                this.context.moveTo(Math.round(x), this.centery - 3);
                this.context.lineTo(Math.round(x), this.centery + 3);
            }

        // Stroke it
        this.context.stroke();
    }


    /**
    * The function which actually draws the radar chart
    */
    RGraph.Radar.prototype.DrawChart = function ()
    {
        var alpha = this.Get('chart.colors.alpha');

        if (typeof(alpha) == 'number') {
            var oldAlpha = this.context.globalAlpha;
            this.context.globalAlpha = alpha;
        }
        
        var numDatasets = this.data.length;

        for (var dataset=0; dataset<this.data.length; ++dataset) {

            this.context.beginPath();

                var coords_dataset = [];
    
                for (var i=0; i<this.data[dataset].length; ++i) {
                    
                    var coords = this.GetCoordinates(dataset, i);

                    if (coords_dataset == null) {
                        coords_dataset = [];
                    }

                    coords_dataset.push(coords);
                    this.coords.push(coords);
                }
                
                this.coords2[dataset] = coords_dataset;
                

                /**
                * Now go through the coords and draw the chart itself
                *
                * 18/5/2012 - chart.strokestyle can now be an array of colors as well as a single color
                */

                this.context.strokeStyle = (typeof(this.Get('chart.strokestyle')) == 'object' && this.Get('chart.strokestyle')[dataset]) ? this.Get('chart.strokestyle')[dataset] : this.Get('chart.strokestyle');
                this.context.fillStyle   = this.Get('chart.colors')[dataset];
                this.context.lineWidth   = this.Get('chart.linewidth');

                for (i=0; i<coords_dataset.length; ++i) {
                    if (i == 0) {
                        this.context.moveTo(coords_dataset[i][0], coords_dataset[i][1]);
                    } else {
                        this.context.lineTo(coords_dataset[i][0], coords_dataset[i][1]);
                    }
                }
                

                // If on the second or greater dataset, backtrack
                if (this.Get('chart.accumulative') && dataset > 0) {

                    // This goes back to the start coords of this particular dataset
                    this.context.lineTo(coords_dataset[0][0], coords_dataset[0][1]);
                    
                    //Now move down to the end point of the previous dataset
                    this.context.moveTo(last_coords[0][0], last_coords[0][1]);

                    for (var i=coords_dataset.length - 1; i>=0; --i) {
                        this.context.lineTo(last_coords[i][0], last_coords[i][1]);
                    }
                }
            
            // This is used by the next iteration of the loop
            var last_coords = coords_dataset;

            this.context.closePath();
    
            this.context.stroke();
            this.context.fill();
        }
        
        // Reset the globalAlpha
        if (typeof(alpha) == 'number') {
            this.context.globalAlpha = oldAlpha;
        }
    }

    /**
    * Gets the coordinates for a particular mark
    * 
    * @param  number i The index of the data (ie which one it is)
    * @return array    A two element array of the coordinates
    */
    RGraph.Radar.prototype.GetCoordinates = function (dataset, index)
    {
        // The number  of data points
        var len = this.data[dataset].length;

        // The magnitude of the data (NOT the x/y coords)
        var mag = (this.data[dataset][index] / this.max) * this.radius;

        /**
        * Get the angle
        */
        var angle = (TWOPI / len) * index; // In radians
        angle -= HALFPI;


        /**
        * Work out the X/Y coordinates
        */
        var x = Math.cos(angle) * mag;
        var y = Math.sin(angle) * mag;

        /**
        * Put the coordinate in the right quadrant
        */
        x = this.centerx + x;
        y = this.centery + y;
        
        return [x,y];
    }
    
    
    /**
    * This function adds the labels to the chart
    */
    RGraph.Radar.prototype.DrawLabels = function ()
    {
        var labels = this.Get('chart.labels');

        if (labels && labels.length > 0) {

            this.context.lineWidth = 1;
            this.context.strokeStyle = 'gray';
            this.context.fillStyle = this.Get('chart.text.color');
            
            var bgFill  = this.properties['chart.labels.background.fill'];
            var bgBoxed = this.properties['chart.labels.boxed'];
            var offset  = this.properties['chart.labels.offset'];
            var font    = this.properties['chart.text.font'];
            var size    = this.properties['chart.text.size'];
            var radius  = this.radius;

            for (var i=0; i<labels.length; ++i) {
                
                var angle  = (TWOPI / this.Get('chart.labels').length) * i;
                    angle -= HALFPI;

                var x = this.centerx + (Math.cos(angle) * (radius + offset));
                var y = this.centery + (Math.sin(angle) * (radius + offset));
                
                /**
                * Horizontal alignment
                */
                var halign = x < this.centerx ? 'right' : 'left' ;
                if (i == 0 || (i / labels.length) == 0.5) halign = 'center';

                if (labels[i] && labels[i].length) {
                    RGraph.Text(this.context, font, size, x, y, labels[i], 'center', halign, bgBoxed, null, bgFill);
                }
            }
        }
    }


    /**
    * Draws the circle. No arguments as it gets the information from the object properties.
    */
    RGraph.Radar.prototype.DrawCircle = function ()
    {
        var circle   = {};
        circle.limit = this.Get('chart.circle');
        circle.fill  = this.Get('chart.circle.fill');
        circle.stroke  = this.Get('chart.circle.stroke');

        if (circle.limit) {

            var r = (circle.limit / this.max) * this.radius;
            
            this.context.fillStyle = circle.fill;
            this.context.strokeStyle = circle.stroke;

            this.context.beginPath();
            this.context.arc(this.centerx, this.centery, r, 0, TWOPI, 0);
            this.context.fill();
            this.context.stroke();
        }
    }


    /**
    * Unsuprisingly, draws the labels
    */
    RGraph.Radar.prototype.DrawAxisLabels = function ()
    {
        /**
        * Draw specific axis labels
        */
        if (this.Get('chart.labels.specific')) {
            this.DrawSpecificAxisLabels();
            return;
        }

        this.context.lineWidth = 1;
        
        // Set the color to black
        this.context.fillStyle = 'black';
        this.context.strokeStyle = 'black';

        var r          = this.radius;
        var font_face  = this.Get('chart.text.font');
        var font_size  = typeof(this.properties['chart.text.size.scale']) == 'number' ? this.properties['chart.text.size.scale'] : this.properties['chart.text.size'];
        var context    = this.context;
        var axes       = this.Get('chart.labels.axes').toLowerCase();
        var color      = 'rgba(255,255,255,0.8)';
        var drawzero   = false;
        var units_pre  = this.Get('chart.units.pre');
        var units_post = this.Get('chart.units.post');
        var decimals   = this.Get('chart.scale.decimals');
        
        this.context,fillStyle = this.properties['chart.text.color'];

        // The "North" axis labels
        if (axes.indexOf('n') > -1) {
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.2), RGraph.number_format(this, this.scale[0].toFixed(decimals), units_pre, units_post),'center','center',true,false,color);
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.4), RGraph.number_format(this, this.scale[1].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.6), RGraph.number_format(this, this.scale[2].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.8), RGraph.number_format(this, this.scale[3].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery - r, RGraph.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            
            drawzero = true;
        }

        // The "South" axis labels
        if (axes.indexOf('s') > -1) {
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.2), RGraph.number_format(this, this.scale[0].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.4), RGraph.number_format(this, this.scale[1].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.6), RGraph.number_format(this, this.scale[2].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.8), RGraph.number_format(this, this.scale[3].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx, this.centery + r, RGraph.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            
            drawzero = true;
        }
        
        // The "East" axis labels
        if (axes.indexOf('e') > -1) {
            RGraph.Text(context, font_face, font_size, this.centerx + (r * 0.2), this.centery, RGraph.number_format(this, this.scale[0].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx + (r * 0.4), this.centery, RGraph.number_format(this, this.scale[1].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx + (r * 0.6), this.centery, RGraph.number_format(this, this.scale[2].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx + (r * 0.8), this.centery, RGraph.number_format(this, this.scale[3].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx + r, this.centery, RGraph.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            
            drawzero = true;
        }

        // The "West" axis labels
        if (axes.indexOf('w') > -1) {
            RGraph.Text(context, font_face, font_size, this.centerx - (r * 0.2), this.centery, RGraph.number_format(this, this.scale[0].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx - (r * 0.4), this.centery, RGraph.number_format(this, this.scale[1].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx - (r * 0.6), this.centery, RGraph.number_format(this, this.scale[2].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx - (r * 0.8), this.centery, RGraph.number_format(this, this.scale[3].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx - r, this.centery, RGraph.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            RGraph.Text(context, font_face, font_size, this.centerx - r, this.centery, RGraph.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            
            drawzero = true;
        }

        if (drawzero) {
            RGraph.Text(context, font_face, font_size, this.centerx,  this.centery, RGraph.number_format(this, (0).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }
    }


    /**
    * Draws specific axis labels
    */
    RGraph.Radar.prototype.DrawSpecificAxisLabels = function ()
    {
        /**
        * Specific Y labels
        */
        var labels  = this.Get('chart.labels.specific');
        var context = this.context;
        var font    = this.Get('chart.text.font');
        var size    = typeof(this.properties['chart.text.size.scale']) == 'number' ? this.properties['chart.text.size.scale'] : this.properties['chart.text.size'];
        var axes    = this.Get('chart.labels.axes').toLowerCase();
        var interval = (this.radius * 2) / (labels.length * 2);
        
        this.context.fillStyle = this.properties['chart.text.color'];

        for (var i=0; i<labels.length; ++i) {
            if (axes.indexOf('n') > -1) RGraph.Text(context,font,size,this.gutterLeft + this.radius,this.gutterTop + (i * interval),labels[i],'center','center', true, false, 'rgba(255,255,255,0.8)');
            if (axes.indexOf('s') > -1) RGraph.Text(context,font,size,this.gutterLeft + this.radius,this.gutterTop + this.radius + (i * interval) + interval,RGraph.array_reverse(labels)[i],'center','center', true, false, 'rgba(255,255,255,0.8)');
            if (axes.indexOf('w') > -1) RGraph.Text(context,font,size,this.gutterLeft + (i * interval),this.gutterTop + this.radius,labels[i],'center','center', true, false, 'rgba(255,255,255,0.8)');
            if (axes.indexOf('e') > -1) RGraph.Text(context,font,size,this.gutterLeft + (i * interval) + interval + this.radius,this.gutterTop + this.radius,RGraph.array_reverse(labels)[i],'center','center', true, false, 'rgba(255,255,255,0.8)');
        }
    }


    /**
    * This method eases getting the focussed point (if any)
    * 
    * @param event e The event object
    */
    RGraph.Radar.prototype.getShape =
    RGraph.Radar.prototype.getPoint = function (e)
    {
        var canvas  = this.canvas;
        var context = this.context;

        for (var i=0; i<this.coords.length; ++i) {

            var x        = this.coords[i][0];
            var y        = this.coords[i][1];
            var tooltips = this.Get('chart.tooltips');
            var index    = Number(i);
            var mouseXY  = RGraph.getMouseXY(e);
            var mouseX   = mouseXY[0];
            var mouseY   = mouseXY[1];

            if (   mouseX < (x + 5)
                && mouseX > (x - 5)
                && mouseY > (y - 5)
                && mouseY < (y + 5)
               ) {
                
                var tooltip = RGraph.parseTooltipText(this.Get('chart.tooltips'), index);

                return {0: this,    'object':  this,
                        1: x,       'x':       x,
                        2: y,       'y':       y,
                        3: null, 'dataset': null,
                        4: index,       'index':   i,
                                    'tooltip': tooltip
                       }
            }
        }
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Radar.prototype.Highlight = function (shape)
    {
        // Add the new highlight
        RGraph.Highlight.Point(this, shape);
    }



    /**
    * The getObjectByXY() worker method. Don't call this call:
    * 
    * RGraph.ObjectRegistry.getObjectByXY(e)
    * 
    * @param object e The event object
    */
    RGraph.Radar.prototype.getObjectByXY = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);

        if (
               mouseXY[0] > (this.centerx - this.radius)
            && mouseXY[0] < (this.centerx + this.radius)
            && mouseXY[1] > (this.centery - this.radius)
            && mouseXY[1] < (this.centery + this.radius)
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
    RGraph.Radar.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var dataset    = tooltip.__dataset__;
        var index      = tooltip.__index__;
        var coordX     = obj.coords[index][0];
        var coordY     = obj.coords[index][1];
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var gutterLeft = obj.Get('chart.gutter.left');
        var gutterTop  = obj.Get('chart.gutter.top');
        var width      = tooltip.offsetWidth;

        // Set the top position
        tooltip.style.left = 0;
        tooltip.style.top  = parseInt(tooltip.style.top) - 9 + 'px';
        
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
        if ((canvasXY[0] + coordX - (width / 2)) < 10) {
            tooltip.style.left = (canvasXY[0] + coordX - (width * 0.1)) + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + coordX + (width / 2)) > document.body.offsetWidth) {
            tooltip.style.left = canvasXY[0] + coordX - (width * 0.9) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + coordX - (width * 0.5)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * This draws highlights on the points
    */
    RGraph.Radar.prototype.DrawHighlights = function ()
    {
        if (this.Get('chart.highlights')) {
            
            var sequentialIdx = 0;
            var dataset       = 0;
            var index         = 0;
            var radius        = this.Get('chart.highlights.radius');
    
            for (var dataset=0; dataset <this.data.length; ++dataset) {
                for (var index=0; index<this.data[dataset].length; ++index) {
                    
                    this.context.beginPath();
                        this.context.strokeStyle = this.Get('chart.highlights.stroke');
                        this.context.fillStyle = this.Get('chart.highlights.fill') ? this.Get('chart.highlights.fill') : ((typeof(this.Get('chart.strokestyle')) == 'object' && this.Get('chart.strokestyle')[dataset]) ? this.Get('chart.strokestyle')[dataset] : this.Get('chart.strokestyle'));
                        this.context.arc(this.coords[sequentialIdx][0], this.coords[sequentialIdx][1], radius, 0, TWOPI, false);
                    this.context.stroke();
                    this.context.fill();
    
                    ++sequentialIdx;
                }
            }
        }
    }



    /**
    * This function returns the radius (ie the distance from the center) for a particular
    * value. Note that if you want the angle for a point you can use getAngle(index)
    * 
    * @param number value The value you want the radius for
    */
    RGraph.Radar.prototype.getRadius = function (value)
    {
        if (value < 0 || value > this.max) {
            return null;
        }

        // Radar doesn't support minimum value
        var radius = (value / this.max) * this.radius;
        
        return radius;
    }



    /**
    * This function returns the angle (in radians) for a particular index.
    * 
    * @param number numitems The total number of items
    * @param number index    The zero index number of the item to get the angle for
    */
    RGraph.Radar.prototype.getAngle = function (numitems, index)
    {
        var angle = (TWOPI / numitems) * index;
            angle -= HALFPI;
        
        return angle;
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Radar.prototype.parseColors = function ()
    {
        for (var i=0; i<this.properties['chart.colors'].length; ++i) {
            this.properties['chart.colors'][i] = this.parseSingleColorForGradient(this.properties['chart.colors'][i]);
        }
        
        var keyColors = this.properties['chart.key.colors'];

        if (typeof(keyColors) != 'null' && keyColors && keyColors.length) {
            for (var i=0; i<this.properties['chart.key.colors'].length; ++i) {
                this.properties['chart.key.colors'][i] = this.parseSingleColorForGradient(this.properties['chart.key.colors'][i]);
            }
        }

        this.properties['chart.title.color']      = this.parseSingleColorForGradient(this.properties['chart.title.color']);
        this.properties['chart.text.color']       = this.parseSingleColorForGradient(this.properties['chart.text.color']);
        this.properties['chart.highlight.stroke'] = this.parseSingleColorForGradient(this.properties['chart.highlight.stroke']);
        this.properties['chart.highlight.fill']   = this.parseSingleColorForGradient(this.properties['chart.highlight.fill']);
        this.properties['chart.circle.fill']      = this.parseSingleColorForGradient(this.properties['chart.circle.fill']);
        this.properties['chart.circle.stroke']    = this.parseSingleColorForGradient(this.properties['chart.circle.stroke']);
    }



    /**
    * This parses a single color value
    */
    RGraph.Radar.prototype.parseSingleColorForGradient = function (color)
    {
        var canvas  = this.canvas;
        var context = this.context;
        
        if (!color || typeof(color) != 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = context.createRadialGradient(this.centerx, this.centery, 0, this.centerx, this.centery, this.radius);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }

        return grad ? grad : color;
    }


    RGraph.Radar.prototype.AddFillListeners = function (e)
    {
        var func = function (e)
        {
            var canvas  = e.target;
            var context = canvas.getContext('2d');
            var obj     = e.target.__object__;
            var coords  = obj.coords;
            var coords2 = obj.coords2;
            var mouseXY = RGraph.getMouseXY(e);
            var dataset = 0;
            
            if (e.type == 'mousemove' && obj.properties['chart.fill.mousemove.redraw']) {
                RGraph.RedrawCanvas(canvas);
            }

            for (var dataset=(obj.coords2.length-1); dataset>=0; --dataset) {
                
                // Draw the path again so that it can be checked
                context.beginPath();
                    obj.context.moveTo(obj.coords2[dataset][0][0], obj.coords2[dataset][0][1]);
                    for (var j=0; j<obj.coords2[dataset].length; ++j) {
                        context.lineTo(obj.coords2[dataset][j][0], obj.coords2[dataset][j][1]);
                    }
                    
                // Draw a line back to the starting point
                obj.context.lineTo(obj.coords2[dataset][0][0], obj.coords2[dataset][0][1]);
    
                // Go thru the previous datasets coords in reverse order
                if (obj.Get('chart.accumulative') && dataset > 0) {
                    obj.context.lineTo(obj.coords2[dataset - 1][0][0], obj.coords2[dataset - 1][0][1]);
                    for (var j=(obj.coords2[dataset - 1].length - 1); j>=0; --j) {
                        obj.context.lineTo(obj.coords2[dataset - 1][j][0], obj.coords2[dataset - 1][j][1]);
                    }
                }

                context.closePath();
                
                if (context.isPointInPath(mouseXY[0], mouseXY[1])) {
                    var inPath = true;
                    break;
                }
            }
            
            // Call the events
            if (inPath) {

                var fillTooltips = obj.properties['chart.fill.tooltips'];

                /**
                * Click event
                */
                if (e.type == 'click') {
                    if (obj.properties['chart.fill.click']) {
                        obj.properties['chart.fill.click'](e, dataset);
                    }
                
                    if (obj.properties['chart.fill.tooltips'] && obj.properties['chart.fill.tooltips'][dataset]) {
                        obj.DatasetTooltip(e, dataset);
                    }
                }



                /**
                * Mousemove event
                */
                if (e.type == 'mousemove') {

                    if (obj.properties['chart.fill.mousemove']) {                    
                        obj.properties['chart.fill.mousemove'](e, dataset);
                    }
                    
                    if (!RGraph.is_null(fillTooltips)) {
                        e.target.style.cursor = 'pointer';
                    }
                
                    if (obj.properties['chart.fill.tooltips'] && obj.properties['chart.fill.tooltips'][dataset]) {
                        e.target.style.cursor = 'pointer';
                    }
                }

                e.stopPropagation();
            
            } else if (e.type == 'mousemove') {
                canvas.style.cursor = 'default';
            }
        }
        
        /**
        * Add the click listener
        */
        if (this.properties['chart.fill.click'] || !RGraph.is_null(this.properties['chart.fill.tooltips'])) {
            this.canvas.addEventListener('click', func, false);
        }

        /**
        * Add the mousemove listener
        */
        if (this.properties['chart.fill.mousemove'] || !RGraph.is_null(this.properties['chart.fill.tooltips'])) {
            this.canvas.addEventListener('mousemove', func, false);
        }
    }



    /**
    * This highlights a specific dataset on the chart
    * 
    * @param number dataset The index of the dataset (which starts at zero)
    */
    RGraph.Radar.prototype.HighlightDataset = function (dataset)
    {
        var context = this.context;

        context.beginPath();
        for (var j=0; j<this.coords2[dataset].length; ++j) {
            if (j == 0) {
                this.context.moveTo(this.coords2[dataset][0][0], this.coords2[dataset][0][1]);
            } else {
                this.context.lineTo(this.coords2[dataset][j][0], this.coords2[dataset][j][1]);
            }
        }

        this.context.lineTo(this.coords2[dataset][0][0], this.coords2[dataset][0][1]);
        
        if (this.Get('chart.accumulative') && dataset > 0) {
            this.context.lineTo(this.coords2[dataset - 1][0][0], this.coords2[dataset - 1][0][1]);
            for (var j=(this.coords2[dataset - 1].length - 1); j>=0; --j) {
                this.context.lineTo(this.coords2[dataset - 1][j][0], this.coords2[dataset - 1][j][1]);
            }
        }

        context.strokeStyle = this.properties['chart.fill.highlight.stroke'];
        context.fillStyle   = this.properties['chart.fill.highlight.fill'];

        context.stroke();
        context.fill();
    }



    /**
    * Shows a tooltip for a dataset (a "fill" tooltip), You can pecify these
    * with chart.fill.tooltips
    */
    RGraph.Radar.prototype.DatasetTooltip = function (e, dataset)
    {
        var obj = e.target.__object__;

        // Highlight the dataset
        obj.HighlightDataset(dataset);
        
        // Use the First datapoints coords for the Y position of the tooltip NOTE The X position is changed in the
        // obj.positionTooltip() method so set the index to be the first one
        var text = obj.properties['chart.fill.tooltips'][dataset];
        var x    = 0;
        var y    = obj.coords2[dataset][0][1] + RGraph.getCanvasXY(obj.canvas)[1];


        // Show a tooltip
        RGraph.Tooltip(obj, text, x, y, 0, e);
    }