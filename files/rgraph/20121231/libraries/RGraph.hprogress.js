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
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'hprogress';
        this.coords            = [];
        this.isRGraph          = true;
        this.currentValue      = null;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;


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
            'chart.title.hpos':         null,
            'chart.title.vpos':         null,
            'chart.title.bold':         true,
            'chart.title.font':         null,
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
            'chart.labels.inner':           false,
            'chart.labels.specific':       null,
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


        /**
        * Register the object for redrawing
        */
        RGraph.Register(this);
    }


    /**
    * A generic setter
    * 
    * @param string name  The name of the property to set
    * @param string value The value of the poperty
    */
    RGraph.HProgress.prototype.Set = function (name, value)
    {
        name = name.toLowerCase();

        /**
        * This should be done first - prepend the propertyy name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        if (name == 'chart.label.inner') {
            name = 'chart.labels.inner';
        }
        
        /**
        * chart.strokestyle now sets both chart.strokestyle.inner and chart.strokestyle.outer
        */
        if (name == 'chart.strokestyle') {
            this.Set('chart.strokestyle.inner', value);
            this.Set('chart.strokestyle.outer', value);
            return;
        }

        this.properties[name] = value;
    }


    /**
    * A generic getter
    * 
    * @param string name  The name of the property to get
    */
    RGraph.HProgress.prototype.Get = function (name)
    {
        /**
        * This should be done first - prepend the property name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        if (name == 'chart.label.inner') {
            name = 'chart.labels.inner';
        }

        return this.properties[name.toLowerCase()];
    }


    /**
    * Draws the progress bar
    */
    RGraph.HProgress.prototype.Draw = function ()
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
        * Set the current value
        */
        this.currentValue = this.value;

        /**
        * This is new in May 2011 and facilitates individual gutter settings,
        * eg chart.gutter.left
        */
        this.gutterLeft   = this.Get('chart.gutter.left');
        this.gutterRight  = this.Get('chart.gutter.right');
        this.gutterTop    = this.Get('chart.gutter.top');
        this.gutterBottom = this.Get('chart.gutter.bottom');

        // Figure out the width and height
        this.width  = this.canvas.width - this.gutterLeft - this.gutterRight;
        this.height = this.canvas.height - this.gutterTop - this.gutterBottom;
        this.coords = [];

        this.Drawbar();
        this.DrawTickMarks();
        this.DrawLabels();

        this.context.stroke();
        this.context.fill();
        
        
        /**
        * Draw the bevel effect if requested
        */
        if (this.properties['chart.bevel']) {
            this.DrawBevel();
        }


        /**
        * Setup the context menu if required
        */
        if (this.Get('chart.contextmenu')) {
            RGraph.ShowContext(this);
        }


        // Draw the key if necessary
        if (this.Get('chart.key') && this.Get('chart.key').length) {
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));
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
    * Draws the bar
    */
    RGraph.HProgress.prototype.Drawbar = function ()
    {
        // Set a shadow if requested
        if (this.Get('chart.shadow')) {
            RGraph.SetShadow(this, this.Get('chart.shadow.color'), this.Get('chart.shadow.offsetx'), this.Get('chart.shadow.offsety'), this.Get('chart.shadow.blur'));
        }

        // Draw the shadow for MSIE
        if (RGraph.isOld() && this.Get('chart.shadow')) {
            this.context.fillStyle = this.Get('chart.shadow.color');
            this.context.fillRect(this.gutterLeft + this.Get('chart.shadow.offsetx'), this.gutterTop + this.Get('chart.shadow.offsety'), this.width, this.height);
        }

        // Draw the outline
        this.context.fillStyle   = this.Get('chart.background.color');
        this.context.strokeStyle = this.Get('chart.strokestyle.outer');
        this.context.strokeRect(this.gutterLeft, this.gutterTop, this.width, this.height);
        this.context.fillRect(this.gutterLeft, this.gutterTop, this.width, this.height);

        // Turn off any shadow
        RGraph.NoShadow(this);

        this.context.fillStyle   = this.Get('chart.colors')[0];
        this.context.strokeStyle = this.Get('chart.strokestyle.outer');
        
        var margin = this.Get('chart.margin');

        // Draw the actual bar itself
        var barWidth = Math.min(this.width, ((RGraph.array_sum(this.value) - this.Get('chart.min')) / (this.max - this.Get('chart.min')) ) * this.width);

        if (this.Get('chart.tickmarks.inner')) {

            var spacing = (this.canvas.width - this.gutterLeft - this.gutterRight) / this.Get('chart.numticks.inner');

            this.context.lineWidth   = 1;
            this.context.strokeStyle = this.Get('chart.strokestyle.outer');

            this.context.beginPath();
            for (var x = this.gutterLeft; x<RGraph.GetWidth(this) - this.gutterRight; x+=spacing) {
                this.context.moveTo(Math.round(x), this.gutterTop);
                this.context.lineTo(Math.round(x), this.gutterTop + 2);

                this.context.moveTo(Math.round(x), RGraph.GetHeight(this) - this.gutterBottom);
                this.context.lineTo(Math.round(x), RGraph.GetHeight(this) - this.gutterBottom - 2);
            }
            this.context.stroke();
        }
        
        /**
        * This bit draws the actual progress bar
        */
        if (typeof(this.value) == 'number') {
            this.context.beginPath();
            this.context.strokeStyle = this.Get('chart.strokestyle.inner');
            this.context.fillStyle = this.Get('chart.colors')[0];

            if (this.Get('chart.border.inner')) {
                this.context.strokeRect(this.gutterLeft, this.gutterTop + margin, barWidth, this.height - margin - margin);
            }
            this.context.fillRect(this.gutterLeft, this.gutterTop + margin, barWidth, this.height - margin - margin);

            // Store the coords
            this.coords.push([this.gutterLeft,
                              this.gutterTop + margin,
                              barWidth,
                              this.height - margin - margin]);

        } else if (typeof(this.value) == 'object') {

            this.context.beginPath();
            this.context.strokeStyle = this.Get('chart.strokestyle.inner');

            var startPoint = this.gutterLeft;
            
            for (var i=0; i<this.value.length; ++i) {

                var segmentLength = (this.value[i] / RGraph.array_sum(this.value)) * barWidth;
                this.context.fillStyle = this.Get('chart.colors')[i];

                if (this.Get('chart.border.inner')) {
                    this.context.strokeRect(startPoint, this.gutterTop + margin, segmentLength, this.height - margin - margin);
                }
                this.context.fillRect(startPoint, this.gutterTop + margin, segmentLength, this.height - margin - margin);


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
        if (this.Get('chart.arrows')) {
            var x = this.gutterLeft + barWidth;
            var y = this.gutterTop;
            
            this.context.lineWidth = 1;
            this.context.fillStyle = 'black';
            this.context.strokeStyle = 'black';

            this.context.beginPath();
                this.context.moveTo(x, y - 3);
                this.context.lineTo(x + 2, y - 7);
                this.context.lineTo(x - 2, y - 7);
            this.context.closePath();

            this.context.stroke();
            this.context.fill();

            this.context.beginPath();
                this.context.moveTo(x, y + this.height + 4);
                this.context.lineTo(x + 2, y + this.height + 9);
                this.context.lineTo(x - 2, y + this.height + 9);
            this.context.closePath();

            this.context.stroke();
            this.context.fill()


            /**
            * Draw the "in-bar" label
            */
            if (this.Get('chart.label.inner')) {
                this.context.beginPath();
                this.context.fillStyle = 'black';
                RGraph.Text(this.context, this.Get('chart.text.font'), this.Get('chart.text.size') + 2, this.gutterLeft + barWidth + 5, RGraph.GetHeight(this) / 2, String(this.Get('chart.units.pre') + this.value + this.Get('chart.units.post')), 'center', 'left');
                this.context.fill();
            }
        }

    }

    /**
    * The function that draws the tick marks. Apt name...
    */
    RGraph.HProgress.prototype.DrawTickMarks = function ()
    {
        var context = this.context;

        context.strokeStyle = this.Get('chart.tickmarks.color');

        if (this.Get('chart.tickmarks')) {
            
            this.context.beginPath();        

            // This is used by the label function below
            this.tickInterval = this.width / this.Get('chart.numticks');
            
            var start   = this.Get('chart.tickmarks.zerostart') ? 0 : this.tickInterval;

            if (this.Get('chart.labels.position') == 'top') {
                for (var i=this.gutterLeft + start; i<=(this.width + this.gutterLeft + 0.1); i+=this.tickInterval) {
                    context.moveTo(Math.round(i), this.gutterTop);
                    context.lineTo(Math.round(i), this.gutterTop - 4);
                }

            } else {

                for (var i=this.gutterLeft + start; i<=(this.width + this.gutterLeft + 0.1); i+=this.tickInterval) {
                    context.moveTo(Math.round(i), this.gutterTop + this.height);
                    context.lineTo(Math.round(i), this.gutterTop + this.height + 4);
                }
            }

            this.context.stroke();
        }
    }


    /**
    * The function that draws the labels
    */
    RGraph.HProgress.prototype.DrawLabels = function ()
    {
        if (!RGraph.is_null(this.Get('chart.labels.specific'))) {
            return this.DrawSpecificLabels();
        }

        var context = this.context;
        this.context.fillStyle = this.Get('chart.text.color');

        var xPoints = [];
        var yPoints = [];

        for (i=0; i<this.Get('chart.numticks'); i++) {

            var font       = this.Get('chart.text.font');
            var size       = this.Get('chart.text.size');

            if (this.Get('chart.labels.position') == 'top') {
                var x = this.width * (i/this.Get('chart.numticks')) + this.gutterLeft + (this.width / this.Get('chart.numticks'));
                var y = this.gutterTop - 6;
                var valign = 'bottom';
            } else {
                var x = this.width * (i/this.Get('chart.numticks')) + this.gutterLeft + (this.width / this.Get('chart.numticks'));
                var y = this.height + this.gutterTop + 4;
                var valign = 'top'; // Doesn't appear to be being used for regular labels
            }

            RGraph.Text(this.context,font,size,x,y, RGraph.number_format(this, (((this.max - this.Get('chart.min')) / this.Get('chart.numticks')) * (i + 1) + this.Get('chart.min')).toFixed(this.Get('chart.scale.decimals')), this.Get('chart.units.pre'), this.Get('chart.units.post')), valign,'center');
        }
        
        if (this.Get('chart.tickmarks.zerostart')) {
            if (this.Get('chart.labels.position') == 'top') {
                RGraph.Text(this.context,font,size,this.gutterLeft,this.gutterTop - 6,this.Get('chart.units.pre') + Number(this.Get('chart.min')).toFixed(this.Get('chart.scale.decimals')) + this.Get('chart.units.post'),'bottom','center');
            } else {
                RGraph.Text(this.context,font,size,this.gutterLeft,this.canvas.height - this.gutterBottom + 5,this.Get('chart.units.pre') + Number(this.Get('chart.min')).toFixed(this.Get('chart.scale.decimals')) + this.Get('chart.units.post'),'top','center');
            }
        }



        // Draw the title text
        if (this.Get('chart.title')) {
            var vpos = this.gutterTop + this.Get('chart.text.size');
            
            if (this.Get('chart.labels.position') == 'top' && this.Get('chart.title.vpos') == null) {
                this.Set('chart.title.vpos', (this.canvas.height / this.gutterTop) - (this.gutterBottom / this.gutterTop));
            }

            RGraph.DrawTitle(this,
                             this.Get('chart.title'),
                             vpos,
                             0,
                             this.Get('chart.title.size') ? this.Get('chart.title.size') : this.Get('chart.text.size') + 2);
        }
    }


    /**
    * Returns the focused bar
    * 
    * @param event e The event object
    */
    RGraph.HProgress.prototype.getShape =
    RGraph.HProgress.prototype.getBar = function (e)
    {
        var mouseCoords = RGraph.getMouseXY(e)

        for (var i=0; i<this.coords.length; i++) {

            var mouseCoords = RGraph.getMouseXY(e);
            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];
            var left   = this.coords[i][0];
            var top    = this.coords[i][1];
            var width  = this.coords[i][2];
            var height = this.coords[i][3];
            var idx    = i;

            if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {
            
                var tooltip = RGraph.parseTooltipText(this.Get('chart.tooltips'), idx);
            
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
    RGraph.HProgress.prototype.getValue = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
            
        var value = (mouseXY[0] - this.gutterLeft) / this.width;
            value *= this.max - this.Get('chart.min');
            value += this.Get('chart.min');
            
        if (mouseXY[0] < this.gutterLeft) {
            value = this.Get('chart.min');
        }
        if (mouseXY[0] > (this.canvas.width - this.gutterRight) ) {
            value = this.max
        }

        return value;
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.HProgress.prototype.Highlight = function (shape)
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
    RGraph.HProgress.prototype.getObjectByXY = function (e)
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
    * This method handles the adjusting calculation for when the mouse is moved
    * 
    * @param object e The event object
    */
    RGraph.HProgress.prototype.Adjusting_mousemove = function (e)
    {
        /**
        * Handle adjusting for the HProgress
        */
        if (RGraph.Registry.Get('chart.adjusting') && RGraph.Registry.Get('chart.adjusting').uid == this.uid) {

            var mouseXY = RGraph.getMouseXY(e);
            var value   = this.getValue(e);
            
            if (typeof(value) == 'number') {

                // Fire the onadjust event
                RGraph.FireCustomEvent(this, 'onadjust');
    
                this.value = Number(value.toFixed(this.Get('chart.scale.decimals')));
                RGraph.Redraw();
            }
        }
    }



    /**
    * Draws chart.labels.specific
    */
    RGraph.HProgress.prototype.DrawSpecificLabels = function ()
    {
        var labels = this.Get('chart.labels.specific');
        
        if (labels) {

            var font   = this.Get('chart.text.font');
            var size   = this.Get('chart.text.size');
            var valign = (this.Get('chart.labels.position') == 'top' ? 'bottom' : 'top');
            var step   = this.width / (labels.length - 1);
    
            this.context.beginPath();
                this.context.fillStyle = this.Get('chart.text.color');
                for (var i=0; i<labels.length; ++i) {
                    RGraph.Text(this.context,
                                font,
                                size,
                                this.gutterLeft + (step * i),
                                this.Get('chart.labels.position') == 'top' ? this.gutterTop - 7  : this.canvas.height - this.gutterBottom + 7,
                                labels[i],
                                valign,
                                'center');
                }
            this.context.fill();
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
    RGraph.HProgress.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
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
    RGraph.HProgress.prototype.getXCoord = function (value)
    {
        var min = this.properties['chart.min'];

        if (value < min || value > this.max) {
            return null;
        }

        var barWidth = this.canvas.width - this.properties['chart.gutter.left'] - this.properties['chart.gutter.right'];
        var coord = ((value - min) / (this.max - min)) * barWidth;
        coord = this.properties['chart.gutter.left'] + coord;
        
        return coord;
    }



    /**
    * This returns true/false as to whether the cursor is over the chart area.
    * The cursor does not necessarily have to be over the bar itself.
    */
    RGraph.HProgress.prototype.overChartArea = function  (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];
        
        if (   mouseX >= this.properties['chart.gutter.left']
            && mouseX <= (this.canvas.width - this.properties['chart.gutter.right'])
            && mouseY >= this.properties['chart.gutter.top']
            && mouseY <= (this.canvas.height - this.properties['chart.gutter.bottom'])
            ) {
            
            return true;
        }

        return false;
    }



    /**
    * 
    */
    RGraph.HProgress.prototype.parseColors = function ()
    {
        var props  = this.properties;
        var colors = props['chart.colors'];

        for (var i=0; i<colors.length; ++i) {
            colors[i] = this.parseSingleColorForGradient(colors[i]);
        }

        props['chart.tickmarks.color']       = this.parseSingleColorForGradient(props['chart.tickmarks.color']);
        props['chart.strokestyle.inner']     = this.parseSingleColorForGradient(props['chart.strokestyle.inner']);
        props['chart.strokestyle.outer']     = this.parseSingleColorForGradient(props['chart.strokestyle.outer']);
        props['chart.highlight.fill']        = this.parseSingleColorForGradient(props['chart.highlight.fill']);
        props['chart.highlight.stroke']      = this.parseSingleColorForGradient(props['chart.highlight.stroke']);
        props['chart.background.color']      = this.parseSingleColorForGradient(props['chart.background.color']);
    }



    /**
    * This parses a single color value
    */
    RGraph.HProgress.prototype.parseSingleColorForGradient = function (color)
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



    /**
    * Draws the bevel effect
    */
    RGraph.HProgress.prototype.DrawBevel = function ()
    {
        // In case of multiple segments - this adds up all the lengths
        for (var i=0,len=0; i<this.coords.length; ++i) len += this.coords[i][2];

        this.context.save();
            // Draw a path to clip to
            this.context.beginPath();
                this.context.rect(this.coords[0][0], this.coords[0][1], len, this.coords[0][3]);
                this.context.clip();
            
            // Now draw the rect with a shadow
            this.context.beginPath();
                
                this.context.shadowColor = 'black';
                this.context.shadowOffsetX = 0;
                this.context.shadowOffsetY = 0;
                this.context.shadowBlur    = 15;
                
                this.context.lineWidth = 2;
                
                this.context.rect(this.coords[0][0] - 1, this.coords[0][1] - 1, len + 2, this.coords[0][3] + 2);
            
            this.context.stroke();

        this.context.restore();
    }