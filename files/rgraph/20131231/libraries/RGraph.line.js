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
    * @param array  ...    The lines to plot
    */
    RGraph.Line = function (id)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'line';
        this.max               = 0;
        this.coords            = [];
        this.coords2           = [];
        this.coords.key        = [];
        this.coordsText        = [];
        this.coordsSpline      = [];
        this.hasnegativevalues = false;
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;
        this.original_colors   = [];


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
            'chart.background.grid.dashed': false,
            'chart.background.grid.dotted': false,
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
            'chart.colors':                 ['red', '#0f0', '#00f', '#f0f', '#ff0', '#0ff','green','pink','blue','black'],
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
            'chart.ymin':                   0,
            'chart.ymax':                   null,
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
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
            'chart.title.yaxis.x':          null,
            'chart.title.yaxis.y':          null,
            'chart.title.xaxis.x':          null,
            'chart.title.xaxis.y':          null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
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
            'chart.key.position.gutter.boxed': false,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.key.interactive':        false,
            'chart.key.interactive.highlight.chart.stroke': 'rgba(255,0,0,0.3)',
            'chart.key.interactive.highlight.label': 'rgba(255,0,0,0.2)',
            'chart.key.text.color':         'black',
            'chart.contextmenu':            null,
            'chart.ylabels':                true,
            'chart.ylabels.count':          5,
            'chart.ylabels.inside':         false,
            'chart.scale.invert':         false,
            'chart.xlabels.inside':         false,
            'chart.xlabels.inside.color':   'rgba(255,255,255,0.5)',
            'chart.noaxes':                 false,
            'chart.noyaxis':                false,
            'chart.noxaxis':                false,
            'chart.noendxtick':             false,
            'chart.noendytick':             false,
            'chart.units.post':             '',
            'chart.units.pre':              '',
            'chart.scale.zerostart':        false,
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
            'chart.filled.range.threshold': null,
            'chart.filled.range.threshold.colors': ['red', 'green'],
            'chart.filled.accumulative':    true,
            'chart.variant':                null,
            'chart.axis.color':             'black',
            'chart.axis.linewidth':         1,
            'chart.numxticks':              (arguments[1] && typeof(arguments[1][0]) == 'number' ? arguments[1].length : 20),
            'chart.numyticks':              10,
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
            'chart.animation.trace.clip':     1,
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
            * chart.xticks is now called chart.numxticks
            */
            if (name == 'chart.xticks') {
                name = 'chart.numxticks';
            }
    
    
            /**
            * Change the new chart.spline option to chart.curvy
            */
            if (name == 'chart.spline') {
                name = 'chart.curvy';
            }
    
    
            /**
            * Chnge chart.ylabels.invert to chart.scale.invert
            */
            if (name == 'chart.ylabels.invert') {
                name = 'chart.scale.invert';
            }
    
    
            this.properties[name] = value;
    
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
            
            /**
            * If requested property is chart.spline - change it to chart.curvy
            */
            if (name == 'chart.spline') {
                name = 'chart.curvy';
            }
    
            return prop[name];
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
        this.Draw = function ()
        {
            // MUST be the first thing done!
            if (typeof(prop['chart.background.image']) == 'string') {
                RG.DrawBackgroundImage(this);
            }
    
    
            /**
            * Fire the onbeforedraw event
            */
            RG.FireCustomEvent(this, 'onbeforedraw');
    
    
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
            this.gutterLeft   = prop['chart.gutter.left'];
            this.gutterRight  = prop['chart.gutter.right'];
            this.gutterTop    = prop['chart.gutter.top'];
            this.gutterBottom = prop['chart.gutter.bottom'];
    
    
            /**
            * Check for Chrome 6 and shadow
            * 
            * TODO Remove once it's been fixed (for a while)
            * 29/10/2011 - Looks like it's been fixed as long the linewidth is at least 1.01
            * SEARCH TAGS: CHROME FIX SHADOW BUG
            */
            if (   prop['chart.shadow']
                && ISCHROME
                && prop['chart.linewidth'] <= 1
                && prop['chart.chromefix']
                && prop['chart.shadow.blur'] > 0) {
                    alert('[RGRAPH WARNING] Chrome has a shadow bug, meaning you should increase the linewidth to at least 1.01');
            }
    
    
            // Reset the data back to that which was initially supplied
            this.data = RG.array_clone(this.original_data);
    
    
            // Reset the max value
            this.max = 0;
    
            /**
            * Reverse the datasets so that the data and the labels tally
            *  COMMENTED OUT 15TH AUGUST 2011
            */
            //this.data = RG.array_reverse(this.data);
    
            if (prop['chart.filled'] && !prop['chart.filled.range'] && this.data.length > 1 && prop['chart.filled.accumulative']) {
    
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
            if (prop['chart.ymax']) {
                
                this.max = prop['chart.ymax'];
                this.min = prop['chart.ymin'] ? prop['chart.ymin'] : 0;
    
                this.scale2 = RG.getScale2(this, {
                                                    'max':this.max,
                                                    'min':prop['chart.ymin'],
                                                    'strict':true,
                                                    'scale.thousand':prop['chart.scale.thousand'],
                                                    'scale.point':prop['chart.scale.point'],
                                                    'scale.decimals':prop['chart.scale.decimals'],
                                                    'ylabels.count':prop['chart.ylabels.count'],
                                                    'scale.round':prop['chart.scale.round'],
                                                    'units.pre': prop['chart.units.pre'],
                                                    'units.post': prop['chart.units.post']
                                                   });
    
                this.max   = this.scale2.max ? this.scale2.max : 0;
    
                // Check for negative values
                if (!prop['chart.outofbounds']) {
                    for (dataset=0; dataset<this.data.length; ++dataset) {
                        for (var datapoint=0; datapoint<this.data[dataset].length; datapoint++) {
                
                            // Check for negative values
                            this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues;
                        }
                    }
                }
    
            } else {
    
                this.min = prop['chart.ymin'] ? prop['chart.ymin'] : 0;
    
                // Work out the max Y value
                for (dataset=0; dataset<this.data.length; ++dataset) {
                    for (var datapoint=0; datapoint<this.data[dataset].length; datapoint++) {
        
                        this.max = Math.max(this.max, this.data[dataset][datapoint] ? Math.abs(parseFloat(this.data[dataset][datapoint])) : 0);
        
                        // Check for negative values
                        if (!prop['chart.outofbounds']) {
                            this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues;
                        }
                    }
                }

                this.scale2 = RG.getScale2(this, {
                                                    'max':this.max,
                                                    'min':prop['chart.ymin'],
                                                    'scale.thousand':prop['chart.scale.thousand'],
                                                    'scale.point':prop['chart.scale.point'],
                                                    'scale.decimals':prop['chart.scale.decimals'],
                                                    'ylabels.count':prop['chart.ylabels.count'],
                                                    'scale.round':prop['chart.scale.round'],
                                                    'units.pre': prop['chart.units.pre'],
                                                    'units.post': prop['chart.units.post']
                                                   });
    
                this.max   = this.scale2.max ? this.scale2.max : 0;
            }
    
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
            }
    
            /**
            * Reset the coords arrays otherwise it will keep growing
            */
            this.coords     = [];
            this.coordsText = [];
    
            /**
            * Work out a few things. They need to be here because they depend on things you can change before you
            * call Draw() but after you instantiate the object
            */
            this.grapharea      = ca.height - this.gutterTop - this.gutterBottom;
            this.halfgrapharea  = this.grapharea / 2;
            this.halfTextHeight = prop['chart.text.size'] / 2;
    
            // Check the combination of the X axis position and if there any negative values
            //
            // 19th Dec 2010 - removed for Opera since it can be reported incorrectly whn there
            // are multiple graphs on the page
            if (prop['chart.xaxispos'] == 'bottom' && this.hasnegativevalues && !ISOPERA) {
                alert('[LINE] You have negative values and the X axis is at the bottom. This is not good...');
            }
    
            if (prop['chart.variant'] == '3d') {
                RG.Draw3DAxes(this);
            }
            
            // Progressively Draw the chart
            RG.background.Draw(this);
    
            /**
            * Draw any horizontal bars that have been defined
            */
            if (prop['chart.background.hbars'] && prop['chart.background.hbars'].length > 0) {
                RG.DrawBars(this);
            }
    
            if (prop['chart.axesontop'] == false) {
                this.DrawAxes();
            }
            
            //if (typeof(shadowColor) == 'object') {
            //    shadowColor = RG.array_reverse(RG.array_clone(prop['chart.shadow.color']]);
            //}
    
            /**
            * This facilitates the new Trace2 effect
            */
    
            co.save()
            co.beginPath();
            co.rect(0, 0, ca.width * prop['chart.animation.trace.clip'], ca.height);
            co.clip();
    
                for (var i=0, j=0, len=this.data.length; i<len; i++, j++) {
        
                    co.beginPath();
        
                    /**
                    * Turn on the shadow if required
                    */
                    if (!prop['chart.filled']) {
                        this.SetShadow(i);
                    }
        
                    /**
                    * Draw the line
                    */
        
                    if (prop['chart.fillstyle']) {
                        if (typeof(prop['chart.fillstyle']) == 'object' && prop['chart.fillstyle'][j]) {
                           var fill = prop['chart.fillstyle'][j];
                        
                        } else if (typeof(prop['chart.fillstyle']) == 'object' && prop['chart.fillstyle'].toString().indexOf('Gradient') > 0) {
                           var fill = prop['chart.fillstyle'];
                        
                        } else if (typeof(prop['chart.fillstyle']) == 'string') {
                            var fill = prop['chart.fillstyle'];
            
                        }
                    } else if (prop['chart.filled']) {
                        var fill = prop['chart.colors'][j];
        
                    } else {
                        var fill = null;
                    }
        
                    /**
                    * Figure out the tickmark to use
                    */
                    if (prop['chart.tickmarks'] && typeof(prop['chart.tickmarks']) == 'object') {
                        var tickmarks = prop['chart.tickmarks'][i];
                    } else if (prop['chart.tickmarks'] && typeof(prop['chart.tickmarks']) == 'string') {
                        var tickmarks = prop['chart.tickmarks'];
                    } else if (prop['chart.tickmarks'] && typeof(prop['chart.tickmarks']) == 'function') {
                        var tickmarks = prop['chart.tickmarks'];
                    } else {
                        var tickmarks = null;
                    }
        
        
                    this.DrawLine(this.data[i],
                                  prop['chart.colors'][j],
                                  fill,
                                  this.GetLineWidth(j),
                                   tickmarks,
                                   i);
        
                    co.stroke();
                }
        
            /**
            * If the line is filled re-stroke the lines
            */
            if (prop['chart.filled'] && prop['chart.filled.accumulative'] && !prop['chart.curvy']) {
        
                for (var i=0; i<this.coords2.length; ++i) {
        
                    co.beginPath();
                    co.lineWidth = this.GetLineWidth(i);
                    co.strokeStyle = prop['chart.colors'][i];
        
                    for (var j=0,len=this.coords2[i].length; j<len; ++j) {
        
                        if (j == 0 || this.coords2[i][j][1] == null || (this.coords2[i][j - 1] && this.coords2[i][j - 1][1] == null)) {
                            co.moveTo(this.coords2[i][j][0], this.coords2[i][j][1]);
                        } else {
                            if (prop['chart.stepped']) {
                                co.lineTo(this.coords2[i][j][0], this.coords2[i][j - 1][1]);
                            }
                            co.lineTo(this.coords2[i][j][0], this.coords2[i][j][1]);
                        }
                    }
                    
                    co.stroke();
                    // No fill!
                }
        
                //Redraw the tickmarks
                if (prop['chart.tickmarks']) {
        
                    co.beginPath();
        
                    co.fillStyle = 'white';
                    
                    for (var i=0,len=this.coords2.length; i<len; ++i) {
        
                        co.beginPath();
                        co.strokeStyle = prop['chart.colors'][i];
    
                        for (var j=0; j<this.coords2[i].length; ++j) {
                            if (typeof(this.coords2[i][j]) == 'object' && typeof(this.coords2[i][j][0]) == 'number' && typeof(this.coords2[i][j][1]) == 'number') {
                                
                                var tickmarks = typeof(prop['chart.tickmarks']) == 'object' ? prop['chart.tickmarks'][i] : prop['chart.tickmarks'];
        
                                this.DrawTick(  this.coords2[i],
                                                this.coords2[i][j][0],
                                                this.coords2[i][j][1],
                                                co.strokeStyle,
                                                false,
                                                j == 0 ? 0 : this.coords2[i][j - 1][0],
                                                j == 0 ? 0 : this.coords2[i][j - 1][1],
                                                tickmarks,
                                                j);
                            }
                        }
                    }
        
                    co.stroke();
                    co.fill();
                }
            
            } else if (prop['chart.filled'] && prop['chart.filled.accumulative'] && prop['chart.curvy']) {

                // Restroke the curvy filled accumulative lines

                for (var i=0; i<this.coordsSpline.length; i+=1) {
                    co.beginPath();
                    co.strokeStyle = prop['chart.colors'][i];
                    co.lineWidth = this.GetLineWidth(i);

                    for (var j=0,len=this.coordsSpline[i].length; j<len; j+=1) {
                        
                        var point = this.coordsSpline[i][j];
                        
                        j == 0 ? co.moveTo(point[0], point[1]) : co.lineTo(point[0], point[1]);
                    }

                   co.stroke();
                }



                for (var i=0,len=this.coords2.length; i<len; i+=1) {
                    for (var j=0,len2=this.coords2[i].length; j<len2; ++j) {
                        if (typeof(this.coords2[i][j]) == 'object' && typeof(this.coords2[i][j][0]) == 'number' && typeof(this.coords2[i][j][1]) == 'number') {
                            
                            var tickmarks = typeof prop['chart.tickmarks'] == 'object' && !RGraph.is_null(prop['chart.tickmarks']) ? prop['chart.tickmarks'][i] : prop['chart.tickmarks'];
                            co.strokeStyle = prop['chart.colors'][i];
                            this.DrawTick(  this.coords2[i],
                                            this.coords2[i][j][0],
                                            this.coords2[i][j][1],
                                            prop['chart.colors'][i],
                                            false,
                                            j == 0 ? 0 : this.coords2[i][j - 1][0],
                                            j == 0 ? 0 : this.coords2[i][j - 1][1],
                                            tickmarks,
                                            j);
                        }
                    }
                }



            }
        co.restore();
    
        // ???
        co.beginPath();
    
    
    
    
            /**
            * If the axes have been requested to be on top, do that
            */
            if (prop['chart.axesontop']) {
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
            if (prop['chart.key'] && prop['chart.key'].length && RG.DrawKey) {
                RG.DrawKey(this, prop['chart.key'], prop['chart.colors']);
            }
    
            /**
            * Draw " above" labels if enabled
            */
            if (prop['chart.labels.above']) {
                this.DrawAboveLabels();
            }
    
            /**
            * Draw the "in graph" labels
            */
            RG.DrawInGraphLabels(this);
    
            /**
            * Redraw the lines if a filled range is on the cards
            */
            if (prop['chart.filled'] && prop['chart.filled.range'] && this.data.length == 2) {
    
                co.beginPath();
                var len        = this.coords.length / 2;
                co.lineWidth   = prop['chart.linewidth'];
                co.strokeStyle = prop['chart.colors'][0];
    
                for (var i=0; i<len; ++i) {
    
                    if (!RG.is_null(this.coords[i][1])) {
                        if (i == 0) {
                            co.moveTo(this.coords[i][0], this.coords[i][1]);
                        } else {
                            co.lineTo(this.coords[i][0], this.coords[i][1]);
                        }
                    }
                }
                
                co.stroke();
    
    
                co.beginPath();
                
                if (prop['chart.colors'][1]) {
                    co.strokeStyle = prop['chart.colors'][1];
                }
                
                for (var i=this.coords.length - 1; i>=len; --i) {
                    if (!RG.is_null(this.coords[i][1])) {
                        if (i == (this.coords.length - 1)) {
                            co.moveTo(this.coords[i][0], this.coords[i][1]);
                        } else {
                            co.lineTo(this.coords[i][0], this.coords[i][1]);
                        }
                    }
                }
    
                co.stroke();
    
    
            } else if (prop['chart.filled'] && prop['chart.filled.range']) {
                alert('[LINE] You must have only two sets of data for a filled range chart');
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
        * Draws the axes
        */
        this.DrawAxes = function ()
        {
            var RG   = RGraph;
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;
    
            // Don't draw the axes?
            if (prop['chart.noaxes']) {
                return;
            }
    
            // Turn any shadow off
            RG.NoShadow(this);
    
            co.lineWidth   = prop['chart.axis.linewidth'] + 0.001;
            co.lineCap     = 'butt';
            co.strokeStyle = prop['chart.axis.color'];
            co.beginPath();
    
            // Draw the X axis
            if (prop['chart.noxaxis'] == false) {
                if (prop['chart.xaxispos'] == 'center') {
                    co.moveTo(this.gutterLeft, Math.round((this.grapharea / 2) + this.gutterTop));
                    co.lineTo(ca.width - this.gutterRight, Math.round((this.grapharea / 2) + this.gutterTop));
                } else if (prop['chart.xaxispos'] == 'top') {
                    co.moveTo(this.gutterLeft, this.gutterTop);
                    co.lineTo(ca.width - this.gutterRight, this.gutterTop);
                } else {
                    co.moveTo(this.gutterLeft, ca.height - this.gutterBottom);
                    co.lineTo(ca.width - this.gutterRight, ca.height - this.gutterBottom);
                }
            }
    
            // Draw the Y axis
            if (prop['chart.noyaxis'] == false) {
                if (prop['chart.yaxispos'] == 'left') {
                    co.moveTo(this.gutterLeft, this.gutterTop);
                    co.lineTo(this.gutterLeft, ca.height - this.gutterBottom);
                } else {
                    co.moveTo(ca.width - this.gutterRight, this.gutterTop);
                    co.lineTo(ca.width - this.gutterRight, ca.height - this.gutterBottom);
                }
            }
    
            /**
            * Draw the X tickmarks
            */
            if (prop['chart.noxaxis'] == false && prop['chart.numxticks'] > 0) {
    
                var xTickInterval = (ca.width - this.gutterLeft - this.gutterRight) / prop['chart.numxticks'];
    
                
                if (!xTickInterval || xTickInterval <= 0) {
                    xTickInterval = (ca.width - this.gutterLeft - this.gutterRight) / (prop['chart.labels'] && prop['chart.labels'].length ? prop['chart.labels'].length - 1 : 10);
                }
    
                for (x=this.gutterLeft + (prop['chart.yaxispos'] == 'left' ? xTickInterval : 0); x<=(ca.width - this.gutterRight + 1 ); x+=xTickInterval) {
    
                    if (prop['chart.yaxispos'] == 'right' && x >= (ca.width - this.gutterRight - 1) ) {
                        break;
                    }
    
                    // If the last tick is not desired...
                    if (prop['chart.noendxtick']) {
                        if (prop['chart.yaxispos'] == 'left' && x >= (ca.width - this.gutterRight - 1)) {
                            break;
                        } else if (prop['chart.yaxispos'] == 'right' && x == this.gutterLeft) {
                            continue;
                        }
                    }
    
                    var yStart = prop['chart.xaxispos'] == 'center' ? (this.gutterTop + (this.grapharea / 2)) - 3 : ca.height - this.gutterBottom;
                    var yEnd   = prop['chart.xaxispos'] == 'center' ? yStart + 6 : ca.height - this.gutterBottom - (x % 60 == 0 ? prop['chart.largexticks'] * prop['chart.tickdirection'] : prop['chart.smallxticks'] * prop['chart.tickdirection']);
    
                    if (prop['chart.xaxispos'] == 'center') {
                        var yStart = Math.round((this.gutterTop + (this.grapharea / 2))) - 3;
                        var yEnd = yStart + 6;
                    
                    } else if (prop['chart.xaxispos'] == 'bottom') {
                        var yStart = ca.height - this.gutterBottom;
                        var yEnd  = ca.height - this.gutterBottom - (x % 60 == 0 ? prop['chart.largexticks'] * prop['chart.tickdirection'] : prop['chart.smallxticks'] * prop['chart.tickdirection']);
                            yEnd += 0;
    
                    
                    } else if (prop['chart.xaxispos'] == 'top') {
                        yStart = this.gutterTop - 3;
                        yEnd   = this.gutterTop;
                    }
    
                    co.moveTo(Math.round(x), yStart);
                    co.lineTo(Math.round(x), yEnd);
                }
    
            // Draw an extra tickmark if there is no X axis, but there IS a Y axis
            } else if (prop['chart.noyaxis'] == false && prop['chart.numyticks'] > 0) {
                if (!prop['chart.noendytick']) {
                    if (prop['chart.yaxispos'] == 'left') {
                        co.moveTo(this.gutterLeft, Math.round(ca.height - this.gutterBottom));
                        co.lineTo(this.gutterLeft - prop['chart.smallyticks'], Math.round(ca.height - this.gutterBottom));
                    } else {
                        co.moveTo(ca.width - this.gutterRight, Math.round(ca.height - this.gutterBottom));
                        co.lineTo(ca.width - this.gutterRight + prop['chart.smallyticks'], Math.round(ca.height - this.gutterBottom));
                    }
                }
            }
    
            /**
            * Draw the Y tickmarks
            */
            var numyticks = prop['chart.numyticks'];
    
            if (prop['chart.noyaxis'] == false && numyticks > 0) {
                var counter    = 0;
                var adjustment = 0;
        
                if (prop['chart.yaxispos'] == 'right') {
                    adjustment = (ca.width - this.gutterLeft - this.gutterRight);
                }
                
                // X axis at the center
                if (prop['chart.xaxispos'] == 'center') {
                    var interval = (this.grapharea / numyticks);
                    var lineto = (prop['chart.yaxispos'] == 'left' ? this.gutterLeft : ca.width - this.gutterRight + prop['chart.smallyticks']);
        
                    // Draw the upper halves Y tick marks
                    for (y=this.gutterTop; y<(this.grapharea / 2) + this.gutterTop; y+=interval) {
                        if (y < (this.grapharea / 2) + this.gutterTop) {
                            co.moveTo((prop['chart.yaxispos'] == 'left' ? this.gutterLeft - prop['chart.smallyticks'] : ca.width - this.gutterRight), Math.round(y));
                            co.lineTo(lineto, Math.round(y));
                        }
                    }
    
                    // Draw the lower halves Y tick marks
                    for (y=this.gutterTop + (this.halfgrapharea) + interval; y <= this.grapharea + this.gutterTop; y+=interval) {
                        co.moveTo((prop['chart.yaxispos'] == 'left' ? this.gutterLeft - prop['chart.smallyticks'] : ca.width - this.gutterRight), Math.round(y));
                        co.lineTo(lineto, Math.round(y));
                    }
                
                // X axis at the top
                } else if (prop['chart.xaxispos'] == 'top') {
                    var interval = (this.grapharea / numyticks);
                    var lineto = (prop['chart.yaxispos'] == 'left' ? this.gutterLeft : ca.width - this.gutterRight + prop['chart.smallyticks']);
    
                    // Draw the Y tick marks
                    for (y=this.gutterTop + interval; y <=this.grapharea + this.gutterTop; y+=interval) {
                        co.moveTo((prop['chart.yaxispos'] == 'left' ? this.gutterLeft - prop['chart.smallyticks'] : ca.width - this.gutterRight), Math.round(y));
                        co.lineTo(lineto, Math.round(y));
                    }
                    
                    // If there's no X axis draw an extra tick
                    if (prop['chart.noxaxis'] && prop['chart.noendytick'] == false) {
                        co.moveTo((prop['chart.yaxispos'] == 'left' ? this.gutterLeft - prop['chart.smallyticks'] : ca.width - this.gutterRight), this.gutterTop);
                        co.lineTo(lineto, this.gutterTop);
                    }
                
                // X axis at the bottom
                } else {
    
                    var lineto = (prop['chart.yaxispos'] == 'left' ? this.gutterLeft - prop['chart.smallyticks'] : ca.width - this.gutterRight + prop['chart.smallyticks']);
    
                    for (y=this.gutterTop; y<(ca.height - this.gutterBottom) && counter < numyticks; y+=( (ca.height - this.gutterTop - this.gutterBottom) / numyticks) ) {
    
                        co.moveTo(this.gutterLeft + adjustment, Math.round(y));
                        co.lineTo(lineto, Math.round(y));
                    
                        var counter = counter + 1;
                    }
                }
    
            // Draw an extra X tickmark
            } else if (prop['chart.noxaxis'] == false && prop['chart.numxticks'] > 0) {
    
                if (prop['chart.yaxispos'] == 'left') {
                    co.moveTo(this.gutterLeft, prop['chart.xaxispos'] == 'top' ? this.gutterTop : ca.height - this.gutterBottom);
                    co.lineTo(this.gutterLeft, prop['chart.xaxispos'] == 'top' ? this.gutterTop - prop['chart.smallxticks'] : ca.height - this.gutterBottom + prop['chart.smallxticks']);
               } else {
                    co.moveTo(ca.width - this.gutterRight, ca.height - this.gutterBottom);
                    co.lineTo(ca.width - this.gutterRight, ca.height - this.gutterBottom + prop['chart.smallxticks']);
                }
            }
    
            co.stroke();
        }




        /**
        * Draw the text labels for the axes
        */
        this.DrawLabels = function ()
        {
            co.strokeStyle = 'black';
            co.fillStyle   = prop['chart.text.color'];
            co.lineWidth   = 1;
            
            // Turn off any shadow
            RG.NoShadow(this);
    
            // This needs to be here
            var font      = prop['chart.text.font'];
            var text_size = prop['chart.text.size'];
            var decimals  = prop['chart.scale.decimals'];
            var context   = co;
            var canvas    = ca;
            var ymin      = prop['chart.ymin'];
    
            // Draw the Y axis labels
            if (prop['chart.ylabels'] && prop['chart.ylabels.specific'] == null) {
    
                var units_pre  = prop['chart.units.pre'];
                var units_post = prop['chart.units.post'];
                var xpos       = prop['chart.yaxispos'] == 'left' ? this.gutterLeft - 5 : ca.width - this.gutterRight + 5;
                var align      = prop['chart.yaxispos'] == 'left' ? 'right' : 'left';
                var numYLabels = this.scale2.labels.length;
                var bounding   = false;
                var bgcolor    = prop['chart.ylabels.inside'] ? prop['chart.ylabels.inside.color'] : null;
    
                
                /**
                * If the Y labels are inside the Y axis, invert the alignment
                */
                if (prop['chart.ylabels.inside'] == true && align == 'left') {
                    xpos -= 10;
                    align = 'right';
                    bounding = true;
                    
    
                } else if (prop['chart.ylabels.inside'] == true && align == 'right') {
                    xpos += 10;
                    align = 'left';
                    bounding = true;
                }
    
    
    
    
                /**
                * X axis in the center
                */
                if (prop['chart.xaxispos'] == 'center') {
                    
                    var half = this.grapharea / 2;
    
                    /**
                    * Draw the top half 
                    */
                    for (var i=0; i<this.scale2.labels.length; ++i) {
                        RG.Text2(this, {'font': font,
                                        'size': text_size,
                                        'x': xpos,
                                        'y': this.gutterTop + half - (((i+1)/numYLabels) * half),
                                        'valign': 'center',
                                        'halign':align,
                                        'bounding': bounding,
                                        'boundingFill': bgcolor,
                                        'text': this.scale2.labels[i],
                                        'tag': 'scale'
                                       });
                    }
                    
                    /**
                    * Draw the bottom half
                    */
                    for (var i=0; i<this.scale2.labels.length; ++i) {
                        RG.Text2(this, {'font': font,
                                        'size': text_size,
                                        'x': xpos,
                                        'y': this.gutterTop + half + (((i+1)/numYLabels) * half),
                                        'valign': 'center',
                                        'halign':align,
                                        'bounding': bounding,
                                        'boundingFill': bgcolor,
                                        'text': '-' + this.scale2.labels[i],
                                        'tag': 'scale'
                                       });
                    }
    
                    // No X axis - so draw 0
                    if (prop['chart.noxaxis'] == true || ymin != 0 || prop['chart.scale.zerostart']) {
                        RG.Text2(this,{'font':font,
                                       'size':text_size,
                                       'x':xpos,
                                       'y':this.gutterTop + half,
                                       'text':prop['chart.units.pre'] + ymin.toFixed(decimals) + prop['chart.units.post'],
                                       'bounding':bounding,
                                       'boundingFill':bgcolor,
                                       'valign':'center',
                                       'halign':align,
                                       'tag': 'scale'
                                      });
                    }
    
    
    
                /**
                * X axis at the top
                */
                } else if (prop['chart.xaxispos'] == 'top') {
                
                    var half = this.grapharea / 2;
    
                    if (prop['chart.scale.invert']) {
    
                        for (var i=0; i<this.scale2.labels.length; ++i) {
    
                            RG.Text2(this, {'font': font,
                                            'size': text_size,
                                            'x': xpos,
                                            'y': this.gutterTop + ((i/this.scale2.labels.length) * this.grapharea),
                                            'valign': 'center',
                                            'halign':align,
                                            'bounding': bounding,
                                            'boundingFill': bgcolor,
                                            'text': '-' + this.scale2.labels[this.scale2.labels.length - (i+1)],
                                            'tag': 'scale'
                                           });
                        }
                    } else {
                        for (var i=0; i<this.scale2.labels.length; ++i) {
                            RG.Text2(this, {'font': font,
                                            'size': text_size,
                                            'x': xpos,
                                            'y': this.gutterTop + (((i+1)/numYLabels) * this.grapharea),
                                            'valign': 'center',
                                            'halign':align,
                                            'bounding': bounding,
                                            'boundingFill': bgcolor,
                                            'text': '-' + this.scale2.labels[i],
                                            'tag': 'scale'
                                           });
                        }
                    }
    
                    // Draw the lower limit if chart.ymin is specified
                    if ((prop['chart.ymin'] != 0 || prop['chart.noxaxis']) || prop['chart.scale.invert'] || prop['chart.scale.zerostart']) {
                        RG.Text2(this, {'font':font,
                                        'size':text_size,
                                        'x':xpos,
                                        'y': prop['chart.scale.invert'] ? ca.height - this.gutterBottom : this.gutterTop,
                                        'text': (prop['chart.ymin'] != 0 ? '-' : '') + RG.number_format(this, prop['chart.ymin'].toFixed(decimals), units_pre, units_post),
                                        'valign':'center',
                                        'halign': align,
                                        'bounding':bounding,
                                        'boundingFill':bgcolor,
                                        'tag': 'scale'});
                    }
    
    
    
    
    
    
                /**
                * X axis labels at the bottom
                */
                } else {
    
                    if (prop['chart.scale.invert']) {
    
                        // Draw the minimum value
                        RG.Text2(this, {'font': font,
                                        'size': text_size,
                                        'x': xpos,
                                        'y': this.gutterTop,
                                        'valign': 'center',
                                        'halign':align,
                                        'bounding': bounding,
                                        'boundingFill': bgcolor,
                                        'text': RG.number_format(this, this.min.toFixed(prop['chart.scale.decimals']), units_pre, units_post),
                                        'tag': 'scale'
                                       });
    
                        for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                            RG.Text2(this, {'font': font,
                                            'size': text_size,
                                            'x': xpos,
                                            'y': this.gutterTop + (((i+1)/this.scale2.labels.length) * this.grapharea),
                                            'valign': 'center',
                                            'halign':align,
                                            'bounding': bounding,
                                            'boundingFill': bgcolor,
                                            'text': this.scale2.labels[i],
                                            'tag': 'scale'
                                           });
                        }
                    } else {
                        for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                            RG.Text2(this, {'font': font,
                                            'size': text_size,
                                            'x': xpos,
                                            'y': this.gutterTop + ((i/this.scale2.labels.length) * this.grapharea),
                                            'valign': 'center',
                                            'halign':align,
                                            'bounding': bounding,
                                            'boundingFill': bgcolor,
                                            'text': this.scale2.labels[this.scale2.labels.length - (i + 1)],
                                            'tag': 'scale'
                                           });
                        }
                    }
    
                    // Draw the lower limit if chart.ymin is specified
                    if ( (prop['chart.ymin']!= 0 && !prop['chart.scale.invert'] || prop['chart.scale.zerostart'])
                        || prop['chart.noxaxis']
                        ) {
                        RG.Text2(this, {'font':font,
                                        'size':text_size,
                                        'x':xpos,
                                        'y':prop['chart.scale.invert'] ? this.gutterTop : ca.height - this.gutterBottom,
                                        'text':RG.number_format(this, prop['chart.ymin'].toFixed(prop['chart.scale.decimals']), units_pre, units_post),
                                        'valign':'center',
                                        'halign':align,
                                        'bounding':bounding,
                                        'boundingFill':bgcolor,
                                        'tag': 'scale'
                                       });
                    }
                }
    
    
    
    
    
    
    
                // No X axis - so draw 0 - but not if the X axis is in the center
                if (   prop['chart.noxaxis'] == true
                    && prop['chart.ymin'] == null
                    && prop['chart.xaxispos'] != 'center'
                    && prop['chart.noendytick'] == false
                   ) {
    
                    RG.Text2(this, {'font':font,
                                    'size':text_size,
                                    'x':xpos,
                                    'y':prop['chart.xaxispos'] == 'top' ? this.gutterTop : (ca.height - this.gutterBottom),'text': prop['chart.units.pre'] + (0).toFixed(prop['chart.scale.decimals']) + prop['chart.units.post'],
                                    'valign':'center',
                                    'halign':align,
                                    'bounding':bounding,
                                    'boundingFill':bgcolor,
                                    'tag':'scale'
                                   });
                }
    
            } else if (prop['chart.ylabels'] && typeof(prop['chart.ylabels.specific']) == 'object') {
    
                // A few things
                var gap      = this.grapharea / prop['chart.ylabels.specific'].length;
                var halign   = prop['chart.yaxispos'] == 'left' ? 'right' : 'left';
                var bounding = false;
                var bgcolor  = null;
                var ymin     = prop['chart.ymin'] != null && prop['chart.ymin'];
    
                // Figure out the X coord based on the position of the axis
                if (prop['chart.yaxispos'] == 'left') {
                    var x = this.gutterLeft - 5;
                    
                    if (prop['chart.ylabels.inside']) {
                        x += 10;
                        halign   = 'left';
                        bounding = true;
                        bgcolor  = 'rgba(255,255,255,0.5)';
                    }
    
                } else if (prop['chart.yaxispos'] == 'right') {
                    var x = ca.width - this.gutterRight + 5;
                    
                    if (prop['chart.ylabels.inside']) {
                        x -= 10;
                        halign = 'right';
                        bounding = true;
                        bgcolor  = 'rgba(255,255,255,0.5)';
                    }
                }
    
    
                // Draw the labels
                if (prop['chart.xaxispos'] == 'center') {
                
                    // Draw the top halfs labels
                    for (var i=0; i<prop['chart.ylabels.specific'].length; ++i) {
                        
                        var y = this.gutterTop + (this.grapharea / (((prop['chart.ylabels.specific'].length - 1)) * 2) * i);
                        
                        if (ymin && ymin > 0) {
                            var y  = ((this.grapharea / 2) / (prop['chart.ylabels.specific'].length - (ymin ? 1 : 0)) ) * i;
                                y += this.gutterTop;
                        }
                        
                        RG.Text2(this, {'font':font,
                                        'size':text_size,
                                        'x':x,
                                        'y':y,
                                        'text':String(prop['chart.ylabels.specific'][i]),
                                        'valign': 'center',
                                        'halign':halign,
                                        'bounding':bounding,
                                        'boundingFill':bgcolor,
                                        'tag': 'ylabels.specific'
                                       });
                    }
                    
                    // Now reverse the labels and draw the bottom half
                    var reversed_labels = RG.array_reverse(prop['chart.ylabels.specific']);
                
                    // Draw the bottom halfs labels
                    for (var i=0; i<reversed_labels.length; ++i) {
                        
                        var y = (this.grapharea / 2) + this.gutterTop + ((this.grapharea / ((reversed_labels.length - 1) * 2) ) * i);
    
                        RG.Text2(this, {'font':font,
                                        'size':text_size,
                                        'x':x,
                                        'y':y,
                                        'text':i == 0 ? '' : String(reversed_labels[i]),
                                        'valign': 'center',
                                        'halign':halign,
                                        'bounding':bounding,
                                        'boundingFill':bgcolor,
                                        'tag': 'ylabels.specific'
                                       });
                    }
                
                } else if (prop['chart.xaxispos'] == 'top') {
    
                    // Reverse the labels and draw
                    var reversed_labels = RG.array_reverse(prop['chart.ylabels.specific']);
                
                    // Draw the bottom halfs labels
                    for (var i=0; i<reversed_labels.length; ++i) {
                        
                        var y = (this.grapharea / (reversed_labels.length - 1)) * i;
                            y = y + this.gutterTop;
    
                        RG.Text2(this, {'font':font,
                                        'size':text_size,
                                        'x':x,
                                        'y':y,
                                        'text':String(reversed_labels[i]),
                                        'valign': 'center',
                                        'halign':halign,
                                        'bounding':bounding,
                                        'boundingFill':bgcolor,
                                        'tag': 'ylabels.specific'
                                       });
                    }
    
                } else {
                    for (var i=0; i<prop['chart.ylabels.specific'].length; ++i) {
                        var y = this.gutterTop + ((this.grapharea / (prop['chart.ylabels.specific'].length - 1)) * i);
                        RG.Text2(this, {'font':font,
                                        'size':text_size,
                                        'x':x,
                                        'y':y,
                                        'text':String(prop['chart.ylabels.specific'][i]),
                                        'valign':'center',
                                        'halign':halign,
                                        'bounding':bounding,
                                        'boundingFill':bgcolor,
                                        'tag': 'ylabels.specific'
                                       });
                    }
                }
            }
    
            // Draw the X axis labels
            if (prop['chart.labels'] && prop['chart.labels'].length > 0) {
    
                var yOffset  = 5;
                var bordered = false;
                var bgcolor  = null;
    
                /**
                * Text angle
                */
                var angle  = 0;
                var valign = 'top';
                var halign = 'center';
    
                if (prop['chart.xlabels.inside']) {
                    yOffset  = -5;
                    bordered = true;
                    bgcolor  = prop['chart.xlabels.inside.color'];
                    valign   = 'bottom';
                }
                
                if (prop['chart.xaxispos'] == 'top') {
                    valign = 'bottom';
                    yOffset += 2;
                }
    
                if (typeof(prop['chart.text.angle']) == 'number' && prop['chart.text.angle'] > 0) {
                    angle   = -1 * prop['chart.text.angle'];
                    valign  = 'center';
                    halign  = 'right';
                    yOffset = 10;
                    
                    if (prop['chart.xaxispos'] == 'top') {
                        yOffset = 10;
                    }
                }
    
                co.fillStyle = prop['chart.text.color'];
                var numLabels = prop['chart.labels'].length;
    
                for (i=0; i<numLabels; ++i) {
    
                    // Changed 8th Nov 2010 to be not reliant on the coords
                    //if (this.properties['chart.labels'][i] && this.coords && this.coords[i] && this.coords[i][0]) {
                    if (prop['chart.labels'][i]) {
    
                        var labelX = ((ca.width - this.gutterLeft - this.gutterRight - (2 * prop['chart.hmargin'])) / (numLabels - 1) ) * i;
                            labelX += this.gutterLeft + prop['chart.hmargin'];
    
                        /**
                        * Account for an unrelated number of labels
                        */
                        if (prop['chart.labels'].length != this.data[0].length) {
                            labelX = this.gutterLeft + prop['chart.hmargin'] + ((ca.width - this.gutterLeft - this.gutterRight - (2 * prop['chart.hmargin'])) * (i / (prop['chart.labels'].length - 1)));
                        }
                        
                        // This accounts for there only being one point on the chart
                        if (!labelX) {
                            labelX = this.gutterLeft + prop['chart.hmargin'];
                        }
    
                        if (prop['chart.xaxispos'] == 'top' && prop['chart.text.angle'] > 0) {
                            halign = 'left';
                        }
                        
                        if (prop['chart.text.angle'] != 0) {
                            halign = 'right';
                        }
    
                        RG.Text2(this, {'font':font,
                                        'size':text_size,
                                        'x':labelX,
                                        'y':(prop['chart.xaxispos'] == 'top') ? this.gutterTop - yOffset - (prop['chart.xlabels.inside'] ? -22 : 0) : (ca.height - this.gutterBottom) + yOffset,
                                        'text':String(prop['chart.labels'][i]),
                                        'valign':valign,
                                        'halign':halign,
                                        'bounding':bordered,
                                        'boundingFill':bgcolor,
                                        'angle':angle,
                                        'tag': 'labels'
                                       });
                    }
                }
    
            }
    
            co.stroke();
            co.fill();
        }
    
    
    
        /**
        * Draws the line
        */
        this.DrawLine = function (lineData, color, fill, linewidth, tickmarks, index)
        {
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;
    
            // This facilitates the Rise animation (the Y value only)
            if (prop['chart.animation.unfold.y'] && prop['chart.animation.factor'] != 1) {
                for (var i=0; i<lineData.length; ++i) {
                    lineData[i] *= prop['chart.animation.factor'];
                }
            }
    
            var penUp = false;
            var yPos  = null;
            var xPos  = 0;
            co.lineWidth = 1;
            var lineCoords = [];
            
            /**
            * Get the previous line data
            */
            if (index > 0) {
                var prevLineCoords = this.coords2[index - 1];
            }
    
            // Work out the X interval
            var xInterval = (ca.width - (2 * prop['chart.hmargin']) - this.gutterLeft - this.gutterRight) / (lineData.length - 1);
    
            // Loop thru each value given, plotting the line
            // (FORMERLY FIRST)
            for (i=0; i<lineData.length; i++) {
    
                var data_point = lineData[i];
    
                /**
                * Get the yPos for the given data point
                */
                var yPos = this.getYCoord(data_point);
    
    
                // Null data points, and a special case for this bug:http://dev.rgraph.net/tests/ymin.html
                if (   lineData[i] == null
                    || (prop['chart.xaxispos'] == 'bottom' && lineData[i] < this.min && !prop['chart.outofbounds'])
                    ||  (prop['chart.xaxispos'] == 'center' && lineData[i] < (-1 * this.max) && !prop['chart.outofbounds'])) {
    
                    yPos = null;
                }
    
                // Not always very noticeable, but it does have an effect
                // with thick lines
                co.lineCap  = 'round';
                co.lineJoin = 'round';
    
                // Plot the line if we're at least on the second iteration
                if (i > 0) {
                    xPos = xPos + xInterval;
                } else {
                    xPos = prop['chart.hmargin'] + this.gutterLeft;
                }
                
                if (prop['chart.animation.unfold.x']) {
                    xPos *= prop['chart.animation.factor'];
                    
                    if (xPos < prop['chart.gutter.left']) {
                        xPos = prop['chart.gutter.left'];
                    }
                }
    
                /**
                * Add the coords to an array
                */
                this.coords.push([xPos, yPos]);
                lineCoords.push([xPos, yPos]);
            }
            
            co.stroke();
    
            // Store the coords in another format, indexed by line number
            this.coords2[index] = lineCoords;
    
            /**
            * For IE only: Draw the shadow ourselves as ExCanvas doesn't produce shadows
            */
            if (ISOLD && prop['chart.shadow']) {
                this.DrawIEShadow(lineCoords, co.shadowColor);
            }
    
            /**
            * Now draw the actual line [FORMERLY SECOND]
            */
            co.beginPath();
            // Transparent now as of 11/19/2011
            co.strokeStyle = 'rgba(0,0,0,0)';
            //co.strokeStyle = fill;
            if (fill) {
                co.fillStyle   = fill;
            }
    
            var isStepped = prop['chart.stepped'];
            var isFilled  = prop['chart.filled'];
            
            if (prop['chart.xaxispos'] == 'top') {
                var xAxisPos = this.gutterTop;
            } else if (prop['chart.xaxispos'] == 'center') {
                var xAxisPos = this.gutterTop + (this.grapharea / 2);
            } else if (prop['chart.xaxispos'] == 'bottom') {
                var xAxisPos = ca.height - this.gutterBottom;
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
                if (prevY < this.gutterTop || prevY > (ca.height - this.gutterBottom) ) {
                    penUp = true;
                }
    
                if (i == 0 || penUp || !yPos || !prevY || prevY < this.gutterTop) {
    
                    if (prop['chart.filled'] && !prop['chart.filled.range']) {
    
                        co.moveTo(xPos + 1, xAxisPos);
    
                        // This facilitates the X axis being at the top
                        // NOTE: Also done below
                        if (prop['chart.xaxispos'] == 'top') {
                            co.moveTo(xPos + 1, xAxisPos);
                        }
    
                        co.lineTo(xPos, yPos);
    
                    } else {
    
                        if (ISOLD && yPos == null) {
                            // Nada
                        } else {
                            co.moveTo(xPos + 1, yPos);
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
                        co.lineTo(xPos, lineCoords[i - 1][1]);
                    }
    
                    if ((yPos >= this.gutterTop && yPos <= (ca.height - this.gutterBottom)) || prop['chart.outofbounds'] ) {
    
                        if (isLast && prop['chart.filled'] && !prop['chart.filled.range'] && prop['chart.yaxispos'] == 'right') {
                            xPos -= 1;
                        }
    
    
                        // Added 8th September 2009
                        if (!isStepped || !isLast) {
                            co.lineTo(xPos, yPos);
                            
                            if (isFilled && lineCoords[i+1] && lineCoords[i+1][1] == null) {
                                co.lineTo(xPos, xAxisPos);
                            }
                        
                        // Added August 2010
                        } else if (isStepped && isLast) {
                            co.lineTo(xPos,yPos);
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
            if (prop['chart.filled'] && !prop['chart.filled.range'] && !prop['chart.curvy']) {
    
                // Is this needed ??
                var fillStyle = prop['chart.fillstyle'];
    
                /**
                * Draw the bottom edge of the filled bit using either the X axis or the prevlinedata,
                * depending on the index of the line. The first line uses the X axis, and subsequent
                * lines use the prevLineCoords array
                */
                if (index > 0 && prop['chart.filled.accumulative']) {
                    
                    co.lineTo(xPos, prevLineCoords ? prevLineCoords[i - 1][1] : (ca.height - this.gutterBottom - 1 + (prop['chart.xaxispos'] == 'center' ? (ca.height - this.gutterTop - this.gutterBottom) / 2 : 0)));
                
                    for (var k=(i - 1); k>=0; --k) {
                        co.lineTo(k == 0 ? prevLineCoords[k][0] + 1: prevLineCoords[k][0], prevLineCoords[k][1]);
                    }
                } else {
    
                    // Draw a line down to the X axis
                    if (prop['chart.xaxispos'] == 'top') {
                        co.lineTo(xPos, prop['chart.gutter.top'] +  1);
                        co.lineTo(lineCoords[0][0],prop['chart.gutter.top'] + 1);
                    } else if (typeof(lineCoords[i - 1][1]) == 'number') {
    
                        var yPosition = prop['chart.xaxispos'] == 'center' ? ((ca.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop : ca.height - this.gutterBottom;
    
                        co.lineTo(xPos,yPosition);
                        co.lineTo(lineCoords[0][0],yPosition);
                    }
                }
    
                co.fillStyle = fill;
    
                co.fill();
                co.beginPath();
    
            }
    
            /**
            * FIXME this may need removing when Chrome is fixed
            * SEARCH TAGS: CHROME SHADOW BUG
            */
            if (ISCHROME && prop['chart.shadow'] && prop['chart.chromefix'] && prop['chart.shadow.blur'] > 0) {
    
                for (var i=lineCoords.length - 1; i>=0; --i) {
                    if (
                           typeof(lineCoords[i][1]) != 'number'
                        || (typeof(lineCoords[i+1]) == 'object' && typeof(lineCoords[i+1][1]) != 'number')
                       ) {
                        co.moveTo(lineCoords[i][0],lineCoords[i][1]);
                    } else {
                        co.lineTo(lineCoords[i][0],lineCoords[i][1]);
                    }
                }
            }
    
            co.stroke();
    
    
            if (prop['chart.backdrop']) {
                this.DrawBackdrop(lineCoords, color);
            }
    
    
    
    
            /**
            * TODO CLIP TRACE
            * By using the clip() method the Trace animation can be updated.
            * NOTE: Needs to be done for the filled part as well
            */
            co.save();
                co.beginPath();
                co.rect(0,0,ca.width * prop['chart.animation.trace.clip'],ca.height);
                co.clip();
    
                // Now redraw the lines with the correct line width
                this.SetShadow(index);
                this.RedrawLine(lineCoords, color, linewidth, index);
                co.stroke();
                RG.NoShadow(this);
    
    
    
    
            // Draw the tickmarks
                for (var i=0; i<lineCoords.length; ++i) {
        
                    i = Number(i);
                    
                    /**
                    * Set the color
                    */
                    co.strokeStyle = color;
                    
        
                    if (isStepped && i == (lineCoords.length - 1)) {
                        co.beginPath();
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
            
            co.restore();
    
            // Draw something off canvas to skirt an annoying bug
            co.beginPath();
            co.arc(ca.width + 50000, ca.height + 50000, 2, 0, 6.38, 1);
        }




        /**
        * This functions draws a tick mark on the line
        * 
        * @param xPos  int  The x position of the tickmark
        * @param yPos  int  The y position of the tickmark
        * @param color str  The color of the tickmark
        * @param       bool Whether the tick is a shadow. If it is, it gets offset by the shadow offset
        */
        this.DrawTick = function (lineData, xPos, yPos, color, isShadow, prevX, prevY, tickmarks, index)
        {
            // Various conditions mean no tick
            if (!prop['chart.line.visible']) {
                return;
            } else if (RG.is_null(yPos)) {
                return;
            } else if ((yPos > (ca.height - this.gutterBottom)) && !prop['chart.outofbounds']) {
                return;
             } else if ((yPos < this.gutterTop) && !prop['chart.outofbounds']) {
                return;
            }
    
            co.beginPath();
    
            var offset   = 0;
    
            // Reset the stroke and lineWidth back to the same as what they were when the line was drawm
            // UPDATE 28th July 2011 - the line width is now set to 1
            co.lineWidth   = prop['chart.tickmarks.linewidth'] ? prop['chart.tickmarks.linewidth'] : prop['chart.linewidth'];
            co.strokeStyle = isShadow ? prop['chart.shadow.color'] : co.strokeStyle;
            co.fillStyle   = isShadow ? prop['chart.shadow.color'] : co.strokeStyle;
    
            // Cicular tick marks
            if (   tickmarks == 'circle'
                || tickmarks == 'filledcircle'
                || tickmarks == 'endcircle') {
    
                if (tickmarks == 'circle'|| tickmarks == 'filledcircle' || (tickmarks == 'endcircle' && (index == 0 || index == (lineData.length - 1)))) {
                    co.beginPath();
                    co.arc(xPos + offset, yPos + offset, prop['chart.ticksize'], 0, 360 / (180 / PI), false);
    
                    if (tickmarks == 'filledcircle') {
                        co.fillStyle = isShadow ? prop['chart.shadow.color'] : co.strokeStyle;
                    } else {
                        co.fillStyle = isShadow ? prop['chart.shadow.color'] : 'white';
                    }
    
                    co.stroke();
                    co.fill();
                }
    
            // Halfheight "Line" style tick marks
            } else if (tickmarks == 'halftick') {
                co.beginPath();
                co.moveTo(Math.round(xPos), yPos);
                co.lineTo(Math.round(xPos), yPos + prop['chart.ticksize']);
    
                co.stroke();
            
            // Tick style tickmarks
            } else if (tickmarks == 'tick') {
                co.beginPath();
                co.moveTo(Math.round(xPos), yPos -  prop['chart.ticksize']);
                co.lineTo(Math.round(xPos), yPos + prop['chart.ticksize']);
    
                co.stroke();
            
            // Endtick style tickmarks
            } else if (tickmarks == 'endtick' && (index == 0 || index == (lineData.length - 1))) {
                co.beginPath();
                co.moveTo(Math.round(xPos), yPos -  prop['chart.ticksize']);
                co.lineTo(Math.round(xPos), yPos + prop['chart.ticksize']);
    
                co.stroke();
            
            // "Cross" style tick marks
            } else if (tickmarks == 'cross') {
                co.beginPath();
                    
                    var ticksize = prop['chart.ticksize'];
                    
                    co.moveTo(xPos - ticksize, yPos - ticksize);
                    co.lineTo(xPos + ticksize, yPos + ticksize);
                    co.moveTo(xPos + ticksize, yPos - ticksize);
                    co.lineTo(xPos - ticksize, yPos + ticksize);
                co.stroke();
    
    
            // Triangle style tick marks
            } else if (tickmarks == 'triangle' || tickmarks == 'filledtriangle' || (tickmarks == 'endtriangle' && (index == 0 || index == (lineData.length - 1)))) {
                co.beginPath();
                    
                    if (tickmarks == 'filledtriangle') {
                        co.fillStyle = isShadow ? prop['chart.shadow.color'] : co.strokeStyle;
                    } else {
                        co.fillStyle = 'white';
                    }
    
                    co.moveTo(Math.round(xPos - prop['chart.ticksize']), yPos + prop['chart.ticksize']);
                    co.lineTo(Math.round(xPos), yPos - prop['chart.ticksize']);
                    co.lineTo(Math.round(xPos + prop['chart.ticksize']), yPos + prop['chart.ticksize']);
                co.closePath();
                
                co.stroke();
                co.fill();
    
    
            // A white bordered circle
            } else if (tickmarks == 'borderedcircle' || tickmarks == 'dot') {
                    co.lineWidth   = 1;
                    co.strokeStyle = prop['chart.tickmarks.dot.color'];
                    co.fillStyle   = prop['chart.tickmarks.dot.color'];
    
                    // The outer white circle
                    co.beginPath();
                    co.arc(xPos, yPos, prop['chart.ticksize'], 0, 360 / (180 / PI), false);
                    co.closePath();
    
    
                    co.fill();
                    co.stroke();
                    
                    // Now do the inners
                    co.beginPath();
                    co.fillStyle   = color;
                    co.strokeStyle = color;
                    co.arc(xPos, yPos, prop['chart.ticksize'] - 2, 0, 360 / (180 / PI), false);
    
                    co.closePath();
    
                    co.fill();
                    co.stroke();
            
            } else if (   tickmarks == 'square'
                       || tickmarks == 'filledsquare'
                       || (tickmarks == 'endsquare' && (index == 0 || index == (lineData.length - 1)))
                       || (tickmarks == 'filledendsquare' && (index == 0 || index == (lineData.length - 1))) ) {
    
                co.fillStyle   = 'white';
                co.strokeStyle = co.strokeStyle;
    
                co.beginPath();
                co.rect(Math.round(xPos - prop['chart.ticksize']), Math.round(yPos - prop['chart.ticksize']), prop['chart.ticksize'] * 2, prop['chart.ticksize'] * 2);
    
                // Fillrect
                if (tickmarks == 'filledsquare' || tickmarks == 'filledendsquare') {
                    co.fillStyle = isShadow ? prop['chart.shadow.color'] : co.strokeStyle;
                    co.rect(Math.round(xPos - prop['chart.ticksize']), Math.round(yPos - prop['chart.ticksize']), prop['chart.ticksize'] * 2, prop['chart.ticksize'] * 2);
    
                } else if (tickmarks == 'square' || tickmarks == 'endsquare') {
                    co.fillStyle = isShadow ? prop['chart.shadow.color'] : 'white';
                    co.rect(Math.round((xPos - prop['chart.ticksize']) + 1), Math.round((yPos - prop['chart.ticksize']) + 1), (prop['chart.ticksize'] * 2) - 2, (prop['chart.ticksize'] * 2) - 2);
                }
    
                co.stroke();
                co.fill();
    
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
    
                co.beginPath();
                    co.moveTo(Math.round(xPos), Math.round(yPos));
                    co.arc(Math.round(xPos), Math.round(yPos), 7, a - 0.5, a + 0.5, false);
                co.closePath();
    
                co.stroke();
                co.fill();
    
            /**
            * Arrow head, NOT filled
            */
            } else if (tickmarks == 'arrow') {
            
                var orig_linewidth = co.lineWidth;
    
                var x = Math.abs(xPos - prevX);
                var y = Math.abs(yPos - prevY);
                
                co.lineWidth;
    
                if (yPos < prevY) {
                    var a = Math.atan(x / y) + 1.57;
                } else {
                    var a = Math.atan(y / x) + 3.14;
                }
    
                co.beginPath();
                    co.moveTo(Math.round(xPos), Math.round(yPos));
                    co.arc(Math.round(xPos), Math.round(yPos), 7, a - 0.5 - (document.all ? 0.1 : 0.01), a - 0.4, false);
    
                    co.moveTo(Math.round(xPos), Math.round(yPos));
                    co.arc(Math.round(xPos), Math.round(yPos), 7, a + 0.5 + (document.all ? 0.1 : 0.01), a + 0.5, true);
                co.stroke();
                co.fill();

                // Revert to original lineWidth
                co.lineWidth = orig_linewidth;
            
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
        this.DrawRange = function ()
        {
            var RG   = RGraph;
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;
    
            /**
            * Fill the range if necessary
            */
            if (prop['chart.filled.range'] && prop['chart.filled'] && prop['chart.line.visible']) {
            
                if (RG.is_null(prop['chart.filled.range.threshold'])) {
                    prop['chart.filled.range.threshold']        = this.ymin
                    prop['chart.filled.range.threshold.colors'] = [prop['chart.fillstyle'], prop['chart.fillstyle']]
                }
    
                for (var idx=0; idx<2; ++idx) {
    
                    var threshold_colors = prop['chart.filled.range.threshold.colors'];
                    var y = this.getYCoord(prop['chart.filled.range.threshold'])
                    
                    co.save();
                        if (idx == 0) {
                            co.beginPath();
                            co.rect(0,0,ca.width,y);
                            co.clip();
                        
                        } else {
    
                            co.beginPath();
                            co.rect(0,y,ca.width, ca.height);
                            co.clip();
                        }
    
                        co.beginPath();
                            co.fillStyle = (idx == 1 ? prop['chart.filled.range.threshold.colors'][1] : prop['chart.filled.range.threshold.colors'][0]);
                        
                            //co.strokeStyle = prop['chart.fillstyle']; // Strokestyle not used now (10th October 2012)
                            
                            co.lineWidth = 1;
                            var len = (this.coords.length / 2);
                
                            
                            
                            for (var i=0; i<len; ++i) {
                                if (!RG.is_null(this.coords[i][1])) {
                                    if (i == 0) {
                                        co.moveTo(this.coords[i][0], this.coords[i][1])
                                    } else {
                                        co.lineTo(this.coords[i][0], this.coords[i][1])
                                    }
                                }
                            }
    
    
                            for (var i=this.coords.length - 1; i>=len; --i) {
                                if (RG.is_null(this.coords[i][1])) {
                                    co.moveTo(this.coords[i][0], this.coords[i][1])
                                } else {
                                    co.lineTo(this.coords[i][0], this.coords[i][1])
                                }
                                //co.lineTo(this.coords[i][0], this.coords[i][1])
                            }
    
    
    
                        // Taken out - 10th Oct 2012
                        //co.stroke();
            
                        co.fill();
                    co.restore();
                }
            }
        }




        /**
        * Redraws the line with the correct line width etc
        * 
        * @param array coords The coordinates of the line
        */
        this.RedrawLine = function (coords, color, linewidth, index)
        {
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;
    
            if (prop['chart.noredraw'] || prop['chart.filled.range']) {
                return;
            }
    
            co.strokeStyle = (typeof(color) == 'object' && color && color.toString().indexOf('CanvasGradient') == -1 ? color[0] : color);
            co.lineWidth = linewidth;
    
            if (!prop['chart.line.visible']) {
                co.strokeStyle = 'rgba(0,0,0,0)';
            }








            if (!ISOLD && (prop['chart.curvy'] || prop['chart.spline'])) {
                this.DrawCurvyLine(coords, !prop['chart.line.visible'] ? 'rgba(0,0,0,0)' : color, linewidth, index);
                return;
            }








            co.beginPath();
    
            var len    = coords.length;
            var width  = ca.width
            var height = ca.height;
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
                   ) && (!prop['chart.outofbounds'] || yPos == null || prevY == null) ) {
    
                    if (ISOLD && yPos == null) {
                        // ...?
                    } else {
                        co.moveTo(coords[i][0], coords[i][1]);
                    }
    
                    penUp = false;
    
                } else {
    
                    if (prop['chart.stepped'] && i > 0) {
                        co.lineTo(coords[i][0], coords[i - 1][1]);
                    }
                    
                    // Don't draw the last bit of a stepped chart. Now DO
                    //if (!this.properties['chart.stepped'] || i < (coords.length - 1)) {
                    co.lineTo(coords[i][0], coords[i][1]);
                    //}
                    penUp = false;
                }
            }
    
            /**
            * If two colors are specified instead of one, go over the up bits
            */
            if (prop['chart.colors.alternate'] && typeof(color) == 'object' && color[0] && color[1]) {
                for (var i=1; i<len; ++i) {
    
                    var prevX = coords[i - 1][0];
                    var prevY = coords[i - 1][1];
                    
                    if (prevY != null && coords[i][1] != null) {
                        co.beginPath();
                            co.strokeStyle = color[coords[i][1] < prevY ? 0 : 1];
                            co.lineWidth = prop['chart.linewidth'];
                            co.moveTo(prevX, prevY);
                            co.lineTo(coords[i][0], coords[i][1]);
                        co.stroke();
                    }
                }
            }
        }




        /**
        * This function is used by MSIE only to manually draw the shadow
        * 
        * @param array coords The coords for the line
        */
        this.DrawIEShadow = function (coords, color)
        {
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;
    
            var offsetx = prop['chart.shadow.offsetx'];
            var offsety = prop['chart.shadow.offsety'];
            
            co.lineWidth   = prop['chart.linewidth'];
            co.strokeStyle = color;
            co.beginPath();
    
            for (var i=0; i<coords.length; ++i) {
                if (i == 0) {
                    co.moveTo(coords[i][0] + offsetx, coords[i][1] + offsety);
                } else {
                    co.lineTo(coords[i][0] + offsetx, coords[i][1] + offsety);
                }
            }
    
            co.stroke();
        }




        /**
        * Draw the backdrop
        */
        this.DrawBackdrop = function (coords, color)
        {
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;
    
            var size = prop['chart.backdrop.size'];
            co.lineWidth = size;
            co.globalAlpha = prop['chart.backdrop.alpha'];
            co.strokeStyle = color;
            var yCoords = [];
    
            co.beginPath();
                if (prop['chart.curvy'] && !ISOLD) {
                    
                    // The DrawSpline function only takes the Y coords so extract them from the coords that have
                    // (which are X/Y pairs)
                    for (var i=0; i<coords.length; ++i) {
                        yCoords.push(coords[i][1])
                    }
    
                    this.DrawSpline(co, yCoords, color, null);
    
                } else {
                    co.moveTo(coords[0][0], coords[0][1]);
                    for (var j=1; j<coords.length; ++j) {
                        co.lineTo(coords[j][0], coords[j][1]);
                    }
                }
            co.stroke();
        
            // Reset the alpha value
            co.globalAlpha = 1;
            RG.NoShadow(this);
        }




        /**
        * Returns the linewidth
        */
        this.GetLineWidth = function (i)
        {
            var linewidth = prop['chart.linewidth'];
            
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
        this.getShape =
        this.getPoint = function (e)
        {
            var obj  = this;
            var RG   = RGraph;
            var ca   = canvas  = e.target;
            var co   = context = this.context;
            var prop = this.properties;
    
            var mouseXY = RG.getMouseXY(e);
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
                if (   mouseX <= (x + prop['chart.tooltips.hotspot.size'])
                    && mouseX >= (x - prop['chart.tooltips.hotspot.size'])
                    && mouseY <= (y + prop['chart.tooltips.hotspot.size'])
                    && mouseY >= (y - prop['chart.tooltips.hotspot.size'])
                   ) {
    
                        if (RG.parseTooltipText) {
                            var tooltip = RG.parseTooltipText(prop['chart.tooltips'], i);
                        }
    
                        // Work out the dataset
                        var dataset = 0;
                        var idx = i;
                        while ((idx + 1) > this.data[dataset].length) {
                            idx -= this.data[dataset].length;
                            dataset++;
                        }
    
                        return {0:obj, 1:x, 2:y, 3:i, 'object': obj, 'x': x, 'y': y, 'index': i, 'tooltip': tooltip, 'dataset': dataset, 'index_adjusted': idx};
    
                } else if (    prop['chart.tooltips.hotspot.xonly'] == true
                            && mouseX <= (x + prop['chart.tooltips.hotspot.size'])
                            && mouseX >= (x - prop['chart.tooltips.hotspot.size'])) {
    
                            var tooltip = RG.parseTooltipText(prop['chart.tooltips'], i);
    
                            return {0:obj, 1:x, 2:y, 3:i, 'object': obj, 'x': x, 'y': y, 'index': i, 'tooltip': tooltip};
                }
            }
        }




        /**
        * Draws the above line labels
        */
        this.DrawAboveLabels = function ()
        {
            var RG   = RGraph;
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;
    
            var context    = co;
            var size       = prop['chart.labels.above.size'];
            var font       = prop['chart.text.font'];
            var units_pre  = prop['chart.units.pre'];
            var units_post = prop['chart.units.post'];
    
            co.beginPath();
    
            // Don't need to check that chart.labels.above is enabled here, it's been done already
            for (var i=0, len=this.coords.length; i<len; ++i) {
                var coords = this.coords[i];
                
                RG.Text2(this, {'font':font,
                                'size':size,
                                'x':coords[0],
                                'y':coords[1] - 5 - size,
                                'text':RG.number_format(this, this.data_arr[i], units_pre, units_post),
                                'valign':'center',
                                'halign':'center',
                                'bounding':true,
                                'boundingFill':'white',
                                'tag': 'labels.above'
                               });
            }
            
            co.fill();
        }




        /**
        * Draw a curvy line.
        */
        this.DrawCurvyLine = function (coords, color, linewidth, index)
        {
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;

            if (ISOLD) {
                return;
            }
    
            var yCoords = [];
    
            for (var i=0; i<coords.length; ++i) {
                yCoords.push(coords[i][1])
            }
            
            if (prop['chart.filled']) {
                co.beginPath();
                    co.moveTo(coords[0][0],ca.height - this.gutterBottom);
                    this.DrawSpline(co, yCoords, color, index);

                    if (prop['chart.filled.accumulative'] && index > 0) {
                        for (var i=(this.coordsSpline[index - 1].length - 1); i>=0; i-=1) {
                            co.lineTo(this.coordsSpline[index - 1][i][0], this.coordsSpline[index - 1][i][1]);
                        }
                    } else {
                        co.lineTo(coords[coords.length - 1][0],ca.height - this.gutterBottom);
                    }
                co.fill();
            }

            co.beginPath();    
            this.DrawSpline(co, yCoords, color, index);
            co.stroke();
        }




        /**
        * When you click on the chart, this method can return the Y value at that point. It works for any point on the
        * chart (that is inside the gutters) - not just points on the Line.
        * 
        * @param object e The event object
        */
        this.getValue = function (arg)
        {
            if (arg.length == 2) {
                var mouseX = arg[0];
                var mouseY = arg[1];
            } else {
                var mouseCoords = RG.getMouseXY(arg);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
            }
    
            var obj = this;
            var xaxispos = prop['chart.xaxispos'];
    
            if (mouseY < prop['chart.gutter.top']) {
                return xaxispos == 'bottom' || xaxispos == 'center' ? this.max : this.min;
            } else if (mouseY > (ca.height - prop['chart.gutter.bottom'])) {
                return xaxispos == 'bottom' ? this.min : this.max;
            }
            
            if (prop['chart.xaxispos'] == 'center') {
                var value = (( (obj.grapharea / 2) - (mouseY - prop['chart.gutter.top'])) / obj.grapharea) * (obj.max - obj.min);
                value *= 2;
                value > 0 ? value += this.min : value -= this.min;
                return value;
            } else if (prop['chart.xaxispos'] == 'top') {
                var value = ((obj.grapharea - (mouseY - prop['chart.gutter.top'])) / obj.grapharea) * (obj.max - obj.min);
                value = Math.abs(obj.max - value) * -1;
                return value;
            } else {
                var value = ((obj.grapharea - (mouseY - prop['chart.gutter.top'])) / obj.grapharea) * (obj.max - obj.min)
                value += obj.min;
                return value;
            }
        }




        /**
        * Each object type has its own Highlight() function which highlights the appropriate shape
        * 
        * @param object shape The shape to highlight
        */
        this.Highlight = function (shape)
        {
            if (prop['chart.tooltips.highlight']) {
                // Add the new highlight
                RG.Highlight.Point(this, shape);
            }
        }




        /**
        * The getObjectByXY() worker method. Don't call this call:
        * 
        * RG.ObjectRegistry.getObjectByXY(e)
        * 
        * @param object e The event object
        */
        this.getObjectByXY = function (e)
        {
            var ca      = this.canvas;
            var prop    = this.properties;
            var mouseXY = RG.getMouseXY(e);
    
            // The 5 is so that the cursor doesn't have to be over the graphArea to trigger the hotspot
            if (
                   (mouseXY[0] > prop['chart.gutter.left'] - 5)
                && mouseXY[0] < (ca.width - prop['chart.gutter.right'] + 5)
                && mouseXY[1] > (prop['chart.gutter.top'] - 5)
                && mouseXY[1] < (ca.height - prop['chart.gutter.bottom'] + 5)
                ) {
    
                return this;
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
    
                // Rounding the value to the given number of decimals make the chart step
                var value   = Number(this.getValue(e));//.toFixed(this.properties['chart.scale.decimals']);
                var shape   = RG.Registry.Get('chart.adjusting.shape');
    
                if (shape) {
    
                    RG.Registry.Set('chart.adjusting.shape', shape);
    
                    this.original_data[shape['dataset']][shape['index_adjusted']] = Number(value);
    
                    RG.RedrawCanvas(e.target);
                    
                    RG.FireCustomEvent(this, 'onadjust');
                }
            }
        }




        /**
        * This function can be used when the canvas is clicked on (or similar - depending on the event)
        * to retrieve the relevant Y coordinate for a particular value.
        * 
        * @param int value The value to get the Y coordinate for
        */
        this.getYCoord = function (value)
        {
            var ca      = this.canvas;
            var co      = this.context;
            var prop    = this.properties;
    
            if (typeof(value) != 'number') {
                return null;
            }
    
            var y;
            var xaxispos = prop['chart.xaxispos'];
    
            // Higher than max
            // Commented out on March 7th 2013 because the tan curve was not showing correctly
            //if (value > this.max) {
            //    value = this.max;
            //}
    
            if (xaxispos == 'top') {
            
                // Account for negative numbers
                if (value < 0) {
                    value = Math.abs(value);
                }
    
                y = ((value - this.min) / (this.max - this.min)) * this.grapharea;
    
                // Inverted Y labels
                if (prop['chart.scale.invert']) {
                    y = this.grapharea - y;
                }
    
                y = y + this.gutterTop
    
            } else if (xaxispos == 'center') {
    
                y = ((value - this.min) / (this.max - this.min)) * (this.grapharea / 2);
                y = (this.grapharea / 2) - y;
                y += this.gutterTop;
    
            } else {
    
                if ((value < this.min || value > this.max) && prop['chart.outofbounds'] == false) {
                    return null;
                }
    
                y = ((value - this.min) / (this.max - this.min)) * this.grapharea;
    
                // Inverted Y labels
                if (prop['chart.scale.invert']) {
                    y = this.grapharea - y;
                }
    
                y = ca.height - this.gutterBottom - y;
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
        this.positionTooltip = function (obj, x, y, tooltip, idx)
        {
            var ca      = obj.canvas;
            var co      = obj.context;
            var prop    = obj.properties;
    
            var coordX     = obj.coords[tooltip.__index__][0];
            var coordY     = obj.coords[tooltip.__index__][1];
            var canvasXY   = RG.getCanvasXY(obj.canvas);
            var gutterLeft = prop['chart.gutter.left'];
            var gutterTop  = prop['chart.gutter.top'];
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
        this.DrawSpline = function (context, coords, color, index)
        {
            // Commented out on 26th Oct 2013
            //var co          = context;
            //var ca          = co.canvas;
            //var prop        = this.properties;

            this.coordsSpline[index] = [];
            var xCoords     = [];
            var gutterLeft  = prop['chart.gutter.left'];
            var gutterRight = prop['chart.gutter.right'];
            var hmargin     = prop['chart.hmargin'];
            var interval    = (ca.width - (gutterLeft + gutterRight) - (2 * hmargin)) / (coords.length - 1);
    
            co.strokeStyle = color;

            /**
            * The drawSpline function takes an array of JUST Y coords - not X/Y coords. So the line coords need converting
            * if we've been given X/Y pairs
            */
            for (var i=0,len=coords.length; i<len;i+=1) {
                if (typeof coords[i] == 'object' && coords[i] && coords[i].length == 2) {
                    coords[i] = Number(coords[i][1]);
                }
            }




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
                    
                    if (typeof index == 'number') {
                        this.coordsSpline[index].push([xCoords[xCoords.length - 1], yCoord]);
                    }
                }
            }





            // Draw the last section
            co.lineTo(((j-1) * interval) + gutterLeft + hmargin, P[j]);
            if (typeof index == 'number') {
                this.coordsSpline[index].push([((j-1) * interval) + gutterLeft + hmargin, P[j]]);
            }





    
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
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['chart.colors']                = RGraph.array_clone(prop['chart.colors']);
                this.original_colors['chart.fillstyle']             = RGraph.array_clone(prop['chart.fillstyle']);
                this.original_colors['chart.key.colors']            = RGraph.array_clone(prop['chart.key.colors']);
                this.original_colors['chart.background.barcolor1']  = prop['chart.background.barcolor1'];
                this.original_colors['chart.background.barcolor2']  = prop['chart.background.barcolor2'];
                this.original_colors['chart.background.grid.color'] = prop['chart.background.grid.color'];
                this.original_colors['chart.text.color']            = prop['chart.text.color'];
                this.original_colors['chart.crosshairs.color']      = prop['chart.crosshairs.color'];
                this.original_colors['chart.annotate.color']        = prop['chart.annotate.color'];
                this.original_colors['chart.title.color']           = prop['chart.title.color'];
                this.original_colors['chart.title.yaxis.color']     = prop['chart.title.yaxis.color'];
                this.original_colors['chart.key.background']        = prop['chart.key.background'];
                this.original_colors['chart.axis.color']            = prop['chart.key.background'];
                this.original_colors['chart.highlight.fill']        = prop['chart.highlight.fill'];
            }

            
            
            
            for (var i=0; i<prop['chart.colors'].length; ++i) {
                if (typeof(prop['chart.colors'][i]) == 'object' && prop['chart.colors'][i][0] && prop['chart.colors'][i][1]) {
                    prop['chart.colors'][i][0] = this.parseSingleColorForGradient(prop['chart.colors'][i][0]);
                    prop['chart.colors'][i][1] = this.parseSingleColorForGradient(prop['chart.colors'][i][1]);
                } else {
                    prop['chart.colors'][i] = this.parseSingleColorForGradient(prop['chart.colors'][i]);
                }
            }
            
            /**
            * Fillstyle
            */
            if (prop['chart.fillstyle']) {
                if (typeof(prop['chart.fillstyle']) == 'string') {
                    prop['chart.fillstyle'] = this.parseSingleColorForGradient(prop['chart.fillstyle'], 'vertical');
                } else {
                    for (var i=0; i<prop['chart.fillstyle'].length; ++i) {
                        prop['chart.fillstyle'][i] = this.parseSingleColorForGradient(prop['chart.fillstyle'][i], 'vertical');
                    }
                }
            }
            
            /**
            * Key colors
            */
            if (!RG.is_null(prop['chart.key.colors'])) {
                for (var i=0; i<prop['chart.key.colors'].length; ++i) {
                    prop['chart.key.colors'][i] = this.parseSingleColorForGradient(prop['chart.key.colors'][i]);
                }
            }
    
            /**
            * Parse various properties for colors
            */
            var properties = ['chart.background.barcolor1',
                              'chart.background.barcolor2',
                              'chart.background.grid.color',
                              'chart.text.color',
                              'chart.crosshairs.color',
                              'chart.annotate.color',
                              'chart.title.color',
                              'chart.title.yaxis.color',
                              'chart.key.background',
                              'chart.axis.color',
                              'chart.highlight.fill'];
    
            for (var i=0; i<properties.length; ++i) {
                prop[properties[i]] = this.parseSingleColorForGradient(prop[properties[i]]);
            }
        }




        /**
        * This parses a single color value
        */
        this.parseSingleColorForGradient = function (color)
        {
            var RG = RGraph;
            var ca = this.canvas;
            var co = this.context;
            
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
                    var grad = co.createLinearGradient(0,0,ca.width,0);
                } else {
                    var grad = co.createLinearGradient(0,0,0,ca.height);
                }
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        }




        /**
        * Sets the appropriate shadow
        */
        this.SetShadow = function (i)
        {
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;
    
            if (prop['chart.shadow']) {
                /**
                * Handle the appropriate shadow color. This now facilitates an array of differing
                * shadow colors
                */
                var shadowColor = prop['chart.shadow.color'];
        
                /**
                * Accommodate an array of shadow colors as well as a single string
                */
                if (typeof(shadowColor) == 'object' && shadowColor[i - 1]) {
                    co.shadowColor = shadowColor[i];
    
                } else if (typeof(shadowColor) == 'object') {
                    co.shadowColor = shadowColor[0];
    
                } else if (typeof(shadowColor) == 'string') {
                    co.shadowColor = shadowColor;
                }
        
                co.shadowBlur    = prop['chart.shadow.blur'];
                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                co.shadowOffsetY = prop['chart.shadow.offsety'];
            }
        }




        /**
        * This function handles highlighting an entire data-series for the interactive
        * key
        * 
        * @param int index The index of the data series to be highlighted
        */
        this.interactiveKeyHighlight = function (index)
        {
            var coords = this.coords2[index];
            
            if (coords) {

                var pre_linewidth = co.lineWidth;
                var pre_linecap   = co.lineCap;
                
                co.lineWidth   = prop['chart.linewidth'] + 10;
                co.lineCap     = 'round';
                co.strokeStyle = prop['chart.key.interactive.highlight.chart.stroke'];

                
                co.beginPath();
                if (prop['chart.curvy']) {
                    this.DrawSpline(co, coords, prop['chart.key.interactive.highlight.chart'], null);
                } else {
                    for (var i=0,len=coords.length; i<len; i+=1) {
                        if (   i == 0
                            || RG.is_null(coords[i][1])
                            || (typeof coords[i - 1][1] != undefined && RG.is_null(coords[i - 1][1]))) {
                            co.moveTo(coords[i][0], coords[i][1]);
                        } else {
                            co.lineTo(coords[i][0], coords[i][1]);
                        }
                    }
                }
                co.stroke();
                
                // Reset the lineCap and lineWidth
                co.lineWidth = pre_linewidth;
                co.lineCap = pre_linecap;
            }
        }




        /**
        * Register the object so it is redrawn when necessary
        */
        RG.Register(this);
    }