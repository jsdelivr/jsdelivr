    /**
    * o-------------------------------------------------------------------------------o
    * | This file is part of the RGraph package. RGraph is Free software, licensed    |
    * | under the MIT license - so it's free to use for all purposes. Extended        |
    * | support is available if required and donations are always welcome! You can    |
    * | read more here:                                                               |
    * |                         http://www.rgraph.net/support                         |
    * o-------------------------------------------------------------------------------o
    */
    
    /**
    * Having this here means that the RGraph libraries can be included in any order, instead of you having
    * to include the common core library first.
    */
    if (typeof(RGraph) == 'undefined') RGraph = {};
    if (typeof(RGraph.Drawing) == 'undefined') RGraph.Drawing = {};




    /**
    * The constructor. This function sets up the object. It takes the ID (the HTML attribute) of the canvas as the
    * first argument, then the coordinates of the coords of the shape
    * 
    * @param string id     The canvas tag ID
    * @param number coords The coordinates of the shape
    */
    RGraph.Drawing.Poly = function (id, coords)
    {
        this.id                = id;
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.colorsParsed      = false;
        this.canvas.__object__ = this;
        this.coords            = coords;
        this.coordsText        = [];


        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.poly';


        /**
        * This facilitates easy object identification, and should always be true
        */
        this.isRGraph = true;


        /**
        * This adds a uid to the object that you can use for identification purposes
        */
        this.uid = RGraph.CreateUID();


        /**
        * This adds a UID to the canvas for identification purposes
        */
        this.canvas.uid = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();


        /**
        * This does a few things, for example adding the .fillText() method to the canvas 2D context when
        * it doesn't exist. This facilitates the graphs to be still shown in older browser (though without
        * text obviously). You'll find the function in RGraph.common.core.js
        */
        RGraph.OldBrowserCompat(this.context);


        /**
        * Some example background properties
        */
        this.properties =
        {
            'chart.strokestyle':             'black',
            'chart.fillstyle':               'red',
            'chart.events.click':            null,
            'chart.events.mousemove':        null,
            'chart.tooltips':                null,
            'chart.tooltips.override':       null,
            'chart.tooltips.effect':         'fade',
            'chart.tooltips.css.class':      'RGraph_tooltip',
            'chart.tooltips.event':          'onclick',
            'chart.tooltips.highlight':      true,
            'chart.highlight.stroke':        'rgba(0,0,0,0)',
            'chart.highlight.fill':          'rgba(255,255,255,0.7)',
            'chart.shadow':                  false,
            'chart.shadow.color':            'rgba(0,0,0,0.2)',
            'chart.shadow.offsetx':          3,
            'chart.shadow.offsety':          3,
            'chart.shadow.blur':             5
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.POLY] No canvas support');
            return;
        }
        
        /**
        * Create the dollar object so that functions can be added to them
        */
        this.$0 = {};


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
        var Path = RGraph.Path;
        //var $jq  = jQuery;




        //////////////////////////////////// METHODS ///////////////////////////////////////




        /**
        * A setter method for setting properties.
        * 
        * @param name  string The name of the property to set
        * @param value mixed  The value of the property
        */
        this.Set = function (name, value)
        {
            name = name.toLowerCase();
    
            /**
            * This should be done first - prepend the property name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }
    
            prop[name] = value;
    
            return this;
        }




        /**
        * A getter method for retrieving graph properties. It can be used like this: obj.Get('chart.strokestyle');
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
        * Draws the shape
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
            * DRAW THE SHAPE HERE
            */
            Path(this, ['b','fu',function (obj){if (prop['chart.shadow']) {co.shadowColor = prop['chart.shadow.color'];co.shadowOffsetY = prop['chart.shadow.offsetx'];co.shadowOffsetX = prop['chart.shadow.offsety'];co.shadowBlur = prop['chart.shadow.blur'];}},'fu',function (obj) {co.strokeStyle=prop['chart.strokestyle'];co.fillStyle=prop['chart.fillstyle'];obj.DrawPoly();},'lw',prop['chart.linewidth'],'s',prop['chart.strokestyle'],'f',prop['chart.fillstyle']]);
            
            /**
            * Turn off shadow again
            */
            RG.NoShadow(this)
    
    
    
            /**
            * This installs the event listeners
            */
            RG.InstallEventListeners(this);
    
    
            /**
            * Fire the ondraw event
            */
            RG.FireCustomEvent(this, 'ondraw');
            
            return this;
        }




        /**
        * The getObjectByXY() worker method
        */
        this.getObjectByXY = function (e)
        {
            if (this.getShape(e)) {
                return this;
            }
        }




        /**
        * Draw the Poly but doesn't stroke or fill - that's left to other functions
        */
        this.DrawPoly = function ()
        {
            var coords = this.coords;
            
            co.beginPath();
                // Move to the first coord
                co.moveTo(coords[0][0], coords[0][1]);
                
                // Draw lines to subsequent coords
                for (var i=1,len=coords.length; i<len; ++i) {
                    co.lineTo(coords[i][0],coords[i][1]);
                }
            co.closePath();
            co.stroke();
            co.fill();
        }




        /**
        * Not used by the class during creating the graph, but is used by event handlers
        * to get the coordinates (if any) of the selected bar
        * 
        * @param object e The event object
        */
        this.getShape = function (e)
        {
            var coords  = this.coords;
            var mouseXY = RGraph.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
    
            // Should redraw the poly but not stroke or fill it and then use isPointInPath() to test it
            co.beginPath();
            co.strokeStyle = 'rgba(0,0,0,0)';
            co.fillStyle = 'rgba(0,0,0,0)';
            this.DrawPoly();
    
            if (co.isPointInPath(mouseX, mouseY)) {
                    
                return {
                        0: this, 1: this.coords, 2: 0,
                        'object': this, 'coords': this.coords, 'index': 0, 'tooltip': prop['chart.tooltips'] ? prop['chart.tooltips'][0] : null
                       };
            }
            
            return null;
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
            var canvasXY = RGraph.getCanvasXY(obj.canvas);
            var width    = tooltip.offsetWidth;
            var height   = tooltip.offsetHeight;
    
            // Set the top position
            tooltip.style.left = 0;
            tooltip.style.top  = (y - height - 7) +  'px';
    
            // By default any overflow is hidden
            tooltip.style.overflow = '';
    
            // The arrow
            var img = new Image();
                img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAFCAYAAACjKgd3AAAARUlEQVQYV2NkQAN79+797+RkhC4M5+/bd47B2dmZEVkBCgcmgcsgbAaA9GA1BCSBbhAuA/AagmwQPgMIGgIzCD0M0AMMAEFVIAa6UQgcAAAAAElFTkSuQmCC';
                img.style.position = 'absolute';
                img.id = '__rgraph_tooltip_pointer__';
                img.style.top = (tooltip.offsetHeight - 2) + 'px';
            tooltip.appendChild(img);
            
            
            
            
            /**
            * Reposition the tooltip if at the edges:
            */
    
    
    
            // LEFT edge
            if (x - (width / 2) < 10) {
                tooltip.style.left = (canvasXY[0] + x - (width * 0.1)) - 8.5+ 'px';
                img.style.left = ((width * 0.1) - 8.5) + 'px';
    
            // RIGHT edge
            } else if ((x + (width / 2)) > document.body.offsetWidth) {
                tooltip.style.left = x - (width * 0.9) + 'px';
                img.style.left = ((width * 0.9) - 8.5) + 'px';
    
            // Default positioning - CENTERED
            } else {
                tooltip.style.left = x - (width / 2) + 'px';
                img.style.left = ((width * 0.5) - 8.5) + 'px';
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
            if (prop['chart.tooltips.highlight']) {
                Path(this, ['b','fu', function (obj){obj.DrawPoly();},'f',prop['chart.highlight.fill'],'s',prop['chart.highlight.stroke']]);
            }
        }




        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            var func = this.parseSingleColorForGradient;
    
            /**
            * Parse various properties for colors
            */
            prop['chart.fillstyle']        = func(prop['chart.fillstyle']);
            prop['chart.strokestyle']      = func(prop['chart.strokestyle']);
            prop['chart.highlight.stroke'] = func(prop['chart.highlight.stroke']);
            prop['chart.highlight.fill']   = func(prop['chart.highlight.fill']);
        }




        /**
        * This parses a single color value
        */
        this.parseSingleColorForGradient = function (color)
        {
            if (!color) {
                return color;
            }
    
            if (color.match(/^gradient\((.*)\)$/i)) {
    
                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = co.createLinearGradient(0,0,ca.width,0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        }




        /**
        * Objects are now always registered so that the chart is redrawn if need be.
        */
        RG.Register(this);
    }