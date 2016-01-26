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
    * The gantt chart constructor
    * 
    * @param object canvas The cxanvas object
    * @param array  data   The chart data
    */
    RGraph.Gantt = function (id, data)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context           = this.canvas.getContext("2d");
        this.canvas.__object__ = this;
        this.type              = 'gantt';
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.data              = data;
        this.colorsParsed      = false;
        this.coordsText        = [];


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);

        
        // Set some defaults
        this.properties = {
            'chart.background.barcolor1':   'rgba(0,0,0,0)',
            'chart.background.barcolor2':   'rgba(0,0,0,0)',
            'chart.background.grid':        true,
            'chart.background.grid.width':  1,
            'chart.background.grid.color':  '#ddd',
            'chart.background.grid.hsize':  20,
            'chart.background.grid.vsize':  20,
            'chart.background.grid.hlines': true,
            'chart.background.grid.vlines': true,
            'chart.background.grid.border': true,
            'chart.background.grid.autofit':true,
            'chart.background.grid.autofit.numhlines': 7,
            'chart.background.grid.autofit.numvlines': 20,
            'chart.background.vbars':       [],
            'chart.text.size':              10,
            'chart.text.font':              'Arial',
            'chart.text.color':             'black',
            'chart.gutter.left':            75,
            'chart.gutter.right':           25,
            'chart.gutter.top':             35,
            'chart.gutter.bottom':          25,
            'chart.labels':                 [],
            'chart.labels.align':           'bottom',
            'chart.labels.inbar':           null,
            'chart.labels.inbar.color':     'black',
            'chart.labels.inbar.bgcolor':   null,
            'chart.labels.inbar.align':     'left',
            'chart.labels.inbar.size':      10,
            'chart.labels.inbar.font':      'Arial',
            'chart.labels.inbar.above':     false,
            'chart.vmargin':                 2,
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.title.yaxis':            '',
            'chart.title.yaxis.bold':        true,
            'chart.title.yaxis.pos':        null,
            'chart.title.yaxis.color':      null,
            'chart.title.yaxis.position':   'right',
            'chart.title.yaxis.x':          null,
            'chart.title.yaxis.y':          null,
            'chart.title.xaxis.x':          null,
            'chart.title.xaxis.y':          null,
            'chart.title.xaxis.bold':       true,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.borders':                true,
            'chart.defaultcolor':           'white',
            'chart.coords':                 [],
            'chart.tooltips':               null,
            'chart.tooltips.effect':         'fade',
            'chart.tooltips.css.class':      'RGraph_tooltip',
            'chart.tooltips.highlight':     true,
            'chart.tooltips.event':         'onclick',
            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',
            'chart.xmin':                   0,
            'chart.xmax':                   0,
            'chart.contextmenu':            null,
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
            'chart.adjustable':             false,
            'chart.events.click':           null,
            'chart.events.mousemove':       null
        }


        /**
        * Create the dollar objects so that functions can be added to them
        */
        if (!data) {
            alert('[GANTT] The Gantt chart event data is now supplied as the second argument to the constructor - please update your code');
        }
        
        // Linearize the data (DON'T use RGraph.array_linearize() here)
        for (var i=0,idx=0; i<data.length; ++i) {
            if (RGraph.is_array(this.data[i][0])) {
                for (var j=0; j<this.data[i].length; ++j) {
                    this['$' + (idx++)] = {};
                }
            } else {
                this['$' + (idx++)] = {};
            }
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
        * A peudo setter
        * 
        * @param name  string The name of the property to set
        * @param value mixed  The value of the property
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
    
            if (name == 'chart.margin') {
                name = 'chart.vmargin'
            }
            
            if (name == 'chart.events') {
                alert('[GANTT] The chart.events property is deprecated - supply the events data as an argument to the constructor instead');
                this.data = value;
            }
    
            prop[name] = value;
    
            return this;
        }




        /**
        * A peudo getter
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
    
            if (name == 'chart.margin') {
                name = 'chart.vmargin'
            }
    
            return prop[name.toLowerCase()];
        }




        /**
        * Draws the chart
        */
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.FireCustomEvent(this, 'onbeforedraw');
    
    
    
            /**
            * This is new in May 2011 and facilitates indiviual gutter settings,
            * eg chart.gutter.left
            */
            this.gutterLeft   = prop['chart.gutter.left'];
            this.gutterRight  = prop['chart.gutter.right'];
            this.gutterTop    = prop['chart.gutter.top'];
            this.gutterBottom = prop['chart.gutter.bottom'];
    
    
            /**
            * Parse the colors. This allows for simple gradient syntax
            */
            if (!this.colorsParsed) {
                this.parseColors();
                
                // Don't want to do this again
                this.colorsParsed = true;
            }

            /**
            * Work out the graphArea
            */
            this.graphArea     = ca.width - this.gutterLeft - this.gutterRight;
            this.graphHeight   = ca.height - this.gutterTop - this.gutterBottom;
            this.numEvents     = this.data.length
            this.barHeight     = this.graphHeight / this.numEvents;
            this.halfBarHeight = this.barHeight / 2;
    
    
    
    
            /**
            * Draw the background
            */
            RG.background.Draw(this);
    
    
    
            /**
            * Draw the labels at the top
            */
            this.DrawLabels();
    
    
    
            /**
            * Draw the events
            */
            this.DrawEvents();
    
    
    
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
        * Draws the labels at the top and the left of the chart
        */
        this.DrawLabels = function ()
        {
            co.beginPath();
            co.fillStyle = prop['chart.text.color'];
    
            /**
            * Draw the X labels at the top of the chart.
            */
            var labels = prop['chart.labels'];
            var labelSpace = (this.graphArea) / labels.length;
            var x      = this.gutterLeft + (labelSpace / 2);
            var y      = this.gutterTop - (prop['chart.text.size'] / 2) - 5;
            var font   = prop['chart.text.font'];
            var size   = prop['chart.text.size'];
    
            co.strokeStyle = 'black'
            
            /**
            * This facilitates chart.labels.align
            */
            if (prop['chart.labels.align'] == 'bottom') {
                y = ca.height - this.gutterBottom + size + 2;
            }
    
            /**
            * Draw the horizontal labels
            */
            for (i=0; i<labels.length; ++i) {
                RG.Text2(this,{'font': font,
                               'size':size,
                               'x': x + (i * labelSpace),
                               'y': y,
                               'text': String(labels[i]),
                               'halign':'center',
                               'valign':'center',
                               'tag': 'labels.horizontal'
                              });
            }
    
            /**
            * Draw the vertical labels
            */
            for (var i=0,len=this.data.length; i<len; ++i) {
                
                var ev = this.data[i];
                var x  = this.gutterLeft;
                var y  = this.gutterTop + this.halfBarHeight + (i * this.barHeight);
                
                RG.Text2(this,{'font': font,
                               'size':size,
                               'x': x - 5,
                               'y': y,
                               'text': RG.is_array(ev[0]) ? (ev[0][3] ? String(ev[0][3]) : '') : (typeof ev[3] == 'string' ? ev[3] : ''),
                               'halign':'right',
                               'valign':'center',
                               'tag': 'labels.vertical'
                              });
            }
        }




        /**
        * Draws the events to the canvas
        */
        this.DrawEvents = function ()
        {
            var events  = this.data;
    
            /**
            * Reset the coords array to prevent it growing
            */
            this.coords = [];
    
            /**
            * First draw the vertical bars that have been added
            */
            if (prop['chart.vbars']) {
                for (i=0,len=prop['chart.vbars'].length; i<len; ++i) {
                    // Boundary checking
                    if (prop['chart.vbars'][i][0] + prop['chart.vbars'][i][1] > prop['chart.xmax']) {
                        prop['chart.vbars'][i][1] = 364 - prop['chart.vbars'][i][0];
                    }
        
                    var barX   = this.gutterLeft + (( (prop['chart.vbars'][i][0] - prop['chart.xmin']) / (prop['chart.xmax'] - prop['chart.xmin']) ) * this.graphArea);
    
                    var barY   = this.gutterTop;
                    var width  = (this.graphArea / (prop['chart.xmax'] - prop['chart.xmin']) ) * prop['chart.vbars'][i][1];
                    var height = ca.height - this.gutterTop - this.gutterBottom;
                    
                    // Right hand bounds checking
                    if ( (barX + width) > (ca.width - this.gutterRight) ) {
                        width = ca.width - this.gutterRight - barX;
                    }
        
                    co.fillStyle = prop['chart.vbars'][i][2];
                    co.fillRect(barX, barY, width, height);
                }
            }


            /**
            * Draw the events
            */
            var sequentialIndex = 0;
            for (i=0; i<events.length; ++i) {
                if (typeof(events[i][0]) == 'number') {
                    this.DrawSingleEvent(events[i], i, null);
                } else {
                    for (var j=0; j<events[i].length; ++j) {
                        this.DrawSingleEvent(events[i][j], i, sequentialIndex++);
                    }
                }
    
            }
        }




        /**
        * Retrieves the bar (if any) that has been click on or is hovered over
        * 
        * @param object e The event object
        */
        this.getShape =
        this.getBar = function (e)
        {
            e = RG.FixEventObject(e);
    
            //var canvas      = e.target;
            //var context     = canvas.getContext('2d');
            var mouseCoords = RGraph.getMouseXY(e);
            var mouseX      = mouseCoords[0];
            var mouseY      = mouseCoords[1];
    
            /**
            * Loop through the bars determining if the mouse is over a bar
            */
            for (var i=0,len=this.coords.length; i<len; i++) {
    
                var left   = this.coords[i][0];
                var top    = this.coords[i][1];
                var width  = this.coords[i][2];
                var height = this.coords[i][3];
    
                if (   mouseX >= left
                    && mouseX <= (left + width)
                    && mouseY >= top
                    && mouseY <= (top + height)
                   ) {
                   
                    var tooltip = RGraph.parseTooltipText(prop['chart.tooltips'], i);
    
                    return {0: this,   'object': this,
                            1: left,   'x':      left,
                            2: top,    'y':      top,
                            3: width,  'width':  width,
                            4: height, 'height': height,
                            5: i,      'index':  i,
                                       'tooltip': tooltip};
                }
            }
        }




        /**
        * Draws a single event
        */
        this.DrawSingleEvent = function (ev, index, sequentialIndex)
        {
            var min     = prop['chart.xmin'];
    
            co.beginPath();
            co.strokeStyle = 'black';
            co.fillStyle = ev[4] ? ev[4] : prop['chart.defaultcolor'];
    
            var barStartX  = this.gutterLeft + (((ev[0] - min) / (prop['chart.xmax'] - min)) * this.graphArea);
            var barStartY  = this.gutterTop + (index * this.barHeight);
            var barWidth   = (ev[1] / (prop['chart.xmax'] - min) ) * this.graphArea;
    
            /**
            * If the width is greater than the graph atrea, curtail it
            */
            if ( (barStartX + barWidth) > (ca.width - this.gutterRight) ) {
                barWidth = ca.width - this.gutterRight - barStartX;
            }

            /**
            *  Draw the actual bar storing store the coordinates
            */
            this.coords.push([barStartX, barStartY + prop['chart.vmargin'], barWidth, this.barHeight - (2 * prop['chart.vmargin'])]);
    
            // draw the border around the bar
            if (prop['chart.borders'] || ev[6]) {
                co.strokeStyle = typeof(ev[6]) == 'string' ? ev[6] : 'black';
                co.lineWidth = (typeof(ev[7]) == 'number' ? ev[7] : 1);
                co.beginPath();
                co.strokeRect(barStartX, barStartY + prop['chart.vmargin'], barWidth, this.barHeight - (2 * prop['chart.vmargin']) );
            }
            
            co.beginPath();
                co.fillRect(barStartX, barStartY + prop['chart.vmargin'], barWidth, this.barHeight - (2 * prop['chart.vmargin']) );
            co.fill();
    
            // Work out the completeage indicator
            var complete = (ev[2] / 100) * barWidth;
    
            // Draw the % complete indicator. If it's greater than 0
            if (typeof(ev[2]) == 'number') {
                co.beginPath();
                co.fillStyle = ev[5] ? ev[5] : '#0c0';
                co.fillRect(barStartX,
                            barStartY + prop['chart.vmargin'],
                            (ev[2] / 100) * barWidth,
                            this.barHeight - (2 * prop['chart.vmargin']) );
                
                co.beginPath();
                co.fillStyle = prop['chart.text.color'];
                RG.Text2(this,{'font': prop['chart.text.font'],
                               'size': prop['chart.text.size'],
                               'x': barStartX + barWidth + 5,
                               'y': barStartY + this.halfBarHeight,
                               'text': String(ev[2]) + '%',
                               'valign':'center',
                               'tag': 'labels.complete'
                              });
            }
            
            /**
            * Draw the inbar label if it's defined
            */
            if (prop['chart.labels.inbar'] && (prop['chart.labels.inbar'][sequentialIndex] || prop['chart.labels.inbar'][index])) {
                
                var label = String(prop['chart.labels.inbar'][sequentialIndex] || prop['chart.labels.inbar'][index]);
                var halign = prop['chart.labels.inbar.align'] == 'left' ? 'left' : 'center';
                    halign = prop['chart.labels.inbar.align'] == 'right' ? 'right' : halign;
                
                // Work out the position of the text
                if (halign == 'right') {
                    var x = (barStartX + barWidth) - 5;
                } else if (halign == 'center') {
                    var x = barStartX + (barWidth / 2);
                } else {
                    var x = barStartX + 5;
                }
    
    
                // Draw the labels "above" the bar
                if (prop['chart.labels.inbar.above']) {
                    x = barStartX + barWidth + 5;
                    halign = 'left';
                }
    
    
                // Set the color
                co.fillStyle = prop['chart.labels.inbar.color'];
                RGraph.Text2(this,{'font':prop['chart.labels.inbar.font'],
                                   'size':prop['chart.labels.inbar.size'],
                                   'x': x,
                                   'y': barStartY + this.halfBarHeight,
                                   'text': label,
                                   'valign':'center',
                                   'halign':halign,
                                   'bounding': typeof(prop['chart.labels.inbar.bgcolor']) == 'string',
                                   'boundingFill':typeof(prop['chart.labels.inbar.bgcolor']) == 'string' ? prop['chart.labels.inbar.bgcolor'] : null,
                                   'tag': 'labels.inbar'
                                  });
            }
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
                
                var bar = RG.Registry.Get('chart.adjusting.gantt');
                
                if (bar) {
                    var mouseXY    = RG.getMouseXY(e);
                    var obj        = RG.Registry.Get('chart.adjusting.gantt')['object'];
                    var index      = bar['index'];
                    var diff       = ((mouseXY[0] - RG.Registry.Get('chart.adjusting.gantt')['mousex']) / (ca.width - obj.gutterLeft - obj.gutterRight)) * prop['chart.xmax'];
                    var eventStart = RG.Registry.Get('chart.adjusting.gantt')['event_start'];
                    var duration   = RG.Registry.Get('chart.adjusting.gantt')['event_duration'];
        
                    if (bar['mode'] == 'move') {
        
                        diff = Math.round(diff);
        
                        if (   eventStart + diff >= 0
                            && (eventStart + diff + obj.data[index][1]) < prop['chart.xmax']) {
        
                            obj.data[index][0] = eventStart + diff;
                        
                        } else if (eventStart + diff < 0) {
                            obj.data[index][0] = 0;
                        //
                        } else if ((eventStart + diff + obj.data[index][1]) > prop['chart.xmax']) {
                            obj.data[index][0] = prop['chart.xmax'] - obj.data[index][1];
                        }
                    
                    } else if (bar['mode'] == 'resize') {
        
                        /*
                        * Account for the right hand gutter. Appears to be a FF bug
                        */
                        if (mouseXY[0] > (ca.width - obj.gutterRight)) {
                            mouseXY[0] = ca.width - obj.gutterRight;
                        }
                        
                        var diff = ((mouseXY[0] - RG.Registry.Get('chart.adjusting.gantt')['mousex']) / (ca.width - obj.gutterLeft - obj.gutterRight)) * prop['chart.xmax'];
                            diff = Math.round(diff);
        
                        obj.data[index][1] = duration + diff;
                        
                        if (obj.data[index][1] < 0) {
                            obj.data[index][1] = 1;
                        }
                    }
                    
                    RG.FireCustomEvent(obj, 'onadjust')
        
                    RG.Clear(ca);
                    RG.RedrawCanvas(ca);
                }
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
        * Returns the X coordinate for the given value
        * 
        * @param number value The desired value (eg minute/hour/day etc)
        */
        this.getXCoord = function (value)
        {
            var min = prop['chart.xmin'];
            var max = prop['chart.xmax'];
            
            if (value > max || value < min) {
                return null;
            }
            
            var x = (((value - min) / (max - min)) * this.graphArea) + this.gutterLeft;
            
            return x;
        }




        /**
        * Returns the value given EITHER the event object OR a two element array containing the X/Y coords
        */
        this.getValue = function (arg)
        {
            if (arg.length == 2) {
                var mouseXY = arg;
            } else {
                var mouseXY = RGraph.getMouseXY(arg);
            }
            
            var mouseX = mouseXY[0];
            var mouseY = mouseXY[1];
            
            var value = (mouseX - this.gutterLeft) / (ca.width - this.gutterLeft - this.gutterRight);
                value *= (prop['chart.xmax'] - prop['chart.xmin']);
            
            // Bounds checking
            if (value < prop['chart.xmin'] || value > prop['chart.xmax']) {
                value = null;
            }
            
            return value;
        }




        /**
        * This allows for easy specification of gradients. Could optimise this not to repeatedly call parseSingleColors()
        */
        this.parseColors = function ()
        {
            for (var i=0; i<this.data.length; ++i) {
                if (typeof(this.data[i][4]) == 'string') this.data[i][4] = this.parseSingleColorForGradient(this.data[i][4]);
                if (typeof(this.data[i][5]) == 'string') this.data[i][5] = this.parseSingleColorForGradient(this.data[i][5]);
                
                if (typeof this.data[i][0] == 'object' && typeof this.data[i][0][0] == 'number') {
                    for (var j=0,len=this.data[i].length; j<len; j+=1) {
                        this.data[i][j][4] = this.parseSingleColorForGradient(this.data[i][j][4]);
                        this.data[i][j][5] = this.parseSingleColorForGradient(this.data[i][j][5]);
                    }
                }
            }
            
            prop['chart.background.barcolor1']  = this.parseSingleColorForGradient(prop['chart.background.barcolor1']);
            prop['chart.background.barcolor2']  = this.parseSingleColorForGradient(prop['chart.background.barcolor2']);
            prop['chart.background.grid.color'] = this.parseSingleColorForGradient(prop['chart.background.grid.color']);
            prop['chart.defaultcolor']          = this.parseSingleColorForGradient(prop['chart.defaultcolor']);
            prop['chart.highlight.stroke']      = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
            prop['chart.highlight.fill']        = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
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

                var grad = co.createLinearGradient(this.gutterLeft,0,ca.width - this.gutterRight,0);
    
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

