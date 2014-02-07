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
    * The pie chart constructor
    * 
    * @param data array The data to be represented on the Pie chart
    */
    RGraph.Pie = function (id, data)
    {
        this.id                = id;
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
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
            'chart.colors':                 ['Gradient(red:#fcc)', 'Gradient(#ddd:#eee)', 'Gradient(#0f0:#cfc)', 'Gradient(blue:#ccf)', 'Gradient(#FB7BA3:#FCC7EE)', 'Gradient(yellow:#ffc)', 'Gradient(#000:#ccc)', 'Gradient(#EE9D80:#FEE5C8)', 'Gradient(cyan:#ccf)','Gradient(#9E7BF6:#C7B6D2)','Gradient(#78CAEA:#C5FBFD)','Gradient(#E284E9:#FDC4FF)','Gradient(#7F84EF:#FCC4FD)'],
            'chart.strokestyle':            '#999',
            'chart.linewidth':              1,
            'chart.labels':                 [],
            'chart.labels.sticks':          false,
            'chart.labels.sticks.length':   7,
            'chart.labels.sticks.color':    '#aaa',
            'chart.labels.ingraph':         null,
            'chart.labels.ingraph.font':    null,
            'chart.labels.ingraph.size':    null,
            'chart.labels.ingraph.specific':null,
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
    
            if (name == 'chart.highlight.style.2d.color') {
                name = 'chart.highlight.style.2d.fill';
            }
    
            prop[name] = value;
    
            return this;
        }




        /**
        * A generic getter
        */
        this.Get = function (name)
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
    
            return prop[name];
        }




        /**
        * This draws the pie chart
        */
        this.Draw = function ()
        {    
            /**
            * Fire the onbeforedraw event
            */
            RG.FireCustomEvent(this, 'onbeforedraw');
            
            // NB: Colors are parsed further down so that the center X/Y can be used
    
    
            /**
            * This is new in May 2011 and facilitates indiviual gutter settings,
            * eg chart.gutter.left
            */
            this.gutterLeft   = prop['chart.gutter.left'];
            this.gutterRight  = prop['chart.gutter.right'];
            this.gutterTop    = prop['chart.gutter.top'];
            this.gutterBottom = prop['chart.gutter.bottom'];
    
    
            
            this.radius     = this.getRadius();// MUST be first
            this.centerx    = (this.graph.width / 2) + this.gutterLeft
            this.centery    = (this.graph.height / 2) + this.gutterTop
            this.subTotal   = this.properties['chart.origin'];
            this.angles     = [];
            this.coordsText = [];
    
            /**
            * Allow specification of a custom radius & center X/Y
            */
            if (typeof(prop['chart.radius']) == 'number')  this.radius  = prop['chart.radius'];
            if (typeof(prop['chart.centerx']) == 'number') this.centerx = prop['chart.centerx'];
            if (typeof(prop['chart.centery']) == 'number') this.centery = prop['chart.centery'];
    
    
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
            if (prop['chart.labels.colors'].length < prop['chart.labels'].length) {
                while (prop['chart.labels.colors'].length < prop['chart.labels'].length) {
                    prop['chart.labels.colors'].push(prop['chart.labels.colors'][prop['chart.labels.colors'].length - 1]);
                }
            } else {
                if (typeof(prop['chart.labels.colors']) == 'undefined') {
                    prop['chart.labels.colors'] = [];
                }
                while (prop['chart.labels.colors'].length < prop['chart.labels'].length) {
                    prop['chart.labels.colors'].push(prop['chart.text.color']);
                }
            }
    
            /**
            * Draw the title
            */
            RG.DrawTitle(this,
                         prop['chart.title'],
                         (ca.height / 2) - this.radius - 5,
                         this.centerx,
                         prop['chart.title.size'] ? prop['chart.title.size'] : prop['chart.text.size'] + 2);
    
            /**
            * Draw the shadow if required
            */
            if (prop['chart.shadow'] && false) {
            
                var offsetx = document.all ? prop['chart.shadow.offsetx'] : 0;
                var offsety = document.all ? prop['chart.shadow.offsety'] : 0;
    
                co.beginPath();
                co.fillStyle = prop['chart.shadow.color'];
    
                co.shadowColor   = prop['chart.shadow.color'];
                co.shadowBlur    = prop['chart.shadow.blur'];
                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                co.shadowOffsetY = prop['chart.shadow.offsety'];
                
                co.arc(this.centerx + offsetx, this.centery + offsety, this.radius, 0, TWOPI, 0);
                
                co.fill();
                
                // Now turn off the shadow
                RG.NoShadow(this);
            }

            /**
            * The total of the array of values
            */
            this.total = RG.array_sum(this.data);
            var tot    = this.total;
            var data   = this.data;

            for (var i=0,len=this.data.length; i<len; i++) {
                
                var angle = ((data[i] / tot) * TWOPI);
    
                // Draw the segment
                this.DrawSegment(angle,prop['chart.colors'][i],i == (len - 1), i);
            }

            RG.NoShadow(this);


            /**
            * Redraw the seperating lines
            */
            if (prop['chart.linewidth'] > 0) {
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
        
                co.beginPath();
                    co.strokeStyle = typeof(prop['chart.strokestyle']) == 'object' ? prop['chart.strokestyle'][i] : prop['chart.strokestyle'];
                    prop['chart.colors'][i] ?  co.fillStyle = prop['chart.colors'][i] : null;
                    co.lineJoin = 'round';
                    
                    co.arc(segment[2],
                           segment[3],
                           r,
                           (segment[0]),
                           (segment[1]),
                           false);
                    if (prop['chart.variant'] == 'donut') {
    
                        co.arc(segment[2],
                               segment[3],
                               typeof(prop['chart.variant.donut.width']) == 'number' ? r - prop['chart.variant.donut.width'] : r / 2,
                               (segment[1]),
                               (segment[0]),
                               true);
                        
                    } else {
                        co.lineTo(segment[2], segment[3]);
                    }
                co.closePath();
                co.stroke();
                co.fill();
            }
    

            /**
            * Draw label sticks
            */
            if (prop['chart.labels.sticks']) {
                
                this.DrawSticks();
    
                // Redraw the border going around the Pie chart if the stroke style is NOT white
                var strokeStyle = prop['chart.strokestyle'];
               //var isWhite     =    strokeStyle == 'white'
               //                  || strokeStyle == '#fff'
               //                  || strokeStyle == '#fffffff'
               //                  || strokeStyle == 'rgb(255,255,255)'
               //                  || strokeStyle == 'rgba(255,255,255,0)';

               // if (!isWhite || (isWhite && this.properties['chart.shadow'])) {
               //    // Again (?)
               //   this.DrawBorders();
               //}
            }

            /**
            * Draw the labels
            */
            if (prop['chart.labels']) {
                this.DrawLabels();
            }
            
            
            /**
            * Draw centerpin if requested
            */
            if (prop['chart.centerpin']) {
                this.DrawCenterpin();
            }
    
    
    
    
            /**
            * Draw ingraph labels
            */
            if (prop['chart.labels.ingraph']) {
                this.DrawInGraphLabels();
            }
    
            
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
            }
    
    
    
            /**
            * If a border is pecified, draw it
            */
            if (prop['chart.border']) {
                co.beginPath();
                co.lineWidth = 5;
                co.strokeStyle = prop['chart.border.color'];
    
                co.arc(this.centerx,
                       this.centery,
                       this.radius - 2,
                       0,
                       TWOPI,
                       0);
    
                co.stroke();
            }

            /**
            * Draw the kay if desired
            */
            if (prop['chart.key'] && prop['chart.key'].length) {
                RG.DrawKey(this, prop['chart.key'], prop['chart.colors']);
            }
    
            RG.NoShadow(this);
    
            
            /**
            * This function enables resizing
            */
            if (prop['chart.resizable']) {
                RG.AllowResizing(this);
            }
    
    
            /**
            * This installs the event listeners
            */
            if (prop['chart.events'] == true) {
                RG.InstallEventListeners(this);
            }
    
    
            /**
            * Fire the RGraph ondraw event
            */
            RG.FireCustomEvent(this, 'ondraw');
            
            return this;
        }




        /**
        * Draws a single segment of the pie chart
        * 
        * @param int degrees The number of degrees for this segment
        */
        this.DrawSegment = function (radians, color, last, index)
        {
            // IE7/8/ExCanvas fix (when there's only one segment the Pie chart doesn't display
            if (ISOLD && radians == TWOPI) {
                radians -= 0.0001;
            } else if (ISOLD && radians == 0) {
                radians = 0.001;
            }
    
            var context  = co;
            var canvas   = ca;
            var subTotal = this.subTotal;
                radians  = radians * prop['chart.effect.roundrobin.multiplier'];
    
            co.beginPath();
    
                color ? co.fillStyle   = color : null;
                co.strokeStyle = prop['chart.strokestyle'];
                co.lineWidth   = 0;
    
                if (prop['chart.shadow']) {
                    RG.SetShadow(this,
                                 prop['chart.shadow.color'],
                                 prop['chart.shadow.offsetx'],
                                 prop['chart.shadow.offsety'],
                                 prop['chart.shadow.blur']);
                }
    
                /**
                * Exploded segments
                */
                if ( (typeof(prop['chart.exploded']) == 'object' && prop['chart.exploded'][index] > 0) || typeof(prop['chart.exploded']) == 'number') {
                    
                    var explosion = typeof(prop['chart.exploded']) == 'number' ? prop['chart.exploded'] : prop['chart.exploded'][index];
                    var x         = 0;
                    var y         = 0;
                    var h         = explosion;
                    var t         = subTotal + (radians / 2);
                    var x         = (Math.cos(t) * explosion);
                    var y         = (Math.sin(t) * explosion);
                    var r         = this.radius;
                
                    co.moveTo(this.centerx + x, this.centery + y);
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
    
                co.arc(this.centerx + x,
                       this.centery + y,
                       r,
                       startAngle,
                       endAngle,
                       0);
    
                if (prop['chart.variant'] == 'donut') {
    
                    co.arc(this.centerx + x,
                           this.centery + y,
                           typeof(prop['chart.variant.donut.width']) == 'number' ? r - prop['chart.variant.donut.width'] : r / 2,
                           endAngle,
                           startAngle,
                           true);
                } else {
                    co.lineTo(this.centerx + x, this.centery + y);
                }
    
            co.closePath();
    
    
            // Keep hold of the angles
            this.angles.push([subTotal, subTotal + radians, this.centerx + x, this.centery + y]);
    
    
            
            //co.stroke();
            co.fill();
    
            /**
            * Calculate the segment angle
            */
            this.subTotal += radians;
        }




        /**
        * Draws the graphs labels
        */
        this.DrawLabels = function ()
        {
            var hAlignment = 'left';
            var vAlignment = 'center';
            var labels     = prop['chart.labels'];
            var context    = co;
            var font       = prop['chart.text.font'];
            var text_size  = prop['chart.text.size'];
            var cx         = this.centerx;
            var cy         = this.centery;
            var r          = this.radius;
    
            /**
            * Turn the shadow off
            */
            RG.NoShadow(this);
            
            co.fillStyle = 'black';
            co.beginPath();
    
            /**
            * Draw the labels
            */
            if (labels && labels.length) {
    
                for (i=0; i<this.angles.length; ++i) {
                
                    var segment = this.angles[i];
                
                    if (typeof(labels[i]) != 'string' && typeof(labels[i]) != 'number') {
                        continue;
                    }
    
                    // Move to the centre
                    co.moveTo(cx,cy);
                    
                    var a = segment[0] + ((segment[1] - segment[0]) / 2);
                    var angle = ((segment[1] - segment[0]) / 2) + segment[0];
    
                    /**
                    * Handle the additional "explosion" offset
                    */
                    if (typeof(prop['chart.exploded']) == 'object' && prop['chart.exploded'][i] || typeof(prop['chart.exploded']) == 'number') {
    
                        var t = ((segment[1] - segment[0]) / 2);
                        var seperation = typeof(prop['chart.exploded']) == 'number' ? prop['chart.exploded'] : prop['chart.exploded'][i];
    
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
                    if (prop['chart.labels.sticks']) {
                        explosion_offsetx += (Math.cos(angle) * prop['chart.labels.sticks.length']);
                        explosion_offsety += (Math.sin(angle) * prop['chart.labels.sticks.length']);
                    }
    
                    /**
                    * Coords for the text
                    */
                    var x = cx + explosion_offsetx + ((r + 10)* Math.cos(a)) + (prop['chart.labels.sticks'] ? (a < HALFPI || a > (TWOPI + HALFPI) ? 2 : -2) : 0)
                    var y = cy + explosion_offsety + (((r + 10) * Math.sin(a)));
    
                    /**
                    * Alignment
                    */
                    //vAlignment = y < cy ? 'center' : 'center';
                    vAlignment = 'center';
                    hAlignment = x < cx ? 'right' : 'left';
    
                    co.fillStyle = prop['chart.text.color'];
                    if (   typeof(prop['chart.labels.colors']) == 'object' && prop['chart.labels.colors'] && prop['chart.labels.colors'][i]) {
                        co.fillStyle = prop['chart.labels.colors'][i];
                    }
    
    
                    RG.Text2(this, {'font':font,
                                        'size':text_size,
                                        'x':x,
                                        'y':y,
                                        'text':labels[i],
                                        'valign':vAlignment,
                                        'halign':hAlignment,
                                        'tag': 'labels'
                                       });
                }
                
                co.fill();
            }
        }




    
        /**
        * This function draws the pie chart sticks (for the labels)
        */
        this.DrawSticks = function ()
        {
            var context  = co;
            var offset   = prop['chart.linewidth'] / 2;
            var exploded = prop['chart.exploded'];
            var sticks   = prop['chart.labels.sticks'];
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
    
                co.beginPath();
                co.strokeStyle = prop['chart.labels.sticks.color'];
                co.lineWidth   = 1;
    
                var midpoint = (segment[0] + (radians / 2));
    
                if (typeof(exploded) == 'object' && exploded[i]) {
                    var extra = exploded[i];
                } else if (typeof(exploded) == 'number') {
                    var extra = exploded;
                } else {
                    var extra = 0;
                }
    
                //context.lineJoin = 'round';
                co.lineWidth = 1;
    
                co.arc(cx,
                       cy,
                       r + prop['chart.labels.sticks.length'] + extra,
                       midpoint,
                       midpoint + 0.001,
                       0);
                co.arc(cx,
                       cy,
                       r + extra + offset,
                       midpoint,
                       midpoint + 0.001,
                       0);
    
                co.stroke();
            }
        }
    
    
    
        /**
        * The (now Pie chart specific) getSegment function
        * 
        * @param object e The event object
        */
        this.getShape =
        this.getSegment = function (e)
        {
            RG.FixEventObject(e);
    
            // The optional arg provides a way of allowing some accuracy (pixels)
            var accuracy = arguments[1] ? arguments[1] : 0;
    
            var canvas      = ca;
            var context     = co;
            var mouseCoords = RG.getMouseXY(e);
            var mouseX      = mouseCoords[0];
            var mouseY      = mouseCoords[1];
            var r           = this.radius;
            var angles      = this.angles;
            var ret         = [];
    
            for (var i=0,len=angles.length; i<len; ++i) {
    
                // DRAW THE SEGMENT AGAIN SO IT CAN BE TESTED //////////////////////////
                co.beginPath();
                    co.strokeStyle = 'rgba(0,0,0,0)';
                    co.arc(angles[i][2], angles[i][3], this.radius, angles[i][0], angles[i][1], false);
                    
                    if (this.type == 'pie' && prop['chart.variant'] == 'donut') {
                        co.arc(angles[i][2], angles[i][3], (typeof(prop['chart.variant.donut.width']) == 'number' ? this.radius - prop['chart.variant.donut.width'] : this.radius / 2), angles[i][1], angles[i][0], true);
                    } else {
                        co.lineTo(angles[i][2], angles[i][3]);
                    }
                co.closePath();
                    
                if (!co.isPointInPath(mouseX, mouseY)) {
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
                var tooltip = RG.parseTooltipText ? RG.parseTooltipText(prop['chart.tooltips'], ret[5]) : null;
                
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




        this.DrawBorders = function ()
        {
            if (prop['chart.linewidth'] > 0) {
    
                co.lineWidth = prop['chart.linewidth'];
                co.strokeStyle = prop['chart.strokestyle'];
                
                var r = this.radius;
    
                for (var i=0,len=this.angles.length; i<len; ++i) {
                
                    var segment = this.angles[i];

                    co.beginPath();
                        co.arc(segment[2],
                               segment[3],
                               r,
                               (segment[0]),
                               (segment[0] + 0.001),
                               0);
                        co.arc(segment[2],
                               segment[3],
                               prop['chart.variant'] == 'donut' ? (typeof(prop['chart.variant.donut.width']) == 'number' ? this.radius - prop['chart.variant.donut.width'] : r / 2): r,
                               segment[0],
                               segment[0] + 0.0001,
                               0);
                    co.closePath();
                    co.stroke();
                }
            }
        }




        /**
        * Returns the radius of the pie chart
        * 
        * [06-02-2012] Maintained for compatibility ONLY.
        */
        this.getRadius = function ()
        {
            this.graph = {width: ca.width - prop['chart.gutter.left'] - prop['chart.gutter.right'], height: ca.height - prop['chart.gutter.top'] - prop['chart.gutter.bottom']}
    
            if (typeof(prop['chart.radius']) == 'number') {
                this.radius = prop['chart.radius'];
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
        this.Explode = function (index, size)
        {
            //this.Set('chart.exploded', []);
            if (!prop['chart.exploded']) {
                prop['chart.exploded'] = [];
            }
            
            // If chart.exploded is a number - convert it to an array
            if (typeof(prop['chart.exploded']) == 'number') {
    
                var original_explode = prop['chart.exploded'];
                var exploded = prop['chart.exploded'];
    
                prop['chart.exploded'] = [];
                
                for (var i=0,len=this.data.length; i<len; ++i) {
                    prop['chart.exploded'][i] = exploded;
                }
            }
            
            prop['chart.exploded'][index] = typeof(original_explode) == 'number' ? original_explode : 0;
    
            for (var o=0; o<size; ++o) {
    
                setTimeout(
                    function ()
                    {
                        prop['chart.exploded'][index] += 1;
                        RG.Clear(ca);
                        RG.RedrawCanvas(ca);
                    }, o * (ISIE &&  !ISIE10 ? 25 : 16.666));
            }
        }




        /**
        * This function highlights a segment
        * 
        * @param array segment The segment information that is returned by the pie.getSegment(e) function
        */
        this.highlight_segment = function (segment)
        {
            co.beginPath();
                co.strokeStyle = prop['chart.highlight.style.2d.stroke'];
                co.fillStyle   = prop['chart.highlight.style.2d.fill'];
                co.moveTo(segment[0], segment[1]);
                co.arc(segment[0], segment[1], segment[2], this.angles[segment[5]][0], this.angles[segment[5]][1], 0);
                co.lineTo(segment[0], segment[1]);
            co.closePath();
            
            co.stroke();
            co.fill();
        }




        /**
        * Each object type has its own Highlight() function which highlights the appropriate shape
        * 
        * @param object shape The shape to highlight
        */
        this.Highlight = function (shape)
        {
            if (prop['chart.tooltips.highlight']) {
                /**
                * 3D style of highlighting
                */
                if (prop['chart.highlight.style'] == '3d') {
            
                    co.lineWidth = 1;
                    
                    // This is the extent of the 2D effect. Bigger values will give the appearance of a larger "protusion"
                    var extent = 2;
            
                    // Draw a white-out where the segment is
                    co.beginPath();
                        RG.NoShadow(this);
                        co.fillStyle   = 'rgba(0,0,0,0)';
                        co.arc(shape['x'], shape['y'], shape['radius'], shape['angle.start'], shape['angle.end'], false);
                        if (prop['chart.variant'] == 'donut') {
                            co.arc(shape['x'], shape['y'], shape['radius'] / 5, shape['angle.end'], shape['angle.start'], true);
                        } else {
                            co.lineTo(shape['x'], shape['y']);
                        }
                    co.closePath();
                    co.fill();
        
                    // Draw the new segment
                    co.beginPath();
        
                        co.shadowColor   = '#666';
                        co.shadowBlur    = 3;
                        co.shadowOffsetX = 3;
                        co.shadowOffsetY = 3;
        
                        co.fillStyle   = prop['chart.colors'][shape['index']];
                        co.strokeStyle = prop['chart.strokestyle'];
                        co.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'], shape['angle.start'], shape['angle.end'], false);
                        if (prop['chart.variant'] == 'donut') {
                            co.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'] / 2, shape['angle.end'], shape['angle.start'],  true)
                        } else {
                            co.lineTo(shape['x'] - extent, shape['y'] - extent);
                        }
                    co.closePath();
                    
                    co.stroke();
                    co.fill();
                    
                    // Turn off the shadow
                    RG.NoShadow(this);
        
                    /**
                    * If a border is defined, redraw that
                    */
                    if (prop['chart.border']) {
                        co.beginPath();
                        co.strokeStyle = prop['chart.border.color'];
                        co.lineWidth = 5;
                        co.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'] - 2, shape['angle.start'], shape['angle.end'], false);
                        co.stroke();
                    }
        
        
        
        
                // Default 2D style of  highlighting
                } else {
    
                    co.beginPath();
    
                        co.strokeStyle = prop['chart.highlight.style.2d.stroke'];
                        co.fillStyle   = prop['chart.highlight.style.2d.fill'];
                        
                        if (prop['chart.variant'] == 'donut') {
                            co.arc(shape['x'], shape['y'], shape['radius'], shape['angle.start'], shape['angle.end'], false);
                            co.arc(shape['x'], shape['y'], typeof(prop['chart.variant.donut.width']) == 'number' ? this.radius - prop['chart.variant.donut.width'] : shape['radius'] / 2, shape['angle.end'], shape['angle.start'], true);
                        } else {
                            co.arc(shape['x'], shape['y'], shape['radius'] + 1, shape['angle.start'], shape['angle.end'], false);
                            co.lineTo(shape['x'], shape['y']);
                        }
                    co.closePath();
        
                    //co.stroke();
                    co.fill();
                }
            }
        }




        /**
        * The getObjectByXY() worker method. The Pie chart is able to use the
        * getShape() method - so it does.
        */
        this.getObjectByXY = function (e)
        {
            if (this.getShape(e)) {
                return this;
            }
        }




        /**
        * Draws the centerpin if requested
        */
        this.DrawCenterpin = function ()
        {
            if (typeof(prop['chart.centerpin']) == 'number' && prop['chart.centerpin'] > 0) {
            
                var cx = this.centerx;
                var cy = this.centery;
            
                co.beginPath();
                    co.strokeStyle = prop['chart.centerpin.stroke'] ? prop['chart.centerpin.stroke'] : prop['chart.strokestyle'];
                    co.fillStyle = prop['chart.centerpin.fill'] ? prop['chart.centerpin.fill'] : prop['chart.strokestyle'];
                    co.moveTo(cx, cy);
                    co.arc(cx, cy, prop['chart.centerpin'], 0, TWOPI, false);
                co.stroke();
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
            var coordX      = obj.angles[idx][2];
            var coordY      = obj.angles[idx][3];
            var angleStart  = obj.angles[idx][0];
            var angleEnd    = obj.angles[idx][1];
            var angleCenter = ((angleEnd - angleStart) / 2) + angleStart;
            var canvasXY    = RGraph.getCanvasXY(obj.canvas);
            var gutterLeft  = prop['chart.gutter.left'];
            var gutterTop   = prop['chart.gutter.top'];
            var width       = tooltip.offsetWidth;
            var height      = tooltip.offsetHeight;
            var x           = canvasXY[0] + this.angles[idx][2] + (Math.cos(angleCenter) * (prop['chart.variant'] == 'donut' && typeof(prop['chart.variant.donut.width']) == 'number' ? ((this.radius - prop['chart.variant.donut.width']) + (prop['chart.variant.donut.width'] / 2)) : (this.radius * (prop['chart.variant'] == 'donut' ? 0.75 : 0.5))));
            var y           = canvasXY[1] + this.angles[idx][3] + (Math.sin(angleCenter) * (prop['chart.variant'] == 'donut' && typeof(prop['chart.variant.donut.width']) == 'number' ? ((this.radius - prop['chart.variant.donut.width']) + (prop['chart.variant.donut.width'] / 2)) : (this.radius * (prop['chart.variant'] == 'donut' ? 0.75 : 0.5))));
    
            
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
        this.DrawInGraphLabels = function ()
        {
            var context = co;
            var cx      = this.centerx;
            var cy      = this.centery;
            
            if (prop['chart.variant'] == 'donut') {
                var r = this.radius * 0.75;
                
                if (typeof(prop['chart.variant.donut.width']) == 'number') {
                    var r = (this.radius - prop['chart.variant.donut.width']) + (prop['chart.variant.donut.width'] / 2);
                }
            } else {
                var r = this.radius / 2;
            }
    
            for (var i=0,len=this.angles.length; i<len; ++i) {
    
                // This handles any explosion that the segment may have
                if (typeof(prop['chart.exploded']) == 'object' && typeof(prop['chart.exploded'][i]) == 'number') {
                    var explosion = prop['chart.exploded'][i];
                } else if (typeof(prop['chart.exploded']) == 'number') {
                    var explosion = parseInt(prop['chart.exploded']);
                } else {
                    var explosion = 0;
                }
    
                var angleStart  = this.angles[i][0];
                var angleEnd    = this.angles[i][1];
                var angleCenter = ((angleEnd - angleStart) / 2) + angleStart;
                var coords      = RG.getRadiusEndPoint(this.centerx, this.centery, angleCenter, r + (explosion ? explosion : 0) );
                var x           = coords[0];
                var y           = coords[1];
    
                var text = prop['chart.labels.ingraph.specific'] && typeof(prop['chart.labels.ingraph.specific'][i]) == 'string' ? prop['chart.labels.ingraph.specific'][i] : RG.number_format(this, this.data[i], prop['chart.labels.ingraph.units.pre'] , prop['chart.labels.ingraph.units.post']);
    
                if (text) {
                    co.beginPath();
                        
                        var font = typeof(prop['chart.labels.ingraph.font']) == 'string' ? prop['chart.labels.ingraph.font'] : prop['chart.text.font'];
                        var size = typeof(prop['chart.labels.ingraph.size']) == 'number' ? prop['chart.labels.ingraph.size'] : prop['chart.text.size'] + 2;
    
                        RG.Text2(this, {'font':font,
                                            'size':size,
                                            'x':x,
                                            'y':y,
                                            'text':text,
                                            'valign':'center',
                                            'halign':'center',
                                            'bounding':true,
                                            'boundingFill':'white',
                                            'tag':'labels.ingraph'
                                           });
                    co.stroke();
                }
            }
        }




        /**
        * This returns the angle for a value based around the maximum number
        * 
        * @param number value The value to get the angle for
        */
        this.getAngle = function (value)
        {
            if (value > this.total) {
                return null;
            }
            
            var angle = (value / this.total) * TWOPI;
    
            // Handle the origin (it can br -HALFPI or 0)
            angle += prop['chart.origin'];
    
            return angle;
        }




        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            for (var i=0; i<prop['chart.colors'].length; ++i) {
                prop['chart.colors'][i] = this.parseSingleColorForGradient(prop['chart.colors'][i]);
            }
    
            var keyColors = prop['chart.key.colors'];
            if (keyColors) {
                for (var i=0; i<keyColors.length; ++i) {
                    keyColors[i] = this.parseSingleColorForGradient(keyColors[i]);
                }
            }
    
            prop['chart.chart.strokestyle']         = this.parseSingleColorForGradient(prop['chart.strokestyle']);
            prop['chart.highlight.stroke']          = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
            prop['chart.highlight.style.2d.fill']   = this.parseSingleColorForGradient(prop['chart.highlight.style.2d.fill']);
            prop['chart.highlight.style.2d.stroke'] = this.parseSingleColorForGradient(prop['chart.highlight.style.2d.stroke']);
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
    
                // If the chart is a donut - the first width should half the total radius
                if (prop['chart.variant'] == 'donut') {
                    var radius_start = typeof(prop['chart.variant.donut.width']) == 'number' ? this.radius - prop['chart.variant.donut.width'] : this.radius / 2;
                } else {
                    var radius_start = 0;
                }
    
                // Create the gradient
                var grad = co.createRadialGradient(this.centerx, this.centery, radius_start, this.centerx, this.centery, Math.min(ca.width - prop['chart.gutter.left'] - prop['chart.gutter.right'], ca.height - prop['chart.gutter.top'] - prop['chart.gutter.bottom']) / 2);
    
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
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
            if (this.angles && this.angles[index]) {

                var segment = this.angles[index];
                var x = segment[2];
                var y = segment[3];
                var start = segment[0];
                var end   = segment[1];
                
                co.strokeStyle = prop['chart.key.interactive.highlight.chart.stroke'];
                co.fillStyle = prop['chart.key.interactive.highlight.chart.fill'];
                co.lineWidth = 2;
                co.lineJoin = 'bevel';
                
                co.beginPath();
                co.moveTo(x, y);
                co.arc(x, y, this.radius, start, end, false);
                co.closePath();
                co.fill();
                co.stroke();
            }
        }




        /**
        * Now need to register all chart types. MUST be after the setters/getters are defined
        * 
        * *** MUST BE LAST IN THE CONSTRUCTOR ***
        */
        RGraph.Register(this);
    }