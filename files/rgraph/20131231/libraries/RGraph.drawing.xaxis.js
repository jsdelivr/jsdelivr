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
    * first argument and the Y coordinate of the axes as the second
    * 
    * @param string id The canvas tag ID
    * @param number y  The Y coordinate
    */
    RGraph.Drawing.XAxis = function (id, y)
    {
        this.id         = id;
        this.canvas     = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context    = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.y          = y;
        this.coords     = [];
        this.coordsText = [];


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
            'chart.gutter.left':     25,
            'chart.gutter.right':    25,
            'chart.labels':          null,
            'chart.labels.position': 'section',
            'chart.colors':          ['black'],
            'chart.title.color':     null, // Defaults to same as chart.colors
            'chart.text.color':      null, // Defaults to same as chart.colors
            'chart.text.font':       'Arial',
            'chart.text.size':       10,
            'chart.align':           'bottom',
            'chart.numlabels':       5,
            'chart.scale.visible':   true,
            'chart.scale.formatter': null,
            'chart.scale.decimals':  0,
            'chart.scale.invert':    false,
            'chart.scale.zerostart': true,
            'chart.units.pre':       '',
            'chart.units.post':      '',
            'chart.title':          '',
            'chart.numticks':        null,
            'chart.hmargin':         0,
            'chart.linewidth':       1,
            'chart.noendtick.left':  false,
            'chart.noendtick.right': false,
            'chart.noxaxis':         false,
            'chart.max':             null,
            'chart.min':             0,
            'chart.tooltips':        null,
            'chart.tooltips.effect':   'fade',
            'chart.tooltips.css.class':'RGraph_tooltip',
            'chart.tooltips.event':    'onclick',
            'chart.events.click':     null,
            'chart.events.mousemove': null,
            'chart.xaxispos':         'bottom',
            'chart.yaxispos':         'left'
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.XAXIS] No canvas support');
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
        * A setter method for setting graph properties. It can be used like this: obj.Set('chart.strokestyle', '#666');
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
    
            /**
            * Make the tickmarks align if labels are specified
            */
            if (name == 'chart.labels' && !prop['chart.numxticks']) {
                prop['chart.numxticks'] = value.length;
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
            * Some defaults
            */
            this.gutterLeft  = prop['chart.gutter.left'];
            this.gutterRight = prop['chart.gutter.right'];
            if (!prop['chart.text.color'])  prop['chart.text.color']  = prop['chart.colors'][0];
            if (!prop['chart.title.color']) prop['chart.title.color'] = prop['chart.colors'][0];
    
            /**
            * Parse the colors. This allows for simple gradient syntax
            */
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
    
            // DRAW X AXIS HERE
            this.DrawXAxis();
    
    
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
        * to get the coordinates (if any) of the selected shape
        * 
        * @param object e The event object
        */
        this.getShape = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
    
            if (   mouseX >= this.gutterLeft
                && mouseX <= (ca.width - this.gutterRight)
                && mouseY >= this.y - (prop['chart.align'] ==  'top' ? (prop['chart.text.size'] * 1.5) + 5 : 0)
                && mouseY <= (this.y + (prop['chart.align'] ==  'top' ? 0 : (prop['chart.text.size'] * 1.5) + 5))
               ) {
                
                var x = this.gutterLeft;
                var y = this.y;
                var w = ca.width - this.gutterLeft - this.gutterRight;
                var h = 15;
    
                return {
                        0: this, 1: x, 2: y, 3: w, 4: h, 5: 0,
                        'object': this, 'x': x, 'y': y, 'width': w, 'height': h, 'index': 0, 'tooltip': prop['chart.tooltips'] ? prop['chart.tooltips'][0] : null
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
            var coordX     = obj.gutterLeft;
            var coordY     = obj.y;
            var coordW     = ca.width - obj.gutterLeft - obj.gutterRight;
            var coordH     = prop['chart.text.size'] * 1.5;
            var canvasXY   = RG.getCanvasXY(ca);
            var width      = tooltip.offsetWidth;
            var height     = tooltip.offsetHeight;
    
            // Set the top position
            tooltip.style.left = 0;
            tooltip.style.top  = canvasXY[1] + this.y - height - 5 + (prop['chart.align'] == 'top' ? ((prop['chart.text.size'] * 1.5) / 2) * -1 : ((prop['chart.text.size'] * 1.5) / 2)) + 'px';
    
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
            // When showing tooltips, this method can be used to highlight the X axis
        }




        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            /**
            * Parse various properties for colors
            */
            //this.properties['chart.title.color'] = this.parseSingleColorForGradient(this.properties['chart.title.color']);
            //this.properties['chart.text.color']  = this.parseSingleColorForGradient(this.properties['chart.text.color']);
            prop['chart.colors'][0]   = this.parseSingleColorForGradient(prop['chart.colors'][0]);
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
                var grad = co.createLinearGradient(prop['chart.gutter.left'],0,ca.width - prop['chart.gutter.right'],0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        }




        /**
        * The function that draws the X axis
        */
        this.DrawXAxis = function ()
        {
            var gutterLeft      = prop['chart.gutter.left'];
            var gutterRight     = prop['chart.gutter.right'];
            var x               = this.gutterLeft;
            var y               = this.y;
            var min             = prop['chart.min'];
            var max             = prop['chart.max'];
            var labels          = prop['chart.labels'];
            var labels_position = prop['chart.labels.position'];
            var color           = prop['chart.colors'][0];
            var title_color     = prop['chart.title.color'];
            var label_color     = prop['chart.text.color'];
            var width           = ca.width - this.gutterLeft - this.gutterRight;
            var font            = prop['chart.text.font'];
            var size            = prop['chart.text.size'];
            var align           = prop['chart.align'];
            var numlabels       = prop['chart.numlabels'];
            var formatter       = prop['chart.scale.formatter'];
            var decimals        = Number(prop['chart.scale.decimals']);
            var invert          = prop['chart.scale.invert'];
            var scale_visible   = prop['chart.scale.visible'];
            var units_pre       = prop['chart.units.pre'];
            var units_post      = prop['chart.units.post'];
            var title           = prop['chart.title'];
            var numticks        = prop['chart.numticks'];
            var hmargin         = prop['chart.hmargin'];
            var linewidth       = prop['chart.linewidth'];
            var noleftendtick   = prop['chart.noendtick.left'];
            var norightendtick  = prop['chart.noendtick.right'];
            var noxaxis         = prop['chart.noxaxis'];
            var xaxispos        = prop['chart.xaxispos'];
            var yaxispos        = prop['chart.yaxispos'];
    
    
            if (RG.is_null(numticks)) {
                if (labels && labels.length) {
                    numticks = labels.length;
                } else if (!labels && max != 0) {
                    numticks = 10;
                } else {
                    numticks = numlabels;
                }
            }
    
            
    
            /**
            * Set the linewidth
            */
            co.lineWidth = linewidth + 0.001;
    
            /**
            * Set the color
            */
            co.strokeStyle = color;
    
            if (!noxaxis) {
                /**
                * Draw the main horizontal line
                */
                Path(co, ['b','m',x, Math.round(y),'l',x + width, Math.round(y),'s',co.strokeStyle]);
    
                /**
                * Draw the axis tickmarks
                */
                co.beginPath();
                    for (var i=(noleftendtick ? 1 : 0); i<=(numticks - (norightendtick ? 1 : 0)); ++i) {
                        co.moveTo(Math.round(x + ((width / numticks) * i)), xaxispos == 'center' ? (align == 'bottom' ? y - 3 : y + 3) : y);
                        co.lineTo(Math.round(x + ((width / numticks) * i)), y + (align == 'bottom' ? 3 : -3));
                    }
                co.stroke();
            }
    
    
    
            /**
            * Draw the labels
            */
            co.fillStyle = label_color;
    
            if (labels) {
                /**
                * Draw the labels
                */
                numlabels = labels.length;
                var h = 0;
                var l = 0;
                var single_line = RG.MeasureText('Mg', false, font, size);
    
                // Measure the maximum height
                for (var i=0,len=labels.length; i<len; ++i) {
                    var dimensions = RG.MeasureText(labels[i], false, font, size);
                    var h = Math.max(h, dimensions[1]);
                    var l = Math.max(l, labels[i].split('\r\n').length);
                }
    
    
                for (var i=0,len=labels.length; i<len; ++i) {
                    RG.Text2(this,{'font': font,
                                   'size': size,
                                   'x': labels_position == 'edge' ? ((((width - hmargin - hmargin) / (labels.length - 1)) * i) + gutterLeft + hmargin) : ((((width - hmargin - hmargin) / labels.length) * i) + ((width / labels.length) / 2) + gutterLeft + hmargin),
                                   'y':align == 'bottom' ? y + 3 : y - 3 - h + single_line[1],
                                   'text':String(labels[i]),
                                   'valign': align == 'bottom' ? 'top' : 'bottom',
                                   'halign':'center',
                                   'tag': 'labels'
                                   });
                }
        
    
    
    
    
            /**
            * No specific labels - draw a scale
            */
            } else if (scale_visible){
    
                if (!max) {
                    alert('[DRAWING.XAXIS] If not specifying axis.labels you must specify axis.max!');
                }
    
                // yaxispos
                if (yaxispos == 'center') {
                    width /= 2;
                    var additionalX = width;            
                } else {
                    var additionalX = 0;
                }
    
                for (var i=0; i<=numlabels; ++i) {
    
                    // Don't show zero if the chart.scale.zerostart option is false
                    if (i == 0 && !prop['chart.scale.zerostart']) {
                        continue;
                    }
    
                    var original = (((max - min) / numlabels) * i) + min;
                    var hmargin  = prop['chart.hmargin'];
    
                    var text = String(typeof(formatter) == 'function' ? formatter(this, original) : RG.number_format(this, original.toFixed(decimals), units_pre, units_post));
    
                    if (invert) {
                        var x = ((width - hmargin - ((width - hmargin - hmargin) / numlabels) * i)) + gutterLeft + additionalX;
                    } else {
                        var x = (((width - hmargin - hmargin) / numlabels) * i) + gutterLeft + hmargin + additionalX;
                    }
    
                    RG.Text2(this,{'font': font,
                                       'size': size,
                                       'x': x,
                                       'y': align == 'bottom' ? y + 3 : y - 3,
                                       'text':text,
                                       'valign':align == 'bottom' ? 'top' : 'bottom',
                                       'halign':'center',
                                       'tag': 'scale'
                                      });
                }
    
                /**
                * If the Y axis is in the center - this draws the left half of the labels
                */
                if (yaxispos == 'center') {
                  for (var i=0; i<numlabels; ++i) {
        
                        var original = (((max - min) / numlabels) * (numlabels - i)) + min;
                        var hmargin  = prop['chart.hmargin'];
        
                        var text = String(typeof(formatter) == 'function' ? formatter(this, original) : RG.number_format(this, original.toFixed(decimals), units_pre, units_post));
        
                        if (invert) {
                            var x = ((width - hmargin - ((width - hmargin - hmargin) / numlabels) * i)) + gutterLeft;
                        } else {
                            var x = (((width - hmargin - hmargin) / numlabels) * i) + gutterLeft + hmargin;
                        }
        
                        RG.Text2(this, {'font':font,
                                            'size':size,
                                            'x':x,
                                            'y':align == 'bottom' ? y + size + 2 : y - size - 2,'text':'-' + text,
                                            'valign':'center',
                                            'halign':'center',
                                            'tag': 'scale'
                                            });
                    }
                }
            }
    
    
    
            /**
            * Draw the title for the axes
            */
            if (title) {
    
                var dimensions = RG.MeasureText(title, false, font, size + 2);
    
                co.fillStyle = title_color
                    RG.Text2(this,{'font': font,
                                       'size': size + 2,
                                       'x': (ca.width - this.gutterLeft - this.gutterRight) / 2 + this.gutterLeft,
                                       'y': align == 'bottom' ? y + dimensions[1] + 10 : y - dimensions[1] - 10,
                                       'text': title,
                                       'valign': 'center',
                                       'halign':'center',
                                       'tag': 'title'
                                       });
            }
        }




        /**
        * Objects are now always registered so that the chart is redrawn if need be.
        */
        RG.Register(this);
    }