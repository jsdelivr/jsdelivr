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



    /**
    * Having this here means that the RGraph libraries can be included in any order, instead of you having
    * to include the common core library first.
    */
    if (typeof(RGraph) == 'undefined') RGraph = {};
    if (typeof(RGraph.Drawing) == 'undefined') RGraph.Drawing = {};




    /**
    * The constructor. This function sets up the object. It takes the ID (the HTML attribute) of the canvas as the
    * first argument and the data as the second. If you need to change this, you can.
    * 
    * @param string id  The canvas tag ID
    * @param number min The minimum  value of the Y axis
    * @param number max The maximum value of the Y axis
    */
    RGraph.Drawing.XAxis = function (obj, min, max, y)
    {
        this.obj     = obj;
        this.id      = obj.id;
        this.canvas  = obj.canvas;
        this.context = obj.context;
        this.min     = min;
        this.max     = max;
        this.y       = y;
        this.coords  = [];


        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.xaxis';


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
            'chart.labels':          null,
            'chart.labels.position': 'section',
            'chart.colors':          ['black'],
            'chart.title.color':     null, // Defaults to same as chart.colors
            'chart.text.color':      null, // Defaults to same as chart.colors
            'chart.text.font':       'Arial',
            'chart.text.size':       10,
            'chart.align':           'bottom',
            'chart.numlabels':       5,
            'chart.scale.formatter': null,
            'chart.scale.decimals':  0,
            'chart.scale.invert':    false,
            'chart.units.pre':       '',
            'chart.units.post':      '',
            'chart.title':          '',
            'chart.numticks':        null,
            'chart.hmargin':         0,
            'chart.linewidth':       1,
            'chart.noendtick.left':  false,
            'chart.noendtick.right': false,
            'chart.noxaxis':         false
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.YAXIS] No canvas support');
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



        /**
        * Objects are now always registered so that the chart is redrawn if need be.
        */
        RGraph.Register(this);
    }




    /**
    * A setter method for setting graph properties. It can be used like this: obj.Set('chart.strokestyle', '#666');
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.Drawing.XAxis.prototype.Set = function (name, value)
    {
        name = name.toLowerCase();

        /**
        * This should be done first - prepend the property name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        /**
        * Make the tickmarks align if labels are specified
        */
        if (name == 'chart.labels' && !this.properties['chart.numxticks']) {
            this.properties['chart.numxticks'] = value.length;
        }

        this.properties[name] = value;
    }




    /**
    * A getter method for retrieving graph properties. It can be used like this: obj.Get('chart.strokestyle');
    * 
    * @param name  string The name of the property to get
    */
    RGraph.Drawing.XAxis.prototype.Get = function (name)
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
    * Draws the rectangle
    */
    RGraph.Drawing.XAxis.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');
        
        /**
        * Add the gutter properties
        */
        this.gutterLeft  = this.obj.gutterLeft;
        this.gutterRight = this.obj.gutterRight;
        this.gutterTop   = this.obj.gutterTop;
        this.gutterBotom = this.obj.gutterBottom;


        
        if (!this.properties['chart.text.color'])  this.properties['chart.text.color']  = this.properties['chart.colors'][0];
        if (!this.properties['chart.title.color']) this.properties['chart.title.color'] = this.properties['chart.colors'][0];

        /**
        * Parse the colors. This allows for simple gradient syntax
        */
        if (!this.colorsParsed) {

            this.parseColors();

            // Don't want to do this again
            this.colorsParsed = true;
        }

        if (RGraph.is_null(this.properties['chart.numticks'])) {
            this.properties['chart.numticks'] = this.properties['chart.labels'] ? this.properties['chart.labels'].length - 1 : 10;
        }



        // DRAW Y AXIS HERE
        this.DrawXAxis();



        /**
        * Fire the ondraw event
        */
        RGraph.FireCustomEvent(this, 'ondraw');
    }



    /**
    * The getObjectByXY() worker method
    */
    RGraph.Drawing.XAxis.prototype.getObjectByXY = function (e)
    {
        if (this.getShape(e)) {
            return this;
        }
    }


    /**
    * Not used by the class during creating the graph, but is used by event handlers
    * to get the coordinates (if any) of the selected shape
    * 
    * @param object e The event object
    */
    RGraph.Drawing.XAxis.prototype.getShape = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];

        if (   mouseX >= this.obj.gutterLeft
            && mouseX <= (this.obj.canvas.width - this.obj.gutterRight)
            && mouseY >= this.y
            && mouseY <= (this.y + 10)
           ) {
            
            var x = this.gutterLeft;
            var y = this.y;
            var w = this.canvas.width - this.gutterLeft - this.gutterRight;
            var h = 15;

            return {
                    0: this, 1: x, 2: y, 3: w, 4: h, h: 0,
                    'object': this, 'x': x, 'y': y, 'width': w, 'height': h, 'index': 0, 'tooltip': this.properties['chart.tooltips'] ? this.properties['chart.tooltips'][0] : null
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
    RGraph.Drawing.XAxis.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var coordX     = obj.gutterLeft;
        var coordY     = obj.y;
        var coordW     = obj.canvas.width - obj.gutterLeft - obj.gutterRight;
        var coordH     = 5;
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
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
    RGraph.Drawing.XAxis.prototype.Highlight = function (shape)
    {
        // When showing tooltips, this method can be used to highlight the X axis
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Drawing.XAxis.prototype.parseColors = function ()
    {
        /**
        * Parse various properties for colors
        */
        //this.properties['chart.title.color'] = this.parseSingleColorForGradient(this.properties['chart.title.color']);
        //this.properties['chart.text.color']  = this.parseSingleColorForGradient(this.properties['chart.text.color']);
        this.properties['chart.colors'][0]   = this.parseSingleColorForGradient(this.properties['chart.colors'][0]);
    }



    /**
    * This parses a single color value
    */
    RGraph.Drawing.XAxis.prototype.parseSingleColorForGradient = function (color)
    {
        var canvas  = this.canvas;
        var context = this.context;
        
        if (!color) {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = context.createLinearGradient(0,0,canvas.width,0);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }

        return grad ? grad : color;
    }



    /**
    * The function that draws the X axis
    */
    RGraph.Drawing.XAxis.prototype.DrawXAxis = function ()
    {
        var obj             = this.obj;
        var prop            = this.properties;
        var gutterLeft      = obj.gutterLeft;
        var gutterRight     = obj.gutterRight;
        var x               = gutterLeft;
        var y               = this.y;
        var min             = this.min;
        var max             = this.max;
        var labels          = prop['chart.labels'];
        var labels_position = prop['chart.labels.position'];
        var color           = prop['chart.colors'][0];
        var title_color     = prop['chart.title.color'];
        var label_color     = prop['chart.text.color'];
        var width           = obj.canvas.width - obj.gutterLeft - obj.gutterRight;
        var height          = obj.canvas.height - obj.gutterBottom - obj.gutterTop;
        var font            = prop['chart.text.font'];
        var size            = prop['chart.text.size'];
        var align           = prop['chart.align'];
        var numlabels       = prop['chart.numlabels'];
        var formatter       = prop['chart.scale.formatter'];
        var decimals        = Number(prop['chart.scale.decimals']);
        var invert          = prop['chart.scale.invert'];
        var units_pre       = prop['chart.units.pre'];
        var units_post      = prop['chart.units.post'];
        var title           = prop['chart.title'];
        var numticks        = prop['chart.numticks'];
        var hmargin         = prop['chart.hmargin'];
        var linewidth       = prop['chart.linewidth'];
        var noleftendtick   = prop['chart.noendtick.left'];
        var norightendtick  = prop['chart.noendtick.right'];
        var noxaxis         = prop['chart.noxaxis'];

        /**
        * Set the linewidth
        */
        this.context.lineWidth = linewidth + 0.001;

        /**
        * Set the color
        */
        this.context.strokeStyle = color;

        if (!noxaxis) {
            /**
            * Draw the main horizontal line
            */
            this.context.beginPath();
                this.context.moveTo(x, Math.round(y));
                this.context.lineTo(x + width, Math.round(y));
            this.context.stroke();

            /**
            * Draw the axes tickmarks
            */
            this.context.beginPath();
                for (var i=(noleftendtick ? 1 : 0); i<=(numticks - (norightendtick ? 1 : 0)); ++i) {
                    this.context.moveTo(Math.round(x + ((width / numticks) * i)), y);
                    this.context.lineTo(Math.round(x + ((width / numticks) * i)), y + (align == 'bottom' ? 3 : -3));
                }
            this.context.stroke();
        }



        /**
        * Draw the labels
        */
        this.context.fillStyle = label_color;

        if (labels) {
            /**
            * Draw the labels
            */
            numlabels = labels.length;
            var h = 0;
            var l = 0;
            var single_line = RGraph.MeasureText('Mg', false, font, size);

            // Measure the maximum height
            for (var i=0; i<labels.length; ++i) {
                var dimensions = RGraph.MeasureText(labels[i], false, font, size);
                var h = Math.max(h, dimensions[1]);
                var l = Math.max(l, labels[i].split('\r\n').length);
            }


            for (var i=0; i<labels.length; ++i) {
                RGraph.Text(this.context,
                            font,
                            size,
                            labels_position == 'edge' ? ((((width - hmargin - hmargin) / (labels.length - 1)) * i) + gutterLeft + hmargin) : ((((width - hmargin - hmargin) / labels.length) * i) + ((width / labels.length) / 2) + gutterLeft + hmargin),
                            align == 'bottom' ? y + 5 : y - 10 - h + single_line[1],
                            String(labels[i]),
                            align == 'bottom' ? 'top' : 'bottom',
                            'center');
            }
    




        /**
        * No specific labels - draw a scale
        */
        } else {

            if (!max) {
                alert('[DRAWXAXIS] If not specifying axis.labels you must specify axis.max!');
            }

            for (var i=0; i<=numlabels; ++i) {

                var original = (((max - min) / numlabels) * i) + min;
                var hmargin  = this.properties['chart.hmargin'];

                var text = String(typeof(formatter) == 'function' ? formatter(obj, original) : RGraph.number_format(obj, original.toFixed(decimals), units_pre, units_post));
                
                if (invert) {
                    var x = ((width - hmargin - ((width - hmargin - hmargin) / numlabels) * i)) + gutterLeft;
                } else {
                    var x = (((width - hmargin - hmargin) / numlabels) * i) + gutterLeft + hmargin;
                }

                RGraph.Text(this.context,
                            font,
                            size,
                            x,
                            align == 'bottom' ? y + size + 2 : y - size - 2,
                            text,
                            'center',
                            'center');
            }
        }



        /**
        * Draw the title for the axes
        */
        if (title) {

            var dimensions = RGraph.MeasureText(title, false, font, size + 2);

            this.context.fillStyle = title_color
            RGraph.Text(this.context,
                        font,
                        size + 2,
                        width / 2 + obj.gutterLeft,
                        align == 'bottom' ? y + dimensions[1] + 10 : y - dimensions[1] - 10,
                        title,
                        'center',
                        'center');
        }
    }