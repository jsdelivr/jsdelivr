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
    * The horizontal bar chart constructor. The horizontal bar is a minor variant
    * on the bar chart. If you have big labels, this may be useful as there is usually
    * more space available for them.
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.HBar = function (id, data)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.data              = data;
        this.type              = 'hbar';
        this.coords            = [];
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);

        
        this.max = 0;
        this.stackedOrGrouped  = false;

        // Default properties
        this.properties = {
            'chart.gutter.left':            75,
            'chart.gutter.right':           25,
            'chart.gutter.top':             35,
            'chart.gutter.bottom':          25,
            'chart.background.grid':        true,
            'chart.background.grid.color':  '#ddd',
            'chart.background.grid.width':  1,
            'chart.background.grid.hsize':  25,
            'chart.background.grid.vsize':  25,
            'chart.background.barcolor1':   'rgba(0,0,0,0)',
            'chart.background.barcolor2':   'rgba(0,0,0,0)',
            'chart.background.grid.hlines': true,
            'chart.background.grid.vlines': true,
            'chart.background.grid.border': true,
            'chart.background.grid.autofit':true,
            'chart.background.grid.autofit.numhlines': 14,
            'chart.background.grid.autofit.numvlines': 20,
            'chart.linewidth':              1,
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.xaxis':            '',
            'chart.title.xaxis.bold':       true,
            'chart.title.xaxis.size':       null,
            'chart.title.xaxis.font':       null,
            'chart.title.yaxis':            '',
            'chart.title.yaxis.bold':       true,
            'chart.title.yaxis.size':       null,
            'chart.title.yaxis.font':       null,
            'chart.title.yaxis.color':      null,
            'chart.title.xaxis.pos':        null,
            'chart.title.yaxis.pos':        0.5,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.text.size':              10,
            'chart.text.color':             'black',
            'chart.text.font':              'Arial',
            'chart.colors':                 ['Gradient(white:red)', 'Gradient(white:blue)', 'Gradient(white:green)', 'Gradient(white:pink)', 'Gradient(white:yellow)', 'Gradient(white:cyan)', 'Gradient(white:navy)', 'Gradient(white:gray)', 'Gradient(white:black)'],
            'chart.colors.sequential':      false,
            'chart.labels':                 [],
            'chart.labels.colors':          [],
            'chart.labels.above':           false,
            'chart.labels.above.decimals':  0,
            'chart.xlabels':                true,
            'chart.contextmenu':            null,
            'chart.key':                    null,
            'chart.key.background':         'white',
            'chart.key.position':           'graph',
            'chart.key.halign':             'right',
            'chart.key.shadow':             false,
            'chart.key.shadow.color':       '#666',
            'chart.key.shadow.blur':        3,
            'chart.key.shadow.offsetx':     2,
            'chart.key.shadow.offsety':     2,
            'chart.key.position.gutter.boxed': true,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.units.pre':              '',
            'chart.units.post':             '',
            'chart.units.ingraph':          false,
            'chart.strokestyle':            'rgba(0,0,0,0)',
            'chart.xmin':                   0,
            'chart.xmax':                   0,
            'chart.axis.color':             'black',
            'chart.shadow':                 false,
            'chart.shadow.color':           '#666',
            'chart.shadow.blur':            3,
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,
            'chart.vmargin':                2,
            'chart.vmargin.grouped':        2,
            'chart.grouping':               'grouped',
            'chart.tooltips':               null,
            'chart.tooltips.event':         'onclick',
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.highlight':     true,
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',
            'chart.highlight.stroke':       'rgba(0,0,0,0)',
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
            'chart.zoom.action':            'zoom',
            'chart.resizable':              false,
            'chart.resize.handle.adjust':   [0,0],
            'chart.resize.handle.background': null,
            'chart.scale.point':            '.',
            'chart.scale.thousand':         ',',
            'chart.scale.decimals':         null,
            'chart.noredraw':               false,
            'chart.events.click':           null,
            'chart.events.mousemove':       null,
            'chart.noxaxis':                false,
            'chart.noyaxis':                false,
            'chart.noaxes':                 false,
            'chart.noxtickmarks':           false,
            'chart.noytickmarks':           false,
            'chart.xlabels.colors':         [],
            'chart.numyticks':              data.length,
            'chart.numxticks':              10
        }

        // Check for support
        if (!this.canvas) {
            alert('[HBAR] No canvas support');
            return;
        }

        for (i=0; i<this.data.length; ++i) {
            if (typeof(this.data[i]) == 'object') {
                this.stackedOrGrouped = true;
            }
        }


        /**
        * Create the dollar objects so that functions can be added to them
        */
        var linear_data = RGraph.array_linearize(data);
        for (var i=0; i<linear_data.length; ++i) {
            this['$' + i] = {};
        }



        /**
        * Create the linear data array
        */
        this.data_arr = RGraph.array_linearize(this.data);


        /**
        * Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        * done already
        */
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            
            this.canvas.__rgraph_aa_translated__ = true;
        }



        /**
        * Charts are now always registered
        */
        RGraph.Register(this);
    }


    /**
    * A setter
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.HBar.prototype.Set = function (name, value)
    {
        name = name.toLowerCase();

        /**
        * This should be done first - prepend the propertyy name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        if (name == 'chart.labels.abovebar') {
            name = 'chart.labels.above';
        }

        this.properties[name] = value;
    }


    /**
    * A getter
    * 
    * @param name  string The name of the property to get
    */
    RGraph.HBar.prototype.Get = function (name)

    {
        /**
        * This should be done first - prepend the property name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        if (name == 'chart.labels.abovebar') {
            name = 'chart.labels.above';
        }

        return this.properties[name];
    }


    /**
    * The function you call to draw the bar chart
    */
    RGraph.HBar.prototype.Draw = function ()
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
        this.gutterLeft   = this.Get('chart.gutter.left');
        this.gutterRight  = this.Get('chart.gutter.right');
        this.gutterTop    = this.Get('chart.gutter.top');
        this.gutterBottom = this.Get('chart.gutter.bottom');

        /**
        * Stop the coords array from growing uncontrollably
        */
        this.coords = [];
        this.max    = 0;

        /**
        * Check for chart.xmin in stacked charts
        */
        if (this.Get('chart.xmin') > 0 && this.Get('chart.grouping') == 'stacked') {
            alert('[HBAR] Using chart.xmin is not supported with stacked charts, resetting chart.xmin to zero');
            this.Set('chart.xmin', 0);
        }

        /**
        * Work out a few things. They need to be here because they depend on things you can change before you
        * call Draw() but after you instantiate the object
        */
        this.graphwidth     = this.canvas.width - this.gutterLeft - this.gutterRight;
        this.graphheight    = this.canvas.height - this.gutterTop - this.gutterBottom;
        this.halfgrapharea  = this.grapharea / 2;
        this.halfTextHeight = this.Get('chart.text.size') / 2;


        /**
        * This sets the label colors. Doing it here saves lots of if() conditions in the draw method
        */
        if (this.properties['chart.labels.colors'].length < this.properties['chart.labels'].length) {
            while (this.properties['chart.labels.colors'].length < this.properties['chart.labels'].length) {
                this.properties['chart.labels.colors'].push(this.properties['chart.labels.colors'][this.properties['chart.labels.colors'].length - 1]);
            }
        } else {
            while (this.properties['chart.labels.colors'].length < this.properties['chart.labels'].length) {
                this.properties['chart.labels.colors'].push(this.properties['chart.text.color']);
            }
        }


        var numLabels    = this.properties['chart.yaxispos'] == 'center' ? 10 : 5;

        if (this.properties['chart.xlabels.colors'].length < numLabels) {
            while (this.properties['chart.xlabels.colors'].length < numLabels) {
                this.properties['chart.xlabels.colors'].push(this.properties['chart.xlabels.colors'][this.properties['chart.xlabels.colors'].length - 1]);
            }
        } else {
            while (this.properties['chart.xlabels.colors'].length < numLabels) {
                this.properties['chart.xlabels.colors'].push(this.properties['chart.text.color']);
            }
        }


        // Progressively Draw the chart
        RGraph.background.Draw(this);

        this.Drawbars();
        this.DrawAxes();
        this.DrawLabels();


        // Draw the key if necessary
        if (this.Get('chart.key') && this.Get('chart.key').length) {
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));
        }



        /**
        * Setup the context menu if required
        */
        if (this.Get('chart.contextmenu')) {
            RGraph.ShowContext(this);
        }


        /**
        * Draw "in graph" labels
        */
        RGraph.DrawInGraphLabels(this);

        
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
    * This draws the axes
    */
    RGraph.HBar.prototype.DrawAxes = function ()
    {
        var halfway = Math.round((this.graphwidth / 2) + this.gutterLeft);

        this.context.beginPath();
            
            this.context.lineWidth   = this.properties['chart.axis.linewidth'] ? this.properties['chart.axis.linewidth'] + 0.001 : 1.001;
            this.context.strokeStyle = this.Get('chart.axis.color');

            // Draw the Y axis
            if (this.properties['chart.noyaxis'] == false && this.properties['chart.noaxes'] == false) {
                if (this.Get('chart.yaxispos') == 'center') {
                    this.context.moveTo(halfway, this.gutterTop);
                    this.context.lineTo(halfway, this.canvas.height - this.gutterBottom);
                } else {
                    this.context.moveTo(this.gutterLeft, this.gutterTop);
                    this.context.lineTo(this.gutterLeft, this.canvas.height - this.gutterBottom);
                }
            }

            // Draw the X axis
            if (this.Get('chart.noxaxis') == false && this.properties['chart.noaxes'] == false) {
                this.context.moveTo(this.gutterLeft +0.001, this.canvas.height - this.gutterBottom + 0.001);
                this.context.lineTo(this.canvas.width - this.gutterRight + 0.001, this.canvas.height - this.gutterBottom + 0.001);
            }

            // Draw the Y tickmarks
            if (   this.Get('chart.noytickmarks') == false
                && this.Get('chart.noyaxis') == false
                && this.properties['chart.numyticks'] > 0
                && this.properties['chart.noaxes'] == false
               ) {
    
                var yTickGap = (this.canvas.height - this.gutterTop - this.gutterBottom) / (this.properties['chart.numyticks'] > 0 ? this.properties['chart.numyticks'] : this.data.length);
        
                for (y=this.gutterTop; y<(this.canvas.height - this.gutterBottom - 1); y+=yTickGap) {
                    if (this.Get('chart.yaxispos') == 'center') {
                        this.context.moveTo(halfway + 3, Math.round(y));
                        this.context.lineTo(halfway  - 3, Math.round(y));
                    } else {
                        this.context.moveTo(this.gutterLeft, Math.round(y));
                        this.context.lineTo( this.gutterLeft  - 3, Math.round(y));
                    }
                }
                
                // If the X axis isn't being shown draw the end tick
                if (this.Get('chart.noxaxis') == true) {
                    if (this.Get('chart.yaxispos') == 'center') {
                        this.context.moveTo(halfway + 3, Math.round(y));
                        this.context.lineTo(halfway  - 3, Math.round(y));
                    } else {
                        this.context.moveTo(this.gutterLeft, Math.round(y));
                        this.context.lineTo( this.gutterLeft  - 3, Math.round(y));
                    }
                }
            }
    
    
            // Draw the X tickmarks
            if (   this.Get('chart.noxtickmarks') == false
                && this.Get('chart.noxaxis') == false
                && this.properties['chart.numxticks'] > 0
                && this.properties['chart.noaxes'] == false) {

                xTickGap = (this.canvas.width - this.gutterLeft - this.gutterRight ) / this.properties['chart.numxticks'];
                
                yStart   = this.canvas.height - this.gutterBottom;
                yEnd     = (this.canvas.height - this.gutterBottom) + 3;
        
                for (x=(this.canvas.width - this.gutterRight), i=0; this.Get('chart.yaxispos') == 'center' ? x>=this.gutterLeft : x>this.gutterLeft; x-=xTickGap) {
        
                    if (this.Get('chart.yaxispos') != 'center' || i != 5) {
                        this.context.moveTo(Math.round(x), yStart);
                        this.context.lineTo(Math.round(x), yEnd);
                    }
                    i++;
                }

                // If the Y axis isn't being shown draw the end tick
                if (this.Get('chart.noyaxis') == true) {
                    this.context.moveTo(this.gutterLeft, Math.round(yStart));
                    this.context.lineTo( this.gutterLeft, Math.round(yEnd));
                }
            }
        this.context.stroke();
            
        /**
        * Reset the linewidth
        */
        this.context.lineWidth = 1;
    }


    /**
    * This draws the labels for the graph
    */
    RGraph.HBar.prototype.DrawLabels = function ()
    {
        var context    = this.context;
        var canvas     = this.canvas;
        var units_pre  = this.Get('chart.units.pre');
        var units_post = this.Get('chart.units.post');
        var text_size  = this.Get('chart.text.size');
        var font       = this.Get('chart.text.font');
        var xcolors    = this.properties['chart.xlabels.colors'];
        var ycolors    = this.properties['chart.labels.colors'];


        /**
        * Set the units to blank if they're to be used for ingraph labels only
        */
        if (this.Get('chart.units.ingraph')) {
            units_pre  = '';
            units_post = '';
        }


        /**
        * Draw the X axis labels
        */
        if (this.Get('chart.xlabels')) {

            var gap = 5;

            this.context.beginPath();
            this.context.fillStyle = this.Get('chart.text.color');


            if (this.Get('chart.yaxispos') == 'center') {
                if (xcolors[9]) this.context.fillStyle = xcolors[9]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (10/10)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[4]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[8]) this.context.fillStyle = xcolors[8]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (9/10)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[3]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[7]) this.context.fillStyle = xcolors[7]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (8/10)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[2]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[6]) this.context.fillStyle = xcolors[6]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (7/10)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[1]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[5]) this.context.fillStyle = xcolors[5]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (6/10)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[0]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');

                if (xcolors[4]) this.context.fillStyle = xcolors[4]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (4/10)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, '-' + RGraph.number_format(this, Number(this.scale[0]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[3]) this.context.fillStyle = xcolors[3]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (3/10)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, '-' + RGraph.number_format(this, Number(this.scale[1]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[2]) this.context.fillStyle = xcolors[2]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (2/10)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, '-' + RGraph.number_format(this, Number(this.scale[2]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[1]) this.context.fillStyle = xcolors[1]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (1/10)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, '-' + RGraph.number_format(this, Number(this.scale[3]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[0]) this.context.fillStyle = xcolors[0]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (0)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, '-' + RGraph.number_format(this, Number(this.scale[4]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
    
            } else {

                if (xcolors[4]) this.context.fillStyle = xcolors[4]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (5/5)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[4]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[3]) this.context.fillStyle = xcolors[3]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (4/5)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[3]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[2]) this.context.fillStyle = xcolors[2]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (3/5)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[2]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[1]) this.context.fillStyle = xcolors[1]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (2/5)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[1]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                if (xcolors[0]) this.context.fillStyle = xcolors[0]; RGraph.Text(context, font, text_size, this.gutterLeft + (this.graphwidth * (1/5)), this.gutterTop + this.halfTextHeight + this.graphheight + gap, RGraph.number_format(this, Number(this.scale[0]).toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', 'center');
                
                if (this.Get('chart.xmin') > 0 || this.properties['chart.noyaxis'] == true) {
                    RGraph.Text(context,font,text_size,this.gutterLeft,this.gutterTop + this.halfTextHeight + this.graphheight + gap,RGraph.number_format(this, this.Get('chart.xmin'), units_pre, units_post),'center','center');
                }
            }
            
            this.context.fill();
            this.context.stroke();
        }

        /**
        * The Y axis labels
        */
        if (typeof(this.Get('chart.labels')) == 'object') {
        
            var xOffset = 5;
            var font    = this.Get('chart.text.font');

            // Draw the X axis labels
            this.context.fillStyle = this.Get('chart.text.color');
            
            // How wide is each bar
            var barHeight = (this.canvas.height - this.gutterTop - this.gutterBottom ) / this.Get('chart.labels').length;
            
            // Reset the xTickGap
            yTickGap = (this.canvas.height - this.gutterTop - this.gutterBottom) / this.Get('chart.labels').length

            // Draw the X tickmarks
            var i=0;
            for (y=this.gutterTop + (yTickGap / 2); y<=this.canvas.height - this.gutterBottom; y+=yTickGap) {
            
                if (ycolors[i]) this.context.fillStyle = ycolors[i];

                RGraph.Text(this.context,
                            font,
                            this.Get('chart.text.size'),
                            this.gutterLeft - xOffset,
                            y,
                            String(this.Get('chart.labels')[i++]),
                            'center',
                            'right');
            }
        }
    }
    
    
    /**
    * This function draws the actual bars
    */
    RGraph.HBar.prototype.Drawbars = function ()
    {
        this.context.lineWidth   = this.properties['chart.linewidth'];
        this.context.strokeStyle = this.Get('chart.strokestyle');
        this.context.fillStyle   = this.Get('chart.colors')[0];
        var prevX                = 0;
        var prevY                = 0;

        /**
        * Work out the max value
        */
        if (this.Get('chart.xmax')) {
            this.scale = [
                          (((this.Get('chart.xmax') - this.Get('chart.xmin')) * 0.2) + this.Get('chart.xmin')).toFixed(this.Get('chart.scale.decimals')),
                          (((this.Get('chart.xmax') - this.Get('chart.xmin')) * 0.4) + this.Get('chart.xmin')).toFixed(this.Get('chart.scale.decimals')),
                          (((this.Get('chart.xmax') - this.Get('chart.xmin')) * 0.6) + this.Get('chart.xmin')).toFixed(this.Get('chart.scale.decimals')),
                          (((this.Get('chart.xmax') - this.Get('chart.xmin')) * 0.8) + this.Get('chart.xmin')).toFixed(this.Get('chart.scale.decimals')),
                          (((this.Get('chart.xmax') - this.Get('chart.xmin')) + this.Get('chart.xmin'))).toFixed(this.Get('chart.scale.decimals'))
                         ];
            this.max = this.scale[4];
        
        } else {
        
            var grouping = this.Get('chart.grouping');

            for (i=0; i<this.data.length; ++i) {
                if (typeof(this.data[i]) == 'object') {
                    var value = grouping == 'grouped' ? Number(RGraph.array_max(this.data[i], true)) : Number(RGraph.array_sum(this.data[i])) ;
                } else {
                    var value = Number(Math.abs(this.data[i]));
                }

                this.max = Math.max(Math.abs(this.max), Math.abs(value));
            }

            this.scale = RGraph.getScale(this.max, this);

            /**
            * Account for chart.xmin
            */
            if (this.Get('chart.xmin') > 0) {
                this.scale[0] = Number((((this.scale[4] - this.Get('chart.xmin')) * 0.2) + this.Get('chart.xmin')).toFixed(this.Get('chart.scale.decimals')));
                this.scale[1] = Number((((this.scale[4] - this.Get('chart.xmin')) * 0.4) + this.Get('chart.xmin')).toFixed(this.Get('chart.scale.decimals')));
                this.scale[2] = Number((((this.scale[4] - this.Get('chart.xmin')) * 0.6) + this.Get('chart.xmin')).toFixed(this.Get('chart.scale.decimals')));
                this.scale[3] = Number((((this.scale[4] - this.Get('chart.xmin')) * 0.8) + this.Get('chart.xmin')).toFixed(this.Get('chart.scale.decimals')));
                this.scale[4] = Number((((this.scale[4] - this.Get('chart.xmin')) * 1.0) + this.Get('chart.xmin')).toFixed(this.Get('chart.scale.decimals')));
            }

            this.max = this.scale[4];
        }

        if (this.Get('chart.scale.decimals') == null && Number(this.max) == 1) {
            this.Set('chart.scale.decimals', 1);
        }
        
        /*******************************************************
        * This is here to facilitate sequential colors
        *******************************************************/
        var colorIdx = 0;

        /**
        * The bars are drawn HERE
        */
        var graphwidth = (this.canvas.width - this.gutterLeft - this.gutterRight);
        var halfwidth  = graphwidth / 2;

        for (i=0; i<this.data.length; ++i) {

            // Work out the width and height
            var width  = (this.data[i] / this.max) *  graphwidth;
            var height = this.graphheight / this.data.length;

            var orig_height = height;

            var x       = this.gutterLeft;
            var y       = this.gutterTop + (i * height);
            var vmargin = this.Get('chart.vmargin');

            // Account for negative lengths - Some browsers (eg Chrome) don't like a negative value
            if (width < 0) {
                x -= width;
                width = Math.abs(width);
            }

            /**
            * Turn on the shadow if need be
            */
            if (this.Get('chart.shadow')) {
                this.context.shadowColor   = this.Get('chart.shadow.color');
                this.context.shadowBlur    = this.Get('chart.shadow.blur');
                this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
                this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
            }

            /**
            * Draw the bar
            */
            this.context.beginPath();
                if (typeof(this.data[i]) == 'number') {

                    var barHeight = height - (2 * vmargin);
                    var barWidth  = ((this.data[i] - this.Get('chart.xmin')) / (this.max - this.Get('chart.xmin'))) * this.graphwidth;
                    var barX      = this.gutterLeft;

                    // Account for Y axis pos
                    if (this.Get('chart.yaxispos') == 'center') {
                        barWidth /= 2;
                        barX += halfwidth;
                        
                        if (this.data[i] < 0) {
                            barWidth = (Math.abs(this.data[i]) - this.Get('chart.xmin')) / (this.max - this.Get('chart.xmin'));
                            barWidth = barWidth * (this.graphwidth / 2);
                            barX = ((this.graphwidth / 2) + this.gutterLeft) - barWidth;
                        }
                    }

                    // Set the fill color
                    this.context.strokeStyle = this.Get('chart.strokestyle');
                    this.context.fillStyle = this.Get('chart.colors')[0];
                    
                    // Sequential colors
                    if (this.Get('chart.colors.sequential')) {
                        this.context.fillStyle = this.Get('chart.colors')[colorIdx++];
                    }

                    this.context.strokeRect(barX, this.gutterTop + (i * height) + this.Get('chart.vmargin'), barWidth, barHeight);
                    this.context.fillRect(barX, this.gutterTop + (i * height) + this.Get('chart.vmargin'), barWidth, barHeight);

                    this.coords.push([barX,
                                      y + vmargin,
                                      barWidth,
                                      height - (2 * vmargin),
                                      this.context.fillStyle,
                                      this.data[i],
                                      true]);

                /**
                * Stacked bar chart
                */
                } else if (typeof(this.data[i]) == 'object' && this.Get('chart.grouping') == 'stacked') {

                    if (this.Get('chart.yaxispos') == 'center') {
                        alert('[HBAR] You can\'t have a stacked chart with the Y axis in the center, change it to grouped');
                    }

                    var barHeight = height - (2 * vmargin);

                    for (j=0; j<this.data[i].length; ++j) {
                    

                        // Set the fill/stroke colors
                        this.context.strokeStyle = this.Get('chart.strokestyle');
                        this.context.fillStyle = this.Get('chart.colors')[j];
                        

                        // Sequential colors
                        if (this.Get('chart.colors.sequential')) {
                            this.context.fillStyle = this.Get('chart.colors')[colorIdx++];
                        }
                        

                        var width = (((this.data[i][j]) / (this.max))) * this.graphwidth;
                        var totalWidth = (RGraph.array_sum(this.data[i]) / this.max) * this.graphwidth;

                        this.context.strokeRect(x, this.gutterTop + this.Get('chart.vmargin') + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );
                        this.context.fillRect(x, this.gutterTop + this.Get('chart.vmargin') + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );

                        /**
                        * Store the coords for tooltips
                        */

                        // The last property of this array is a boolean which tells you whether the value is the last or not
                        this.coords.push([x,
                                          y + vmargin,
                                          width,
                                          height - (2 * vmargin),
                                          this.context.fillStyle,
                                          RGraph.array_sum(this.data[i]),
                                          j == (this.data[i].length - 1)
                                         ]);

                        x += width;
                    }

                /**
                * A grouped bar chart
                */
                } else if (typeof(this.data[i]) == 'object' && this.Get('chart.grouping') == 'grouped') {

                    var vmarginGrouped      = this.properties['chart.vmargin.grouped'];
                    var individualBarHeight = ((height - (2 * vmargin) - ((this.data[i].length - 1) * vmarginGrouped)) / this.data[i].length)
                    
                    
                    for (j=0; j<this.data[i].length; ++j) {


                        /**
                        * Turn on the shadow if need be
                        */
                        if (this.Get('chart.shadow')) {
                            RGraph.SetShadow(this, this.Get('chart.shadow.color'), this.Get('chart.shadow.offsetx'), this.Get('chart.shadow.offsety'), this.Get('chart.shadow.blur'));
                        }

                        // Set the fill/stroke colors
                        this.context.strokeStyle = this.Get('chart.strokestyle');
                        this.context.fillStyle   = this.Get('chart.colors')[j];

                        // Sequential colors
                        if (this.Get('chart.colors.sequential')) {
                            this.context.fillStyle = this.Get('chart.colors')[colorIdx++];
                        }



                        var startY = this.gutterTop + (height * i) + (individualBarHeight * j) + vmargin + (vmarginGrouped * j);
                        var width = ((this.data[i][j] - this.Get('chart.xmin')) / (this.max - this.Get('chart.xmin'))) * (this.canvas.width - this.gutterLeft - this.gutterRight );
                        var startX = this.gutterLeft;




                        // Account for the Y axis being in the middle
                        if (this.Get('chart.yaxispos') == 'center') {
                            width  /= 2;
                            startX += halfwidth;
                        }
                        
                        if (width < 0) {
                            startX += width;
                            width *= -1;
                        }

                        this.context.strokeRect(startX, startY, width, individualBarHeight);
                        this.context.fillRect(startX, startY, width, individualBarHeight);

                        this.coords.push([startX,
                                          startY,
                                          width,
                                          individualBarHeight,
                                          this.context.fillStyle,
                                          this.data[i][j],
                                          true]);
                    }
                    
                    startY += vmargin;
                }

            this.context.closePath();
        }

        this.context.stroke();
        this.context.fill();



        /**
        * Now the bars are stroke()ed, turn off the shadow
        */
        RGraph.NoShadow(this);
        
        this.RedrawBars();
    }
    
    
    /**
    * This function goes over the bars after they been drawn, so that upwards shadows are underneath the bars
    */
    RGraph.HBar.prototype.RedrawBars = function ()
    {
        if (this.Get('chart.noredraw')) {
            return;
        }

        var coords = this.coords;

        var font   = this.Get('chart.text.font');
        var size   = this.Get('chart.text.size');
        var color  = this.Get('chart.text.color');

        RGraph.NoShadow(this);
        this.context.strokeStyle = this.Get('chart.strokestyle');

        for (var i=0; i<coords.length; ++i) {

            if (this.Get('chart.shadow')) {
                this.context.beginPath();
                    this.context.strokeStyle = this.Get('chart.strokestyle');
                    this.context.fillStyle = coords[i][4];
                    this.context.lineWidth = this.properties['chart.linewidth'];
                    this.context.strokeRect(coords[i][0], coords[i][1], coords[i][2], coords[i][3]);
                    this.context.fillRect(coords[i][0], coords[i][1], coords[i][2], coords[i][3]);
                this.context.fill();
                this.context.stroke();
            }

            /**
            * Draw labels "above" the bar
            */
            if (this.Get('chart.labels.above') && coords[i][6]) {

                this.context.fillStyle   = this.properties['chart.text.color'];
                this.context.strokeStyle = 'black';
                RGraph.NoShadow(this);

                var border = (coords[i][0] + coords[i][2] + 7 + this.context.measureText(this.Get('chart.units.pre') + this.coords[i][5] + this.Get('chart.units.post')).width) > this.canvas.width ? true : false;

                RGraph.Text(this.context,
                            font,
                            size,
                            coords[i][0] + coords[i][2] + 5,
                            coords[i][1] + (coords[i][3] / 2),
                            RGraph.number_format(this, (this.coords[i][5]).toFixed(this.Get('chart.labels.above.decimals')), this.Get('chart.units.pre'), this.Get('chart.units.post')),
                            'center',
                            'left');
            }
        }
    }
    
    
    /*******************************************************
    * This function can be used to get the appropriate bar information (if any)
    * 
    * @param  e Event object
    * @return   Appriate bar information (if any)
    *******************************************************/
    RGraph.HBar.prototype.getShape =
    RGraph.HBar.prototype.getBar = function (e)
    {
        var canvas      = this.canvas;
        var context     = this.context;
        var mouseCoords = RGraph.getMouseXY(e);

        /**
        * Loop through the bars determining if the mouse is over a bar
        */
        for (var i=0,len=this.coords.length; i<len; i++) {

            var mouseX = mouseCoords[0];  // In relation to the canvas
            var mouseY = mouseCoords[1];  // In relation to the canvas
            var left   = this.coords[i][0];
            var top    = this.coords[i][1];
            var width  = this.coords[i][2];
            var height = this.coords[i][3];
            var idx    = i;

            if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {

                var tooltip = RGraph.parseTooltipText(this.Get('chart.tooltips'), i);

                return {
                        0: this,   'object': this,
                        1: left,   'x': left,
                        2: top,    'y': top,
                        3: width,  'width': width,
                        4: height, 'height': height,
                        5: idx,    'index': idx,
                                   'tooltip': tooltip
                       };
            }
        }
    }


    /**
    * When you click on the chart, this method can return the X value at that point. It works for any point on the
    * chart (that is inside the gutters) - not just points within the Bars.
    * 
    * @param object e The event object
    */
    RGraph.HBar.prototype.getValue = function (arg)
    {
        if (arg.length == 2) {
            var mouseX = arg[0];
            var mouseY = arg[1];
        } else {
            var mouseCoords = RGraph.getMouseXY(arg);
            var mouseX      = mouseCoords[0];
            var mouseY      = mouseCoords[1];
        }
        
        if (   mouseY < this.Get('chart.gutter.top')
            || mouseY > (this.canvas.height - this.Get('chart.gutter.bottom'))
            || mouseX < this.Get('chart.gutter.left')
            || mouseX > (this.canvas.width - this.Get('chart.gutter.right'))
           ) {
            return null;
        }
        
        if (this.Get('chart.yaxispos') == 'center') {
            var value = ((mouseX - this.Get('chart.gutter.left')) / (this.graphwidth / 2)) * (this.max - this.Get('chart.xmin'));
                value = value - this.max
                
                // Special case if xmin is defined
                if (this.Get('chart.xmin') > 0) {
                    value = ((mouseX - this.Get('chart.gutter.left') - (this.graphwidth / 2)) / (this.graphwidth / 2)) * (this.max - this.Get('chart.xmin'));
                    value += this.Get('chart.xmin');
                    
                    if (mouseX < (this.gutterLeft + (this.graphwidth / 2))) {
                        value -= (2 * this.Get('chart.xmin'));
                    }
                }
        } else {
            var value = ((mouseX - this.Get('chart.gutter.left')) / this.graphwidth) * (this.max - this.Get('chart.xmin'));
                value += this.Get('chart.xmin');
        }

        return value;
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.HBar.prototype.Highlight = function (shape)
    {
        // Add the new highlight
        RGraph.Highlight.Rect(this, shape);
    }



    /**
    * The getObjectByXY() worker method. Don't call this call:
    * 
    * RGraph.ObjectRegistry.getObjectByXY(e)
    * 
    * @param object e The event object
    */
    RGraph.HBar.prototype.getObjectByXY = function (e)
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
    RGraph.HBar.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
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
        tooltip.style.top  = canvasXY[1] + coordY - height - 7  + 'px';
        
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
        if ((canvasXY[0] + coordX  + (coordW / 2) - (width / 2)) < 10) {
            tooltip.style.left = (canvasXY[0] + coordX - (width * 0.1)) + (coordW / 2) + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + (coordW / 2) + coordX + (width / 2)) > document.body.offsetWidth) {
            tooltip.style.left = canvasXY[0] + coordX - (width * 0.9) + (coordW / 2) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + coordX + (coordW / 2) - (width * 0.5)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * Returns the appropriate Y coord for the given value
    * 
    * @param number value The value to get the coord for
    */
    RGraph.HBar.prototype.getXCoord = function (value)
    {

        if (this.properties['chart.yaxispos'] == 'center') {
    
            // Range checking
            if (value > this.max || value < (-1 * this.max)) {
                return null;
            }

            var width = (this.canvas.width - this.properties['chart.gutter.left'] - this.properties['chart.gutter.right']) / 2;
            var coord = (((value - this.properties['chart.xmin']) / (this.max - this.properties['chart.xmin'])) * width) + width;

                coord = this.properties['chart.gutter.left'] + coord;
        } else {
        
            // Range checking
            if (value > this.max || value < 0) {
                return null;
            }

            var width = this.canvas.width - this.properties['chart.gutter.left'] - this.properties['chart.gutter.right'];
            var coord = ((value - this.properties['chart.xmin']) / (this.max - this.properties['chart.xmin'])) * width;

                coord = this.properties['chart.gutter.left'] + coord;
        }

        return coord;
    }



    /**
    * 
    */
    RGraph.HBar.prototype.parseColors = function ()
    {
        var props  = this.properties;
        var colors = props['chart.colors'];

        for (var i=0; i<colors.length; ++i) {
            colors[i] = this.parseSingleColorForGradient(colors[i]);
        }
        
        props['chart.background.grid.color'] = this.parseSingleColorForGradient(props['chart.background.grid.color']);
        props['chart.background.barcolor1']  = this.parseSingleColorForGradient(props['chart.background.barcolor1']);
        props['chart.background.barcolor2']  = this.parseSingleColorForGradient(props['chart.background.barcolor2']);
        props['chart.text.color']            = this.parseSingleColorForGradient(props['chart.text.color']);
        props['chart.labels.colors']         = this.parseSingleColorForGradient(props['chart.labels.colors']);
        props['chart.strokestyle']           = this.parseSingleColorForGradient(props['chart.strokestyle']);
        props['chart.axis.color']            = this.parseSingleColorForGradient(props['chart.axis.color']);
        props['chart.highlight.fill']        = this.parseSingleColorForGradient(props['chart.highlight.fill']);
        props['chart.highlight.stroke']      = this.parseSingleColorForGradient(props['chart.highlight.stroke']);
    }



    /**
    * This parses a single color value
    */
    RGraph.HBar.prototype.parseSingleColorForGradient = function (color)
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