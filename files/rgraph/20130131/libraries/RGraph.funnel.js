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
    * The bar chart constructor
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.Funnel = function (id, data)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'funnel';
        this.coords            = [];
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);


        // Check for support
        if (!this.canvas) {
            alert('[FUNNEL] No canvas support');
            return;
        }

        /**
        * The funnel charts properties
        */
        this.properties = {
            'chart.strokestyle':           'rgba(0,0,0,0)',
            'chart.gutter.left':           25,
            'chart.gutter.right':          25,
            'chart.gutter.top':            25,
            'chart.gutter.bottom':         25,
            'chart.labels':                null,
            'chart.labels.sticks':         false,
            'chart.labels.x':              null,
            'chart.title':                 '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':            null,
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.colors':                ['Gradient(white:red)','Gradient(white:green)','Gradient(white:gray)','Gradient(white:blue)','Gradient(white:black)','Gradient(white:gray)','Gradient(white:pink)','Gradient(white:blue)','Gradient(white:yellow)','Gradient(white:green)','Gradient(white:red)'],
            'chart.text.size':             10,
            'chart.text.boxed':            true,
            'chart.text.halign':           'left',
            'chart.text.color':            'black',
            'chart.text.font':             'Arial',
            'chart.contextmenu':           null,
            'chart.shadow':                false,
            'chart.shadow.color':          '#666',
            'chart.shadow.blur':           3,
            'chart.shadow.offsetx':        3,
            'chart.shadow.offsety':        3,
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
            'chart.tooltips':               null,
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.event':         'onclick',
            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',
            'chart.tooltips.highlight':     true,
            'chart.annotatable':           false,
            'chart.annotate.color':        'black',
            'chart.zoom.factor':           1.5,
            'chart.zoom.fade.in':          true,
            'chart.zoom.fade.out':         true,
            'chart.zoom.factor':           1.5,
            'chart.zoom.fade.in':          true,
            'chart.zoom.fade.out':         true,
            'chart.zoom.hdir':             'right',
            'chart.zoom.vdir':             'down',
            'chart.zoom.frames':            25,
            'chart.zoom.delay':             16.666,
            'chart.zoom.shadow':            true,
            'chart.zoom.background':        true,
            'chart.zoom.action':            'zoom',
            'chart.resizable':              false,
            'chart.events.click':           null,
            'chart.events.mousemove':       null
        }

        // Store the data
        this.data = data;


        /**
        * Create the dollar objects so that functions can be added to them
        */
        for (var i=0; i<data.length; ++i) {
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
        * Always now regsiter the object
        */
        RGraph.Register(this);
    }


    /**
    * A setter
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.Funnel.prototype.Set = function (name, value)
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
    * A getter
    * 
    * @param name  string The name of the property to get
    */
    RGraph.Funnel.prototype.Get = function (name)
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
    * The function you call to draw the bar chart
    */
    RGraph.Funnel.prototype.Draw = function ()
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

        // This stops the coords array from growing
        this.coords = [];

        RGraph.DrawTitle(this, this.Get('chart.title'), this.gutterTop, null, this.Get('chart.title.size') ? this.Get('chart.title.size') : this.Get('chart.text.size') + 2);
        this.DrawFunnel();

        
        /**
        * Setup the context menu if required
        */
        if (this.Get('chart.contextmenu')) {
            RGraph.ShowContext(this);
        }



        /**
        * Draw the labels on the chart
        */
        this.DrawLabels();

        
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
    * This function actually draws the chart
    */
    RGraph.Funnel.prototype.DrawFunnel = function ()
    {
        var context   = this.context;
        var canvas    = this.canvas;
        var width     = this.canvas.width - this.gutterLeft - this.gutterRight;
        var height    = this.canvas.height - this.gutterTop - this.gutterBottom;
        var total     = RGraph.array_max(this.data);
        var accheight = this.gutterTop;


        /**
        * Loop through each segment to draw
        */
        
        // Set a shadow if it's been requested
        if (this.Get('chart.shadow')) {
            context.shadowColor   = this.Get('chart.shadow.color');
            context.shadowBlur    = this.Get('chart.shadow.blur');
            context.shadowOffsetX = this.Get('chart.shadow.offsetx');
            context.shadowOffsetY = this.Get('chart.shadow.offsety');
        }

        for (i=0; i<(this.data.length); ++i) {

            var firstvalue = this.data[0];
            var firstwidth = (firstvalue / total) * width;
            var curvalue   = this.data[i];
            var curwidth   = (curvalue / total) * width;
            var curheight  = height / this.data.length;
            var halfCurWidth = (curwidth / 2);
            var nextvalue  = this.data[i + 1];
            var nextwidth  = this.data[i + 1] ? (nextvalue / total) * width : null;
            var halfNextWidth = (nextwidth / 2);
            var center        = this.gutterLeft + (firstwidth / 2);

            var x1 = center - halfCurWidth;
            var y1 = accheight;
            var x2 = center + halfCurWidth;
            var y2 = accheight;
            var x3 = center + halfNextWidth;
            var y3 = accheight + curheight;
            var x4 = center - halfNextWidth;
            var y4 = accheight + curheight;

            if (nextwidth && i < this.data.length - 1) {

                context.beginPath();

                    context.strokeStyle = this.properties['chart.strokestyle'];
                    context.fillStyle   = this.properties['chart.colors'][i];

                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.lineTo(x3, y3);
                    context.lineTo(x4, y4);

                context.closePath();

                /**
                * Store the coordinates
                */
                this.coords.push([x1, y1, x2, y2, x3, y3, x4, y4]);
            }


            // The redrawing if the shadow is on will do the stroke
            if (!this.Get('chart.shadow')) {
                context.stroke();
            }

            context.fill();

            accheight += curheight;
        }

        /**
        * If the shadow is enabled, redraw every segment, in order to allow for shadows going upwards
        */
        if (this.Get('chart.shadow')) {
        
            RGraph.NoShadow(this);
        
            for (i=0; i<this.coords.length; ++i) {
            
                context.strokeStyle = this.Get('chart.strokestyle');
                context.fillStyle = this.Get('chart.colors')[i];
        
                context.beginPath();
                    context.moveTo(this.coords[i][0], this.coords[i][1]);
                    context.lineTo(this.coords[i][2], this.coords[i][3]);
                    context.lineTo(this.coords[i][4], this.coords[i][5]);
                    context.lineTo(this.coords[i][6], this.coords[i][7]);
                context.closePath();
                
                context.stroke();
                context.fill();
            }
        }
        
        /**
        * Lastly, draw the key if necessary
        */
        if (this.Get('chart.key') && this.Get('chart.key').length) {
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));
        }
    }
    
    /**
    * Draws the labels
    */
    RGraph.Funnel.prototype.DrawLabels = function ()
    {
        /**
        * Draws the labels
        */
        if (this.Get('chart.labels') && this.Get('chart.labels').length > 0) {

            var context = this.context;
            var font    = this.Get('chart.text.font');
            var size    = this.Get('chart.text.size');
            var color   = this.Get('chart.text.color');
            var labels  = this.Get('chart.labels');
            var halign  = this.Get('chart.text.halign') == 'left' ? 'left' : 'center';
            var bgcolor = this.Get('chart.text.boxed') ? 'white' : null;

            if (typeof(this.Get('chart.labels.x')) == 'number') {
                var x = this.Get('chart.labels.x');
            } else {
                var x = halign == 'left' ? (this.gutterLeft - 15) : ((this.canvas.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;
            }

            for (var j=0; j<this.coords.length; ++j) {  // MUST be "j"

                context.beginPath();
                
                // Set the color back to black
                context.strokeStyle = 'black';
                context.fillStyle = color;
                
                // Turn off any shadow
                RGraph.NoShadow(this);
                
                var label = labels[j];

                RGraph.Text(context,
                            font,
                            size,
                            x,
                            this.coords[j][1],
                            label,
                            'center',
                            halign,
                            this.Get('chart.text.boxed'),
                            null,
                            bgcolor);
                
                if (this.Get('chart.labels.sticks')) {
                    /**
                    * Measure the text
                    */
                    this.context.font = size + 'pt ' + font;
                    var labelWidth    = this.context.measureText(label).width;
    
                    /**
                    * Draw the horizontal indicator line
                    */
                    this.context.beginPath();
                        this.context.strokeStyle = 'gray';

                        this.context.moveTo(x + labelWidth + 10, Math.round(this.coords[j][1]));
                        this.context.lineTo(this.coords[j][0] - 10, Math.round(this.coords[j][1]));
                    this.context.stroke();
                }
            }



            /**
            * This draws the last labels if defined
            */
            var lastLabel = labels[j];

            if (lastLabel) {
                
                RGraph.Text(context, font, size,x,this.coords[j - 1][5],lastLabel,'center',halign,this.Get('chart.text.boxed'),null,bgcolor);

                if (this.Get('chart.labels.sticks')) {
                    /**
                    * Measure the text
                    */
                    this.context.font = size + 'pt ' + font;
                    var labelWidth    = this.context.measureText(lastLabel).width;
    
                    /**
                    * Draw the horizontal indicator line
                    */
                    this.context.beginPath();
                        this.context.strokeStyle = 'gray';
                        this.context.moveTo(x + labelWidth + 10, Math.round(this.coords[j - 1][7]));
                        this.context.lineTo(this.coords[j - 1][0] - 10, Math.round(this.coords[j - 1][7]));
                    this.context.stroke();
                }
            }
        }
    }


    /**
    * Gets the appropriate segment that has been highlighted
    */
    RGraph.Funnel.prototype.getShape =
    RGraph.Funnel.prototype.getSegment = function (e)
    {
        var canvas      = e.target;
        var mouseCoords = RGraph.getMouseXY(e);
        var coords      = this.coords;
        var x           = mouseCoords[0];
        var y           = mouseCoords[1];        

        for (i=0; i<coords.length; ++i) {

            // Path testing
            this.context.beginPath();
                this.context.moveTo(coords[i][0], coords[i][1]);
                this.context.lineTo(coords[i][2], coords[i][3]);
                this.context.lineTo(coords[i][4], coords[i][5]);
                this.context.lineTo(coords[i][6], coords[i][7]);
                this.context.lineTo(coords[i][8], coords[i][9]);

            if (this.context.isPointInPath(x, y)) {
                var tooltip = RGraph.parseTooltipText(this.Get('chart.tooltips'), i);
                return {0: this, 1: coords, 2: i, 'object': this, 'coords': coords[i], 'index': i, 'tooltip': tooltip};
            }
        }

        return null;
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Funnel.prototype.Highlight = function (shape)
    {
        if (this.Get('chart.tooltips.highlight')) {
            // Add the new highlight
            var coords = shape['coords'];
            
            this.context.beginPath();
                this.context.strokeStyle = this.Get('chart.highlight.stroke');
                this.context.fillStyle   = this.Get('chart.highlight.fill');
    
                this.context.moveTo(coords[0], coords[1]);
                this.context.lineTo(coords[2], coords[3]);
                this.context.lineTo(coords[4], coords[5]);
                this.context.lineTo(coords[6], coords[7]);
            this.context.closePath();
            
            this.context.stroke();
            this.context.fill();
        }
    }



    /**
    * The getObjectByXY() worker method. Don't call this call:
    * 
    * RGraph.ObjectRegistry.getObjectByXY(e)
    * 
    * @param object e The event object
    */
    RGraph.Funnel.prototype.getObjectByXY = function (e)
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
    RGraph.Funnel.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var coords = obj.coords[tooltip.__index__];

        var x1 = coords[0];
        var y1 = coords[1];
        var x2 = coords[2];
        var y2 = coords[3];
        var x3 = coords[4];
        var y3 = coords[5];
        var x4 = coords[6];
        var y4 = coords[7];
        
        var coordW     = x2 - x1;
        var coordX     = x1 + (coordW / 2);
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var gutterLeft = obj.Get('chart.gutter.left');
        var gutterTop  = obj.Get('chart.gutter.top');
        var width      = tooltip.offsetWidth;
        var height     = tooltip.offsetHeight;

        // Set the top position
        tooltip.style.left = 0;
        tooltip.style.top  = canvasXY[1] + y1 - height - 7 + 'px';
        
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
        if ((canvasXY[0] + coordX - (width / 2)) < 5) {
            tooltip.style.left = (canvasXY[0] + coordX - (width * 0.1)) + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + coordX + (width / 2)) > document.body.offsetWidth) {
            tooltip.style.left = canvasXY[0] + coordX - (width * 0.9) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + coordX - (width / 2)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Funnel.prototype.parseColors = function ()
    {
        var props  = this.properties;
        var colors = props['chart.colors'];

        for (var i=0; i<colors.length; ++i) {
            colors[i] = this.parseSingleColorForHorizontalGradient(colors[i]);
        }
        
        var keyColors = props['chart.key.colors'];
        if (keyColors) {
            for (var i=0; i<keyColors.length; ++i) {
                keyColors[i] = this.parseSingleColorForHorizontalGradient(keyColors[i]);
            }
        }
        
        
        props['chart.strokestyle'] = this.parseSingleColorForVerticalGradient(props['chart.strokestyle']);
        props['chart.highlight.stroke'] = this.parseSingleColorForHorizontalGradient(props['chart.highlight.stroke']);
        props['chart.highlight.fill']   = this.parseSingleColorForHorizontalGradient(props['chart.highlight.fill']);
    }



    /**
    * This parses a single color value
    */
    RGraph.Funnel.prototype.parseSingleColorForHorizontalGradient = function (color)
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
    * This parses a single color value
    */
    RGraph.Funnel.prototype.parseSingleColorForVerticalGradient = function (color)
    {        
        if (!color || typeof(color) != 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {
            
            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = this.context.createLinearGradient(0, this.properties['chart.gutter.top'],0,this.canvas.height - this.properties['chart.gutter.bottom']);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }
            
        return grad ? grad : color;
    }