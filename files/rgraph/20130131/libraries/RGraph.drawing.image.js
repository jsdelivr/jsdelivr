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
    * @param string id    The canvas tag ID
    * @param number x    The X position of the label
    * @param number y    The Y position of the label
    * @param number text The text used
    */
    RGraph.Drawing.Image = function (id, x, y)
    {
        this.id           = id;
        this.canvas       = document.getElementById(id);
        this.context      = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.colorsParsed = false;


        /**
        * Store the properties
        */
        this.x   = x;
        this.y   = y;
        this.src = (typeof(arguments[3]) == 'string') ? arguments[3] : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAjCAYAAAAXMhMjAAAD5klEQVRYR+2Yf0xbVRTHP++1tHQMqBXKoIBAtmyIsokmIyxujgRdRMniT5yRzGjizIIxCm5m/lhiTESasDhEh0vcjDrnP0bBuYhuJoIsSrIpG3Nbha5IEQgrsxNKKe95Xxs16hikbdKaeJKXl/T+eJ9+zz3nnnslVRjCslIl7RUX5r4YRELS4DSwAaclLsA0iPy8C2iAUmYKajyB/aGQBvg/XDjrJSrK9Z7biDHRR1dnF/6Aj4KCPEpLy0nW7QmH6c8xUYE7+VMV9sYDHO2Yxu+HnFy4b9MK6raOxh5u3welvNZ0iOFBwSIygCkJim8081T9atbe9F3YgFFRbtebZTS83I46AzNCOVkPZevMPLOjhDWrTsQW7hV7Ca82fIFO5HBZhlmhXtlaM9ueL2RN8ZnYwu0/WCzc+hVDwq3qrEyiSaJUwB3cH8ry4VrEbvXqC+nuUtn57DecOQlKAJKT4f6aLBpf8oXLFRwXMZw2ydHvLey2Ozj2pXDpNFxthU2b03lu22zs4U6ct9LS5KT9Q18wKLJyoPbJfDbXXIw9nHMik70to7zdPIYi4IquT6J++zJuu9UVG7gplmPir0hsfS8F+04n3gm4ZX0G23esYOXK3tjA/fOrbUcsAs6Bywl33JnF7tcjC4aoBYQ2UWePleZGB6f7Atx1byYvviAiI0KLSrRqDMdP2WjdNcAPvZeofiib2q2TEaJFKZVoFM6ha9m3x013dz8PP2aj+p6p+IH7bXo1B94Z4/OOHrbULqH8ZrHJRmhRc+uY9xrOnTbybc9xKjakUVQQJ8oFJJuo47JxnRenJVmHNVNH0uJxDLN9EWkXFeV+di/j8KduDrUNMj4OGTYj1Q/ms6EynUX6U2EDRgXurVYz9oZ+vJ5grQminisugcefSGPj7Urs4H48m0pT4yCftQdIELXcpEhvinhb0uDuBzJ4us7GVSaRmcOweZWTE3LFfjn3Hnm238obzSO8/65HFJsS+gRJACokm6HmkVzq6nPFQWfutedXlmOQL1+QXhFO0q9CDVy5zB75tYCOw5O0NPfhcAh5RDVsWgTX3aDn0S05lK9PJ1XSGua2GbmcBOXIvzrMq9x83vBJFXg8Vjq/dvHxR8cYHLpAwdJsKqtKWFeeTcriCYzTbfNNc9n2iOHC+uoCB/034QJyEYrfg0HvDv1PxSbWUwJa4a1IKqokY1AHFqjBAroZqsD/yd86xrVyFZVLQ/dz5mSJEVf83M/lFeoY/mU0BKfpGc7NplGkjSntpC+OhHqxMyQm6jAYZC55Z7SsgioysqroQ4+qE7+JR+RDGbGdzGGJliX0DwwHW38HIHO9QizDMu0AAAAASUVORK5CYII=';
        this.img = new Image();
        this.img.src = this.src;


        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.image';


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
            'chart.src':              null,
            'chart.width':            null,
            'chart.height':           null,
            'chart.events.mousemove': null,
            'chart.events.click':     null,
            'chart.shadow':           false,
            'chart.shadow.color':     'gray',
            'chart.shadow.offsetx':   3,
            'chart.shadow.offsety':   3,
            'chart.shadow.blur':      5,
            'chart.tooltips':           null,
            'chart.tooltips.highlight': true,
            'chart.tooltips.event':     'onclick',
            'chart.highlight.stroke':     'rgba(0,0,0,0)',
            'chart.highlight.fill':       'rgba(255,255,255,0.7)',
            'chart.alpha':       1
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.IMAGE] No canvas support');
            return;
        }
        
        /**
        * This can be used to store the coordinates of shapes on the graph
        */
        this.coords = [];


        /**
        * Create the dollar object so that functions can be added to them
        */
        this.$0 = {};



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
    RGraph.Drawing.Image.prototype.Set = function (name, value)
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
    * A getter method for retrieving graph properties. It can be used like this: obj.Get('chart.strokestyle');
    * 
    * @param name  string The name of the property to get
    */
    RGraph.Drawing.Image.prototype.Get = function (name)
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
    * Draws the circle
    */
    RGraph.Drawing.Image.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');


        /**
        * Parse the colors. This allows for simple gradient syntax
        */
        var __object__ = this;
        this.img.onload = function ()
        {
            if (!__object__.colorsParsed) {

                __object__.parseColors();
    
                // Don't want to do this again
                __object__.colorsParsed = true;
            }
        }
        
        // The onload event doesn't always fire - so call it manually as well
        if (this.img.complete || this.img.readyState === 4) {
            this.img.onload();
        }


        /**
        * Draw the image here
        */
        
        if (this.properties['chart.shadow']) {
            RGraph.SetShadow(this, this.properties['chart.shadow.color'], this.properties['chart.shadow.offsetx'], this.properties['chart.shadow.offsety'], this.properties['chart.shadow.blur']);
        }

        var oldAlpha = this.context.globalAlpha;
        this.context.globalAlpha = this.properties['chart.alpha'];
            if (typeof(this.properties['chart.width']) == 'number' && typeof(this.properties['chart.width']) == 'number') {
                this.context.drawImage(
                                       this.img,
                                       Math.round(this.x),
                                       Math.round(this.y),
                                       this.properties['chart.width'],
                                       this.properties['chart.height']
                                      );
            } else {
                this.context.drawImage(
                                       this.img,
                                       Math.round(this.x),
                                       Math.round(this.y)
                                      );
            }
        this.context.globalAlpha = oldAlpha;

        var obj    = this;
        var canvas = this.canvas;

        this.img.onload = function ()
        {
            RGraph.RedrawCanvas(canvas);
            
            obj.coords[0] = [Math.round(obj.x), Math.round(obj.y), typeof(obj.properties['chart.width']) == 'number' ? obj.properties['chart.width'] : this.width, typeof(obj.properties['chart.height']) == 'number' ? obj.properties['chart.height'] : this.height];

        }
        
        RGraph.NoShadow(this);


        /**
        * This installs the event listeners
        */
        RGraph.InstallEventListeners(this);


        /**
        * Fire the ondraw event
        */
        RGraph.FireCustomEvent(this, 'ondraw');
    }



    /**
    * The getObjectByXY() worker method
    */
    RGraph.Drawing.Image.prototype.getObjectByXY = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);

        if (this.getShape(e)) {
            return this;
        }
    }



    /**
    * Not used by the class during creating the shape, but is used by event handlers
    * to get the coordinates (if any) of the selected bar
    * 
    * @param object e The event object
    * @param object   OPTIONAL You can pass in the bar object instead of the
    *                          function using "this"
    */
    RGraph.Drawing.Image.prototype.getShape = function (e)
    {
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];

        if (   this.coords
            && this.coords[0]
            && mouseXY[0] >= this.coords[0][0]
            && mouseXY[0] <= (this.coords[0][0] + this.coords[0][2])
            && mouseXY[1] >= this.coords[0][1]
            && mouseXY[1] <= (this.coords[0][1] + this.coords[0][3])) {
            
            return {
                    0: this, 1: this.coords[0][0], 2: this.coords[0][1], 3: this.coords[0][2], 4: this.coords[0][3], 5: 0,
                    'object': this, 'x': this.coords[0][0], 'y': this.coords[0][1], 'width': this.coords[0][2], 'height': this.coords[0][3], 'index': 0, 'tooltip': this.properties['chart.tooltips'] ? this.properties['chart.tooltips'][0] : null
                   };
        }
        
        return null;
    }



    /**
    * This function positions a tooltip when it is displayed
    * 
    * @param obj object     The chart object
    * @param int x          The X coordinate specified for the tooltip
    * @param int y          The Y coordinate specified for the tooltip
    * @param object tooltip The tooltips DIV element
    * @param number idx     The index of the tooltip
    */
    RGraph.Drawing.Image.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var canvasXY   = RGraph.getCanvasXY(obj.canvas);
        var width      = tooltip.offsetWidth;
        var height     = tooltip.offsetHeight;

        // Set the top position
        tooltip.style.left = 0;
        tooltip.style.top  = canvasXY[1] + this.coords[0][1] - height - 7 + 'px';

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
        if ((canvasXY[0] + obj.coords[0][0] + (obj.coords[0][2] / 2) - (width / 2)) < 10) {
            tooltip.style.left = (canvasXY[0] + this.coords[0][0] + (this.coords[0][2] / 2) - (width * 0.1)) + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((canvasXY[0] + this.coords[0][0] + (this.coords[0][2] / 2) + (width / 2)) > document.body.offsetWidth) {
            tooltip.style.left = (canvasXY[0] + this.coords[0][0] + (this.coords[0][2] / 2) - (width * 0.9)) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (canvasXY[0] + this.coords[0][0] + (this.coords[0][2] / 2) - (width * 0.5)) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Drawing.Image.prototype.Highlight = function (shape)
    {
        this.context.beginPath();
            this.context.strokeStyle = this.properties['chart.highlight.stroke'];
            this.context.fillStyle = this.properties['chart.highlight.fill'];
            this.context.strokeRect(this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3]);
            this.context.fillRect(this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3]);
        this.context.fill();
        this.context.stroke();
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Drawing.Image.prototype.parseColors = function ()
    {
        /**
        * Parse various properties for colors
        */
        this.properties['chart.highlight.stroke'] = this.parseSingleColorForGradient(this.properties['chart.highlight.stroke']);
        this.properties['chart.highlight.fill']   = this.parseSingleColorForGradient(this.properties['chart.highlight.fill']);
    }



    /**
    * This parses a single color value
    */
    RGraph.Drawing.Image.prototype.parseSingleColorForGradient = function (color)
    {
        var canvas  = this.canvas;
        var context = this.context;
        
        if (!color || typeof(color) != 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = context.createLinearGradient(this.x, this.y, this.x + this.img.width, this.y);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }

        return grad ? grad : color;
    }