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
    * The bar chart constructor
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.Waterfall = function (id, data)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'waterfall';
        this.max               = 0;
        this.isRGraph          = true;
        this.coords            = [];
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;
        this.coordsText        = [];

        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);


        // Various config
        this.properties = {
            'chart.background.barcolor1':   'rgba(0,0,0,0)',
            'chart.background.barcolor2':   'rgba(0,0,0,0)',
            'chart.background.grid':        true,
            'chart.background.grid.color':  '#ddd',
            'chart.background.grid.width':  1,
            'chart.background.grid.hsize':  20,
            'chart.background.grid.vsize':  20,
            'chart.background.grid.vlines': true,
            'chart.background.grid.hlines': true,
            'chart.background.grid.border': true,
            'chart.background.grid.autofit':true,
            'chart.background.grid.autofit.numhlines': 5,
            'chart.background.grid.autofit.numvlines': 20,
            'chart.background.grid.autofit.align': false,
            'chart.background.image':       null,
            'chart.background.hbars':       null,
            'chart.linewidth':              1,
            'chart.axis.linewidth':         1,
            'chart.xaxispos':               'bottom',
            'chart.numxticks':              null,
            'chart.numyticks':              10,
            'chart.hmargin':                5,
            'chart.strokestyle':            '#666',
            'chart.axis.color':             'black',
            'chart.gutter.left':            25,
            'chart.gutter.right':           25,
            'chart.gutter.top':             25,
            'chart.gutter.bottom':          25,
            'chart.labels':                 [],
            'chart.ylabels':                true,
            'chart.text.color':             'black',
            'chart.text.size':              10,
            'chart.text.angle':             0,
            'chart.text.font':              'Arial',
            'chart.ymax':                   null,
            'chart.title':                  '',
            'chart.title.color':            'black',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.title.xaxis':            '',
            'chart.title.yaxis':            '',
            'chart.title.yaxis.bold':       true,
            'chart.title.yaxis.size':       null,
            'chart.title.yaxis.font':       null,
            'chart.title.yaxis.color':      null,
            'chart.title.xaxis.pos':        null,
            'chart.title.yaxis.pos':        null,
            'chart.title.yaxis.align':      'left',
            'chart.title.xaxis.bold':       true,
            'chart.title.xaxis.size':       null,
            'chart.title.xaxis.font':       null,
            'chart.title.yaxis.x':          null,
            'chart.title.yaxis.y':          null,
            'chart.title.xaxis.x':          null,
            'chart.title.xaxis.y':          null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.colors':                 ['Gradient(white:green)', 'Gradient(white:red)', 'Gradient(white:blue)'],
            'chart.shadow':                 false,
            'chart.shadow.color':           '#666',
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,
            'chart.shadow.blur':            3,
            'chart.tooltips':               null,
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.event':         'onclick',
            'chart.tooltips.highlight':     true,
            'chart.tooltips.override':     null,
            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',
            'chart.contextmenu':            null,
            'chart.units.pre':              '',
            'chart.units.post':             '',
            'chart.scale.decimals':         0,
            'chart.scale.point':            '.',
            'chart.scale.thousand':         ',',
        //'chart.scale.formatter':        null,
            'chart.crosshairs':             false,
            'chart.crosshairs.color':       '#333',
            'chart.crosshairs.hline':       true,
            'chart.crosshairs.vline':       true,
            'chart.annotatable':            false,
            'chart.annotate.color':         'black',
            'chart.zoom.factor':            1.5,
            'chart.zoom.fade.in':           true,
            'chart.zoom.fade.out':          true,
            'chart.zoom.hdir':              'right',
            'chart.zoom.vdir':              'down',
            'chart.zoom.frames':            25,
            'chart.zoom.delay':             16.666,
            'chart.zoom.shadow':            true,
            'chart.zoom.background':        true,
            'chart.resizable':              false,
            'chart.resize.handle.background': null,
            'chart.noaxes':                 false,
            'chart.noxaxis':                false,
            'chart.noyaxis':                false,
            'chart.axis.color':             'black',
            'chart.total':                  true,
            'chart.multiplier.x':           1,
            'chart.multiplier.w':           1,
            'chart.events.click':           null,
            'chart.events.mousemove':       null
        }

        // Check for support
        if (!this.canvas) {
            alert('[WATERFALL] No canvas support');
            return;
        }

        // Store the data
        this.data = data;
        
        /**
        * Create the $ objects
        */
        for (var i=0; i<=this.data.length; ++i) {
            this['$' + i] = {}
        }


        /**
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
        * A setter
        * 
        * @param name  string The name of the property to set
        * @param value mixed  The value of the property
        */
        this.Set = function (name, value)
        {
            /**
            * This should be done first - prepend the propertyy name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }
            
            if (name == 'chart.total' && prop['chart.numxticks'] == null) {
                prop['chart.numxticks'] = this.data.length;
            }
    
            prop[name.toLowerCase()] = value;
    
            return this;
        }




        /**
        * A getter
        * 
        * @param name  string The name of the property to get
        */
        this.Get = function (name)
        {
            /**
            * This should be done first - prepend the property name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }
    
            return prop[name.toLowerCase()];
        }




        /**
        * The function you call to draw the bar chart
        */
        this.Draw = function ()
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
            * Draw the background image
            */
            RGraph.DrawBackgroundImage(this);
            
            /**
            * This is new in May 2011 and facilitates indiviual gutter settings,
            * eg chart.gutter.left
            */
            this.gutterLeft   = prop['chart.gutter.left'];
            this.gutterRight  = prop['chart.gutter.right'];
            this.gutterTop    = prop['chart.gutter.top'];
            this.gutterBottom = prop['chart.gutter.bottom'];

            /**
            * Stop the coords array from growing uncontrollably
            */
            this.coords = [];
            
            /**
            * This gets used a lot
            */
            this.centery = ((ca.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop;
    
            /**
            * Work out a few things. They need to be here because they depend on things you can change after you instantiate the object
            */
            this.max            = 0;
            this.grapharea      = ca.height - this.gutterTop - this.gutterBottom;
            this.graphwidth     = ca.width - this.gutterLeft - this.gutterRight;
            this.halfTextHeight = prop['chart.text.size'] / 2;
    
    
            /**
            * Work out the maximum value
            */
            this.max     = this.getMax(this.data);
    
            var decimals = prop['chart.scale.decimals'];
            this.scale2 = RGraph.getScale2(this, {'max':typeof(prop['chart.ymax']) == 'number' ? prop['chart.ymax'] : this.max,
                                                  'min':prop['chart.xmin'],
                                                  'strict': typeof(prop['chart.ymax']) == 'number' ? true : false,
                                                  'scale.decimals':Number(decimals),
                                                  'scale.point':prop['chart.scale.point'],
                                                  'scale.thousand':prop['chart.scale.thousand'],
                                                  'scale.round':prop['chart.scale.round'],
                                                  'units.pre':prop['chart.units.pre'],
                                                  'units.post':prop['chart.units.post'],
                                                  'ylabels.count':prop['chart.labels.count']
                                                 });
    
            this.max     = this.scale2.max;
    
    
            // Draw the background hbars
            RGraph.DrawBars(this)

            // Progressively Draw the chart
            RG.background.Draw(this);
    
            this.DrawAxes();
            this.Drawbars();
            this.DrawLabels();
            
            /**
            * If the X axis is at the bottom - draw the it again so that it appears "on top" of the bars
            */
            if (prop['chart.xaxispos'] == 'bottom' && prop['chart.noaxes'] == false && prop['chart.noxaxis'] == false) {
                co.strokeStyle = prop['chart.axis.color'];
                co.strokeRect(prop['chart.gutter.left'], ca.height - prop['chart.gutter.bottom'], ca.width - this.gutterLeft - this.gutterRight, 0);
            }
    
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
            }
    
            
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
        * Draws the charts axes
        */
        this.DrawAxes = function ()
        {
            if (prop['chart.noaxes']) {
                return;
            }
    
            co.beginPath();
            co.strokeStyle = prop['chart.axis.color'];
            co.lineWidth   = prop['chart.axis.linewidth'] + 0.001;
    
            // Draw the Y axis
            if (prop['chart.noyaxis'] == false) {
                co.moveTo(Math.round(this.gutterLeft), this.gutterTop);
                co.lineTo(Math.round(this.gutterLeft), ca.height - this.gutterBottom);
            }

            // Draw the X axis
            if (prop['chart.noxaxis'] == false) {
                // Center X axis
                if (prop['chart.xaxispos'] == 'center') {
                    co.moveTo(this.gutterLeft, Math.round( ((ca.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop));
                    co.lineTo(ca.width - this.gutterRight, Math.round( ((ca.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop));
                } else {
                    co.moveTo(this.gutterLeft, Math.round(ca.height - this.gutterBottom));
                    co.lineTo(ca.width - this.gutterRight, Math.round(ca.height - this.gutterBottom));
                }
            }
    
            var numYTicks = prop['chart.numyticks'];
    
            // Draw the Y tickmarks
            if (prop['chart.noyaxis'] == false && prop['chart.numyticks'] > 0) {
    
                var yTickGap = (ca.height - this.gutterTop - this.gutterBottom) / numYTicks;
        
                for (y=this.gutterTop; y < (ca.height - this.gutterBottom); y += yTickGap) {
                    if (prop['chart.xaxispos'] == 'bottom' || (y != ((ca.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop)) {
                        co.moveTo(this.gutterLeft, Math.round( y));
                        co.lineTo(this.gutterLeft - 3, Math.round( y));
                    }
                }

                /**
                * If the X axis is not being shown, draw an extra tick
                */
                if (prop['chart.noxaxis'] || prop['chart.xaxispos'] == 'center') {
                    co.moveTo(this.gutterLeft - 3, Math.round(ca.height - this.gutterBottom));
                    co.lineTo(this.gutterLeft, Math.round(ca.height - this.gutterBottom));
                }
            }


            // Draw the X tickmarks
            if (prop['chart.numxticks'] == null) {
                prop['chart.numxticks'] = this.data.length + (prop['chart.total'] ? 1 : 0)
            }
    
            if (prop['chart.noxaxis'] == false && prop['chart.numxticks'] > 0) {
    
                xTickGap = (ca.width - this.gutterLeft - this.gutterRight ) / prop['chart.numxticks'];
                
                if (prop['chart.xaxispos'] == 'center') {
                    yStart   = ((ca.height - this.gutterBottom - this.gutterTop) / 2) + this.gutterTop - 3;
                    yEnd     = ((ca.height - this.gutterBottom - this.gutterTop) / 2) + this.gutterTop + 3;
                } else {
                    yStart   = ca.height - this.gutterBottom;
                    yEnd     = (ca.height - this.gutterBottom) + 3;
                }
        
                for (x=this.gutterLeft + xTickGap; x<=ca.width - this.gutterRight + 1; x+=xTickGap) {
                    co.moveTo(Math.round( x), yStart);
                    co.lineTo(Math.round( x), yEnd);
                }
                
                if (prop['chart.noyaxis']) {
                    co.moveTo(Math.round( this.gutterLeft), yStart);
                    co.lineTo(Math.round( this.gutterLeft), yEnd);
                }
            }
    
            /**
            * If the Y axis is not being shown, draw an extra tick
            */
            if (prop['chart.noyaxis'] && prop['chart.noxaxis'] == false) {
                co.moveTo(Math.round( this.gutterLeft), ca.height - this.gutterBottom);
                co.lineTo(Math.round( this.gutterLeft), ca.height - this.gutterBottom + 3);
            }
    
            co.stroke();
        }




        /**
        * Draws the labels for the graph
        */
        this.DrawLabels = function ()
        {
            var context    = co;
            var numYLabels = 5; // Make this configurable
            var interval   = this.grapharea / numYLabels;
            var font       = prop['chart.text.font'];
            var size       = prop['chart.text.size'];
            var color      = prop['chart.text.color'];
            var units_pre  = prop['chart.units.pre'];
            var units_post = prop['chart.units.post'];
            
            co.beginPath();
            co.fillStyle = color;
    
            /**
            * First, draw the Y labels
            */
            if (prop['chart.ylabels']) {
                if (prop['chart.xaxispos'] == 'center') {
    
                    var halfInterval = interval / 2;
                    var halfWay      = ((ca.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop;
    
                    for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                        RG.Text2(this, {
                                            'font':font,
                                            'size':size,
                                            'x':this.gutterLeft - 5,
                                            'y': this.gutterTop + (((this.grapharea/2) / len) * i),
                                            'text':this.scale2.labels[len - i - 1],
                                            'valign':'center',
                                            'halign':'right',
                                            'tag': 'scale'
                                           });
                        
                        RG.Text2(this, {
                                            'font':font,
                                            'size':size,
                                            'x':this.gutterLeft - 5,
                                            'y': halfWay + (((this.grapharea/2) / len) * (i + 1)),
                                            'text':this.scale2.labels[i],
                                            'valign':'center',
                                            'halign':'right',
                                            'tag': 'scale'
                                           });
                    }
    
                } else {
    
                    for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                        RG.Text2(this, {
                                            'font':font,
                                            'size':size,
                                            'x':this.gutterLeft - 5,
                                            'y': ca.height - this.gutterBottom - ((this.grapharea / len) * (i + 1)),
                                            'text':this.scale2.labels[i],
                                            'valign':'center',
                                            'halign':'right',
                                            'tag': 'scale'
                                           });
                    }
                }
            }
    
    
    
            /**
            * Now, draw the X labels
            */
            if (prop['chart.labels'].length > 0) {
            
                // Recalculate the interval for the X labels
                interval = (ca.width - this.gutterLeft - this.gutterRight) / prop['chart.labels'].length;
                
                var halign = 'center';
                var angle  = prop['chart.text.angle'];
                
                if (angle) {
                    halign = 'right';
                    angle *= -1;
                }
    
                var labels = prop['chart.labels'];
    
                for (var i=0,len=labels.length; i<len; i+=1) {
                    RG.Text2(this, {'font':font,
                                        'size':size,
                                        'x':this.gutterLeft + (i * interval) + (interval / 2),
                                        'y':ca.height - this.gutterBottom + 5 + this.halfTextHeight,
                                        'text':labels[i],
                                        'valign':'center',
                                        'halign':halign,
                                        'angle':angle,
                                        'tag': 'labels'
                                       });
                }
            }
            
            co.stroke();
            co.fill();
        }




        /**
        * Draws the bars on to the chart
        */
        this.Drawbars = function ()
        {
            var context      = co;
            var canvas       = ca;
            var hmargin      = prop['chart.hmargin'];
            var runningTotal = 0;
    
            co.lineWidth = prop['chart.linewidth'] + 0.001;

                for (var i=0,len=this.data.length; i<len; ++i) {
                    co.beginPath();
                    co.strokeStyle = prop['chart.strokestyle'];
    
                        var x      = Math.round( this.gutterLeft + hmargin + (((this.graphwidth / (this.data.length + (prop['chart.total'] ? 1 : 0))) * i) * prop['chart.multiplier.x']));
                        var y      = Math.round( this.gutterTop + this.grapharea - (i == 0 ? ((this.data[0] / this.max) * this.grapharea) : (this.data[i] > 0 ? ((runningTotal + this.data[i]) / this.max) * this.grapharea : (runningTotal / this.max) * this.grapharea)));
                        var w      = ((ca.width - this.gutterLeft - this.gutterRight) / (this.data.length + (prop['chart.total'] ? 1 : 0 )) ) - (2 * prop['chart.hmargin']);
                            w      = w * prop['chart.multiplier.w'];
                        var h      = (Math.abs(this.data[i]) / this.max) * this.grapharea;
    
                        if (prop['chart.xaxispos'] == 'center') {
                            h /= 2;
                            y  = (i == 0 ? ((this.data[0] / this.max) * this.grapharea) : (this.data[i] > 0 ? ((runningTotal + this.data[i]) / this.max) * this.grapharea : (runningTotal / this.max) * this.grapharea));
                            y  = this.gutterTop + (this.grapharea/2) - (y / 2);
                        }
    
                        // Color
                        co.fillStyle = this.data[i] >= 0 ? prop['chart.colors'][0] : prop['chart.colors'][1];
    
                        
                        if (prop['chart.shadow']) {
                            RG.SetShadow(this, prop['chart.shadow.color'], prop['chart.shadow.offsetx'], prop['chart.shadow.offsety'], prop['chart.shadow.blur']);
                        } else {
                            RG.NoShadow(this);
                        }
    
                        co.rect(x, y, w, h);
    
                        this.coords.push([x, y, w, h]);
                        
                        runningTotal += this.data[i];
    
                    co.stroke();
                    co.fill();
                }
                
                // Store the total
                this.total = runningTotal;
    
                if (prop['chart.total']) {
                
                    // This is the height of the final bar
                    h = (runningTotal / this.max) * (this.grapharea / (prop['chart.xaxispos'] == 'center' ? 2 : 1));

                    /**
                    * Set the Y (ie the start point) value
                    */
                    if (prop['chart.xaxispos'] == 'center') {
                        y = runningTotal > 0 ? this.centery - h : this.centery - h;
                    } else {
                        y = ca.height - this.gutterBottom - h;
                    }
                
                    // This is the X position of the final bar
                    x = x + (prop['chart.hmargin'] * 2) + w;
                
                
                    // Final color
                    co.fillStyle = prop['chart.colors'][2];
                
                    co.beginPath();
                    co.strokeRect(x, y, w, h);
                    co.fillRect(x, y, w, h);
                    co.stroke();
                    co.fill();
                
                    this.coords.push([x, y - (runningTotal > 0 ? 0 : Math.abs(h)), w, Math.abs(h)]);
                }
    
                RG.NoShadow(this);
    
                /**
                * This draws the connecting lines
                */
                co.lineWidth = 1;
    
                for (var i=1,len=this.coords.length; i<len; i+=1) {
                    co.strokeStyle = 'gray';
                    co.beginPath();
                        if (this.data[i - 1] > 0) {
                            co.moveTo(this.coords[i - 1][0] + this.coords[i - 1][2], Math.round( this.coords[i - 1][1]));
                            co.lineTo(this.coords[i - 1][0] + this.coords[i - 1][2] + (2 * hmargin), Math.round( this.coords[i - 1][1]));
                        } else {
                            co.moveTo(this.coords[i - 1][0] + this.coords[i - 1][2], Math.round( this.coords[i - 1][1] + this.coords[i - 1][3]));
                            co.lineTo(this.coords[i - 1][0] + this.coords[i - 1][2] + (2 * hmargin), Math.round( this.coords[i - 1][1] + this.coords[i - 1][3]));
                        }
                    co.stroke();
                }
        }




        /**
        * Not used by the class during creating the graph, but is used by event handlers
        * to get the coordinates (if any) of the selected bar
        * 
        * @param object e The event object
        */
        this.getShape =
        this.getBar = function (e)
        {
            /**
            * Loop through the bars determining if the mouse is over a bar
            */
            for (var i=0,len=this.coords.length; i<len; i++) {
    
                var mouseCoords = RG.getMouseXY(e);
                var mouseX = mouseCoords[0];
                var mouseY = mouseCoords[1];
    
                var left   = this.coords[i][0];
                var top    = this.coords[i][1];
                var width  = this.coords[i][2];
                var height = this.coords[i][3];
    
                if (   mouseX >= left
                    && mouseX <= (left + width)
                    && mouseY >= top
                    && mouseY <= top + height) {
                    
                    var tooltip = RG.parseTooltipText(prop['chart.tooltips'], i);
    
                    return {0: this,   'object': this,
                            1: left,   'x':      left,
                            2: top,    'y':      top,
                            3: width,  'width':  width,
                            4: height, 'height': height,
                            5: i,      'index':  i,
                                       'tooltip': tooltip};
                }
            }
            
            return null;
        }




        /**
        * The Waterfall is slightly different to Bar/Line charts so has this function to get the max value
        */
        this.getMax = function (data)
        {
            var runningTotal = 0;
            var max          = 0;
    
            for (var i=0,len=data.length; i<len; i+=1) {
                runningTotal += data[i];
                max = Math.max(max, Math.abs(runningTotal));
            }
    
            return max;
        }




        /**
        * This function facilitates the installation of tooltip event listeners if
        * tooltips are defined.
        */
        this.AllowTooltips = function ()
        {
            // Preload any tooltip images that are used in the tooltips
            RG.PreLoadTooltipImages(this);
    
    
            /**
            * This installs the window mousedown event listener that lears any
            * highlight that may be visible.
            */
            RG.InstallWindowMousedownTooltipListener(this);
    
    
            /**
            * This installs the canvas mousemove event listener. This function
            * controls the pointer shape.
            */
            RG.InstallCanvasMousemoveTooltipListener(this);
    
    
            /**
            * This installs the canvas mouseup event listener. This is the
            * function that actually shows the appropriate tooltip (if any).
            */
            RG.InstallCanvasMouseupTooltipListener(this);
        }




        /**
        * Each object type has its own Highlight() function which highlights the appropriate shape
        * 
        * @param object shape The shape to highlight
        */
        this.Highlight = function (shape)
        {
            // Add the new highlight
            RG.Highlight.Rect(this, shape);
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
            var mouseXY = RG.getMouseXY(e);
    
            if (
                   mouseXY[0] > this.gutterLeft
                && mouseXY[0] < (ca.width - this.gutterRight)
                && mouseXY[1] > this.gutterTop
                && mouseXY[1] < (ca.height - this.gutterBottom)
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
        this.positionTooltip = function (obj, x, y, tooltip, idx)
        {
            var coordX     = obj.coords[tooltip.__index__][0];
            var coordY     = obj.coords[tooltip.__index__][1];
            var coordW     = obj.coords[tooltip.__index__][2];
            var coordH     = obj.coords[tooltip.__index__][3];
            var canvasXY   = RG.getCanvasXY(obj.canvas);
            var gutterLeft = obj.gutterLeft;
            var gutterTop  = obj.gutterTop;
            var width      = tooltip.offsetWidth;
            var height     = tooltip.offsetHeight;
            var value      = obj.data[idx];
    
            /**
            * Change the value to be the total if necessary
            */
            if (tooltip.__index__ == obj.data.length) {
                value = obj.total;
            }
    
            // Set the top position
            tooltip.style.left = 0;
            tooltip.style.top  = canvasXY[1] + coordY - height - 7 + 'px';
    
    
            /**
            * If the tooltip is for a negative value - position it underneath the bar
            */
            if (value < 0) {
                tooltip.style.top =  canvasXY[1] + coordY + coordH + 7 + 'px';
            }
    
    
            // By default any overflow is hidden
            tooltip.style.overflow = '';
    
            // The arrow
            var img = new Image();
                img.id = '__rgraph_tooltip_pointer__';
                img.style.position = 'absolute';
                if (value >= 0) {
                    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAFCAYAAACjKgd3AAAARUlEQVQYV2NkQAN79+797+RkhC4M5+/bd47B2dmZEVkBCgcmgcsgbAaA9GA1BCSBbhAuA/AagmwQPgMIGgIzCD0M0AMMAEFVIAa6UQgcAAAAAElFTkSuQmCC';
                    img.style.top = (tooltip.offsetHeight - 2) + 'px';
                } else {
                    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAFCAMAAACkeOZkAAAAK3RFWHRDcmVhdGlvbiBUaW1lAFNhdCA2IE9jdCAyMDEyIDEyOjQ5OjMyIC0wMDAw2S1RlgAAAAd0SU1FB9wKBgszM4Ed2k4AAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAEZ0FNQQAAsY8L/GEFAAAACVBMVEX/AAC9vb3//+92Pom0AAAAAXRSTlMAQObYZgAAAB1JREFUeNpjYAABRgY4YGRiRDCZYBwQE8qBMEEcAANCACqByy1sAAAAAElFTkSuQmCC';
                    img.style.top = '-5px';
                }
            tooltip.appendChild(img);
            
            // Reposition the tooltip if at the edges:
            
            // LEFT edge
            if ((canvasXY[0] + coordX - (width / 2)) < 10) {
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
        * This method returns the appropriate Y coord for the given value
        * 
        * @param number value The value
        */
        this.getYCoord = function (value)
        {
            if (value > this.max) {
                return null;
            }
    
            if (prop['chart.xaxispos'] == 'center') {
    
                if (value < (-1 * this.max)) {
                    return null;
                }
            
                var coord = (value / this.max) * (this.grapharea / 2);    
                return this.gutterTop + (this.grapharea / 2) - coord;
            
            } else {
    
                if (value < 0) {
                    return null;
                }
    
                var coord = (value / this.max) * this.grapharea;
                    coord = coord + this.gutterTop;
                return ca.height - coord;
            }
        }




        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            // chart.colors
            var colors = prop['chart.colors'];

            if (colors) {
                for (var i=0,len=colors.length; i<len; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }
    
            // chart.key.colors
            var colors = prop['chart.key.colors'];

            if (colors) {
                for (var i=0,len=colors.length; i<len; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }
    
             prop['chart.crosshairs.color']      = this.parseSingleColorForGradient(prop['chart.crosshairs.color']);
             prop['chart.highlight.stroke']      = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
             prop['chart.highlight.fill']        = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
             prop['chart.background.barcolor1']  = this.parseSingleColorForGradient(prop['chart.background.barcolor1']);
             prop['chart.background.barcolor2']  = this.parseSingleColorForGradient(prop['chart.background.barcolor2']);
             prop['chart.background.grid.color'] = this.parseSingleColorForGradient(prop['chart.background.grid.color']);
             prop['chart.strokestyle']           = this.parseSingleColorForGradient(prop['chart.strokestyle']);
             prop['chart.axis.color']            = this.parseSingleColorForGradient(prop['chart.axis.color']);
        }




        /**
        * This parses a single color value
        * 
        * @param string color The color to parse for gradients
        */
        this.parseSingleColorForGradient = function (color)
        {
            if (!color || typeof(color) != 'string') {
                return color;
            }

            if (color.match(/^gradient\((.*)\)$/i)) {
                
                var parts = RegExp.$1.split(':');
    
                // Create the gradient

                var grad = co.createLinearGradient(0,ca.height - prop['chart.gutter.bottom'], 0, prop['chart.gutter.top']);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
                
            return grad ? grad : color;
        }




        /**
        * Now, because canvases can support multiple charts, canvases must always be registered
        */
        RG.Register(this);
    }