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
    * The pie chart constructor
    * 
    * @param data array The data to be represented on the Pie chart
    */
    RGraph.Pie = function (id, data)
    {
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext("2d");
        this.canvas.__object__ = this;
        this.total             = 0;
        this.subTotal          = 0;
        this.angles            = [];
        this.data              = data;
        this.properties        = [];
        this.type              = 'pie';
        this.isRGraph          = true;
        this.coords            = [];
        this.coords.key        = [];
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);

        this.properties = {
            'chart.colors':                 ['red', '#ddd', '#0f0', 'blue', 'pink', 'yellow', 'black', 'cyan'],
            'chart.strokestyle':            '#999',
            'chart.linewidth':              1,
            'chart.labels':                 [],
            'chart.labels.sticks':          false,
            'chart.labels.sticks.length':   7,
            'chart.labels.sticks.color':    '#aaa',
            'chart.gutter.left':            25,
            'chart.gutter.right':           25,
            'chart.gutter.top':             25,
            'chart.gutter.bottom':          25,
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             0.5,
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.shadow':                 false,
            'chart.shadow.color':           'rgba(0,0,0,0.5)',
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,
            'chart.shadow.blur':            3,
            'chart.text.size':              10,
            'chart.text.color':             'black',
            'chart.text.font':              'Arial',
            'chart.contextmenu':            null,
            'chart.tooltips':               null,
            'chart.tooltips.event':         'onclick',
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.highlight':     true,
            'chart.highlight.style':        '2d',
            'chart.highlight.style.2d.fill': 'rgba(255,255,255,0.7)',
            'chart.highlight.style.2d.stroke': 'rgba(255,255,255,0.7)',
            'chart.centerx':                null,
            'chart.centery':                null,
            'chart.radius':                 null,
            'chart.border':                 false,
            'chart.border.color':           'rgba(255,255,255,0.5)',
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
            'chart.variant':                'pie',
            'chart.variant.donut.width':    null,
            'chart.exploded':               [],
            'chart.effect.roundrobin.multiplier': 1,
            'chart.events.click':             null,
            'chart.events.mousemove':         null,
            'chart.centerpin':                null,
            'chart.centerpin.fill':           'white',
            'chart.centerpin.stroke':         null,
            'chart.origin':                   0 - (Math.PI / 2),
            'chart.events':                   true,
            'chart.labels.colors':            []
        }

        /**
        * Calculate the total
        */
        for (var i=0,len=data.length; i<len; i++) {
            this.total += data[i];
            
            // This loop also creates the $xxx objects - this isn't related to
            // the code above but just saves doing another loop through the data
            this['$' + i] = {};
        }
        
        
        /**
        * Now all charts are always registered
        */
        RGraph.Register(this);
    }


    /**
    * A generic setter
    */
    RGraph.Pie.prototype.Set = function (name, value)
    {
        name = name.toLowerCase();

        /**
        * This should be done first - prepend the propertyy name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        if (name == 'chart.highlight.style.2d.color') {
            name = 'chart.highlight.style.2d.fill';
        }

        this.properties[name] = value;
    }


    /**
    * A generic getter
    */
    RGraph.Pie.prototype.Get = function (name)
    {
        /**
        * This should be done first - prepend the property name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        if (name == 'chart.highlight.style.2d.color') {
            name = 'chart.highlight.style.2d.fill';
        }

        return this.properties[name];
    }



    /**
    * This draws the pie chart
    */
    RGraph.Pie.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');
        
        // NB: Colors are parsed further down so that the center X/Y can be used


        /**
        * This is new in May 2011 and facilitates indiviual gutter settings,
        * eg chart.gutter.left
        */
        this.gutterLeft   = this.properties['chart.gutter.left'];
        this.gutterRight  = this.properties['chart.gutter.right'];
        this.gutterTop    = this.properties['chart.gutter.top'];
        this.gutterBottom = this.properties['chart.gutter.bottom'];


        
        this.radius   = this.getRadius();// MUST be first
        this.centerx  = (this.graph.width / 2) + this.gutterLeft
        this.centery  = (this.graph.height / 2) + this.gutterTop
        this.subTotal = this.properties['chart.origin'];
        this.angles   = [];

        /**
        * Allow specification of a custom radius & center X/Y
        */
        if (typeof(this.properties['chart.radius']) == 'number')  this.radius  = this.properties['chart.radius'];
        if (typeof(this.properties['chart.centerx']) == 'number') this.centerx = this.properties['chart.centerx'];
        if (typeof(this.properties['chart.centery']) == 'number') this.centery = this.properties['chart.centery'];


        if (this.radius <= 0) {
            return;
        }

        /**
        * Parse the colors for gradients. Its down here so that the center X/Y can be used
        */
        if (!this.colorsParsed) {

            this.parseColors();

            // Don't want to do this again
            this.colorsParsed = true;
        }



        /**
        * This sets the label colors. Doing it here saves lots of if() conditions in the draw method
        */
        if (this.properties['chart.labels.colors'].length < this.properties['chart.labels'].length) {
            while (this.properties['chart.labels.colors'].length < this.properties['chart.labels'].length) {
                this.properties['chart.labels.colors'].push(this.properties['chart.labels.colors'][this.properties['chart.labels.colors'].length - 1]);
            }
        } else {
            if (typeof(this.properties['chart.labels.colors']) == 'undefined') {
                this.properties['chart.labels.colors'] = [];
            }
            while (this.properties['chart.labels.colors'].length < this.properties['chart.labels'].length) {
                this.properties['chart.labels.colors'].push(this.properties['chart.text.color']);
            }
        }

        /**
        * Draw the title
        */
        RGraph.DrawTitle(this,
                         this.properties['chart.title'],
                         (this.canvas.height / 2) - this.radius - 5,
                         this.centerx,
                         this.properties['chart.title.size'] ? this.properties['chart.title.size'] : this.properties['chart.text.size'] + 2);

        /**
        * Draw the shadow if required
        */
        if (this.properties['chart.shadow'] && false) {
        
            var offsetx = document.all ? this.properties['chart.shadow.offsetx'] : 0;
            var offsety = document.all ? this.properties['chart.shadow.offsety'] : 0;

            this.context.beginPath();
            this.context.fillStyle = this.properties['chart.shadow.color'];

            this.context.shadowColor   = this.properties['chart.shadow.color'];
            this.context.shadowBlur    = this.properties['chart.shadow.blur'];
            this.context.shadowOffsetX = this.properties['chart.shadow.offsetx'];
            this.context.shadowOffsetY = this.properties['chart.shadow.offsety'];
            
            this.context.arc(this.centerx + offsetx, this.centery + offsety, this.radius, 0, TWOPI, 0);
            
            this.context.fill();
            
            // Now turn off the shadow
            RGraph.NoShadow(this);
        }

        /**
        * The total of the array of values
        */
        this.total = RGraph.array_sum(this.data);
        var tot    = this.total;
        var data   = this.data;

        for (var i=0,len=this.data.length; i<len; i++) {
            
            var angle = ((data[i] / tot) * TWOPI);

            // Draw the segment
            this.DrawSegment(angle,this.properties['chart.colors'][i],i == (len - 1), i);
        }

        RGraph.NoShadow(this);


        /**
        * Redraw the seperating lines
        */
        if (this.properties['chart.linewidth'] > 0) {
            this.DrawBorders();
        }

        /**
        * Now draw the segments again with shadow turned off. This is always performed,
        * not just if the shadow is on.
        */
        var len = this.angles.length;
        var r   = this.radius;

        for (var i=0; i<len; i++) {
        
            var segment = this.angles[i];
    
            this.context.beginPath();
                this.context.strokeStyle = typeof(this.properties['chart.strokestyle']) == 'object' ? this.properties['chart.strokestyle'][i] : this.properties['chart.strokestyle'];
                this.context.fillStyle = this.properties['chart.colors'][i];
                
                this.context.arc(segment[2],
                                 segment[3],
                                 r,
                                 (segment[0]),
                                 (segment[1]),
                                 false);
                if (this.properties['chart.variant'] == 'donut') {

                    this.context.arc(segment[2],
                                     segment[3],
                                     typeof(this.properties['chart.variant.donut.width']) == 'number' ? r - this.properties['chart.variant.donut.width'] : r / 2,
                                     (segment[1]),
                                     (segment[0]),
                                     true);
                    
                } else {
                    this.context.lineTo(segment[2], segment[3]);
                }
            this.context.closePath();
            this.context.stroke();
            this.context.fill();
        }


        /**
        * Draw label sticks
        */
        if (this.properties['chart.labels.sticks']) {
            
            this.DrawSticks();

            // Redraw the border going around the Pie chart if the stroke style is NOT white
            var strokeStyle = this.properties['chart.strokestyle'];
            var isWhite     =    strokeStyle == 'white'
                              || strokeStyle == '#fff'
                              || strokeStyle == '#fffffff'
                              || strokeStyle == 'rgb(255,255,255)'
                              || strokeStyle == 'rgba(255,255,255,0)';

            if (!isWhite || (isWhite && this.properties['chart.shadow'])) {
               // Again (?)
              this.DrawBorders();
           }
        }

        /**
        * Draw the labels
        */
        if (this.properties['chart.labels']) {
            this.DrawLabels();
        }
        
        
        /**
        * Draw centerpin if requested
        */
        if (this.properties['chart.centerpin']) {
            this.DrawCenterpin();
        }




        /**
        * Draw ingraph labels
        */
        if (this.properties['chart.labels.ingraph']) {
            this.DrawInGraphLabels();
        }

        
        /**
        * Setup the context menu if required
        */
        if (this.properties['chart.contextmenu']) {
            RGraph.ShowContext(this);
        }



        /**
        * If a border is pecified, draw it
        */
        if (this.properties['chart.border']) {
            this.context.beginPath();
            this.context.lineWidth = 5;
            this.context.strokeStyle = this.properties['chart.border.color'];

            this.context.arc(this.centerx,
                             this.centery,
                             this.radius - 2,
                             0,
                             TWOPI,
                             0);

            this.context.stroke();
        }
        
        /**
        * Draw the kay if desired
        */
        if (this.properties['chart.key'] && this.properties['chart.key'].length) {
            RGraph.DrawKey(this, this.properties['chart.key'], this.properties['chart.colors']);
        }

        RGraph.NoShadow(this);

        
        /**
        * This function enables resizing
        */
        if (this.properties['chart.resizable']) {
            RGraph.AllowResizing(this);
        }


        /**
        * This installs the event listeners
        */
        if (this.properties['chart.events'] == true) {
            RGraph.InstallEventListeners(this);
        }


        /**
        * Fire the RGraph ondraw event
        */
        RGraph.FireCustomEvent(this, 'ondraw');
    }


    /**
    * Draws a single segment of the pie chart
    * 
    * @param int degrees The number of degrees for this segment
    */
    RGraph.Pie.prototype.DrawSegment = function (radians, color, last, index)
    {
        var context  = this.context;
        var canvas   = this.canvas;
        var subTotal = this.subTotal;
            radians  = radians * this.properties['chart.effect.roundrobin.multiplier'];

        context.beginPath();

            context.fillStyle   = color;
            context.strokeStyle = this.properties['chart.strokestyle'];
            context.lineWidth   = 0;

            if (this.properties['chart.shadow']) {
                RGraph.SetShadow(this,
                                 this.properties['chart.shadow.color'],
                                 this.properties['chart.shadow.offsetx'],
                                 this.properties['chart.shadow.offsety'],
                                 this.properties['chart.shadow.blur']);
            }

            /**
            * Exploded segments
            */
            if ( (typeof(this.properties['chart.exploded']) == 'object' && this.properties['chart.exploded'][index] > 0) || typeof(this.properties['chart.exploded']) == 'number') {
                var explosion = typeof(this.properties['chart.exploded']) == 'number' ? this.properties['chart.exploded'] : this.properties['chart.exploded'][index];
                var x         = 0;
                var y         = 0;
                var h         = explosion;
                var t         = subTotal + (radians / 2);
                var x         = (Math.cos(t) * explosion);
                var y         = (Math.sin(t) * explosion);
                var r         = this.radius;
            
                this.context.moveTo(this.centerx + x, this.centery + y);
            } else {
                var x = 0;
                var y = 0;
                var r = this.radius;
            }
            
            /**
            * Calculate the angles
            */
            var startAngle = subTotal;
            var endAngle   = ((subTotal + radians));

            context.arc(this.centerx + x,
                        this.centery + y,
                        r,
                        startAngle,
                        endAngle,
                        0);

            if (this.properties['chart.variant'] == 'donut') {

                context.arc(this.centerx + x,
                            this.centery + y,
                            typeof(this.properties['chart.variant.donut.width']) == 'number' ? r - this.properties['chart.variant.donut.width'] : r / 2,
                            endAngle,
                            startAngle,
                            true);
            } else {
                context.lineTo(this.centerx + x, this.centery + y);
            }

        this.context.closePath();


        // Keep hold of the angles
        this.angles.push([subTotal, subTotal + radians, this.centerx + x, this.centery + y]);


        
        //this.context.stroke();
        this.context.fill();

        /**
        * Calculate the segment angle
        */
        this.subTotal += radians;
    }

    /**
    * Draws the graphs labels
    */
    RGraph.Pie.prototype.DrawLabels = function ()
    {
        var hAlignment = 'left';
        var vAlignment = 'center';
        var labels     = this.properties['chart.labels'];
        var context    = this.context;
        var font       = this.properties['chart.text.font'];
        var text_size  = this.properties['chart.text.size'];
        var cx         = this.centerx;
        var cy         = this.centery;
        var r          = this.radius;

        /**
        * Turn the shadow off
        */
        RGraph.NoShadow(this);
        
        context.fillStyle = 'black';
        context.beginPath();

        /**
        * Draw the key (ie. the labels)
        */
        if (labels && labels.length) {

            for (i=0; i<this.angles.length; ++i) {
            
                var segment = this.angles[i];
            
                if (typeof(labels[i]) != 'string' && typeof(labels[i]) != 'number') {
                    continue;
                }

                // Move to the centre
                context.moveTo(cx,cy);
                
                var a = segment[0] + ((segment[1] - segment[0]) / 2);

                var angle = ((segment[1] - segment[0]) / 2) + segment[0];

                /**
                * Handle the additional "explosion" offset
                */
                if (typeof(this.properties['chart.exploded']) == 'object' && this.properties['chart.exploded'][i] || typeof(this.properties['chart.exploded']) == 'number') {

                    var t = ((segment[1] - segment[0]) / 2);
                    var seperation = typeof(this.properties['chart.exploded']) == 'number' ? this.properties['chart.exploded'] : this.properties['chart.exploded'][i];

                    // Adjust the angles
                    var explosion_offsetx = (Math.cos(angle) * seperation);
                    var explosion_offsety = (Math.sin(angle) * seperation);
                } else {
                    var explosion_offsetx = 0;
                    var explosion_offsety = 0;
                }
                
                /**
                * Allow for the label sticks
                */
                if (this.properties['chart.labels.sticks']) {
                    explosion_offsetx += (Math.cos(angle) * this.properties['chart.labels.sticks.length']);
                    explosion_offsety += (Math.sin(angle) * this.properties['chart.labels.sticks.length']);
                }

                /**
                * Coords for the text
                */
                var x = cx + explosion_offsetx + ((r + 10)* Math.cos(a)) + (this.properties['chart.labels.sticks'] ? (a < HALFPI || a > (TWOPI + HALFPI) ? 2 : -2) : 0)
                var y = cy + explosion_offsety + (((r + 10) * Math.sin(a)));

                /**
                * Alignment
                */
                vAlignment = y < cy ? 'bottom' : 'top';
                hAlignment = x < cx ? 'right' : 'left';

                context.fillStyle = this.properties['chart.text.color'];
                if (   typeof(this.properties['chart.labels.colors']) == 'object' && this.properties['chart.labels.colors'] && this.properties['chart.labels.colors'][i]) {
                    this.context.fillStyle = this.properties['chart.labels.colors'][i];
                }

                RGraph.Text(context,font,text_size,x,y,labels[i],vAlignment,hAlignment);
            }
            
            context.fill();
        }
    }


    /**
    * This function draws the pie chart sticks (for the labels)
    */
    RGraph.Pie.prototype.DrawSticks = function ()
    {
        var context  = this.context;
        var offset   = this.properties['chart.linewidth'] / 2;
        var exploded = this.properties['chart.exploded'];
        var sticks   = this.properties['chart.labels.sticks'];
        var len      = this.angles.length;
        var cx       = this.centerx;
        var cy       = this.centery;
        var r        = this.radius;

        for (var i=0; i<len; ++i) {
        
            var segment = this.angles[i];

            // This allows the chart.labels.sticks to be an array as well as a boolean
            if (typeof(sticks) == 'object' && !sticks[i]) {
                continue;
            }

            var radians = segment[1] - segment[0];

            context.beginPath();
            context.strokeStyle = this.properties['chart.labels.sticks.color'];
            context.lineWidth   = 1;

            var midpoint = (segment[0] + (radians / 2));

            if (typeof(exploded) == 'object' && exploded[i]) {
                var extra = exploded[i];
            } else if (typeof(exploded) == 'number') {
                var extra = exploded;
            } else {
                var extra = 0;
            }

            //context.lineJoin = 'round';
            context.lineWidth = 1;

            context.arc(cx,
                        cy,
                        r + this.properties['chart.labels.sticks.length'] + extra,
                        midpoint,
                        midpoint + 0.001,
                        0);
            context.arc(cx,
                        cy,
                        r + extra + offset,
                        midpoint,
                        midpoint + 0.001,
                        0);

            context.stroke();
        }
    }


    /**
    * The (now Pie chart specific) getSegment function
    * 
    * @param object e The event object
    */
    RGraph.Pie.prototype.getShape =
    RGraph.Pie.prototype.getSegment = function (e)
    {
        RGraph.FixEventObject(e);

        // The optional arg provides a way of allowing some accuracy (pixels)
        var accuracy = arguments[1] ? arguments[1] : 0;

        var canvas      = this.canvas;
        var context     = this.context;
        var mouseCoords = RGraph.getMouseXY(e);
        var mouseX      = mouseCoords[0];
        var mouseY      = mouseCoords[1];
        var r           = this.radius;
        var angles      = this.angles;
        var ret         = [];

        for (var i=0; i<angles.length; ++i) {

            // DRAW THE SEGMENT AGAIN SO IT CAN BE TESTED //////////////////////////
            context.beginPath();
                context.strokeStyle = 'rgba(0,0,0,0)';
                context.arc(angles[i][2], angles[i][3], this.radius, angles[i][0], angles[i][1], false);
                
                if (this.type == 'pie' && this.properties['chart.variant'] == 'donut') {
                    context.arc(angles[i][2], angles[i][3], (typeof(this.properties['chart.variant.donut.width']) == 'number' ? this.radius - this.properties['chart.variant.donut.width'] : this.radius / 2), angles[i][1], angles[i][0], true);
                } else {
                    context.lineTo(angles[i][2], angles[i][3]);
                }
            context.closePath();
                
            if (!context.isPointInPath(mouseX, mouseY)) {
                continue;
            }

            ////////////////////////////////////////////////////////////////////////

            ret[0] = angles[i][2];
            ret[1] = angles[i][3];
            ret[2] = this.radius;
            ret[3] = angles[i][0] - TWOPI;
            ret[4] = angles[i][1];
            ret[5] = i;


            
            if (ret[3] < 0) ret[3] += TWOPI;
            if (ret[4] > TWOPI) ret[4] -= TWOPI;
            
            /**
            * Add the tooltip to the returned shape
            */
            var tooltip = RGraph.parseTooltipText ? RGraph.parseTooltipText(this.properties['chart.tooltips'], ret[5]) : null;
            
            /**
            * Now return textual keys as well as numerics
            */
            ret['object']      = this;
            ret['x']           = ret[0];
            ret['y']           = ret[1];
            ret['radius']      = ret[2];
            ret['angle.start'] = ret[3];
            ret['angle.end']   = ret[4];
            ret['index']       = ret[5];
            ret['tooltip']     = tooltip;

            return ret;
        }
        
        return null;
    }


    RGraph.Pie.prototype.DrawBorders = function ()
    {
        if (this.properties['chart.linewidth'] > 0) {

            this.context.lineWidth = this.properties['chart.linewidth'];
            this.context.strokeStyle = this.properties['chart.strokestyle'];
            
            var r = this.radius;

            for (var i=0,len=this.angles.length; i<len; ++i) {
            
                var segment = this.angles[i];

                this.context.beginPath();
                    this.context.arc(segment[2],
                                     segment[3],
                                     r,
                                     (segment[0]),
                                     (segment[0] + 0.001),
                                     0);
                    this.context.arc(segment[2],
                                     segment[3],
                                     this.properties['chart.variant'] == 'donut' ? (typeof(this.properties['chart.variant.donut.width']) == 'number' ? this.radius - this.properties['chart.variant.donut.width'] : r / 2): r,
                                     segment[0],
                                     segment[0] + 0.0001,
                                     0);
                this.context.closePath();
            
                this.context.stroke();
            }
        }
    }


    /**
    * Returns the radius of the pie chart
    * 
    * [06-02-2012] Maintained for compatibility ONLY.
    */
    RGraph.Pie.prototype.getRadius = function ()
    {

        this.graph        = {};
        this.graph.width  = this.canvas.width - this.properties['chart.gutter.left'] - this.properties['chart.gutter.right'];
        this.graph.height = this.canvas.height - this.properties['chart.gutter.top'] - this.properties['chart.gutter.bottom'];

        if (typeof(this.properties['chart.radius']) == 'number') {
            this.radius = this.properties['chart.radius'];
        } else {
            this.radius = Math.min(this.graph.width, this.graph.height) / 2;
        }

        return this.radius;
    }


    /**
    * A programmatic explode function
    * 
    * @param object obj   The chart object
    * @param number index The zero-indexed number of the segment
    * @param number size  The size (in pixels) of the explosion
    */
    RGraph.Pie.prototype.Explode = function (index, size)
    {

        var obj = this;
        
        //this.Set('chart.exploded', []);
        if (!this.properties['chart.exploded']) {
            this.properties['chart.exploded'] = [];
        }
        this.properties['chart.exploded'][index] = 0;

        for (var o=0; o<size; ++o) {

            setTimeout(
                function ()
                {
                    obj.properties['chart.exploded'][index] += 1;
                    RGraph.Clear(obj.canvas);
                    RGraph.RedrawCanvas(obj.canvas);
                }, o * (document.all ? 25 : 16.666));
        }
    }


    /**
    * This function highlights a segment
    * 
    * @param array segment The segment information that is returned by the pie.getSegment(e) function
    */
    RGraph.Pie.prototype.highlight_segment = function (segment)
    {
        var context = this.context;

        context.beginPath();
    
        context.strokeStyle = this.properties['chart.highlight.style.2d.stroke'];
        context.fillStyle   = this.properties['chart.highlight.style.2d.fill'];
    
        context.moveTo(segment[0], segment[1]);
        context.arc(segment[0], segment[1], segment[2], this.angles[segment[5]][0], this.angles[segment[5]][1], 0);
        context.lineTo(segment[0], segment[1]);
        context.closePath();
        
        context.stroke();
        context.fill();
    }


    /**
    * Each object type has its own Highlight() function which highlights the appropriate shape
    * 
    * @param object shape The shape to highlight
    */
    RGraph.Pie.prototype.Highlight = function (shape)
    {
        if (this.properties['chart.tooltips.highlight']) {
            /**
            * 3D style of highlighting
            */
            if (this.properties['chart.highlight.style'] == '3d') {
        
                this.context.lineWidth = 1;
                
                // This is the extent of the 2D effect. Bigger values will give the appearance of a larger "protusion"
                var extent = 2;
        
                // Draw a white-out where the segment is
                this.context.beginPath();
                    RGraph.NoShadow(this);
                    this.context.fillStyle   = 'rgba(0,0,0,0)';
                    this.context.arc(shape['x'], shape['y'], shape['radius'], shape['angle.start'], shape['angle.end'], false);
                    if (this.properties['chart.variant'] == 'donut') {
                        this.context.arc(shape['x'], shape['y'], shape['radius'] / 5, shape['angle.end'], shape['angle.start'], true);
                    } else {
                        this.context.lineTo(shape['x'], shape['y']);
                    }
                this.context.closePath();
                this.context.fill();
    
                // Draw the new segment
                this.context.beginPath();
    
                    this.context.shadowColor   = '#666';
                    this.context.shadowBlur    = 3;
                    this.context.shadowOffsetX = 3;
                    this.context.shadowOffsetY = 3;
    
                    this.context.fillStyle   = this.properties['chart.colors'][shape['index']];
                    this.context.strokeStyle = this.properties['chart.strokestyle'];
                    this.context.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'], shape['angle.start'], shape['angle.end'], false);
                    if (this.properties['chart.variant'] == 'donut') {
                        this.context.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'] / 2, shape['angle.end'], shape['angle.start'],  true)
                    } else {
                        this.context.lineTo(shape['x'] - extent, shape['y'] - extent);
                    }
                this.context.closePath();
                
                this.context.stroke();
                this.context.fill();
                
                // Turn off the shadow
                RGraph.NoShadow(this);
    
                /**
                * If a border is defined, redraw that
                */
                if (this.properties['chart.border']) {
                    this.context.beginPath();
                    this.context.strokeStyle = obj.properties['chart.border.color'];
                    this.context.lineWidth = 5;
                    this.context.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'] - 2, shape['angle.start'], shape['angle.end'], false);
                    this.context.stroke();
                }
    
    
    
    
            // Default 2D style of  highlighting
            } else {

                this.context.beginPath();

                    this.context.strokeStyle = this.properties['chart.highlight.style.2d.stroke'];
                    this.context.fillStyle   = this.properties['chart.highlight.style.2d.fill'];
                    
                    if (this.properties['chart.variant'] == 'donut') {
                        this.context.arc(shape['x'], shape['y'], shape['radius'], shape['angle.start'], shape['angle.end'], false);
                        this.context.arc(shape['x'], shape['y'], typeof(this.properties['chart.variant.donut.width']) == 'number' ? this.radius - this.properties['chart.variant.donut.width'] : shape['radius'] / 2, shape['angle.end'], shape['angle.start'], true);
                    } else {
                        this.context.arc(shape['x'], shape['y'], shape['radius'] + 1, shape['angle.start'], shape['angle.end'], false);
                        this.context.lineTo(shape['x'], shape['y']);
                    }
                this.context.closePath();
    
                //this.context.stroke();
                this.context.fill();
            }
        }
    }



    /**
    * The getObjectByXY() worker method. The Pie chart is able to use the
    * getShape() method - so it does.
    */
    RGraph.Pie.prototype.getObjectByXY = function (e)
    {
        if (this.getShape(e)) {
            return this;
        }
    }
    
    
    
    /**
    * Draws the centerpin if requested
    */
    RGraph.Pie.prototype.DrawCenterpin = function ()
    {
        if (typeof(this.properties['chart.centerpin']) == 'number' && this.properties['chart.centerpin'] > 0) {
        
            var cx = this.centerx;
            var cy = this.centery;
        
            this.context.beginPath();
                this.context.strokeStyle = this.properties['chart.centerpin.stroke'] ? this.properties['chart.centerpin.stroke'] : this.properties['chart.strokestyle'];
                this.context.fillStyle = this.properties['chart.centerpin.fill'] ? this.properties['chart.centerpin.fill'] : this.properties['chart.strokestyle'];
                this.context.moveTo(cx, cy);
                this.context.arc(cx, cy, this.properties['chart.centerpin'], 0, TWOPI, false);                
            this.context.stroke();
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
    RGraph.Pie.prototype.positionTooltip = function (obj, x, y, tooltip, idx)
    {
        var coordX      = obj.angles[idx][2];
        var coordY      = obj.angles[idx][3];
        var angleStart  = obj.angles[idx][0];
        var angleEnd    = obj.angles[idx][1];
        var angleCenter = ((angleEnd - angleStart) / 2) + angleStart;
        var canvasXY    = RGraph.getCanvasXY(obj.canvas);
        var gutterLeft  = obj.properties['chart.gutter.left'];
        var gutterTop   = obj.properties['chart.gutter.top'];
        var width       = tooltip.offsetWidth;
        var height      = tooltip.offsetHeight;
        var x           = canvasXY[0] + this.angles[idx][2] + (Math.cos(angleCenter) * (this.properties['chart.variant'] == 'donut' && typeof(this.properties['chart.variant.donut.width']) == 'number' ? ((this.radius - this.properties['chart.variant.donut.width']) + (this.properties['chart.variant.donut.width'] / 2)) : (this.radius * (this.properties['chart.variant'] == 'donut' ? 0.75 : 0.5))));
        var y           = canvasXY[1] + this.angles[idx][3] + (Math.sin(angleCenter) * (this.properties['chart.variant'] == 'donut' && typeof(this.properties['chart.variant.donut.width']) == 'number' ? ((this.radius - this.properties['chart.variant.donut.width']) + (this.properties['chart.variant.donut.width'] / 2)) : (this.radius * (this.properties['chart.variant'] == 'donut' ? 0.75 : 0.5))));

        
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
        if ((x - (width / 2)) < 10) {
            tooltip.style.left = (x - (width * 0.1)) + 'px';
            tooltip.style.top  = (y - height - 4) + 'px';
            img.style.left = ((width * 0.1) - 8.5) + 'px';

        // RIGHT edge
        } else if ((x + (width / 2)) > (document.body.offsetWidth - 10) ) {
            tooltip.style.left = (x - (width * 0.9)) + 'px';
            tooltip.style.top  = (y - height - 4) + 'px';
            img.style.left = ((width * 0.9) - 8.5) + 'px';

        // Default positioning - CENTERED
        } else {
            tooltip.style.left = (x - (width / 2)) + 'px';
            tooltip.style.top  = (y - height - 4) + 'px';
            img.style.left = ((width * 0.5) - 8.5) + 'px';
        }
    }



    /**
    * This draws Ingraph labels
    */
    RGraph.Pie.prototype.DrawInGraphLabels = function ()
    {
        var context = this.context;
        var cx      = this.centerx;
        var cy      = this.centery;
        
        if (this.properties['chart.variant'] == 'donut') {
            var r = this.radius * 0.75;
            
            if (typeof(this.properties['chart.variant.donut.width']) == 'number') {
                var r = (this.radius - this.properties['chart.variant.donut.width']) + (this.properties['chart.variant.donut.width'] / 2);
            }
        } else {
            var r = this.radius / 2;
        }

        for (var i=0; i<this.angles.length; ++i) {

            // This handles any explosion that the segment may have
            if (typeof(this.properties['chart.exploded']) == 'object' && typeof(this.properties['chart.exploded'][i]) == 'number') {
                var explosion = this.properties['chart.exploded'][i];
            } else if (typeof(this.properties['chart.exploded']) == 'number') {
                var explosion = parseInt(this.properties['chart.exploded']);
            } else {
                var explosion = 0;
            }

            var angleStart  = this.angles[i][0];
            var angleEnd    = this.angles[i][1];
            var angleCenter = ((angleEnd - angleStart) / 2) + angleStart;
            var coords      = RGraph.getRadiusEndPoint(this.centerx, this.centery, angleCenter, r + (explosion ? explosion : 0) );
            var x           = coords[0];
            var y           = coords[1];

            var text = this.properties['chart.labels.ingraph.specific'] && typeof(this.properties['chart.labels.ingraph.specific'][i]) == 'string' ? this.properties['chart.labels.ingraph.specific'][i] : RGraph.number_format(this, this.data[i], this.properties['chart.labels.ingraph.units.pre'] , this.properties['chart.labels.ingraph.units.post']);

            if (text) {
                this.context.beginPath();
                    RGraph.Text(this.context,
                                typeof(this.properties['chart.labels.ingraph.font']) == 'string' ? this.properties['chart.labels.ingraph.font'] : this.properties['chart.text.font'],
                                typeof(this.properties['chart.labels.ingraph.size']) == 'number' ? this.properties['chart.labels.ingraph.size'] : this.properties['chart.text.size'] + 2,
                                x,
                                y,
                                text,
                                'center',
                                'center',
                                true,
                                null,
                                'white');
                this.context.stroke();
            }
        }
    }



    /**
    * This returns the angle for a value based around the maximum number
    * 
    * @param number value The value to get the angle for
    */
    RGraph.Pie.prototype.getAngle = function (value)
    {
        if (value > this.total) {
            return null;
        }
        
        var angle = (value / this.total) * TWOPI;

        // Handle the origin (it can -HALFPI or 0)
        angle += this.properties['chart.origin'];

        return angle;
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.Pie.prototype.parseColors = function ()
    {
        var props = this.properties;

        for (var i=0; i<this.properties['chart.colors'].length; ++i) {
            this.properties['chart.colors'][i] = this.parseSingleColorForGradient(this.properties['chart.colors'][i]);
        }

        var keyColors = props['chart.key.colors'];
        if (keyColors) {
            for (var i=0; i<keyColors.length; ++i) {
                keyColors[i] = this.parseSingleColorForGradient(keyColors[i]);
            }
        }

        props['chart.chart.strokestyle']         = this.parseSingleColorForGradient(props['chart.strokestyle']);
        props['chart.highlight.stroke']          = this.parseSingleColorForGradient(props['chart.highlight.stroke']);
        props['chart.highlight.style.2d.fill']   = this.parseSingleColorForGradient(props['chart.highlight.style.2d.fill']);
        props['chart.highlight.style.2d.stroke'] = this.parseSingleColorForGradient(props['chart.highlight.style.2d.stroke']);
    }



    /**
    * This parses a single color value
    */
    RGraph.Pie.prototype.parseSingleColorForGradient = function (color)
    {
        var canvas  = this.canvas;
        var context = this.context;
        
        if (!color || typeof(color) != 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            // If the chart is a donut - the first width should half the total radius
            if (this.properties['chart.variant'] == 'donut') {
                var radius_start = typeof(this.properties['chart.variant.donut.width']) == 'number' ? this.radius - this.properties['chart.variant.donut.width'] : this.radius / 2;
            } else {
                var radius_start = 0;
            }

            // Create the gradient
            var grad = context.createRadialGradient(this.centerx, this.centery, radius_start, this.centerx, this.centery, Math.min(this.canvas.width - this.properties['chart.gutter.left'] - this.properties['chart.gutter.right'], this.canvas.height - this.properties['chart.gutter.top'] - this.properties['chart.gutter.bottom']) / 2);


            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }

        return grad ? grad : color;
    }