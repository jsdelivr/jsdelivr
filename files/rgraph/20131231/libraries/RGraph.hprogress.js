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
    * The progress bar constructor
    * 
    * @param int id    The ID of the canvas tag
    * @param int value The indicated value of the meter.
    * @param int max   The end value (the upper most) of the meter
    */
    RGraph.HProgress = function (id, value, max)
    {
        this.id                = id;
        this.max               = max;
        this.value             = value;
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'hprogress';
        this.coords            = [];
        this.isRGraph          = true;
        this.currentValue      = null;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;
        this.coordsText        = [];


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);

        this.properties = {
            'chart.min':                0,
            'chart.colors':             ['Gradient(white:#0c0)','Gradient(white:red)','Gradient(white:green)','yellow','pink','cyan','black','white','gray'],
            'chart.strokestyle.inner':  '#999',
            'chart.strokestyle.outer':  '#999',
            'chart.tickmarks':          true,
            'chart.tickmarks.color':    '#999',
            'chart.tickmarks.inner':    false,
            'chart.tickmarks.zerostart':true,
            'chart.gutter.left':        25,
            'chart.gutter.right':       25,
            'chart.gutter.top':         25,
            'chart.gutter.bottom':      25,
            'chart.numticks':           10,
            'chart.numticks.inner':     50,
            'chart.background.color':   '#eee',
            'chart.shadow':             false,
            'chart.shadow.color':       'rgba(0,0,0,0.5)',
            'chart.shadow.blur':        3,
            'chart.shadow.offsetx':     3,
            'chart.shadow.offsety':     3,
            'chart.title':              '',
            'chart.title.background':   null,
            'chart.title.bold':         true,
            'chart.title.font':         null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.text.size':          10,
            'chart.text.color':         'black',
            'chart.text.font':          'Arial',
            'chart.contextmenu':        null,
            'chart.units.pre':          '',
            'chart.units.post':         '',
            'chart.tooltips':           null,
            'chart.tooltips.effect':    'fade',
            'chart.tooltips.css.class': 'RGraph_tooltip',
            'chart.tooltips.highlight': true,
            'chart.tooltips.event':         'onclick',
            'chart.highlight.stroke':   'rgba(0,0,0,0)',
            'chart.highlight.fill':     'rgba(255,255,255,0.7)',
            'chart.annotatable':        false,
            'chart.annotate.color':     'black',
            'chart.zoom.factor':        1.5,
            'chart.zoom.fade.in':       true,
            'chart.zoom.fade.out':      true,
            'chart.zoom.hdir':          'right',
            'chart.zoom.vdir':          'down',
            'chart.zoom.frames':            25,
            'chart.zoom.delay':             16.666,
            'chart.zoom.shadow':        true,
            'chart.zoom.background':    true,
            'chart.arrows':                false,
            'chart.margin':                0,
            'chart.resizable':             false,
            'chart.resize.handle.adjust':  [0,0],
            'chart.resize.handle.background':null,
            'chart.labels.specific':       null,
            'chart.labels.count':          10,
            'chart.adjustable':            false,
            'chart.scale.decimals':     0,
            'chart.scale.point':        '.',
            'chart.scale.thousand':     ',',
            'chart.key':                null,
            'chart.key.background':     'white',
            'chart.key.position':       'gutter',
            'chart.key.halign':             'right',
            'chart.key.shadow':         false,
            'chart.key.shadow.color':   '#666',
            'chart.key.shadow.blur':    3,
            'chart.key.shadow.offsetx': 2,
            'chart.key.shadow.offsety': 2,
            'chart.key.position.gutter.boxed': false,
            'chart.key.position.x':     null,
            'chart.key.position.y':     null,
            'chart.key.color.shape':    'square',
            'chart.key.rounded':        true,
            'chart.key.linewidth':      1,
            'chart.key.colors':         null,
            'chart.key.color.shape':    'square',
            'chart.key.interactive':    false,
            'chart.key.interactive.highlight.chart.stroke': 'black',
            'chart.key.interactive.highlight.chart.fill': 'rgba(255,255,255,0.7)',
            'chart.key.interactive.highlight.label': 'rgba(255,0,0,0.2)',
            'chart.key.text.color':      'black',
            'chart.labels.position':     'bottom',
            'chart.events.mousemove':    null,
            'chart.events.click':        null,
            'chart.border.inner':        true
        }
        
        /**
        * Allow for new style method of passing arguments to the constructor
        */
        if (arguments.length == 4) {

            this.min   = arguments[1];
            this.max   = arguments[2];
            this.value = arguments[3];
            
            this.properties['chart.min'] = arguments[1];
        
        } else if (arguments.length == 3) {

            this.min   = 0;
            this.max   = arguments[2];
            this.value = arguments[1];
            
            this.properties['chart.min'] = 0;
        }

        // Check for support
        if (!this.canvas) {
            alert('[HPROGRESS] No canvas support');
            return;
        }


        /**
        * Create the dollar objects so that functions can be added to them
        */
        var linear_data = RGraph.array_linearize(value);
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




        ///////////////////////////////// SHORT PROPERTIES /////////////////////////////////




        var RG   = RGraph;
        var ca   = this.canvas;
        var co   = ca.getContext('2d');
        var prop = this.properties;
        //var $jq  = jQuery;




        //////////////////////////////////// METHODS ///////////////////////////////////////




        /**
        * A generic setter
        * 
        * @param string name  The name of the property to set
        * @param string value The value of the poperty
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
            * chart.strokestyle now sets both chart.strokestyle.inner and chart.strokestyle.outer
            */
            if (name == 'chart.strokestyle') {
                this.Set('chart.strokestyle.inner', value);
                this.Set('chart.strokestyle.outer', value);
                return;
            }
    
            prop[name] = value;
    
            return this;
        }




        /**
        * A generic getter
        * 
        * @param string name  The name of the property to get
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
        * Draws the progress bar
        */
        this.Draw = function ()
        {
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
            * Set the current value
            */
            this.currentValue = this.value;
    
            /**
            * This is new in May 2011 and facilitates individual gutter settings,
            * eg chart.gutter.left
            */
            this.gutterLeft   = prop['chart.gutter.left'];
            this.gutterRight  = prop['chart.gutter.right'];
            this.gutterTop    = prop['chart.gutter.top'];
            this.gutterBottom = prop['chart.gutter.bottom'];
    
            // Figure out the width and height
            this.width  = ca.width - this.gutterLeft - this.gutterRight;
            this.height = ca.height - this.gutterTop - this.gutterBottom;
            this.coords = [];
    
            this.Drawbar();
            this.DrawTickMarks();
            this.DrawLabels();
            this.DrawTitle();
    
            co.stroke();
            co.fill();
            
            
            /**
            * Draw the bevel effect if requested
            */
            if (prop['chart.bevel']) {
                this.DrawBevel();
            }
    
    
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
            }
    
    
            // Draw the key if necessary
            if (prop['chart.key'] && prop['chart.key'].length) {
                RG.DrawKey(this, prop['chart.key'], prop['chart.colors']);
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
        * Draws the bar
        */
        this.Drawbar = function ()
        {
            /**
            * First get the scale
            */
    
            this.scale2 = RG.getScale2(this, {
                                            'max':this.max,
                                            'min':this.min,
                                            'strict':true,
                                            'scale.thousand':prop['chart.scale.thousand'],
                                            'scale.point':prop['chart.scale.point'],
                                            'scale.decimals':prop['chart.scale.decimals'],
                                            'ylabels.count':prop['chart.labels.count'],
                                            'scale.round':prop['chart.scale.round'],
                                            'units.pre': prop['chart.units.pre'],
                                            'units.post': prop['chart.units.post']
                                           });

            // Set a shadow if requested
            if (prop['chart.shadow']) {
                RG.SetShadow(this, prop['chart.shadow.color'], prop['chart.shadow.offsetx'], prop['chart.shadow.offsety'], prop['chart.shadow.blur']);
            }
    
            // Draw the shadow for MSIE
            if (ISOLD && prop['chart.shadow']) {
                co.fillStyle = prop['chart.shadow.color'];
                co.fillRect(this.gutterLeft + prop['chart.shadow.offsetx'], this.gutterTop + prop['chart.shadow.offsety'], this.width, this.height);
            }
    
            // Draw the outline
            co.fillStyle   = prop['chart.background.color'];
            co.strokeStyle = prop['chart.strokestyle.outer'];
            co.strokeRect(this.gutterLeft, this.gutterTop, this.width, this.height);
            co.fillRect(this.gutterLeft, this.gutterTop, this.width, this.height);
    
            // Turn off any shadow
            RG.NoShadow(this);
    
            co.fillStyle   = prop['chart.colors'][0];
            co.strokeStyle = prop['chart.strokestyle.outer'];
            
            var margin = prop['chart.margin'];
    
            // Draw the actual bar itself
            var barWidth = Math.min(this.width, ((RG.array_sum(this.value) - prop['chart.min']) / (this.max - prop['chart.min']) ) * this.width);
    
            if (prop['chart.tickmarks.inner']) {
    
                var spacing = (ca.width - this.gutterLeft - this.gutterRight) / prop['chart.numticks.inner'];
    
                co.lineWidth   = 1;
                co.strokeStyle = prop['chart.strokestyle.outer'];
    
                co.beginPath();
                for (var x = this.gutterLeft; x<ca.width - this.gutterRight; x+=spacing) {
                    co.moveTo(Math.round(x), this.gutterTop);
                    co.lineTo(Math.round(x), this.gutterTop + 2);
    
                    co.moveTo(Math.round(x), ca.height - this.gutterBottom);
                    co.lineTo(Math.round(x), ca.height - this.gutterBottom - 2);
                }
                co.stroke();
            }
            
            /**
            * This bit draws the actual progress bar
            */
            if (typeof(this.value) == 'number') {
                co.beginPath();
                co.strokeStyle = prop['chart.strokestyle.inner'];
                co.fillStyle = prop['chart.colors'][0];
    
                if (prop['chart.border.inner']) {
                    co.strokeRect(this.gutterLeft, this.gutterTop + margin, barWidth, this.height - margin - margin);
                }
                co.fillRect(this.gutterLeft, this.gutterTop + margin, barWidth, this.height - margin - margin);
    
                // Store the coords
                this.coords.push([this.gutterLeft,
                                  this.gutterTop + margin,
                                  barWidth,
                                  this.height - margin - margin]);
    
            } else if (typeof(this.value) == 'object') {
    
                co.beginPath();
                co.strokeStyle = prop['chart.strokestyle.inner'];
    
                var startPoint = this.gutterLeft;
                
                for (var i=0; i<this.value.length; ++i) {
    
                    var segmentLength = (this.value[i] / RG.array_sum(this.value)) * barWidth;
                    co.fillStyle = prop['chart.colors'][i];
    
                    if (prop['chart.border.inner']) {
                        co.strokeRect(startPoint, this.gutterTop + margin, segmentLength, this.height - margin - margin);
                    }
                    co.fillRect(startPoint, this.gutterTop + margin, segmentLength, this.height - margin - margin);
    
    
                    // Store the coords
                    this.coords.push([startPoint,
                                      this.gutterTop + margin,
                                      segmentLength,
                                      this.height - margin - margin]);
    
                    startPoint += segmentLength;
                }
            }
    
            /**
            * Draw the arrows indicating the level if requested
            */
            if (prop['chart.arrows']) {
                var x = this.gutterLeft + barWidth;
                var y = this.gutterTop;
                
                co.lineWidth = 1;
                co.fillStyle = 'black';
                co.strokeStyle = 'black';
    
                co.beginPath();
                    co.moveTo(x, y - 3);
                    co.lineTo(x + 2, y - 7);
                    co.lineTo(x - 2, y - 7);
                co.closePath();
    
                co.stroke();
                co.fill();
    
                co.beginPath();
                    co.moveTo(x, y + this.height + 4);
                    co.lineTo(x + 2, y + this.height + 9);
                    co.lineTo(x - 2, y + this.height + 9);
                co.closePath();
    
                co.stroke();
                co.fill()
            }

    
            /**
            * Draw the "in-bar" label
            */
            if (prop['chart.label.inner']) {
                co.fillStyle = 'black';
                RG.Text2(this, {'font':prop['chart.text.font'],
                               'size':prop['chart.text.size'] + 2,
                               'x':this.gutterLeft + barWidth + 5,
                               'y':this.gutterTop + (this.height / 2),
                               'text': String(prop['chart.units.pre'] + this.value + prop['chart.units.post']),
                               'valign':'bottom',
                               'halign':'left',
                               'bounding':true,
                               'boundingFill':'white',
                                'tag': 'label.inner'
                               });
            }
    
        }




        /**
        * The function that draws the tick marks. Apt name...
        */
        this.DrawTickMarks = function ()
        {
            co.strokeStyle = prop['chart.tickmarks.color'];
    
            if (prop['chart.tickmarks']) {
                
                co.beginPath();        
    
                // This is used by the label function below
                this.tickInterval = this.width / prop['chart.numticks'];
                
                var start   = prop['chart.tickmarks.zerostart'] ? 0 : this.tickInterval;
    
                if (prop['chart.labels.position'] == 'top') {
                    for (var i=this.gutterLeft + start; i<=(this.width + this.gutterLeft + 0.1); i+=this.tickInterval) {
                        co.moveTo(Math.round(i), this.gutterTop);
                        co.lineTo(Math.round(i), this.gutterTop - 4);
                    }
    
                } else {
    
                    for (var i=this.gutterLeft + start; i<=(this.width + this.gutterLeft + 0.1); i+=this.tickInterval) {
                        co.moveTo(Math.round(i), this.gutterTop + this.height);
                        co.lineTo(Math.round(i), this.gutterTop + this.height + 4);
                    }
                }
    
                co.stroke();
            }
        }




        /**
        * The function that draws the labels
        */
        this.DrawLabels = function ()
        {
            if (!RG.is_null(prop['chart.labels.specific'])) {
                return this.DrawSpecificLabels();
            }
    
            co.fillStyle = prop['chart.text.color'];
    
            var xPoints = [];
            var yPoints = [];
            var font = prop['chart.text.font'];
            var size = prop['chart.text.size'];
    
            for (i=0,len=this.scale2.labels.length; i<len; i++) {
    
    
                if (prop['chart.labels.position'] == 'top') {
                    var x = this.width * (i/this.scale2.labels.length) + this.gutterLeft + (this.width / this.scale2.labels.length);
                    var y = this.gutterTop - 6;
                    var valign = 'bottom';
                } else {
                    var x = this.width * (i/this.scale2.labels.length) + this.gutterLeft + (this.width / this.scale2.labels.length);
                    var y = this.height + this.gutterTop + 4;
                    var valign = 'top';
                }
    
                RG.Text2(this, {'font':font,
                                'size':size,
                                'x':x,
                                'y':y,
                                'text': this.scale2.labels[i],
                                'valign':valign,
                                'halign':'center',
                                 'tag': 'scale'
                                });
            }
            
            if (prop['chart.tickmarks.zerostart']) {
                if (prop['chart.labels.position'] == 'top') {
                    RG.Text2(this, {'font':font,
                                    'size':size,
                                    'x':this.gutterLeft,
                                    'y':this.gutterTop - 6,
                                    'text': prop['chart.units.pre'] + Number(prop['chart.min']).toFixed(prop['chart.scale.decimals']) + prop['chart.units.post'],
                                    'valign':'bottom',
                                    'halign':'center',
                                    'tag': 'scale'
                                    });
                } else {
                    RG.Text2(this, {'font':font,
                                    'size':size,
                                    'x':this.gutterLeft,
                                    'y':ca.height - this.gutterBottom + 5,
                                    'text': prop['chart.units.pre'] + Number(prop['chart.min']).toFixed(prop['chart.scale.decimals']) + prop['chart.units.post'],
                                    'valign':'top',
                                    'halign':'center',
                                    'tag': 'scale'
                                    });
                }
            }
        }




        /**
        * Returns the focused bar
        * 
        * @param event e The event object
        */
        this.getShape =
        this.getBar = function (e)
        {
            var mouseCoords = RG.getMouseXY(e)
    
            for (var i=0; i<this.coords.length; i++) {
    
                var mouseCoords = RG.getMouseXY(e);
                var mouseX = mouseCoords[0];
                var mouseY = mouseCoords[1];
                var left   = this.coords[i][0];
                var top    = this.coords[i][1];
                var width  = this.coords[i][2];
                var height = this.coords[i][3];
                var idx    = i;
    
                if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {
                
                    var tooltip = RG.parseTooltipText(prop['chart.tooltips'], idx);
                
                    return {
                            0: this, 1: left, 2: top, 3: width, 4: height, 5: idx,
                            'object':this, 'x':left, 'y':top, 'width': width, 'height': height, 'index': idx, 'tooltip': tooltip
                           }
                }
            }
        }




        /**
        * This function returns the value that the mouse is positioned at, regardless of
        * the actual indicated value.
        * 
        * @param object e The event object
        */
        this.getValue = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
                
            var value = (mouseXY[0] - this.gutterLeft) / this.width;
                value *= this.max - prop['chart.min'];
                value += prop['chart.min'];
                
            if (mouseXY[0] < this.gutterLeft) {
                value = prop['chart.min'];
            }
            if (mouseXY[0] > (ca.width - this.gutterRight) ) {
                value = this.max
            }
    
            return value;
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
            * Handle adjusting for the HProgress
            */
            if (prop['chart.adjustable'] && RG.Registry.Get('chart.adjusting') && RG.Registry.Get('chart.adjusting').uid == this.uid) {
    
                var mouseXY = RG.getMouseXY(e);
                var value   = this.getValue(e);
                
                if (typeof(value) == 'number') {
    
                    // Fire the onadjust event
                    RG.FireCustomEvent(this, 'onadjust');
        
                    this.value = Number(value.toFixed(prop['chart.scale.decimals']));
                    RG.Redraw();
                }
            }
        }




        /**
        * Draws chart.labels.specific
        */
        this.DrawSpecificLabels = function ()
        {
            var labels = prop['chart.labels.specific'];
            
            if (labels) {
    
                var font   = prop['chart.text.font'];
                var size   = prop['chart.text.size'];
                var valign = (prop['chart.labels.position'] == 'top' ? 'bottom' : 'top');
                var step   = this.width / (labels.length - 1);
        
                co.beginPath();
                    co.fillStyle = prop['chart.text.color'];
                    for (var i=0; i<labels.length; ++i) {
                        RG.Text2(this, {'font':font,
                                        'size':size,
                                        'x': this.gutterLeft + (step * i),
                                        'y':prop['chart.labels.position'] == 'top' ? this.gutterTop - 7  : ca.height - this.gutterBottom + 7,
                                        'text': labels[i],
                                        'valign':valign,
                                        'halign':'center',
                                        'tag': 'labels.specific'
                                        });
                    }
                co.fill();
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
            var gutterLeft = this.gutterLeft;
            var gutterTop  = this.gutterTop;
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
        * This function returns the appropriate X coordinate for the given value
        * 
        * @param  int value The value you want the coordinate for
        * @returm int       The coordinate
        */
        this.getXCoord = function (value)
        {
            var min = prop['chart.min'];
    
            if (value < min || value > this.max) {
                return null;
            }
    
            var barWidth = ca.width - this.gutterLeft - this.gutterRight;
            var coord = ((value - min) / (this.max - min)) * barWidth;
            coord = this.gutterLeft + coord;
            
            return coord;
        }




        /**
        * This returns true/false as to whether the cursor is over the chart area.
        * The cursor does not necessarily have to be over the bar itself.
        */
        this.overChartArea = function  (e)
        {
            var mouseXY = RGraph.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
            
            if (   mouseX >= this.gutterLeft
                && mouseX <= (ca.width - this.gutterRight)
                && mouseY >= this.gutterTop
                && mouseY <= (ca.height - this.gutterBottom)
                ) {
                
                return true;
            }
    
            return false;
        }




        /**
        * 
        */
        this.parseColors = function ()
        {
            var colors = prop['chart.colors'];
    
            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForGradient(colors[i]);
            }
    
            prop['chart.tickmarks.color']   = this.parseSingleColorForGradient(prop['chart.tickmarks.color']);
            prop['chart.strokestyle.inner'] = this.parseSingleColorForGradient(prop['chart.strokestyle.inner']);
            prop['chart.strokestyle.outer'] = this.parseSingleColorForGradient(prop['chart.strokestyle.outer']);
            prop['chart.highlight.fill']    = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
            prop['chart.highlight.stroke']  = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
            prop['chart.background.color']  = this.parseSingleColorForGradient(prop['chart.background.color']);
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
                var grad = co.createLinearGradient(prop['chart.gutter.left'],0,ca.width - prop['chart.gutter.right'],0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
                
            return grad ? grad : color;
        }




        /**
        * Draws the bevel effect
        */
        this.DrawBevel = function ()
        {
            // In case of multiple segments - this adds up all the lengths
            for (var i=0,len=0; i<this.coords.length; ++i) len += this.coords[i][2];
    
            co.save();
                // Draw a path to clip to
                co.beginPath();
                    co.rect(this.coords[0][0], this.coords[0][1], len, this.coords[0][3]);
                    co.clip();
                
                // Now draw the rect with a shadow
                co.beginPath();

                    co.shadowColor = 'black';
                    co.shadowOffsetX = 0;
                    co.shadowOffsetY = 0;
                    co.shadowBlur    = 15;
                    
                    co.lineWidth = 2;
                    
                    co.rect(this.coords[0][0] - 1, this.coords[0][1] - 1, len + 2, this.coords[0][3] + 2);
                
                co.stroke();
    
            co.restore();
        }




        /**
        * Draw the titles
        */
        this.DrawTitle = function ()
        {
            // Draw the title text
            if (prop['chart.title'].length) {
    
                var x    = ((ca.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;
                var text = prop['chart.title'];
                var size = prop['chart.title.size'] ? prop['chart.title.size'] : prop['chart.text.size'] + 2;
                var font = prop['chart.title.font'] ? prop['chart.title.font'] : prop['chart.text.font'];
                
                if (prop['chart.labels.position'] == 'top') {
                    y = ca.height - this.gutterBottom +5;
                    x = ((ca.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;
                    valign = 'top';
                } else {
                    x = ((ca.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;
                    y = this.gutterTop - 5;
                    valign = 'bottom';
                }
    
    
                RG.Text2(this, {'font':font,
                                'size':size,
                                'x': typeof(prop['chart.title.x']) == 'number' ? prop['chart.title.x'] : x,
                                'y': typeof(prop['chart.title.y']) == 'number' ? prop['chart.title.y'] : y,
                                'text': text,
                                'valign': prop['chart.title.valign'] ? prop['chart.title.valign'] : valign,
                                'halign': prop['chart.title.halign'] ? prop['chart.title.halign'] : 'center',
                                'bold':prop['chart.title.bold'],
                                'bounding': prop['chart.title.background'] ? true : false,
                                'boundingFill': prop['chart.title.background'],
                                'tag': 'title'
                                });
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
            var coords = this.coords[index];

            co.beginPath();

                co.strokeStyle = prop['chart.key.interactive.highlight.chart.stroke'];
                co.lineWidth    = 2;
                co.fillStyle   = prop['chart.key.interactive.highlight.chart.fill'];

                co.rect(coords[0], coords[1], coords[2], coords[3]);
            co.fill();
            co.stroke();
            
            // Reset the linewidth
            co.lineWidth    = 1;
        }




        /**
        * Register the object for redrawing
        */
        RG.Register(this);
    }