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
    RGraph.Funnel = function (id, data)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'funnel';
        this.coords            = [];
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.coordsText        = [];


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
            'chart.key.position.gutter.boxed': false,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.key.interactive':        false,
            'chart.key.interactive.highlight.chart.stroke': 'black',
            'chart.key.interactive.highlight.chart.fill': 'rgba(255,255,255,0.7)',
            'chart.key.interactive.highlight.label': 'rgba(255,0,0,0.2)',
            'chart.key.text.color':         'black',
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
            name = name.toLowerCase();
    
            /**
            * This should be done first - prepend the propertyy name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }
    
            prop[name] = value;

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
    
            // This stops the coords array from growing
            this.coords = [];
    
            RG.DrawTitle(this, prop['chart.title'], this.gutterTop, null, prop['chart.title.size'] ? prop['chart.title.size'] : prop['chart.text.size'] + 2);
            this.DrawFunnel();

            
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
            }
    
    
    
            /**
            * Draw the labels on the chart
            */
            this.DrawLabels();

            
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
        * This function actually draws the chart
        */
        this.DrawFunnel = function ()
        {
            var width     = ca.width - this.gutterLeft - this.gutterRight;
            var height    = ca.height - this.gutterTop - this.gutterBottom;
            var total     = RG.array_max(this.data);
            var accheight = this.gutterTop;
    
    
            /**
            * Loop through each segment to draw
            */
            
            // Set a shadow if it's been requested
            if (prop['chart.shadow']) {
                co.shadowColor   = prop['chart.shadow.color'];
                co.shadowBlur    = prop['chart.shadow.blur'];
                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                co.shadowOffsetY = prop['chart.shadow.offsety'];
            }

            for (i=0,len=this.data.length; i<len; ++i) {
    
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

                    co.beginPath();
    
                        co.strokeStyle = prop['chart.strokestyle'];
                        co.fillStyle   = prop['chart.colors'][i];
    
                        co.moveTo(x1, y1);
                        co.lineTo(x2, y2);
                        co.lineTo(x3, y3);
                        co.lineTo(x4, y4);
    
                    co.closePath();

                    /**
                    * Store the coordinates
                    */
                    this.coords.push([x1, y1, x2, y2, x3, y3, x4, y4]);
                }
    
    
                // The redrawing if the shadow is on will do the stroke
                if (!prop['chart.shadow']) {
                    co.stroke();
                }
    
                co.fill();
    
                accheight += curheight;
            }

            /**
            * If the shadow is enabled, redraw every segment, in order to allow for shadows going upwards
            */
            if (prop['chart.shadow']) {
            
                RG.NoShadow(this);
            
                for (i=0; i<this.coords.length; ++i) {
                
                    co.strokeStyle = prop['chart.strokestyle'];
                    co.fillStyle = prop['chart.colors'][i];
            
                    co.beginPath();
                        co.moveTo(this.coords[i][0], this.coords[i][1]);
                        co.lineTo(this.coords[i][2], this.coords[i][3]);
                        co.lineTo(this.coords[i][4], this.coords[i][5]);
                        co.lineTo(this.coords[i][6], this.coords[i][7]);
                    co.closePath();

                    co.stroke();
                    co.fill();
                }
            }

            /**
            * Lastly, draw the key if necessary
            */
            if (prop['chart.key'] && prop['chart.key'].length) {
                RG.DrawKey(this, prop['chart.key'], prop['chart.colors']);
            }
        }




        /**
        * Draws the labels
        */
        this.DrawLabels = function ()
        {
            /**
            * Draws the labels
            */
            if (prop['chart.labels'] && prop['chart.labels'].length > 0) {
    
                var font    = prop['chart.text.font'];
                var size    = prop['chart.text.size'];
                var color   = prop['chart.text.color'];
                var labels  = prop['chart.labels'];
                var halign  = prop['chart.text.halign'] == 'left' ? 'left' : 'center';
                var bgcolor = prop['chart.text.boxed'] ? 'white' : null;
    
                if (typeof prop['chart.labels.x'] == 'number') {
                    var x = prop['chart.labels.x'];
                } else {
                    var x = halign == 'left' ? (this.gutterLeft - 15) : ((ca.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;
                }

                for (var j=0; j<this.coords.length; ++j) {  // MUST be "j"
    
                    co.beginPath();
                    
                    // Set the color back to black
                    co.strokeStyle = 'black';
                    co.fillStyle = color;
                    
                    // Turn off any shadow
                    RG.NoShadow(this);
                    
                    var label = labels[j];
    
                    RG.Text2(this,{'font':font,
                                   'size':size,
                                   'x':x,
                                   'y':this.coords[j][1],
                                   'text':label,
                                   'valign':'center',
                                   'halign':halign,
                                   'bounding': prop['chart.text.boxed'],
                                   'boundingFill':bgcolor,
                                   'tag': 'labels'
                                  });
                    
                    if (prop['chart.labels.sticks']) {
                        /**
                        * Measure the text
                        */
                        co.font = size + 'pt ' + font;
                        var labelWidth    = co.measureText(label).width;
        
                        /**
                        * Draw the horizontal indicator line
                        */
                        co.beginPath();
                            co.strokeStyle = 'gray';
    
                            co.moveTo(x + labelWidth + 10, Math.round(this.coords[j][1]));
                            co.lineTo(this.coords[j][0] - 10, Math.round(this.coords[j][1]));
                        co.stroke();
                    }
                }
    
    
    
                /**
                * This draws the last labels if defined
                */
                var lastLabel = labels[j];
    
                if (lastLabel) {
    
                    RG.Text2(this,{'font':font,
                                   'size':size,
                                   'x':x,
                                   'y':this.coords[j - 1][5],
                                   'text':lastLabel,
                                   'valign':'center',
                                   'halign':halign,
                                   'bounding': prop['chart.text.boxed'],
                                   'boundingFill':bgcolor,
                                   'tag': 'labels'
                                  });
    
                    if (prop['chart.labels.sticks']) {

                        /**
                        * Measure the text
                        */
                        co.font = size + 'pt ' + font;
                        var labelWidth    = co.measureText(lastLabel).width;
        
                        /**
                        * Draw the horizontal indicator line
                        */
                        co.beginPath();
                            co.strokeStyle = 'gray';
                            co.moveTo(x + labelWidth + 10, Math.round(this.coords[j - 1][7]));
                            co.lineTo(this.coords[j - 1][0] - 10, Math.round(this.coords[j - 1][7]));
                        co.stroke();
                    }
                }
            }
        }




        /**
        * Gets the appropriate segment that has been highlighted
        */
        this.getShape =
        this.getSegment = function (e)
        {
            //var canvas = ca = e.target;
            //var co          = this.context;
            //var prop        = this.properties;
            var coords      = this.coords;
            var mouseCoords = RG.getMouseXY(e);
            var x           = mouseCoords[0];
            var y           = mouseCoords[1];        
    
            for (i=0,len=coords.length; i<len; ++i) {
            
                var segment = coords[i]
    
                // Path testing
                co.beginPath();
                    co.moveTo(segment[0], segment[1]);
                    co.lineTo(segment[2], segment[3]);
                    co.lineTo(segment[4], segment[5]);
                    co.lineTo(segment[6], segment[7]);
                    co.lineTo(segment[8], segment[9]);
    
                if (co.isPointInPath(x, y)) {
                    var tooltip = RGraph.parseTooltipText(prop['chart.tooltips'], i);
                    return {0: this, 1: coords, 2: i, 'object': this, 'coords': segment, 'index': i, 'tooltip': tooltip};
                }
            }
    
            return null;
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
                var coords = shape['coords'];
                
                co.beginPath();
                    co.strokeStyle = prop['chart.highlight.stroke'];
                    co.fillStyle   = prop['chart.highlight.fill'];
        
                    co.moveTo(coords[0], coords[1]);
                    co.lineTo(coords[2], coords[3]);
                    co.lineTo(coords[4], coords[5]);
                    co.lineTo(coords[6], coords[7]);
                co.closePath();
                
                co.stroke();
                co.fill();
            }
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
            var mouseXY = RGraph.getMouseXY(e);
    
            if (
                   mouseXY[0] > prop['chart.gutter.left']
                && mouseXY[0] < (ca.width - prop['chart.gutter.right'])
                && mouseXY[1] > prop['chart.gutter.top']
                && mouseXY[1] < (ca.height - prop['chart.gutter.bottom'])
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
            var canvasXY   = RG.getCanvasXY(ca);
            var gutterLeft = prop['chart.gutter.left'];
            var gutterTop  = prop['chart.gutter.top'];
            var width      = tooltip.offsetWidth;
            var height     = tooltip.offsetHeight;
    
            // Set the top position
            tooltip.style.left = 0;
            tooltip.style.top  = canvasXY[1] + y1 + ((y3 - y2) / 2) - height - 7 + 'px';
            
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
        this.parseColors = function ()
        {
            var colors = prop['chart.colors'];
    
            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForHorizontalGradient(colors[i]);
            }
            
            var keyColors = prop['chart.key.colors'];
            if (keyColors) {
                for (var i=0; i<keyColors.length; ++i) {
                    keyColors[i] = this.parseSingleColorForHorizontalGradient(keyColors[i]);
                }
            }
            
            
            prop['chart.strokestyle'] = this.parseSingleColorForVerticalGradient(prop['chart.strokestyle']);
            prop['chart.highlight.stroke'] = this.parseSingleColorForHorizontalGradient(prop['chart.highlight.stroke']);
            prop['chart.highlight.fill']   = this.parseSingleColorForHorizontalGradient(prop['chart.highlight.fill']);
        }




        /**
        * This parses a single color value
        */
        this.parseSingleColorForHorizontalGradient = function (color)
        {
            if (!color || typeof(color) != 'string') {
                return color;
            }

            if (color.match(/^gradient\((.*)\)$/i)) {
                
                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = co.createLinearGradient(prop['chart.gutter.left'],0,ca.width - prop['chart.gutter.right'],0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RGraph.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
                
            return grad ? grad : color;
        }




        /**
        * This parses a single color value
        */
        this.parseSingleColorForVerticalGradient = function (color)
        {
            if (!color || typeof(color) != 'string') {
                return color;
            }
    
            if (color.match(/^gradient\((.*)\)$/i)) {
                
                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = co.createLinearGradient(0, prop['chart.gutter.top'],0,ca.height - prop['chart.gutter.bottom']);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RGraph.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
                
            return grad ? grad : color;
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
            
            if (coords && coords.length == 8) {
                var pre_linewidth = co.lineWidth;

                co.lineWidth   = 2;
                co.strokeStyle = prop['chart.key.interactive.highlight.chart.stroke'];
                co.fillStyle   = prop['chart.key.interactive.highlight.chart.fill'];
                
                co.beginPath();
                    co.moveTo(coords[0], coords[1]);
                    co.lineTo(coords[2], coords[3]);
                    co.lineTo(coords[4], coords[5]);
                    co.lineTo(coords[6], coords[7]);
                co.closePath();
                co.fill();
                co.stroke();
                
                // Reset the linewidth
                co.lineWidth = pre_linewidth;
            }
        }




        /**
        * Always now regsiter the object
        */
        RG.Register(this);
    }