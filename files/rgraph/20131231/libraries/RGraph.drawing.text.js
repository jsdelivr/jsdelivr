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
    * first argument, then th X position, the Y position and then the text to show
    * 
    * @param string id    The canvas tag ID
    * @param number x     The X position of the text
    * @param number y     The Y position of the text
    * @param number text  The text to show
    */
    RGraph.Drawing.Text = function (id, x, y, text)
    {
        this.id                = id;
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.colorsParsed      = false;
        this.canvas.__object__ = this;
        this.x                 = x;
        this.y                 = y;
        this.text              = text;
        this.coords            = [];
        this.coordsText        = [];


        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.text';


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
            'chart.size':                    10,
            'chart.font':                    'Arial',
            'chart.bold':                    false,
            'chart.angle':                   0,
            'chart.colors':                  ['black'],
            'chart.events.click':            null,
            'chart.events.mousemove':        null,
            'chart.highlight.stroke':        '#ccc',
            'chart.highlight.fill':          'rgba(255,255,255,0.7)',
            'chart.tooltips':                null,
            'chart.tooltips.effect':         'fade',
            'chart.tooltips.css.class':      'RGraph_tooltip',
            'chart.tooltips.event':          'onclick',
            'chart.tooltips.highlight':      true,
            'chart.tooltips.coords.page':    false,
            'chart.bounding':                false,
            'chart.bounding.fill':           'rgba(255,255,255,0.7)',
            'chart.bounding.stroke':         '#777',
            'chart.bounding.shadow':         false,
            'chart.bounding.shadow.color':   '#ccc',
            'chart.bounding.shadow.blur':    3,
            'chart.bounding.shadow.offsetx': 3,
            'chart.bounding.shadow.offsety': 3,
            'chart.marker':                  false,
            'chart.halign':                  'left',
            'chart.valign':                  'bottom',
            'chart.link':                    null,
            'chart.link.target':             '_self',
            'chart.link.options':            ''
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.TEXT] No canvas support');
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
        * Draws the rectangle
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
            * Stop the coods array from growing
            */
            this.coords = [];
            
            
            /**
            * The font, its size and whether its bold or not can be set by properties,
            * so now they have been (potentiall) set - measure the text
            */
                    /**
            * Measure the text and add the width/height
            * 
            * text, bold, font, size
            * 
            */
            var dimensions = RG.MeasureText(this.text, prop['chart.text.bold'],prop['chart.text.font'], prop['chart.text.size']);
    
    
    
            // ------------- DRAW TEXT HERE -------------
            co.fillStyle = prop['chart.colors'][0];
    
            var ret = RG.Text2(this, {'font':                    prop['chart.font'],
                                      'size':                    prop['chart.size'],
                                      'x':                       this.x,
                                      'y':                       this.y,
                                      'text':                    this.text,
                                      'bold':                    prop['chart.bold'],
                                      'angle':                   prop['chart.angle'],
                                      'bounding':                prop['chart.bounding'],
                                      'bounding.fill':           prop['chart.bounding.fill'],
                                      'bounding.stroke':         prop['chart.bounding.stroke'],
                                      'bounding.shadow':         prop['chart.bounding.shadow'],
                                      'bounding.shadow.color':   prop['chart.bounding.shadow.color'],
                                      'bounding.shadow.blur':    prop['chart.bounding.shadow.blur'],
                                      'bounding.shadow.offsetx': prop['chart.bounding.shadow.offsetx'],
                                      'bounding.shadow.offsety': prop['chart.bounding.shadow.offsety'],
                                      'marker':                  prop['chart.marker'],
                                      'halign':                  prop['chart.halign'],
                                      'valign':                  prop['chart.valign']
                                      });
    
    
            // store the dimensions
            this.coords.push({'x':ret.x, 'y':ret.y, 'width':ret.width, 'height':ret.height});
    
    
    
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
        * Not used by the class during creating the graph, but is used by event handlers
        * to get the coordinates (if any) of the selected bar
        * 
        * @param object e The event object
        */
        this.getShape = function (e)
        {
            var prop    = this.properties;
            var coords  = this.coords;
            var mouseXY = RGraph.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];  
    
            for (var i=0,len=this.coords.length; i<len; i++) {
    
                var left   = coords[i].x;
                var top    = coords[i].y;
                var width  = coords[i].width;
                var height = coords[i].height;
    
                if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height)) {
                    
                    return {
                            0: this, 1: left, 2: top, 3: width, 4: height, 5: 0,
                            'object': this, 'x': left, 'y': top, 'width': width, 'height': height, 'index': 0, 'tooltip': prop['chart.tooltips'] ? prop['chart.tooltips'][0] : null
                           };
                }
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
            var coords   = obj.coords[0];
            var coordX   = coords.x;
            var coordY   = coords.y;
            var coordW   = coords.width;
            var coordH   = coords.height;
            var canvasXY = RGraph.getCanvasXY(obj.canvas);
            var width    = tooltip.offsetWidth;
            var height   = tooltip.offsetHeight;
    
            // Set the top position
            tooltip.style.left = 0;
            
            tooltip.style.top  = canvasXY[1] + coordY + (coordH / 2) - height + 'px';
            
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
            if ((canvasXY[0] + coordX + (coordW / 2) - (width / 2)) < 10) {
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
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            /**
            * Parse various properties for colors
            */
            prop['chart.fillstyle']        = this.parseSingleColorForGradient(prop['chart.fillstyle']);
            prop['chart.strokestyle']      = this.parseSingleColorForGradient(prop['chart.strokestyle']);
            prop['chart.highlight.stroke'] = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
            prop['chart.highlight.fill']   = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
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
    
                grad.addColorStop(0, RGraph.trim(parts[0]));
    
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