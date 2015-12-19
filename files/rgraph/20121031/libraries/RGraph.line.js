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
    * The line chart constructor
    * 
    * @param object canvas The cxanvas object
    * @param array  data   The chart data
    * @param array  ...    Other lines to plot
    */
    RGraph.Line = function (id)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'line';
        this.max               = 0;
        this.coords            = [];
        this.coords2           = [];
        this.coords.key        = [];
        this.hasnegativevalues = false;
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;



        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);


        // Various config type stuff
        this.properties = {
            'chart.background.barcolor1':   'rgba(0,0,0,0)',
            'chart.background.barcolor2':   'rgba(0,0,0,0)',
            'chart.background.grid':        1,
            'chart.background.grid.width':  1,
            'chart.background.grid.hsize':  25,
            'chart.background.grid.vsize':  25,
            'chart.background.grid.color':  '#ddd',
            'chart.background.grid.vlines': true,
            'chart.background.grid.hlines': true,
            'chart.background.grid.border': true,
            'chart.background.grid.autofit':           true,
            'chart.background.grid.autofit.align':     false,
            'chart.background.grid.autofit.numhlines': 5,
            'chart.background.grid.autofit.numvlines': 20,
            'chart.background.hbars':       null,
            'chart.background.image':       null,
            'chart.background.image.stretch': true,
            'chart.background.image.x':     null,
            'chart.background.image.y':     null,
            'chart.background.image.w':     null,
            'chart.background.image.h':     null,
            'chart.background.image.align': null,
            'chart.labels':                 null,
            'chart.labels.ingraph':         null,
            'chart.labels.above':           false,
            'chart.labels.above.size':      8,
            'chart.xtickgap':               20,
            'chart.smallxticks':            3,
            'chart.largexticks':            5,
            'chart.ytickgap':               20,
            'chart.smallyticks':            3,
            'chart.largeyticks':            5,
            'chart.numyticks':              10,
            'chart.linewidth':              1.01,
            'chart.colors':                 ['red', '#0f0', '#00f', '#f0f', '#ff0', '#0ff'],
            'chart.hmargin':                0,
            'chart.tickmarks.dot.color':    'white',
            'chart.tickmarks':              null,
            'chart.tickmarks.linewidth':    null,
            'chart.ticksize':               3,
            'chart.gutter.left':            25,
            'chart.gutter.right':           25,
            'chart.gutter.top':             25,
            'chart.gutter.bottom':          25,
            'chart.tickdirection':          -1,
            'chart.yaxispoints':            5,
            'chart.fillstyle':              null,
            'chart.xaxispos':               'bottom',
            'chart.yaxispos':               'left',
            'chart.xticks':                 null,
            'chart.text.size':              10,
            'chart.text.angle':             0,
            'chart.text.color':             'black',
            'chart.text.font':              'Arial',
            'chart.ymin':                   null,
            'chart.ymax':                   null,
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             0.5,
            'chart.title.bold':             true,
            'chart.title.font':             null,
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
            'chart.title.yaxis.pos':        null,
            'chart.shadow':                 false,
            'chart.shadow.offsetx':         2,
            'chart.shadow.offsety':         2,
            'chart.shadow.blur':            3,
            'chart.shadow.color':           'rgba(0,0,0,0.5)',
            'chart.tooltips':               null,
            'chart.tooltips.hotspot.xonly': false,
            'chart.tooltips.hotspot.size':  5,
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.event':         'onmousemove',
            'chart.tooltips.highlight':     true,
            'chart.tooltips.coords.page':   false,
            'chart.highlight.stroke':       'gray',
            'chart.highlight.fill':         'white',
            'chart.stepped':                false,
            'chart.key':                    null,
            'chart.key.background':         'white',
            'chart.key.position':           'graph',
            'chart.key.halign':             null,
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
            'chart.key.interactive':        false,
            'chart.contextmenu':            null,
            'chart.ylabels':                true,
            'chart.ylabels.count':          5,
            'chart.ylabels.inside':         false,
            'chart.ylabels.invert':         false,
            'chart.xlabels.inside':         false,
            'chart.xlabels.inside.color':   'rgba(255,255,255,0.5)',
            'chart.noaxes':                 false,
            'chart.noyaxis':                false,
            'chart.noxaxis':                false,
            'chart.noendxtick':             false,
            'chart.noendytick':             false,
            'chart.units.post':             '',
            'chart.units.pre':              '',
            'chart.scale.decimals':         null,
            'chart.scale.point':            '.',
            'chart.scale.thousand':         ',',
            'chart.crosshairs':             false,
            'chart.crosshairs.color':       '#333',
            'chart.crosshairs.hline':       true,
            'chart.crosshairs.vline':       true,
            'chart.annotatable':            false,
            'chart.annotate.color':         'black',
            'chart.axesontop':              false,
            'chart.filled':                 false,
            'chart.filled.range':           false,
            'chart.filled.accumulative':    true,
            'chart.variant':                null,
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
            'chart.backdrop':               false,
            'chart.backdrop.size':          30,
            'chart.backdrop.alpha':         0.2,
            'chart.resizable':              false,
            'chart.resize.handle.adjust':   [0,0],
            'chart.resize.handle.background': null,
            'chart.adjustable':             false,
            'chart.noredraw':               false,
            'chart.outofbounds':            false,
            'chart.chromefix':              true,
            'chart.animation.factor':       1,
            'chart.animation.unfold.x':     false,
            'chart.animation.unfold.y':     true,
            'chart.animation.unfold.initial': 2,
            'chart.curvy':                    false,
            'chart.line.visible':             true,
            'chart.events.click':             null,
            'chart.events.mousemove':         null
        }

        /**
        * Change null arguments to empty arrays
        */
        for (var i=1; i<arguments.length; ++i) {
            if (typeof(arguments[i]) == 'null' || !arguments[i]) {
                arguments[i] = [];
            }
        }


        /**
        * Store the original data. Thiss also allows for giving arguments as one big array.
        */
        this.original_data = [];

        for (var i=1; i<arguments.length; ++i) {
            if (arguments[1] && typeof(arguments[1]) == 'object' && arguments[1][0] && typeof(arguments[1][0]) == 'object' && arguments[1][0].length) {

                var tmp = [];

                for (var i=0; i<arguments[1].length; ++i) {
                    tmp[i] = RGraph.array_clone(arguments[1][i]);
                }

                for (var j=0; j<tmp.length; ++j) {
                    this.original_data[j] = RGraph.array_clone(tmp[j]);
                }

            } else {
                this.original_data[i - 1] = RGraph.array_clone(arguments[i]);
            }
        }

        // Check for support
        if (!this.canvas) {
            alert('[LINE] Fatal error: no canvas support');
            return;
        }
        
        /**
        * Store the data here as one big array
        */
        this.data_arr = RGraph.array_linearize(this.original_data);

        for (var i=0; i<this.data_arr.length; ++i) {
            this['$' + i] = {};
        }


        /**
        * Register the object so it is redrawn when necessary
        */
        RGraph.Register(this);
    }


    /**
    * An all encompassing accessor
    * 
    * @param string name The name of the property
    * @param mixed value The value of the property
    */
    RGraph.Line.prototype.Set = function (name, value)
    {
        // Consolidate the tooltips
        if (name == 'chart.tooltips' && typeof value == 'object' && value) {

            var tooltips = [];

            for (var i=1; i<arguments.length; i++) {
                if (typeof(arguments[i]) == 'object' && arguments[i][0]) {
                    for (var j=0; j<arguments[i].length; j++) {
                        tooltips.push(arguments[i][j]);
                    }

                } else if (typeof(arguments[i]) == 'function') {
                    tooltips = arguments[i];

                } else {
                    tooltips.push(arguments[i]);
                }
            }

            // Because "value" is used further down at the end of this function, set it to the expanded array os tooltips
            value = tooltips;
        }

        /**
        * Reverse the tickmarks to make them correspond to the right line
        * 
        * Taken out - 1/5/12
        */
        //if (name == 'chart.tickmarks' && typeof(value) == 'object' && value) {
        //    value = RGraph.array_reverse(value);
        //}
        
        /**
        * Inverted Y axis should show the bottom end of the scale
        */
        if (name == 'chart.ylabels.invert' && value && this.properties['chart.ymin'] == null) {
            this.Set('chart.ymin', 0);
        }
        
        /**
        * If (buggy) Chrome and the linewidth is 1, change it to 1.01
        */
        if (name == 'chart.linewidth' && navigator.userAgent.match(/Chrome/)) {
            if (value == 1) {
                value = 1.01;
            
            } else if (RGraph.is_array(value)) {
                for (var i=0; i<value.length; ++i) {
                    if (typeof(value[i]) == 'number' && value[i] == 1) {
                        value[i] = 1.01;
                    }
                }
            }
        }


        /**
        * Check for xaxispos
        */
        if (name == 'chart.xaxispos' ) {
            if (value != 'bottom' && value != 'center' && value != 'top') {
                alert('[LINE] (' + this.id + ') chart.xaxispos should be top, center or bottom. Tried to set it to: ' + value + ' Changing it to center');
                value = 'center';
            }
        }


        /**
        * chart.xticks is now calledchart.numxticks
        */
        if (name == 'chart.numxticks') {
            name = 'chart.xticks';
        }


        /**
        * Change the new chart.spline option to chart.curvy
        */
        if (name == 'chart.spline') {
            name = 'chart.curvy';
        }


        this.properties[name] = value;
    }


    /**
    * An all encompassing accessor
    * 
    * @param string name The name of the property
    */
    RGraph.Line.prototype.Get = function (name)
    {
        return this.properties[name];
    }


    /**
    * The function you call to draw the line chart
    * 
    * @param bool An optional bool used internally to ditinguish whether the
    *             line chart is being called by the bar chart
    * 
    * Draw()
    *  |
    *  +--Draw()
    *  |  |
    *  |  +-DrawLine()
    *  |
    *  +-RedrawLine()
    *     |
    *     +-DrawCurvyLine()
    *        |
    *        +-DrawSpline()
    */
    RGraph.Line.prototype.Draw = function ()
    {
        // MUST be the first thing done!
        if (typeof(this.properties['chart.background.image']) == 'string') {
            RGraph.DrawBackgroundImage(this);
        }


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


        /**
        * Check for Chrome 6 and shadow
        * 
        * TODO Remove once it's been fixed (for a while)
        * 29/10/2011 - Looks like it's been fixed as long the linewidth is at least 1.01
        * SEARCH TAGS: CHROME FIX SHADOW BUG
        */
        if (   this.properties['chart.shadow']
            && navigator.userAgent.match(/Chrome/)
            && this.properties['chart.linewidth'] <= 1
            && this.properties['chart.chromefix']
            && this.properties['chart.shadow.blur'] > 0) {
                alert('[RGRAPH WARNING] Chrome has a shadow bug, meaning you should increase the linewidth to at least 1.01');
        }


        // Reset the data back to that which was initially supplied
        this.data = RGraph.array_clone(this.original_data);


        // Reset the max value
        this.max = 0;

        /**
        * Reverse the datasets so that the data and the labels tally
        *  COMMENTED OUT 15TH AUGUST 2011
        */
        //this.data = RGraph.array_reverse(this.data);

        if (this.properties['chart.filled'] && !this.properties['chart.filled.range'] && this.data.length > 1 && this.properties['chart.filled.accumulative']) {

            var accumulation = [];
        
            for (var set=0; set<this.data.length; ++set) {
                for (var point=0; point<this.data[set].length; ++point) {
                    this.data[set][point] = Number(accumulation[point] ? accumulation[point] : 0) + this.data[set][point];
                    accumulation[point] = this.data[set][point];
                }
            }
        }

        /**
        * Get the maximum Y scale value
        */
        if (this.properties['chart.ymax']) {
            
            this.max = this.properties['chart.ymax'];
            this.min = this.properties['chart.ymin'] ? this.properties['chart.ymin'] : 0;

            this.scale = [
                          ( ((this.max - this.min) * (1/5)) + this.min).toFixed(this.properties['chart.scale.decimals']),
                          ( ((this.max - this.min) * (2/5)) + this.min).toFixed(this.properties['chart.scale.decimals']),
                          ( ((this.max - this.min) * (3/5)) + this.min).toFixed(this.properties['chart.scale.decimals']),
                          ( ((this.max - this.min) * (4/5)) + this.min).toFixed(this.properties['chart.scale.decimals']),
                          this.max.toFixed(this.properties['chart.scale.decimals'])
                         ];

            // Check for negative values
            if (!this.properties['chart.outofbounds']) {
                for (dataset=0; dataset<this.data.length; ++dataset) {
                    for (var datapoint=0; datapoint<this.data[dataset].length; datapoint++) {
            
                        // Check for negative values
                        this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues;
                    }
                }
            }

        } else {

            this.min = this.properties['chart.ymin'] ? this.properties['chart.ymin'] : 0;

            // Work out the max Y value
            for (dataset=0; dataset<this.data.length; ++dataset) {
                for (var datapoint=0; datapoint<this.data[dataset].length; datapoint++) {
    
                    this.max = Math.max(this.max, this.data[dataset][datapoint] ? Math.abs(parseFloat(this.data[dataset][datapoint])) : 0);
    
                    // Check for negative values
                    if (!this.properties['chart.outofbounds']) {
                        this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues;
                    }
                }
            }

            // 20th April 2009 - moved out of the above loop
            this.scale = RGraph.getScale(Math.abs(parseFloat(this.max)), this);
            this.max   = this.scale[4] ? this.scale[4] : 0;

            if (this.properties['chart.ymin']) {
                this.scale[0] = ((this.max - this.properties['chart.ymin']) * (1/5)) + this.properties['chart.ymin'];
                this.scale[1] = ((this.max - this.properties['chart.ymin']) * (2/5)) + this.properties['chart.ymin'];
                this.scale[2] = ((this.max - this.properties['chart.ymin']) * (3/5)) + this.properties['chart.ymin'];
                this.scale[3] = ((this.max - this.properties['chart.ymin']) * (4/5)) + this.properties['chart.ymin'];
                this.scale[4] = ((this.max - this.properties['chart.ymin']) * (5/5)) + this.properties['chart.ymin'];
            }

            if (typeof(this.properties['chart.scale.decimals']) == 'number') {
                this.scale[0] = Number(this.scale[0]).toFixed(this.properties['chart.scale.decimals']);
                this.scale[1] = Number(this.scale[1]).toFixed(this.properties['chart.scale.decimals']);
                this.scale[2] = Number(this.scale[2]).toFixed(this.properties['chart.scale.decimals']);
                this.scale[3] = Number(this.scale[3]).toFixed(this.properties['chart.scale.decimals']);
                this.scale[4] = Number(this.scale[4]).toFixed(this.properties['chart.scale.decimals']);
            }
        }

        /**
        * Setup the context menu if required
        */
        if (this.properties['chart.contextmenu']) {
            RGraph.ShowContext(this);
        }

        /**
        * Reset the coords array otherwise it will keep growing
        */
        this.coords = [];

        /**
        * Work out a few things. They need to be here because they depend on things you can change before you
        * call Draw() but after you instantiate the object
        */
        this.grapharea      = this.canvas.height - this.gutterTop - this.gutterBottom;
        this.halfgrapharea  = this.grapharea / 2;
        this.halfTextHeight = this.properties['chart.text.size'] / 2;

        // Check the combination of the X axis position and if there any negative values
        //
        // 19th Dec 2010 - removed for Opera since it can be reported incorrectly whn there
        // are multiple graphs on the page
        if (this.properties['chart.xaxispos'] == 'bottom' && this.hasnegativevalues && navigator.userAgent.indexOf('Opera') == -1) {
            alert('[LINE] You have negative values and the X axis is at the bottom. This is not good...');
        }

        if (this.properties['chart.variant'] == '3d') {
            RGraph.Draw3DAxes(this);
        }
        
        // Progressively Draw the chart
        RGraph.background.Draw(this);

        /**
        * Draw any horizontal bars that have been defined
        */
        if (this.properties['chart.background.hbars'] && this.properties['chart.background.hbars'].length > 0) {
            RGraph.DrawBars(this);
        }

        if (this.properties['chart.axesontop'] == false) {
            this.DrawAxes();
        }

        /**
        * Handle the appropriate shadow color. This now facilitates an array of differing
        * shadow colors
        */
        var shadowColor = this.properties['chart.shadow.color'];
        
        //if (typeof(shadowColor) == 'object') {
        //    shadowColor = RGraph.array_reverse(RGraph.array_clone(this.properties['chart.shadow.color')]);
        //}


        for (var i=0, j=0; i<this.data.length; i++, j++) {

            this.context.beginPath();

            /**
            * Turn on the shadow if required
            */
            if (this.properties['chart.shadow'] && !this.properties['chart.filled']) {

                /**
                * Accommodate an array of shadow colors as well as a single string
                */
                if (typeof(shadowColor) == 'object' && shadowColor[i - 1]) {
                    this.context.shadowColor = shadowColor[i];
                } else if (typeof(shadowColor) == 'object') {
                    this.context.shadowColor = shadowColor[0];
                } else if (typeof(shadowColor) == 'string') {
                    this.context.shadowColor = shadowColor;
                }

                this.context.shadowBlur    = this.properties['chart.shadow.blur'];
                this.context.shadowOffsetX = this.properties['chart.shadow.offsetx'];
                this.context.shadowOffsetY = this.properties['chart.shadow.offsety'];

            } else if (this.properties['chart.filled'] && this.properties['chart.shadow']) {
                alert('[LINE] Shadows are not permitted when the line is filled');
            }

            /**
            * Draw the line
            */

            if (this.properties['chart.fillstyle']) {
                if (typeof(this.properties['chart.fillstyle']) == 'object' && this.properties['chart.fillstyle'][j]) {
                   var fill = this.properties['chart.fillstyle'][j];
                
                } else if (typeof(this.properties['chart.fillstyle']) == 'object' && this.properties['chart.fillstyle'].toString().indexOf('Gradient') > 0) {
                   var fill = this.properties['chart.fillstyle'];
                
                } else if (typeof(this.properties['chart.fillstyle']) == 'string') {
                    var fill = this.properties['chart.fillstyle'];
    
                }
            } else if (this.properties['chart.filled']) {
                var fill = this.properties['chart.colors'][j];

            } else {
                var fill = null;
            }

            /**
            * Figure out the tickmark to use
            */
            if (this.properties['chart.tickmarks'] && typeof(this.properties['chart.tickmarks']) == 'object') {
                var tickmarks = this.properties['chart.tickmarks'][i];
            } else if (this.properties['chart.tickmarks'] && typeof(this.properties['chart.tickmarks']) == 'string') {
                var tickmarks = this.properties['chart.tickmarks'];
            } else if (this.properties['chart.tickmarks'] && typeof(this.properties['chart.tickmarks']) == 'function') {
                var tickmarks = this.properties['chart.tickmarks'];
            } else {
                var tickmarks = null;
            }


            this.DrawLine(this.data[i],
                          this.properties['chart.colors'][j],
                          fill,
                          this.GetLineWidth(j),
                           tickmarks,
                           i);

            this.context.stroke();
        }

    /**
    * If the line is filled re-stroke the lines
    */
    if (this.properties['chart.filled'] && this.properties['chart.filled.accumulative']) {

        for (var i=0; i<this.coords2.length; ++i) {

            this.context.beginPath();
            this.context.lineWidth = this.GetLineWidth(i);
            this.context.strokeStyle = this.properties['chart.colors'][i];

            for (var j=0; j<this.coords2[i].length; ++j) {

                if (j == 0 || this.coords2[i][j][1] == null || (this.coords2[i][j - 1] && this.coords2[i][j - 1][1] == null)) {
                    this.context.moveTo(this.coords2[i][j][0], this.coords2[i][j][1]);
                } else {
                    if (this.properties['chart.stepped']) {
                        this.context.lineTo(this.coords2[i][j][0], this.coords2[i][j - 1][1]);
                    }
                    this.context.lineTo(this.coords2[i][j][0], this.coords2[i][j][1]);
                }
            }
            
            this.context.stroke();
            // No fill!
        }

        //Redraw the tickmarks
        if (this.properties['chart.tickmarks']) {

            this.context.beginPath();

            this.context.fillStyle = 'white';
            
            for (var i=0; i<this.coords2.length; ++i) {

                this.context.beginPath();
                this.context.strokeStyle = this.properties['chart.colors'][i];
                for (var j=0; j<this.coords2[i].length; ++j) {
                    if (typeof(this.coords2[i][j]) == 'object' && typeof(this.coords2[i][j][0]) == 'number' && typeof(this.coords2[i][j][1]) == 'number') {
                        
                        var tickmarks = typeof(this.properties['chart.tickmarks']) == 'object' ? this.properties['chart.tickmarks'][i] : this.properties['chart.tickmarks'];

                        this.DrawTick(  this.coords2[i][j],
                                        this.coords2[i][j][0],
                                        this.coords2[i][j][1],
                                        this.context.strokeStyle,
                                        false,
                                        j == 0 ? 0 : this.coords2[i][j - 1][0],
                                        j == 0 ? 0 : this.coords2[i][j - 1][1],
                                        tickmarks,
                                        j);
                    }
                }
            }

            this.context.stroke();
            this.context.fill();
        }
    }

    // ???
    this.context.beginPath();




        /**
        * If the axes have been requested to be on top, do that
        */
        if (this.properties['chart.axesontop']) {
            this.DrawAxes();
        }

        /**
        * Draw the labels
        */
        this.DrawLabels();
        
        /**
        * Draw the range if necessary
        */
        this.DrawRange();
        
        // Draw a key if necessary
        if (this.properties['chart.key'] && this.properties['chart.key'].length && RGraph.DrawKey) {
            RGraph.DrawKey(this, this.properties['chart.key'], this.properties['chart.colors']);
        }

        /**
        * Draw " above" labels if enabled
        */
        if (this.properties['chart.labels.above']) {
            this.DrawAboveLabels();
        }

        /**
        * Draw the "in graph" labels
        */
        RGraph.DrawInGraphLabels(this);

        /**
        * Redraw the lines if a filled range is on the cards
        */
        if (this.properties['chart.filled'] && this.properties['chart.filled.range'] && this.data.length == 2) {

            this.context.beginPath();
            var len = this.coords.length / 2;
            this.context.lineWidth = this.properties['chart.linewidth'];
            this.context.strokeStyle = this.properties['chart.colors'][0];

            for (var i=0; i<len; ++i) {
                if (i == 0) {
                    this.context.moveTo(this.coords[i][0], this.coords[i][1]);
                } else {
                    this.context.lineTo(this.coords[i][0], this.coords[i][1]);
                }
            }
            
            this.context.stroke();


            this.context.beginPath();
            
            if (this.properties['chart.colors'][1]) {
                this.context.strokeStyle = this.properties['chart.colors'][1];
            }
            
            for (var i=this.coords.length - 1; i>=len; --i) {
                if (i == (this.coords.length - 1) ) {
                    this.context.moveTo(this.coords[i][0], this.coords[i][1]);
                } else {
                    this.context.lineTo(this.coords[i][0], this.coords[i][1]);
                }
            }
            
            this.context.stroke();
        } else if (this.properties['chart.filled'] && this.properties['chart.filled.range']) {
            alert('[LINE] You must have only two sets of data for a filled range chart');
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
    * Draws the axes
    */
    RGraph.Line.prototype.DrawAxes = function ()
    {
        // Don't draw the axes?
        if (this.properties['chart.noaxes']) {
            return;
        }

        // Turn any shadow off
        RGraph.NoShadow(this);

        this.context.lineWidth   = 1;
        this.context.lineCap = 'butt';
        this.context.strokeStyle = this.properties['chart.axis.color'];
        this.context.beginPath();

        // Draw the X axis
        if (this.properties['chart.noxaxis'] == false) {
            if (this.properties['chart.xaxispos'] == 'center') {
                this.context.moveTo(this.gutterLeft, AA(this, (this.grapharea / 2) + this.gutterTop));
                this.context.lineTo(this.canvas.width - this.gutterRight, AA(this, (this.grapharea / 2) + this.gutterTop));
            } else if (this.properties['chart.xaxispos'] == 'top') {
                this.context.moveTo(this.gutterLeft, AA(this, this.gutterTop));
                this.context.lineTo(this.canvas.width - this.gutterRight, AA(this, this.gutterTop));
            } else {
                this.context.moveTo(this.gutterLeft, AA(this, this.canvas.height - this.gutterBottom));
                this.context.lineTo(this.canvas.width - this.gutterRight, AA(this, this.canvas.height - this.gutterBottom));
            }
        }

        // Draw the Y axis
        if (this.properties['chart.noyaxis'] == false) {
            if (this.properties['chart.yaxispos'] == 'left') {
                this.context.moveTo(AA(this, this.gutterLeft), this.gutterTop);
                this.context.lineTo(AA(this, this.gutterLeft), this.canvas.height - this.gutterBottom );
            } else {
                this.context.moveTo(AA(this, this.canvas.width - this.gutterRight), this.gutterTop);
                this.context.lineTo(AA(this, this.canvas.width - this.gutterRight), this.canvas.height - this.gutterBottom);
            }
        }

        /**
        * Draw the X tickmarks
        */
        if (this.properties['chart.noxaxis'] == false) {

            if (this.data[0].length > 0) {
                var xTickInterval = (this.canvas.width - this.gutterLeft - this.gutterRight) / (this.properties['chart.xticks'] ? this.properties['chart.xticks'] : (this.data[0].length - 1));
            }
            
            if (!xTickInterval || xTickInterval <= 0) {
                xTickInterval = (this.canvas.width - this.gutterLeft - this.gutterRight) / (this.properties['chart.labels'] && this.properties['chart.labels'].length ? this.properties['chart.labels'].length - 1 : 10);
            }

            for (x=this.gutterLeft + (this.properties['chart.yaxispos'] == 'left' ? xTickInterval : 0); x<=(this.canvas.width - this.gutterRight + 1 ); x+=xTickInterval) {

                if (this.properties['chart.yaxispos'] == 'right' && x >= (this.canvas.width - this.gutterRight - 1) ) {
                    break;
                }

                // If the last tick is not desired...
                if (this.properties['chart.noendxtick']) {
                    if (this.properties['chart.yaxispos'] == 'left' && x >= (this.canvas.width - this.gutterRight - 1)) {
                        break;
                    } else if (this.properties['chart.yaxispos'] == 'right' && x == this.gutterLeft) {
                        continue;
                    }
                }

                var yStart = this.properties['chart.xaxispos'] == 'center' ? (this.gutterTop + (this.grapharea / 2)) - 3 : this.canvas.height - this.gutterBottom;
                var yEnd = this.properties['chart.xaxispos'] == 'center' ? yStart + 6 : this.canvas.height - this.gutterBottom - (x % 60 == 0 ? this.properties['chart.largexticks'] * this.properties['chart.tickdirection'] : this.properties['chart.smallxticks'] * this.properties['chart.tickdirection']);

                if (this.properties['chart.xaxispos'] == 'center') {
                    var yStart = AA(this, (this.gutterTop + (this.grapharea / 2))) - 3;
                    var yEnd = yStart + 6;
                
                } else if (this.properties['chart.xaxispos'] == 'bottom') {
                    var yStart = this.canvas.height - this.gutterBottom;
                    var yEnd  = this.canvas.height - this.gutterBottom - (x % 60 == 0 ? this.properties['chart.largexticks'] * this.properties['chart.tickdirection'] : this.properties['chart.smallxticks'] * this.properties['chart.tickdirection']);
                        yEnd += 0.5;

                
                } else if (this.properties['chart.xaxispos'] == 'top') {
                    yStart = this.gutterTop - 3;
                    yEnd   = this.gutterTop;
                }

                this.context.moveTo(AA(this, x), yStart);
                this.context.lineTo(AA(this, x), yEnd);
            }

        // Draw an extra tickmark if there is no X axis, but there IS a Y axis
        } else if (this.properties['chart.noyaxis'] == false) {
            if (!this.properties['chart.noendytick']) {
                if (this.properties['chart.yaxispos'] == 'left') {
                    this.context.moveTo(this.gutterLeft, AA(this, this.canvas.height - this.gutterBottom));
                    this.context.lineTo(this.gutterLeft - this.properties['chart.smallyticks'], AA(this, this.canvas.height - this.gutterBottom));
                } else {
                    this.context.moveTo(this.canvas.width - this.gutterRight, AA(this, this.canvas.height - this.gutterBottom));
                    this.context.lineTo(this.canvas.width - this.gutterRight + this.properties['chart.smallyticks'], AA(this, this.canvas.height - this.gutterBottom));
                }
            }
        }

        /**
        * Draw the Y tickmarks
        */
        var numyticks = this.properties['chart.numyticks'];

        if (this.properties['chart.noyaxis'] == false) {
            var counter    = 0;
            var adjustment = 0;
    
            if (this.properties['chart.yaxispos'] == 'right') {
                adjustment = (this.canvas.width - this.gutterLeft - this.gutterRight);
            }
            
            // X axis at the center
            if (this.properties['chart.xaxispos'] == 'center') {
                var interval = (this.grapharea / numyticks);
                var lineto = (this.properties['chart.yaxispos'] == 'left' ? this.gutterLeft : this.canvas.width - this.gutterRight + this.properties['chart.smallyticks']);
    
                // Draw the upper halves Y tick marks
                for (y=this.gutterTop; y < (this.grapharea / 2) + this.gutterTop; y+=interval) {
                    if (y < (this.grapharea / 2) + this.gutterTop - 1) {
                        this.context.moveTo((this.properties['chart.yaxispos'] == 'left' ? this.gutterLeft - this.properties['chart.smallyticks'] : this.canvas.width - this.gutterRight), AA(this, y));
                        this.context.lineTo(lineto, AA(this, y));
                    }
                }
                
                // Draw the lower halves Y tick marks
                for (y=this.gutterTop + (this.halfgrapharea) + interval; y <= this.grapharea + this.gutterTop; y+=interval) {
                    this.context.moveTo((this.properties['chart.yaxispos'] == 'left' ? this.gutterLeft - this.properties['chart.smallyticks'] : this.canvas.width - this.gutterRight), AA(this, y));
                    this.context.lineTo(lineto, AA(this, y));
                }
            
            // X axis at the top
            } else if (this.properties['chart.xaxispos'] == 'top') {
                var interval = (this.grapharea / numyticks);
                var lineto = (this.properties['chart.yaxispos'] == 'left' ? this.gutterLeft : this.canvas.width - this.gutterRight + this.properties['chart.smallyticks']);

                // Draw the Y tick marks
                for (y=this.gutterTop + interval; y <=this.grapharea + this.gutterTop; y+=interval) {
                    this.context.moveTo((this.properties['chart.yaxispos'] == 'left' ? this.gutterLeft - this.properties['chart.smallyticks'] : this.canvas.width - this.gutterRight), AA(this, y));
                    this.context.lineTo(lineto, AA(this, y));
                }
                
                // If there's no X axis draw an extra tick
                if (this.properties['chart.noxaxis'] && this.properties['chart.noendytick'] == false) {
                    this.context.moveTo((this.properties['chart.yaxispos'] == 'left' ? this.gutterLeft - this.properties['chart.smallyticks'] : this.canvas.width - this.gutterRight), this.gutterTop);
                    this.context.lineTo(lineto, this.gutterTop);
                }
            
            // X axis at the bottom
            } else {

                var lineto = (this.properties['chart.yaxispos'] == 'left' ? this.gutterLeft - this.properties['chart.smallyticks'] : this.canvas.width - this.gutterRight + this.properties['chart.smallyticks']);

                for (y=this.gutterTop; y < (this.canvas.height - this.gutterBottom) && counter < numyticks; y+=( (this.canvas.height - this.gutterTop - this.gutterBottom) / numyticks) ) {

                    this.context.moveTo(this.gutterLeft + adjustment, AA(this, y));
                    this.context.lineTo(lineto, AA(this, y));
                
                    var counter = counter +1;
                }
            }

        // Draw an extra X tickmark
        } else if (this.properties['chart.noxaxis'] == false) {

            if (this.properties['chart.yaxispos'] == 'left') {
                this.context.moveTo(this.gutterLeft, this.properties['chart.xaxispos'] == 'top' ? this.gutterTop : this.canvas.height - this.gutterBottom);
                this.context.lineTo(this.gutterLeft, this.properties['chart.xaxispos'] == 'top' ? this.gutterTop - this.properties['chart.smallxticks'] : this.canvas.height - this.gutterBottom + this.properties['chart.smallxticks']);
           } else {
                this.context.moveTo(this.canvas.width - this.gutterRight, this.canvas.height - this.gutterBottom);
                this.context.lineTo(this.canvas.width - this.gutterRight, this.canvas.height - this.gutterBottom + this.properties['chart.smallxticks']);
            }
        }

        this.context.stroke();
    }


    /**
    * Draw the text labels for the axes
    */
    RGraph.Line.prototype.DrawLabels = function ()
    {
        this.context.strokeStyle = 'black';
        this.context.fillStyle   = this.properties['chart.text.color'];
        this.context.lineWidth   = 1;
        
        // Turn off any shadow
        RGraph.NoShadow(this);

        // This needs to be here
        var font      = this.properties['chart.text.font'];
        var text_size = this.properties['chart.text.size'];
        var context   = this.context;
        var canvas    = this.canvas;

        // Draw the Y axis labels
        if (this.properties['chart.ylabels'] && this.properties['chart.ylabels.specific'] == null) {

            var units_pre  = this.properties['chart.units.pre'];
            var units_post = this.properties['chart.units.post'];
            var xpos       = this.properties['chart.yaxispos'] == 'left' ? this.gutterLeft - 5 : this.canvas.width - this.gutterRight + 5;
            var align      = this.properties['chart.yaxispos'] == 'left' ? 'right' : 'left';
            
            var numYLabels = this.properties['chart.ylabels.count'];
            var bounding   = false;
            var bgcolor    = this.properties['chart.ylabels.inside'] ? this.properties['chart.ylabels.inside.color'] : null;

            
            /**
            * If the Y labels are inside the Y axis, invert the alignment
            */
            if (this.properties['chart.ylabels.inside'] == true && align == 'left') {
                xpos -= 10;
                align = 'right';
                bounding = true;
                

            } else if (this.properties['chart.ylabels.inside'] == true && align == 'right') {
                xpos += 10;
                align = 'left';
                bounding = true;
            }



            if (this.properties['chart.xaxispos'] == 'center') {
                var half = this.grapharea / 2;

                if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
                    //  Draw the upper halves labels
                    RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (0/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[4], units_pre, units_post), null, align, bounding, null, bgcolor);
    
                    if (numYLabels == 5) {
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (1/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor);
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (3/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);
                    }
    
                    if (numYLabels >= 3) {
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (2/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (4/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor);
                    }
                    
                    //  Draw the lower halves labels
                    if (numYLabels >= 3) {
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (6/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor);
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (8/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);
                    }
    
                    if (numYLabels == 5) {
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (7/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (9/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor);
                    }
    
                    RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (10/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, (this.scale[4] == '1.0' ? '1.0' : this.scale[4]), units_pre, units_post), null, align, bounding, null, bgcolor);
                
                } else if (numYLabels == 10) {

                    // 10 Y labels
                    var interval = (this.grapharea / numYLabels) / 2;
                
                    for (var i=0; i<numYLabels; ++i) {
                        // This draws the upper halves labels
                        RGraph.Text(context,font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((i/20) * (this.grapharea) ), RGraph.number_format(this, ((this.scale[4] / numYLabels) * (numYLabels - i)).toFixed((this.properties['chart.scale.decimals'])),units_pre, units_post), null, align, bounding, null, bgcolor);
                        
                        // And this draws the lower halves labels
                        RGraph.Text(context, font, text_size, xpos,
                        
                        this.gutterTop + this.halfTextHeight + ((i/20) * this.grapharea) + (this.grapharea / 2) + (this.grapharea / 20),
                        
                        '-' + RGraph.number_format(this, (this.scale[4] - ((this.scale[4] / numYLabels) * (numYLabels - i - 1))).toFixed((this.properties['chart.scale.decimals'])),units_pre, units_post), null, align, bounding, null, bgcolor);
                    }
                    
                } else {
                    alert('[LINE SCALE] The number of Y labels must be 1/3/5/10');
                }

                // Draw the lower limit if chart.ymin is specified
                if (typeof(this.properties['chart.ymin']) == 'number') {
                    RGraph.Text(context, font, text_size, xpos, this.canvas.height / 2, RGraph.number_format(this, this.properties['chart.ymin'].toFixed(this.properties['chart.scale.decimals']), units_pre, units_post), 'center', align, bounding, null, bgcolor);
                }
                
                // No X axis - so draw 0
                if (this.properties['chart.noxaxis'] == true) {
                    RGraph.Text(context,font,text_size,xpos,this.gutterTop + ( (5/5) * half ) + this.halfTextHeight,this.properties['chart.units.pre'] + '0' + this.properties['chart.units.post'],null, align, bounding, null, bgcolor);
                }

            // X axis at the top
            } else if (this.properties['chart.xaxispos'] == 'top') {

                var scale = RGraph.array_reverse(this.scale);

                /**
                * Accommodate reversing the Y labels
                */
                if (this.properties['chart.ylabels.invert']) {

                    scale = RGraph.array_reverse(scale);

                    this.context.translate(0, this.grapharea * -0.2);
                    if (typeof(this.properties['chart.ymin']) == null) {
                        this.Set('chart.ymin', 0);
                    }
                }

                if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
                    RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((1/5) * (this.grapharea ) ), '-' + RGraph.number_format(this, scale[4], units_pre, units_post), null, align, bounding, null, bgcolor);
    
                    if (numYLabels == 5) {
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((4/5) * (this.grapharea) ), '-' + RGraph.number_format(this, scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((2/5) * (this.grapharea) ), '-' + RGraph.number_format(this, scale[3], units_pre, units_post), null, align, bounding, null, bgcolor);
                    }
    
                    if (numYLabels >= 3) {
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((3/5) * (this.grapharea ) ), '-' + RGraph.number_format(this, scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((5/5) * (this.grapharea) ), '-' + RGraph.number_format(this, scale[0], units_pre, units_post), null, align, bounding, null, bgcolor);
                    }
                
                } else if (numYLabels == 10) {

                    // 10 Y labels
                    var interval = (this.grapharea / numYLabels) / 2;

                    for (var i=0; i<numYLabels; ++i) {

                        RGraph.Text(context,font,text_size,xpos,(2 * interval) + this.gutterTop + this.halfTextHeight + ((i/10) * (this.grapharea) ),'-' + RGraph.number_format(this,(scale[0] - (((scale[0] - this.min) / numYLabels) * (numYLabels - i - 1))).toFixed((this.properties['chart.scale.decimals'])),units_pre,units_post),null,align,bounding,null,bgcolor);
                    }

                } else {
                    alert('[LINE SCALE] The number of Y labels must be 1/3/5/10');
                }


                /**
                * Accommodate translating back after reversing the labels
                */
                if (this.properties['chart.ylabels.invert']) {
                    this.context.translate(0, 0 - (this.grapharea * -0.2));
                }

                // Draw the lower limit if chart.ymin is specified
                if (typeof(this.properties['chart.ymin']) == 'number') {
                    RGraph.Text(context,font,text_size,xpos,this.properties['chart.ylabels.invert'] ? this.canvas.height - this.gutterBottom : this.gutterTop,'-' + RGraph.number_format(this, this.properties['chart.ymin'].toFixed(this.properties['chart.scale.decimals']), units_pre, units_post),'center',align,bounding,null,bgcolor);
                }

            } else {

                /**
                * Accommodate reversing the Y labels
                */
                if (this.properties['chart.ylabels.invert']) {
                    this.scale = RGraph.array_reverse(this.scale);
                    this.context.translate(0, this.grapharea * 0.2);
                    if (typeof(this.properties['chart.ymin']) == null) {
                        this.Set('chart.ymin', 0);
                    }
                }

                if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
                    RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((0/5) * (this.grapharea ) ), RGraph.number_format(this, this.scale[4], units_pre, units_post), null, align, bounding, null, bgcolor);
    
                    if (numYLabels == 5) {
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((3/5) * (this.grapharea) ), RGraph.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((1/5) * (this.grapharea) ), RGraph.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor);
                    }
    
                    if (numYLabels >= 3) {
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((2/5) * (this.grapharea ) ), RGraph.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);
                        RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((4/5) * (this.grapharea) ), RGraph.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor);
                    }
                
                } else if (numYLabels == 10) {

                    // 10 Y labels
                    var interval = (this.grapharea / numYLabels) / 2;
                
                    for (var i=0; i<numYLabels; ++i) {
                        RGraph.Text(context,font,text_size,xpos,this.gutterTop + this.halfTextHeight + ((i/10) * (this.grapharea) ),RGraph.number_format(this,((((this.scale[4] - this.min) / numYLabels) * (numYLabels - i)) + this.min).toFixed((this.properties['chart.scale.decimals'])),units_pre,units_post),null,align,bounding,null,bgcolor);
                    }

                } else {
                    alert('[LINE SCALE] The number of Y labels must be 1/3/5/10');
                }


                /**
                * Accommodate translating back after reversing the labels
                */
                if (this.properties['chart.ylabels.invert']) {
                    this.context.translate(0, 0 - (this.grapharea * 0.2));
                }

                // Draw the lower limit if chart.ymin is specified
                if (typeof(this.properties['chart.ymin']) == 'number') {
                    RGraph.Text(context,font,text_size,xpos,this.properties['chart.ylabels.invert'] ? this.gutterTop : this.canvas.height - this.gutterBottom,RGraph.number_format(this, this.properties['chart.ymin'].toFixed(this.properties['chart.scale.decimals']), units_pre, units_post),'center',align,bounding,null,bgcolor);
                }
            }

            // No X axis - so draw 0 - but not if the X axis is in the center
            if (   this.properties['chart.noxaxis'] == true
                && this.properties['chart.ymin'] == null
                && this.properties['chart.xaxispos'] != 'center'
                && this.properties['chart.noendytick'] == false
               ) {

                RGraph.Text(context,font,text_size,xpos,this.properties['chart.xaxispos'] == 'top' ? this.gutterTop + this.halfTextHeight: (this.canvas.height - this.gutterBottom + this.halfTextHeight),this.properties['chart.units.pre'] + '0' + this.properties['chart.units.post'],null, align, bounding, null, bgcolor);
            }
        
        } else if (this.properties['chart.ylabels'] && typeof(this.properties['chart.ylabels.specific']) == 'object') {
            
            // A few things
            var gap      = this.grapharea / this.properties['chart.ylabels.specific'].length;
            var halign   = this.properties['chart.yaxispos'] == 'left' ? 'right' : 'left';
            var bounding = false;
            var bgcolor  = null;
            var ymin     = this.properties['chart.ymin'] != null && this.properties['chart.ymin'];

            // Figure out the X coord based on the position of the axis
            if (this.properties['chart.yaxispos'] == 'left') {
                var x = this.gutterLeft - 5;
                
                if (this.properties['chart.ylabels.inside']) {
                    x += 10;
                    halign   = 'left';
                    bounding = true;
                    bgcolor  = 'rgba(255,255,255,0.5)';
                }

            } else if (this.properties['chart.yaxispos'] == 'right') {
                var x = this.canvas.width - this.gutterRight + 5;
                
                if (this.properties['chart.ylabels.inside']) {
                    x -= 10;
                    halign = 'right';
                    bounding = true;
                    bgcolor  = 'rgba(255,255,255,0.5)';
                }
            }


            // Draw the labels
            if (this.properties['chart.xaxispos'] == 'center') {
            
                // Draw the top halfs labels
                for (var i=0; i<this.properties['chart.ylabels.specific'].length; ++i) {
                    var y = this.gutterTop + (this.grapharea / ((this.properties['chart.ylabels.specific'].length ) * 2) * i);
                    
                    if (ymin && ymin > 0) {
                        var y  = ((this.grapharea / 2) / (this.properties['chart.ylabels.specific'].length - (ymin ? 1 : 0)) ) * i;
                            y += this.gutterTop;
                    }
                    
                    RGraph.Text(context, font, text_size,x,y,String(this.properties['chart.ylabels.specific'][i]), 'center', halign, bounding, 0, bgcolor);
                }
                
                // Now reverse the labels and draw the bottom half
                var reversed_labels = RGraph.array_reverse(this.properties['chart.ylabels.specific']);
            
                // Draw the bottom halfs labels
                for (var i=0; i<reversed_labels.length; ++i) {
                    var y = (this.grapharea / 2) + this.gutterTop + ((this.grapharea / (reversed_labels.length * 2) ) * (i + 1));

                    if (ymin && ymin > 0) {
                        var y  = ((this.grapharea / 2) / (reversed_labels.length - (ymin ? 1 : 0)) ) * i;
                            y += this.gutterTop;
                            y += (this.grapharea / 2);
                    }

                    RGraph.Text(context, font, text_size,x,y,String(reversed_labels[i]), 'center', halign, bounding, 0, bgcolor);
                }
            
            } else if (this.properties['chart.xaxispos'] == 'top') {

                // Reverse the labels and draw
                var reversed_labels = RGraph.array_reverse(this.properties['chart.ylabels.specific']);
            
                // Draw the bottom halfs labels
                for (var i=0; i<reversed_labels.length; ++i) {
                    
                    var y = ((this.grapharea / (reversed_labels.length - (ymin ? 1 : 0)) ) * (i + (ymin ? 0 : 1)));
                        y = y + this.gutterTop;

                    RGraph.Text(context, font, text_size,x,y,String(reversed_labels[i]), 'center', halign, bounding, 0, bgcolor);
                }

            } else {
                for (var i=0; i<this.properties['chart.ylabels.specific'].length; ++i) {
                    var y = this.gutterTop + ((this.grapharea / (this.properties['chart.ylabels.specific'].length - (ymin ? 1 : 0) )) * i);
                    RGraph.Text(context, font, text_size,x,y,String(this.properties['chart.ylabels.specific'][i]), 'center', halign, bounding, 0, bgcolor);
                }
            }
        }

        // Draw the X axis labels
        if (this.properties['chart.labels'] && this.properties['chart.labels'].length > 0) {

            var yOffset  = 5;
            var bordered = false;
            var bgcolor  = null;

            /**
            * Text angle
            */
            var angle  = 0;
            var valign = 'top';
            var halign = 'center';

            if (this.properties['chart.xlabels.inside']) {
                yOffset = -5;
                bordered = true;
                bgcolor  = this.properties['chart.xlabels.inside.color'];
                valign = 'bottom';
            }
            
            if (this.properties['chart.xaxispos'] == 'top') {
                valign = 'bottom';
                yOffset += 2;
            }

            if (typeof(this.properties['chart.text.angle']) == 'number' && this.properties['chart.text.angle'] > 0) {
                angle   = -1 * this.properties['chart.text.angle'];
                valign  = 'center';
                halign  = 'right';
                yOffset = 10;
                
                if (this.properties['chart.xaxispos'] == 'top') {
                    yOffset = 10;
                }
            }

            this.context.fillStyle = this.properties['chart.text.color'];
            var numLabels = this.properties['chart.labels'].length;

            for (i=0; i<numLabels; ++i) {

                // Changed 8th Nov 2010 to be not reliant on the coords
                //if (this.properties['chart.labels'][i] && this.coords && this.coords[i] && this.coords[i][0]) {
                if (this.properties['chart.labels'][i]) {

                    var labelX = ((this.canvas.width - this.gutterLeft - this.gutterRight - (2 * this.properties['chart.hmargin'])) / (numLabels - 1) ) * i;
                        labelX += this.gutterLeft + this.properties['chart.hmargin'];

                    /**
                    * Account for an unrelated number of labels
                    */
                    if (this.properties['chart.labels'].length != this.data[0].length) {
                        labelX = this.gutterLeft + this.properties['chart.hmargin'] + ((this.canvas.width - this.gutterLeft - this.gutterRight - (2 * this.properties['chart.hmargin'])) * (i / (this.properties['chart.labels'].length - 1)));
                    }
                    
                    // This accounts for there only being one point on the chart
                    if (!labelX) {
                        labelX = this.gutterLeft + this.properties['chart.hmargin'];
                    }

                    if (this.properties['chart.xaxispos'] == 'top' && this.properties['chart.text.angle'] > 0) {
                        halign = 'left';
                    }

                    RGraph.Text(context,
                                font,
                                text_size,
                                labelX,
                                (this.properties['chart.xaxispos'] == 'top') ? this.gutterTop - yOffset - (this.properties['chart.xlabels.inside'] ? -22 : 0) : (this.canvas.height - this.gutterBottom) + yOffset,
                                String(this.properties['chart.labels'][i]),
                                valign,
                                halign,
                                bordered,
                                angle,
                                bgcolor);
                }
            }

        }

        this.context.stroke();
        this.context.fill();
    }


    /**
    * Draws the line
    */
    RGraph.Line.prototype.DrawLine = function (lineData, color, fill, linewidth, tickmarks, index)
    {
        // This facilitates the Rise animation (the Y value only)
        if (this.properties['chart.animation.unfold.y'] && this.properties['chart.animation.factor'] != 1) {
            for (var i=0; i<lineData.length; ++i) {
                lineData[i] *= this.properties['chart.animation.factor'];
            }
        }

        var penUp = false;
        var yPos  = null;
        var xPos  = 0;
        this.context.lineWidth = 1;
        var lineCoords = [];
        
        /**
        * Get the previous line data
        */
        if (index > 0) {
            var prevLineCoords = this.coords2[index - 1];
        }

        // Work out the X interval
        var xInterval = (this.canvas.width - (2 * this.properties['chart.hmargin']) - this.gutterLeft - this.gutterRight) / (lineData.length - 1);

        // Loop thru each value given, plotting the line
        // (FORMERLY FIRST)
        for (i=0; i<lineData.length; i++) {

            var data_point = lineData[i];

            yPos = this.canvas.height - (((data_point - (data_point > 0 ?  this.properties['chart.ymin'] : (-1 * this.properties['chart.ymin']))) / (this.max - this.min) ) * this.grapharea);
            yPos = (this.grapharea / (this.max - this.min)) * (data_point - this.min);
            yPos = this.canvas.height - yPos;

            /**
            * This skirts an annoying JS rounding error
            * SEARCH TAGS: JS ROUNDING ERROR DECIMALS
            */
            if (data_point == this.max) {
                yPos = Math.round(yPos);
            }

            if (this.properties['chart.ylabels.invert']) {
                yPos -= this.gutterBottom;
                yPos -= this.gutterTop;
                yPos = this.canvas.height - yPos;
            }

            // Make adjustments depending on the X axis position
            if (this.properties['chart.xaxispos'] == 'center') {
                yPos = (yPos - this.gutterBottom - this.gutterTop) / 2;
                yPos = yPos + this.gutterTop;


            // TODO Check this
            } else if (this.properties['chart.xaxispos'] == 'top') {

                yPos = (this.grapharea / (this.max - this.min)) * (Math.abs(data_point) - this.min);
                yPos += this.gutterTop;
                
                if (this.properties['chart.ylabels.invert']) {
                    yPos -= this.gutterTop;
                    yPos  = this.grapharea - yPos;
                    yPos += this.gutterTop;
                }

            } else if (this.properties['chart.xaxispos'] == 'bottom') {
                // TODO
                yPos -= this.gutterBottom; // Without this the line is out of place due to the gutter
            }



            // Null data points, and a special case for this bug:http://dev.rgraph.net/tests/ymin.html
            if (   lineData[i] == null
                || (this.properties['chart.xaxispos'] == 'bottom' && lineData[i] < this.min && !this.properties['chart.outofbounds'])
                ||  (this.properties['chart.xaxispos'] == 'center' && lineData[i] < (-1 * this.max) && !this.properties['chart.outofbounds'])) {

                yPos = null;
            }

            // Not always very noticeable, but it does have an effect
            // with thick lines
            this.context.lineCap  = 'round';
            this.context.lineJoin = 'round';

            // Plot the line if we're at least on the second iteration
            if (i > 0) {
                xPos = xPos + xInterval;
            } else {
                xPos = this.properties['chart.hmargin'] + this.gutterLeft;
            }
            
            if (this.properties['chart.animation.unfold.x']) {
                xPos *= this.properties['chart.animation.factor'];
                
                if (xPos < this.properties['chart.gutter.left']) {
                    xPos = this.properties['chart.gutter.left'];
                }
            }

            /**
            * Add the coords to an array
            */
            this.coords.push([xPos, yPos]);
            lineCoords.push([xPos, yPos]);
        }
        
        this.context.stroke();

        // Store the coords in another format, indexed by line number
        this.coords2[index] = lineCoords;

        /**
        * For IE only: Draw the shadow ourselves as ExCanvas doesn't produce shadows
        */
        if (RGraph.isOld() && this.properties['chart.shadow']) {
            this.DrawIEShadow(lineCoords, this.context.shadowColor);
        }

        /**
        * Now draw the actual line [FORMERLY SECOND]
        */
        this.context.beginPath();
        // Transparent now as of 11/19/2011
        this.context.strokeStyle = 'rgba(0,0,0,0)';
        //this.context.strokeStyle = fill;
        if (fill) {
            this.context.fillStyle   = fill;
        }

        var isStepped = this.properties['chart.stepped'];
        var isFilled = this.properties['chart.filled'];
        
        if (this.properties['chart.xaxispos'] == 'top') {
            var xAxisPos = this.gutterTop;
        } else if (this.properties['chart.xaxispos'] == 'center') {
            var xAxisPos = this.gutterTop + (this.grapharea / 2);
        } else if (this.properties['chart.xaxispos'] == 'bottom') {
            var xAxisPos = this.canvas.height - this.gutterBottom;
        }


        for (var i=0; i<lineCoords.length; ++i) {

            xPos = lineCoords[i][0];
            yPos = lineCoords[i][1];
            var set = index;

            var prevY     = (lineCoords[i - 1] ? lineCoords[i - 1][1] : null);
            var isLast    = (i + 1) == lineCoords.length;

            /**
            * This nullifys values which are out-of-range
            */
            if (prevY < this.gutterTop || prevY > (this.canvas.height - this.gutterBottom) ) {
                penUp = true;
            }

            if (i == 0 || penUp || !yPos || !prevY || prevY < this.gutterTop) {

                if (this.properties['chart.filled'] && !this.properties['chart.filled.range']) {

                    this.context.moveTo(xPos + 1, xAxisPos);

                    // This facilitates the X axis being at the top
                    // NOTE: Also done below
                    if (this.properties['chart.xaxispos'] == 'top') {
                        this.context.moveTo(xPos + 1, xAxisPos);
                    }

                    this.context.lineTo(xPos, yPos);

                } else {

                    if (RGraph.isOld() && yPos == null) {
                        // Nada
                    } else {
                        this.context.moveTo(xPos + 1, yPos);
                    }
                }

                if (yPos == null) {
                    penUp = true;

                } else {
                    penUp = false;
                }

            } else {

                // Draw the stepped part of stepped lines
                if (isStepped) {
                    this.context.lineTo(xPos, lineCoords[i - 1][1]);
                }

                if ((yPos >= this.gutterTop && yPos <= (this.canvas.height - this.gutterBottom)) || this.properties['chart.outofbounds'] ) {

                    if (isLast && this.properties['chart.filled'] && !this.properties['chart.filled.range'] && this.properties['chart.yaxispos'] == 'right') {
                        xPos -= 1;
                    }


                    // Added 8th September 2009
                    if (!isStepped || !isLast) {
                        this.context.lineTo(xPos, yPos);
                        
                        if (isFilled && lineCoords[i+1] && lineCoords[i+1][1] == null) {
                            this.context.lineTo(xPos, xAxisPos);
                        }
                    
                    // Added August 2010
                    } else if (isStepped && isLast) {
                        this.context.lineTo(xPos,yPos);
                    }


                    penUp = false;
                } else {
                    penUp = true;
                }
            }
        }

        /**
        * Draw a line to the X axis if the chart is filled
        */
        if (this.properties['chart.filled'] && !this.properties['chart.filled.range']) {

            // Is this needed ??
            var fillStyle = this.properties['chart.fillstyle'];

            /**
            * Draw the bottom edge of the filled bit using either the X axis or the prevlinedata,
            * depending on the index of the line. The first line uses the X axis, and subsequent
            * lines use the prevLineCoords array
            */
            if (index > 0 && this.properties['chart.filled.accumulative']) {
                
                this.context.lineTo(xPos, prevLineCoords ? prevLineCoords[i - 1][1] : (this.canvas.height - this.gutterBottom - 1 + (this.properties['chart.xaxispos'] == 'center' ? (this.canvas.height - this.gutterTop - this.gutterBottom) / 2 : 0)));
            
                for (var k=(i - 1); k>=0; --k) {
                    this.context.lineTo(k == 0 ? prevLineCoords[k][0] + 1: prevLineCoords[k][0], prevLineCoords[k][1]);
                }
            } else {

                // Draw a line down to the X axis
                if (this.properties['chart.xaxispos'] == 'top') {
                    this.context.lineTo(xPos, this.properties['chart.gutter.top'] +  1);
                    this.context.lineTo(lineCoords[0][0],this.properties['chart.gutter.top'] + 1);
                } else if (typeof(lineCoords[i - 1][1]) == 'number') {

                    var yPosition = this.properties['chart.xaxispos'] == 'center' ? ((this.canvas.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop : this.canvas.height - this.gutterBottom;

                    this.context.lineTo(xPos,yPosition);
                    this.context.lineTo(lineCoords[0][0],yPosition);
                }
            }

            this.context.fillStyle = fill;

            this.context.fill();
            this.context.beginPath();

        }

        /**
        * FIXME this may need removing when Chrome is fixed
        * SEARCH TAGS: CHROME SHADOW BUG
        */
        if (navigator.userAgent.match(/Chrome/) && this.properties['chart.shadow'] && this.properties['chart.chromefix'] && this.properties['chart.shadow.blur'] > 0) {

            for (var i=lineCoords.length - 1; i>=0; --i) {
                if (
                       typeof(lineCoords[i][1]) != 'number'
                    || (typeof(lineCoords[i+1]) == 'object' && typeof(lineCoords[i+1][1]) != 'number')
                   ) {
                    this.context.moveTo(lineCoords[i][0],lineCoords[i][1]);
                } else {
                    this.context.lineTo(lineCoords[i][0],lineCoords[i][1]);
                }
            }
        }

        this.context.stroke();


        if (this.properties['chart.backdrop']) {
            this.DrawBackdrop(lineCoords, color);
        }

        // Now redraw the lines with the correct line width
        this.RedrawLine(lineCoords, color, linewidth);
        
        this.context.stroke();

        // Draw the tickmarks
        for (var i=0; i<lineCoords.length; ++i) {

            i = Number(i);

            if (isStepped && i == (lineCoords.length - 1)) {
                this.context.beginPath();
                //continue;
            }

            if (
                (
                    tickmarks != 'endcircle'
                 && tickmarks != 'endsquare'
                 && tickmarks != 'filledendsquare'
                 && tickmarks != 'endtick'
                 && tickmarks != 'endtriangle'
                 && tickmarks != 'arrow'
                 && tickmarks != 'filledarrow'
                )
                || (i == 0 && tickmarks != 'arrow' && tickmarks != 'filledarrow')
                || i == (lineCoords.length - 1)
               ) {

                var prevX = (i <= 0 ? null : lineCoords[i - 1][0]);
                var prevY = (i <= 0 ? null : lineCoords[i - 1][1]);

                this.DrawTick(lineData, lineCoords[i][0], lineCoords[i][1], color, false, prevX, prevY, tickmarks, i);

                // Draws tickmarks on the stepped bits of stepped charts. Takend out 14th July 2010
                //
                //if (this.properties['chart.stepped'] && lineCoords[i + 1] && this.properties['chart.tickmarks'] != 'endsquare' && this.properties['chart.tickmarks'] != 'endcircle' && this.properties['chart.tickmarks'] != 'endtick') {
                //    this.DrawTick(lineCoords[i + 1][0], lineCoords[i][1], color);
                //}
            }
        }

        // Draw something off canvas to skirt an annoying bug
        this.context.beginPath();
        this.context.arc(this.canvas.width + 50000, this.canvas.height + 50000, 2, 0, 6.38, 1);
    }



    /**
    * This functions draws a tick mark on the line
    * 
    * @param xPos  int  The x position of the tickmark
    * @param yPos  int  The y position of the tickmark
    * @param color str  The color of the tickmark
    * @param       bool Whether the tick is a shadow. If it is, it gets offset by the shadow offset
    */
    RGraph.Line.prototype.DrawTick = function (lineData, xPos, yPos, color, isShadow, prevX, prevY, tickmarks, index)
    {
        // If the yPos is null - no tick
        if ((yPos == null || yPos > (this.canvas.height - this.gutterBottom) || yPos < this.gutterTop) && !this.properties['chart.outofbounds'] || !this.properties['chart.line.visible']) {
            return;
        }

        this.context.beginPath();

        var offset   = 0;

        // Reset the stroke and lineWidth back to the same as what they were when the line was drawm
        // UPDATE 28th July 2011 - the line width is now set to 1
        this.context.lineWidth   = this.properties['chart.tickmarks.linewidth'] ? this.properties['chart.tickmarks.linewidth'] : this.properties['chart.linewidth'];
        this.context.strokeStyle = isShadow ? this.properties['chart.shadow.color'] : this.context.strokeStyle;
        this.context.fillStyle   = isShadow ? this.properties['chart.shadow.color'] : this.context.strokeStyle;

        // Cicular tick marks
        if (   tickmarks == 'circle'
            || tickmarks == 'filledcircle'
            || tickmarks == 'endcircle') {

            if (tickmarks == 'circle'|| tickmarks == 'filledcircle' || (tickmarks == 'endcircle') ) {
                this.context.beginPath();
                this.context.arc(xPos + offset, yPos + offset, this.properties['chart.ticksize'], 0, 360 / (180 / PI), false);

                if (tickmarks == 'filledcircle') {
                    this.context.fillStyle = isShadow ? this.properties['chart.shadow.color'] : this.context.strokeStyle;
                } else {
                    this.context.fillStyle = isShadow ? this.properties['chart.shadow.color'] : 'white';
                }

                this.context.stroke();
                this.context.fill();
            }

        // Halfheight "Line" style tick marks
        } else if (tickmarks == 'halftick') {
            this.context.beginPath();
            this.context.moveTo(AA(this, xPos), yPos);
            this.context.lineTo(AA(this, xPos), yPos + this.properties['chart.ticksize']);

            this.context.stroke();
        
        // Tick style tickmarks
        } else if (tickmarks == 'tick') {
            this.context.beginPath();
            this.context.moveTo(AA(this, xPos), yPos -  this.properties['chart.ticksize']);
            this.context.lineTo(AA(this, xPos), yPos + this.properties['chart.ticksize']);

            this.context.stroke();
        
        // Endtick style tickmarks
        } else if (tickmarks == 'endtick') {
            this.context.beginPath();
            this.context.moveTo(AA(this, xPos), yPos -  this.properties['chart.ticksize']);
            this.context.lineTo(AA(this, xPos), yPos + this.properties['chart.ticksize']);

            this.context.stroke();
        
        // "Cross" style tick marks
        } else if (tickmarks == 'cross') {
            this.context.beginPath();
                
                var ticksize = this.properties['chart.ticksize'];
                
                this.context.moveTo(xPos - ticksize, yPos - ticksize);
                this.context.lineTo(xPos + ticksize, yPos + ticksize);
                this.context.moveTo(xPos + ticksize, yPos - ticksize);
                this.context.lineTo(xPos - ticksize, yPos + ticksize);
            this.context.stroke();


        // Triangle style tick marks
        } else if (tickmarks == 'triangle' || tickmarks == 'filledtriangle' || tickmarks == 'endtriangle') {
            this.context.beginPath();
                
                if (tickmarks == 'filledtriangle') {
                    this.context.fillStyle = isShadow ? this.properties['chart.shadow.color'] : this.context.strokeStyle;
                } else {
                    this.context.fillStyle = 'white';
                }

                this.context.moveTo(AA(this, xPos - this.properties['chart.ticksize']), yPos + this.properties['chart.ticksize']);
                this.context.lineTo(AA(this, xPos), yPos - this.properties['chart.ticksize']);
                this.context.lineTo(AA(this, xPos + this.properties['chart.ticksize']), yPos + this.properties['chart.ticksize']);
            this.context.closePath();
            
            this.context.stroke();
            this.context.fill();


        // A white bordered circle
        } else if (tickmarks == 'borderedcircle' || tickmarks == 'dot') {
                this.context.lineWidth   = 1;
                this.context.strokeStyle = this.properties['chart.tickmarks.dot.color'];
                this.context.fillStyle   = this.properties['chart.tickmarks.dot.color'];

                // The outer white circle
                this.context.beginPath();
                this.context.arc(xPos, yPos, this.properties['chart.ticksize'], 0, 360 / (180 / PI), false);
                this.context.closePath();


                this.context.fill();
                this.context.stroke();
                
                // Now do the inners
                this.context.beginPath();
                this.context.fillStyle   = color;
                this.context.strokeStyle = color;
                this.context.arc(xPos, yPos, this.properties['chart.ticksize'] - 2, 0, 360 / (180 / PI), false);

                this.context.closePath();

                this.context.fill();
                this.context.stroke();
        
        } else if (   tickmarks == 'square'
                   || tickmarks == 'filledsquare'
                   || (tickmarks == 'endsquare')
                   || (tickmarks == 'filledendsquare') ) {

            this.context.fillStyle   = 'white';
            this.context.strokeStyle = this.context.strokeStyle;

            this.context.beginPath();
            this.context.rect(AA(this, xPos - this.properties['chart.ticksize']), AA(this, yPos - this.properties['chart.ticksize']), this.properties['chart.ticksize'] * 2, this.properties['chart.ticksize'] * 2);

            // Fillrect
            if (tickmarks == 'filledsquare' || tickmarks == 'filledendsquare') {
                this.context.fillStyle = isShadow ? this.properties['chart.shadow.color'] : this.context.strokeStyle;
                this.context.rect(AA(this, xPos - this.properties['chart.ticksize']), AA(this, yPos - this.properties['chart.ticksize']), this.properties['chart.ticksize'] * 2, this.properties['chart.ticksize'] * 2);

            } else if (tickmarks == 'square' || tickmarks == 'endsquare') {
                this.context.fillStyle = isShadow ? this.properties['chart.shadow.color'] : 'white';
                this.context.rect(AA(this, (xPos - this.properties['chart.ticksize']) + 1), AA(this, (yPos - this.properties['chart.ticksize']) + 1), (this.properties['chart.ticksize'] * 2) - 2, (this.properties['chart.ticksize'] * 2) - 2);
            }

            this.context.stroke();
            this.context.fill();

        /**
        * FILLED arrowhead
        */
        } else if (tickmarks == 'filledarrow') {
        
            var x = Math.abs(xPos - prevX);
            var y = Math.abs(yPos - prevY);

            if (yPos < prevY) {
                var a = Math.atan(x / y) + 1.57;
            } else {
                var a = Math.atan(y / x) + 3.14;
            }

            this.context.beginPath();
                this.context.moveTo(AA(this, xPos), AA(this, yPos));
                this.context.arc(AA(this, xPos), AA(this, yPos), 7, a - 0.5, a + 0.5, false);
            this.context.closePath();

            this.context.stroke();
            this.context.fill();

        /**
        * Arrow head, NOT filled
        */
        } else if (tickmarks == 'arrow') {

            var x = Math.abs(xPos - prevX);
            var y = Math.abs(yPos - prevY);
            
            var orig_linewidth = this.context.lineWidth;

            if (yPos < prevY) {
                var a = Math.atan(x / y) + 1.57;
            } else {
                var a = Math.atan(y / x) + 3.14;
            }

            this.context.beginPath();
                this.context.moveTo(AA(this, xPos), AA(this, yPos));
                this.context.arc(AA(this, xPos), AA(this, yPos), 7, a - 0.5 - (document.all ? 0.1 : 0.01), a - 0.4, false);

                this.context.moveTo(AA(this, xPos), AA(this, yPos));
                this.context.arc(AA(this, xPos), AA(this, yPos), 7, a + 0.5 + (document.all ? 0.1 : 0.01), a + 0.5, true);
            this.context.stroke();
            this.context.fill();
            
            // Revert to original lineWidth
            this.context.lineWidth = orig_linewidth;
        
        /**
        * Custom tick drawing function
        */
        } else if (typeof(tickmarks) == 'function') {
            tickmarks(this, lineData, lineData[index], index, xPos, yPos, color, prevX, prevY);
        }
    }


    /**
    * Draws a filled range if necessary
    */
    RGraph.Line.prototype.DrawRange = function ()
    {
        /**
        * Fill the range if necessary
        */
        if (this.properties['chart.filled.range'] && this.properties['chart.filled']) {
            this.context.beginPath();
            this.context.fillStyle = this.properties['chart.fillstyle'];
            //this.context.strokeStyle = this.properties['chart.fillstyle']; // Strokestyle not used now (10th October 2012)
            this.context.lineWidth = 1;
            var len = (this.coords.length / 2);

            for (var i=0; i<len; ++i) {
                if (i == 0) {
                    this.context.moveTo(this.coords[i][0], this.coords[i][1])
                } else {
                    this.context.lineTo(this.coords[i][0], this.coords[i][1])
                }
            }

            for (var i=this.coords.length - 1; i>=len; --i) {
                this.context.lineTo(this.coords[i][0], this.coords[i][1])
            }
            // Taken out - 10th Oct 2012
            //this.context.stroke();
            this.context.fill();
        }
    }


    /**
    * Redraws the line with the correct line width etc
    * 
    * @param array coords The coordinates of the line
    */
    RGraph.Line.prototype.RedrawLine = function (coords, color, linewidth)
    {
        if (this.properties['chart.noredraw']) {
            return;
        }

        this.context.strokeStyle = (typeof(color) == 'object' && color && color.toString().indexOf('CanvasGradient') == -1 ? color[0] : color);
        this.context.lineWidth = linewidth;

        if (!this.properties['chart.line.visible']) {
            this.context.strokeStyle = 'transparent';
        }

        if (this.properties['chart.curvy'] || this.properties['chart.spline']) {
            this.DrawCurvyLine(coords, !this.properties['chart.line.visible'] ? 'transparent' : color, linewidth);
            return;
        }

        this.context.beginPath();

        var len    = coords.length;
        var width  = this.canvas.width
        var height = this.canvas.height;
        var penUp  = false;

        for (var i=0; i<len; ++i) {

            var xPos   = coords[i][0];
            var yPos   = coords[i][1];

            if (i > 0) {
                var prevX = coords[i - 1][0];
                var prevY = coords[i - 1][1];
            }


            if ((
                   (i == 0 && coords[i])
                || (yPos < this.gutterTop)
                || (prevY < this.gutterTop)
                || (yPos > (height - this.gutterBottom))
                || (i > 0 && prevX > (width - this.gutterRight))
                || (i > 0 && prevY > (height - this.gutterBottom))
                || prevY == null
                || penUp == true
               ) && (!this.properties['chart.outofbounds'] || yPos == null || prevY == null) ) {

                if (RGraph.isOld() && yPos == null) {
                    // ...?
                } else {
                    this.context.moveTo(coords[i][0], coords[i][1]);
                }

                penUp = false;

            } else {

                if (this.properties['chart.stepped'] && i > 0) {
                    this.context.lineTo(coords[i][0], coords[i - 1][1]);
                }
                
                // Don't draw the last bit of a stepped chart. Now DO
                //if (!this.properties['chart.stepped'] || i < (coords.length - 1)) {
                this.context.lineTo(coords[i][0], coords[i][1]);
                //}
                penUp = false;
            }
        }

        /**
        * If two colors are specified instead of one, go over the up bits
        */
        if (this.properties['chart.colors.alternate'] && typeof(color) == 'object' && color[0] && color[1]) {
            for (var i=1; i<len; ++i) {

                var prevX = coords[i - 1][0];
                var prevY = coords[i - 1][1];
                
                this.context.beginPath();
                this.context.strokeStyle = color[coords[i][1] < prevY ? 0 : 1];
                this.context.lineWidth = this.properties['chart.linewidth'];
                this.context.moveTo(prevX, prevY);
                this.context.lineTo(coords[i][0], coords[i][1]);
                this.context.stroke();
            }
        }
    }


    /**
    * This function is used by MSIE only to manually draw the shadow
    * 
    * @param array coords The coords for the line
    */
    RGraph.Line.prototype.DrawIEShadow = function (coords, color)
    {
        var offsetx = this.properties['chart.shadow.offsetx'];
        var offsety = this.properties['chart.shadow.offsety'];
        
        this.context.lineWidth   = this.properties['chart.linewidth'];
        this.context.strokeStyle = color;
        this.context.beginPath();

        for (var i=0; i<coords.length; ++i) {
            if (i == 0) {
                this.context.moveTo(coords[i][0] + offsetx, coords[i][1] + offsety);
            } else {
                this.context.lineTo(coords[i][0] + offsetx, coords[i][1] + offsety);
            }
        }

        this.context.stroke();
    }


    /**
    * Draw the backdrop
    */
    RGraph.Line.prototype.DrawBackdrop = function (coords, color)
    {
        var size = this.properties['chart.backdrop.size'];
        this.context.lineWidth = size;
        this.context.globalAlpha = this.properties['chart.backdrop.alpha'];
        this.context.strokeStyle = color;
        this.context.lineJoin = 'miter';
        
        this.context.beginPath();
            this.context.moveTo(coords[0][0], coords[0][1]);
            for (var j=1; j<coords.length; ++j) {
                this.context.lineTo(coords[j][0], coords[j][1]);
            }
    
        this.context.stroke();
    
        // Reset the alpha value
        this.context.globalAlpha = 1;
        this.context.lineJoin = 'round';
        RGraph.NoShadow(this);
    }


    /**
    * Returns the linewidth
    */
    RGraph.Line.prototype.GetLineWidth = function (i)
    {
        var linewidth = this.properties['chart.linewidth'];
        
        if (typeof(linewidth) == 'number') {
            return linewidth;
        
        } else if (typeof(linewidth) == 'object') {
            if (linewidth[i]) {
                return linewidth[i];
            } else {
                return linewidth[0];
            }

            alert('[LINE] Error! chart.linewidth should be a single number or an array of one or more numbers');
        }
    }



    /**
    * The getPoint() method - used to get the point the mouse is currently over, if any
    * 
    * @param object e The event object
    * @param object   OPTIONAL You can pass in the bar object instead of the
    *                          function getting it from the canvas
    */
    RGraph.Line.prototype.getShape =
    RGraph.Line.prototype.getPoint = function (e)
    {
        var canvas  = e.target;
        var obj     = this;
        var context = obj.context;
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];
        
        // This facilitates you being able to pass in the bar object as a parameter instead of
        // the function getting it from the object
        if (arguments[1]) {
            obj = arguments[1];
        }

        for (var i=0; i<obj.coords.length; ++i) {
        
            var x = obj.coords[i][0];
            var y = obj.coords[i][1];

            // Do this if the hotspot is triggered by the X coord AND the Y coord
            if (   mouseX <= (x + obj.properties['chart.tooltips.hotspot.size'])
                && mouseX >= (x - obj.properties['chart.tooltips.hotspot.size'])
                && mouseY <= (y + obj.properties['chart.tooltips.hotspot.size'])
                && mouseY >= (y - obj.properties['chart.tooltips.hotspot.size'])
               ) {

                    if (RGraph.parseTooltipText) {
                        var tooltip = RGraph.parseTooltipText(this.properties['chart.tooltips'], i);
                    }

                    // Work out the dataset
                    var dataset = 0;
                    var idx = i;
                    while ((idx + 1) > this.data[dataset].length) {
                        idx -= this.data[dataset].length;
                        dataset++;
                    }

                    return {0:obj, 1:x, 2:y, 3:i, 'object': obj, 'x': x, 'y': y, 'index': i, 'tooltip': tooltip, 'dataset': dataset, 'index_adjusted': idx};

            } else if (    obj.properties['chart.tooltips.hotspot.xonly'] == true
                        && mouseX <= (x + obj.properties['chart.tooltips.hotspot.size'])
                        && mouseX >= (x - obj.properties['chart.tooltips.hotspot.size'])) {

                        var tooltip = RGraph.parseTooltipText(this.properties['chart.tooltips'], i);

                        return {0:obj, 1:x, 2:y, 3:i, 'object': obj, 'x': x, 'y': y, 'index': i, 'tooltip': tooltip};
            }
        }
    }



    /**
    * Draws the above line labels
    */
    RGraph.Line.prototype.DrawAboveLabels = function ()
    {
        var context    = this.context;
        var size       = this.properties['chart.labels.above.size'];
        var font       = this.properties['chart.text.font'];
        var units_pre  = this.properties['chart.units.pre'];
        var units_post = this.properties['chart.units.post'];

        context.beginPath();

        // Don't need to check that chart.labels.above is enabled here, it's been done already
        for (var i=0; i<this.coords.length; ++i) {
            var coords = this.coords[i];
            
            RGraph.Text(context, font, size, coords[0], coords[1] - 5 - size, RGraph.number_format(this, this.data_arr[i], units_pre, units_post), 'center', 'center', true, null, 'rgba(255, 255, 255, 0.7)');
        }
        
        context.fill();
    }


    /**
    * Draw a curvy line. This isn't 100% accurate but may be more to your tastes
    */
    RGraph.Line.prototype.DrawCurvyLine = function (coords, color, linewidth)
    {
        var yCoords = [];

        for (var i=0; i<coords.length; ++i) {
            yCoords.push(coords[i][1])
        }
        
        this.context.beginPath();
            //if (this.properties['chart.spline.filled']) {
            //    this.context.moveTo(coords[0][0],this.canvas.height - this.gutterBottom);
            //}
    
            this.DrawSpline(this.context, yCoords, color);
            
            //if (this.properties['chart.spline.filled']) {
            //    this.context.lineTo(coords[coords.length - 1][0],this.canvas.height - this.gutterBottom);
            //}
        //this.context.closePath();
        this.context.stroke();
        //this.context.fill();
    }


    /**
    * When you click on the chart, this method can return the Y value at that point. It works for any point on the
    * chart (that is inside the gutters) - not just points on the Line.
    * 
    * @param object e The event object
    */
    RGraph.Line.prototype.getValue = function (arg)
    {
        if (arg.length == 2) {
            var mouseX = arg[0];
            var mouseY = arg[1];
        } else {
            var mouseCoords = RGraph.getMouseXY(arg);
            var mouseX      = mouseCoords[0];
            var mouseY      = mouseCoords[1];
        }

        var obj = this;
        var xaxispos = this.properties['chart.xaxispos'];

        if (mouseY < obj.properties['chart.gutter.top']) {
            return xaxispos == 'bottom' || xaxispos == 'center' ? this.max : this.min;
        } else if (mouseY > (obj.canvas.height - obj.properties['chart.gutter.bottom'])) {
            return xaxispos == 'bottom' ? this.min : this.max;
        }
        
        if (this.properties['chart.xaxispos'] == 'center') {
            var value = (( (obj.grapharea / 2) - (mouseY - obj.properties['chart.gutter.top'])) / obj.grapharea) * (obj.max - obj.min);
            value *= 2;
            value > 0 ? value += this.min : value -= this.min;
            return value;
        } else if (this.properties['chart.xaxispos'] == 'top') {
            var value = ((obj.grapharea - (mouseY - obj.properties['chart.gutter.top'])) / obj.grapharea) * (obj.max - obj.min);
            value = Math.abs(obj.max - value) * -1;
            return value;
        } else {
            var value = ((obj.grapharea - (mouseY - obj.properties['chart.gutter.top'])) / obj.grapharea) * (obj.max - obj.min)
            value += obj.min;
            return value;
        }
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Line.prototype.Highlight = function (shape)
    {
        if (this.properties['chart.tooltips.highlight']) {
            // Add the new highlight
            RGraph.Highlight.Point(this, shape);
        }
    }



    /**
    * The getObjectByXY() worker method. Don't call this call:
    * 
    * RGraph.ObjectRegistry.getObjectByXY(e)
    * 
    * @param object e The event object
    */
    RGraph.Line.prototype.getObjectByXY = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);

        // The 5 is so that the cursor doesn't have to be over the graphArea to trigger the hotspot
        if (
               (mouseXY[0] > this.properties['chart.gutter.left'] - 5)
            && mouseXY[0] < (this.canvas.width - this.properties['chart.gutter.right'] + 5)
            && mouseXY[1] > (this.properties['chart.gutter.top'] - 5)
            && mouseXY[1] < (this.canvas.height - this.properties['chart.gutter.bottom'] + 5)
            ) {

            return this;
        }
    }



    /**
    * This method handles the adjusting calculation for when the mouse is moved
    * 
    * @param object e The event object
    */
    RGraph.Line.prototype.Adjusting_mousemove = function (e)
    {
        /**
        * Handle adjusting for the Bar
        */
        if (RGraph.Registry.Get('chart.adjusting') && RGraph.Registry.Get('chart.adjusting').uid == this.uid) {

            // Rounding the value to the given number of decimals make the chart step
            var value   = Number(this.getValue(e));//.toFixed(this.properties['chart.scale.decimals']);
            var shape   = RGraph.Registry.Get('chart.adjusting.shape');

            if (shape) {

                RGraph.Registry.Set('chart.adjusting.shape', shape);

                this.original_data[shape['dataset']][shape['index_adjusted']] = Number(value);

                RGraph.RedrawCanvas(e.target);
                
                RGraph.FireCustomEvent(this, 'onadjust');
            }
        }
    }


    /**
    * This function can be used when the canvas is clicked on (or similar - depending on the event)
    * to retrieve the relevant Y coordinate for a particular value.
    * 
    * @param int value The value to get the Y coordinate for
    */
    RGraph.Line.prototype.getYCoord = function (value)
    {
        if (typeof(value) != 'number') {
            return null;
        }

        var y;
        var xaxispos = this.properties['chart.xaxispos'];

        // Higher than max
        if (value > this.max) {
            value = this.max;
        }

        if (xaxispos == 'top') {
        
            // Account for negative numbers
            if (value < 0) {
                value = Math.abs(value);
            }

            y = ((value - this.min) / (this.max - this.min)) * this.grapharea;

            // Inverted Y labels
            if (this.properties['chart.ylabels.invert']) {
                y = this.grapharea - y;
            }

            y = y + this.gutterTop

        } else if (xaxispos == 'center') {

            y = ((value - this.min) / (this.max - this.min)) * (this.grapharea / 2);
            y = (this.grapharea / 2) - y;
            y += this.gutterTop;

        } else {

            if (value < this.min || value > this.max) {
                return null;
            }

            y = ((value - this.min) / (this.max - this.min)) * this.grapharea;
            
            // Inverted Y labels
            if (this.properties['chart.ylabels.invert']) {
                y = this.grapharea - y;
            }

            y = this.canvas.height - this.gutterBottom - y;
        }
        
        return y;
    }



    /**
    * This function positions a tooltip when it is displayed
    * 
    * @param obj object    The chart object
    * @param int x         The X coordinate specified for the tooltip
    * @param int y         The Y coordinate specified for the tooltip
    * @param objec tooltip The tooltips DIV element
    */
    RGraph.Line.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var coordX     = obj.coords[tooltip.__index__][0];
        var coordY     = obj.coords[tooltip.__index__][1];
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var gutterLeft = obj.properties['chart.gutter.left'];
        var gutterTop  = obj.properties['chart.gutter.top'];
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
            tooltip.style.left = (canvasXY[0] + coordX - (width * 0.2)) + 'px';
            img.style.left = ((width * 0.2) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + coordX + (width / 2)) > document.body.offsetWidth) {
            tooltip.style.left = canvasXY[0] + coordX - (width * 0.8) + 'px';
            img.style.left = ((width * 0.8) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + coordX - (width * 0.5)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * This function draws a curvy line
    * 
    * @param object context The  2D context
    * @param array  coords  The coordinates
    */
    RGraph.Line.prototype.DrawSpline = function (context, coords, color)
    {

        var co          = context;
        var ca          = co.canvas;
        var xCoords     = [];
        var gutterLeft  = this.properties['chart.gutter.left'];
        var gutterRight = this.properties['chart.gutter.right'];
        var hmargin     = this.properties['chart.hmargin'];
        var interval    = (ca.width - (gutterLeft + gutterRight) - (2 * hmargin)) / (coords.length - 1);

        this.context.strokeStyle = color;

        /**
        * Get the Points array in the format we want - first value should be null along with the lst value
        */
        var P = [coords[0]];
        for (var i=0; i<coords.length; ++i) {
            P.push(coords[i]);
        }
        P.push(coords[coords.length - 1] + (coords[coords.length - 1] - coords[coords.length - 2]));
        //P.push(null);

        for (var j=1; j<P.length-2; ++j) {
            for (var t=0; t<10; ++t) {
                
                var yCoord = Spline( t/10, P[j-1], P[j], P[j+1], P[j+2] );

                xCoords.push(((j-1) * interval) + (t * (interval / 10)) + gutterLeft + hmargin);
                co.lineTo(xCoords[xCoords.length - 1], yCoord);
            }
        }
        
        // Draw the last section
        co.lineTo(((j-1) * interval) + gutterLeft + hmargin, P[j]);


        function Spline (t, P0, P1, P2, P3)
        {
            return 0.5 * ((2 * P1) +
                         ((0-P0) + P2) * t +
                         ((2*P0 - (5*P1) + (4*P2) - P3) * (t*t) +
                         ((0-P0) + (3*P1)- (3*P2) + P3) * (t*t*t)));
        }
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Line.prototype.parseColors = function ()
    {
        for (var i=0; i<this.properties['chart.colors'].length; ++i) {
            if (typeof(this.properties['chart.colors'][i]) == 'object' && this.properties['chart.colors'][i][0] && this.properties['chart.colors'][i][1]) {
                this.properties['chart.colors'][i][0] = this.parseSingleColorForGradient(this.properties['chart.colors'][i][0]);
                this.properties['chart.colors'][i][1] = this.parseSingleColorForGradient(this.properties['chart.colors'][i][1]);
            } else {
                this.properties['chart.colors'][i] = this.parseSingleColorForGradient(this.properties['chart.colors'][i]);
            }
        }
        
        /**
        * Fillstyle
        */
        if (this.properties['chart.fillstyle']) {
            if (typeof(this.properties['chart.fillstyle']) == 'string') {
                this.properties['chart.fillstyle'] = this.parseSingleColorForGradient(this.properties['chart.fillstyle'], 'vertical');
            } else {
                for (var i=0; i<this.properties['chart.fillstyle'].length; ++i) {
                    this.properties['chart.fillstyle'][i] = this.parseSingleColorForGradient(this.properties['chart.fillstyle'][i], 'vertical');
                }
            }
        }
        
        /**
        * Key colors
        */
        if (!RGraph.is_null(this.properties['chart.key.colors'])) {
            for (var i=0; i<this.properties['chart.key.colors'].length; ++i) {
                this.properties['chart.key.colors'][i] = this.parseSingleColorForGradient(this.properties['chart.key.colors'][i]);
            }
        }
        
        /**
        * Parse various properties for colors
        */
        var properties = ['chart.background.barcolor1','chart.background.barcolor2','chart.background.grid.color','chart.text.color','chart.crosshairs.color','chart.annotate.color','chart.title.color','chart.title.yaxis.color','chart.key.background','chart.axis.color','chart.highlight.fill'];

        for (var i=0; i<properties.length; ++i) {
            this.properties[properties[i]] = this.parseSingleColorForGradient(this.properties[properties[i]]);
        }
    }



    /**
    * This parses a single color value
    */
    RGraph.Line.prototype.parseSingleColorForGradient = function (color)
    {
        var canvas  = this.canvas;
        var context = this.context;
        
        if (!color || typeof(color) != 'string') {
            return color;
        }
        
        /**
        * Horizontal or vertical gradient
        */
        var dir = typeof(arguments[1]) == 'string' ? arguments[1] : 'horizontal';

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            // Create the gradient
            if (dir == 'horizontal') {
                var grad = context.createLinearGradient(0,0,canvas.width,0);
            } else {
                var grad = context.createLinearGradient(0,0,0,canvas.height);
            }

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }

        return grad ? grad : color;
    }