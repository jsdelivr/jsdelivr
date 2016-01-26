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
    * The odometer constructor. Pass it the ID of the canvas tag, the start value of the odo,
    * the end value, and the value that the pointer should point to.
    * 
    * @param string id    The ID of the canvas tag
    * @param int    start The start value of the Odo
    * @param int    end   The end value of the odo
    * @param int    value The indicated value (what the needle points to)
    */
    RGraph.Odometer = function (id, start, end, value)
    {
        this.id                = id
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'odo';
        this.isRGraph          = true;
        this.start             = start;
        this.min               = start;
        this.end               = end;
        this.max               = end;
        this.value             = value;
        this.currentValue      = null;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;
        this.coordsText        = [];


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);


        this.properties = {
            'chart.centerx':                null,
            'chart.centery':                null,
            'chart.radius':                 null,
            'chart.value.text':             false,
            'chart.value.text.decimals':    0,
            'chart.needle.color':           'black',
            'chart.needle.width':           2,
            'chart.needle.head':            true,
            'chart.needle.tail':            true,
            'chart.needle.type':            'pointer',
            'chart.needle.extra':            [],
            'chart.needle.triangle.border': '#aaa',
            'chart.text.size':              10,
            'chart.text.color':             'black',
            'chart.text.font':              'Arial',
            'chart.green.max':              end * 0.75,
            'chart.red.min':                end * 0.9,

            'chart.green.color':            'Gradient(white:#0c0)',
            'chart.yellow.color':           'Gradient(white:#ff0)',
            'chart.red.color':              'Gradient(white:#f00)',

            'chart.label.area':             35,
            'chart.gutter.left':            25,
            'chart.gutter.right':           25,
            'chart.gutter.top':             25,
            'chart.gutter.bottom':          25,
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.font':             null,
            'chart.title.bold':             true,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.contextmenu':            null,
            'chart.linewidth':              1,
            'chart.shadow.inner':           false,
            'chart.shadow.inner.color':     'black',
            'chart.shadow.inner.offsetx':   3,
            'chart.shadow.inner.offsety':   3,
            'chart.shadow.inner.blur':      6,
            'chart.shadow.outer':           false,
            'chart.shadow.outer.color':     '#666',
            'chart.shadow.outer.offsetx':   0,
            'chart.shadow.outer.offsety':   0,
            'chart.shadow.outer.blur':      15,
            'chart.annotatable':            false,
            'chart.annotate.color':         'black',
            'chart.scale.decimals':         0,
            'chart.scale.point':            '.',
            'chart.scale.thousand':         ',',
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
            'chart.units.pre':              '',
            'chart.units.post':             '',
            'chart.border':                 false,
            'chart.border.color1':          '#BEBCB0',
            'chart.border.color2':          '#F0EFEA',
            'chart.border.color3':          '#BEBCB0',
            'chart.tickmarks':              true,
            'chart.tickmarks.highlighted':  false,
            'chart.zerostart':              false,
            'chart.labels':                 null,
            'chart.units.pre':              '',
            'chart.units.post':             '',
            'chart.value.units.pre':        '',
            'chart.value.units.post':       '',
            'chart.key':                    null,
            'chart.key.background':         'white',
            'chart.key.position':           'graph',
            'chart.key.shadow':             false,
            'chart.key.shadow.color':       '#666',
            'chart.key.shadow.blur':        3,
            'chart.key.shadow.offsetx':     2,
            'chart.key.shadow.offsety':     2,
            'chart.key.position.gutter.boxed':false,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.halign':             'right',
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.text.size':          10,
            'chart.key.colors':             null,
            'chart.key.text.color':         'black',
            'chart.adjustable':             false
        }



        /*
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
        * A peudo setter
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
    
            if (name == 'chart.needle.style') {
                alert('[RGRAPH] The RGraph property chart.needle.style has changed to chart.needle.color');
            }
    
            if (name == 'chart.needle.thickness') {
                name = 'chart.needle.width';
            }
    
            if (name == 'chart.value') {
                this.value = value;
                return;
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
    
            if (name == 'chart.value') {
                return this.value;
            }
    
            return prop[name.toLowerCase()];
        }




        /**
        * Draws the odometer
        */
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.FireCustomEvent(this, 'onbeforedraw');
    
            
            /**
            * Set the current value
            */
            this.currentValue = this.value;
    
            /**
            * No longer allow values outside the range of the Odo
            */
            if (this.value > this.end) {
                this.value = this.end;
            }
    
            if (this.value < this.start) {
                this.value = this.start;
            }
    
            /**
            * This is new in May 2011 and facilitates indiviual gutter settings,
            * eg chart.gutter.left
            */
            this.gutterLeft   = prop['chart.gutter.left'];
            this.gutterRight  = prop['chart.gutter.right'];
            this.gutterTop    = prop['chart.gutter.top'];
            this.gutterBottom = prop['chart.gutter.bottom'];
    
            // Work out a few things
            this.radius   = Math.min(
                                     (ca.width - this.gutterLeft - this.gutterRight) / 2,
                                     (ca.height - this.gutterTop - this.gutterBottom) / 2
                                    )
                                    - (prop['chart.border'] ? 25 : 0);
            this.diameter = 2 * this.radius;
            this.centerx  = ((ca.width - this.gutterLeft- this.gutterRight) / 2) + this.gutterLeft;
            this.centery  = ((ca.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop;
            this.range    = this.end - this.start;
            
            /**
            * Move the centerx if the key is defined
            */
            if (prop['chart.key'] && prop['chart.key'].length > 0 && ca.width > ca.height) this.centerx = 5 + this.radius;
            if (typeof(prop['chart.centerx']) == 'number') this.centerx = prop['chart.centerx'];
            if (typeof(prop['chart.centery']) == 'number') this.centery = prop['chart.centery'];
    
            
            /**
            * Allow custom setting of the radius
            */
            if (typeof(prop['chart.radius']) == 'number') {
                this.radius = prop['chart.radius'];
                
                if (prop['chart.border']) {
                    this.radius -= 25;
                }
            }
    
    
            /**
            * Parse the colors for gradients. Its down here so that the center X/Y can be used
            */
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
    
            co.lineWidth = prop['chart.linewidth'];
    
            // Draw the background
            this.DrawBackground();
    
            // And lastly, draw the labels
            this.DrawLabels();
    
            // Draw the needle
            this.DrawNeedle(this.value, prop['chart.needle.color']);
            
            /**
            * Draw any extra needles
            */
            if (prop['chart.needle.extra'].length > 0) {
                for (var i=0; i<prop['chart.needle.extra'].length; ++i) {
                    var needle = prop['chart.needle.extra'][i];
                    this.DrawNeedle(needle[0], needle[1], needle[2]);
                }
            }

            /**
            * Draw the key if requested
            */
            if (prop['chart.key'] && prop['chart.key'].length > 0) {
                // Build a colors array out of the needle colors
                var colors = [prop['chart.needle.color']];
                
                if (prop['chart.needle.extra'].length > 0) {
                    for (var i=0; i<prop['chart.needle.extra'].length; ++i) {
                        var needle = prop['chart.needle.extra'][i];
                        colors.push(needle[1]);
                    }
                }
    
                RG.DrawKey(this, prop['chart.key'], colors);
            }
            
            
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
            }
    
            
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
        * Draws the background
        */
        this.DrawBackground = function ()
        {
            co.beginPath();
    
            /**
            * Turn on the shadow if need be
            */
            if (prop['chart.shadow.outer']) {
                RG.SetShadow(this, prop['chart.shadow.outer.color'], prop['chart.shadow.outer.offsetx'], prop['chart.shadow.outer.offsety'], prop['chart.shadow.outer.blur']);
            }
    
            var backgroundColor = '#eee';
    
            // Draw the grey border
            co.fillStyle = backgroundColor;
            co.arc(this.centerx, this.centery, this.radius, 0.0001, TWOPI, false);
            co.fill();
    
            /**
            * Turn off the shadow
            */
            RG.NoShadow(this);
    
    
            // Draw a circle
            co.strokeStyle = '#666';
            co.arc(this.centerx, this.centery, this.radius, 0, TWOPI, false);
    
            // Now draw a big white circle to make the lines appear as tick marks
            // This is solely for Chrome
            co.fillStyle = backgroundColor;
            co.arc(this.centerx, this.centery, this.radius, 0, TWOPI, false);
            co.fill();
    
            /**
            * Draw more tickmarks
            */
            if (prop['chart.tickmarks']) {
                co.beginPath();
                co.strokeStyle = '#bbb';
            
                for (var i=0; i<=360; i+=3) {
                    co.arc(this.centerx, this.centery, this.radius, 0, i / 57.3, false);
                    co.lineTo(this.centerx, this.centery);
                }
                co.stroke();
            }
    
            co.beginPath();
            co.lineWidth = 1;
            co.strokeStyle = 'black';
    
            // Now draw a big white circle to make the lines appear as tick marks
            co.fillStyle = backgroundColor;
            co.strokeStyle = backgroundColor;
            co.arc(this.centerx, this.centery, this.radius - 5, 0, TWOPI, false);
            co.fill();
            co.stroke();
    
            // Gray lines at 18 degree intervals
            co.beginPath();
            co.strokeStyle = '#ddd';
            for (var i=0; i<360; i+=18) {
                co.arc(this.centerx, this.centery, this.radius, 0, RG.degrees2Radians(i), false);
                co.lineTo(this.centerx, this.centery);
            }
            co.stroke();
            
            // Redraw the outer circle
            co.beginPath();
            co.strokeStyle = 'black';
            co.arc(this.centerx, this.centery, this.radius, 0, TWOPI, false);
            co.stroke();
    
            /**
            * Now draw the center bits shadow if need be
            */
            if (prop['chart.shadow.inner']) {
                co.beginPath();
                RG.SetShadow(this, prop['chart.shadow.inner.color'], prop['chart.shadow.inner.offsetx'], prop['chart.shadow.inner.offsety'], prop['chart.shadow.inner.blur']);
                co.arc(this.centerx, this.centery, this.radius - prop['chart.label.area'], 0, TWOPI, 0);
                co.fill();
                co.stroke();
        
                /**
                * Turn off the shadow
                */
                RG.NoShadow(this);
            }
    
            /*******************************************************
            * Draw the green area
            *******************************************************/
            var greengrad = prop['chart.green.color'];
    
            // Draw the "tick highlight"
            if (prop['chart.tickmarks.highlighted']) {
                co.beginPath();
                co.lineWidth = 5;
                co.strokeStyle = greengrad;
                co.arc(this.centerx, this.centery, this.radius - 2.5,
                
                    -1 * HALFPI,
                    (((prop['chart.green.max'] - this.start)/ (this.end - this.start)) * TWOPI) - HALFPI,
                    0);
    
                co.stroke();
                
                co.lineWidth = 1;
            }
    
            co.beginPath();
                co.fillStyle = greengrad;
                co.arc(
                        this.centerx,
                        this.centery,
                        this.radius - prop['chart.label.area'],
                        0 - HALFPI,
                        (((prop['chart.green.max'] - this.start)/ (this.end - this.start)) * TWOPI) - HALFPI,
                        false
                       );
                co.lineTo(this.centerx, this.centery);
            co.closePath();
            co.fill();
    
    
            /*******************************************************
            * Draw the yellow area
            *******************************************************/
            var yellowgrad = prop['chart.yellow.color'];
    
            // Draw the "tick highlight"
            if (prop['chart.tickmarks.highlighted']) {
                co.beginPath();
                co.lineWidth = 5;
                co.strokeStyle = yellowgrad;
                co.arc(this.centerx, this.centery, this.radius - 2.5, (
                
                    ((prop['chart.green.max'] - this.start) / (this.end - this.start)) * TWOPI) - HALFPI,
                    (((prop['chart.red.min'] - this.start) / (this.end - this.start)) * TWOPI) - HALFPI,
                    0);
    
                co.stroke();
                
                co.lineWidth = 1;
            }
    
            co.beginPath();
                co.fillStyle = yellowgrad;
                co.arc(
                        this.centerx,
                        this.centery,
                        this.radius - prop['chart.label.area'],
                        ( ((prop['chart.green.max'] - this.start) / (this.end - this.start)) * TWOPI) - HALFPI,
                        ( ((prop['chart.red.min'] - this.start) / (this.end - this.start)) * TWOPI) - HALFPI,
                        false
                       );
                co.lineTo(this.centerx, this.centery);
            co.closePath();
            co.fill();
    
            /*******************************************************
            * Draw the red area
            *******************************************************/
            var redgrad = prop['chart.red.color'];
    
            // Draw the "tick highlight"
            if (prop['chart.tickmarks.highlighted']) {
                co.beginPath();
                co.lineWidth = 5;
                co.strokeStyle = redgrad;
                co.arc(this.centerx, this.centery, this.radius - 2.5,(((prop['chart.red.min'] - this.start) / (this.end - this.start)) * TWOPI) - HALFPI,TWOPI - HALFPI,0);
                co.stroke();
                
                co.lineWidth = 1;
            }
    
            co.beginPath();
                co.fillStyle = redgrad;
                co.strokeStyle = redgrad;
                co.arc(
                        this.centerx,
                        this.centery,
                        this.radius - prop['chart.label.area'],
                        (((prop['chart.red.min'] - this.start) / (this.end - this.start)) * TWOPI) - HALFPI,
                        TWOPI - HALFPI,
                        false
                       );
                co.lineTo(this.centerx, this.centery);
            co.closePath();
            co.fill();
    
    
            /**
            * Draw the thick border
            */
            if (prop['chart.border']) {
    
                var grad = co.createRadialGradient(this.centerx, this.centery, this.radius, this.centerx, this.centery, this.radius + 20);
                grad.addColorStop(0, prop['chart.border.color1']);
                grad.addColorStop(0.5, prop['chart.border.color2']);
                grad.addColorStop(1, prop['chart.border.color3']);
    
                
                co.beginPath();
                    co.fillStyle = grad;
                    co.strokeStyle = 'rgba(0,0,0,0)'
                    co.lineWidth = 0.001;
                    co.arc(this.centerx, this.centery, this.radius + 20, 0, TWOPI, 0);
                    co.arc(this.centerx, this.centery, this.radius - 2, TWOPI, 0, 1);
                co.fill();
            }
            
            // Put the linewidth back to what it was
            co.lineWidth = prop['chart.linewidth'];
    
    
            /**
            * Draw the title if specified
            */
            if (prop['chart.title']) {
                RG.DrawTitle(this,
                             prop['chart.title'],
                             this.centery - this.radius,
                             null,
                             prop['chart.title.size'] ? prop['chart.title.size'] : prop['chart.text.size'] + 2);
            }
    
    
            // Draw the big tick marks
            if (!prop['chart.tickmarks.highlighted']) {
                for (var i=18; i<=360; i+=36) {
                    co.beginPath();
                        co.strokeStyle = '#999';
                        co.lineWidth = 2;
                        co.arc(this.centerx, this.centery, this.radius - 1, RG.degrees2Radians(i), RG.degrees2Radians(i+0.01), false);
                        co.arc(this.centerx, this.centery, this.radius - 7, RG.degrees2Radians(i), RG.degrees2Radians(i+0.01), false);
                    co.stroke();
                }
            }
        }




        /**
        * Draws the needle of the odometer
        * 
        * @param number value The value to represent
        * @param string color The color of the needle
        * @param number       The OPTIONAL length of the needle
        */
        this.DrawNeedle = function (value, color)
        {
            // The optional length of the needle
            var length = arguments[2] ? arguments[2] : this.radius - prop['chart.label.area'];
    
            // ===== First draw a grey background circle =====
            
            co.fillStyle = '#999';
    
            co.beginPath();
                co.moveTo(this.centerx, this.centery);
                co.arc(this.centerx, this.centery, 10, 0, TWOPI, false);
                co.fill();
            co.closePath();
    
            co.fill();
    
            // ===============================================
            
            co.fillStyle = color
            co.strokeStyle = '#666';
    
            // Draw the centre bit
            co.beginPath();
                co.moveTo(this.centerx, this.centery);
                co.arc(this.centerx, this.centery, 8, 0, TWOPI, false);
                co.fill();
            co.closePath();
            
            co.stroke();
            co.fill();
    
            if (prop['chart.needle.type'] == 'pointer') {
    
                co.strokeStyle = color;
                co.lineWidth   = prop['chart.needle.width'];
                co.lineCap     = 'round';
                co.lineJoin    = 'round';
                
                // Draw the needle
                co.beginPath();
                    // The trailing bit on the opposite side of the dial
                    co.beginPath();
                        co.moveTo(this.centerx, this.centery);
                        
                        if (prop['chart.needle.tail']) {
    
                            co.arc(this.centerx,
                                   this.centery,
                                   20,
                                    (((value / this.range) * 360) + 90) / (180 / PI),
                                   (((value / this.range) * 360) + 90 + 0.01) / (180 / PI), // The 0.01 avoids a bug in ExCanvas and Chrome 6
                                   false
                                  );
                        }
    
                    // Draw the long bit on the opposite side
                    co.arc(this.centerx,
                            this.centery,
                            length - 10,
                            (((value / this.range) * 360) - 90) / (180 / PI),
                            (((value / this.range) * 360) - 90 + 0.1 ) / (180 / PI), // The 0.1 avoids a bug in ExCanvas and Chrome 6
                            false
                           );
                co.closePath();
                
                //co.stroke();
                //co.fill();
            
    
            } else if (prop['chart.needle.type'] == 'triangle') {
    
                co.lineWidth = 0.01;
                co.lineEnd  = 'square';
                co.lineJoin = 'miter';
    
                /**
                * This draws the version of the pointer that becomes the border
                */
                co.beginPath();
                    co.fillStyle = prop['chart.needle.triangle.border'];
                    co.arc(this.centerx, this.centery, 11, (((value / this.range) * 360)) / 57.3, ((((value / this.range) * 360)) + 0.01) / 57.3, 0);
                    co.arc(this.centerx, this.centery, 11, (((value / this.range) * 360) + 180) / 57.3, ((((value / this.range) * 360) + 180) + 0.01)/ 57.3, 0);
                    co.arc(this.centerx, this.centery, length - 5, (((value / this.range) * 360) - 90) / 57.3, ((((value / this.range) * 360) - 90) / 57.3) + 0.01, 0);
                co.closePath();
                co.fill();
    
                co.beginPath();
                co.arc(this.centerx, this.centery, 15, 0, TWOPI, 0);
                co.closePath();
                co.fill();
    
                // This draws the pointer
                co.beginPath();
                co.strokeStyle = 'black';
                co.fillStyle = color;
                co.arc(this.centerx, this.centery, 7, (((value / this.range) * 360)) / 57.3, ((((value / this.range) * 360)) + 0.01) / 57.3, 0);
                co.arc(this.centerx, this.centery, 7, (((value / this.range) * 360) + 180) / 57.3, ((((value / this.range) * 360) + 180) + 0.01)/ 57.3, 0);
                co.arc(this.centerx, this.centery, length - 13, (((value / this.range) * 360) - 90) / 57.3, ((((value / this.range) * 360) - 90) / 57.3) + 0.01, 0);
                co.closePath();
                co.stroke();
                co.fill();


                /**
                * This is here to accomodate the MSIE/ExCanvas combo
                */
                co.beginPath();
                co.arc(this.centerx, this.centery, 7, 0, TWOPI, 0);
                co.closePath();
                co.fill();
            }
    
    
            co.stroke();
            co.fill();
    
            // Draw the mini center circle
            co.beginPath();
            co.fillStyle = color;
            co.arc(this.centerx, this.centery, prop['chart.needle.type'] == 'pointer' ? 7 : 12, 0.01, TWOPI, false);
            co.fill();
    
            // This draws the arrow at the end of the line
            if (prop['chart.needle.head'] && prop['chart.needle.type'] == 'pointer') {
                co.lineWidth = 1;
                co.fillStyle = color;
    
                // round, bevel, miter
                co.lineJoin = 'miter';
                co.lineCap  = 'butt';
    
                co.beginPath();
                    co.arc(this.centerx, this.centery, length - 5, (((value / this.range) * 360) - 90) / 57.3, (((value / this.range) * 360) - 90 + 0.1) / 57.3, false);
    
                    co.arc(this.centerx,
                           this.centery,
                           length - 20,
                           RG.degrees2Radians( ((value / this.range) * 360) - (length < 60 ? 80 : 85) ),
                           RG.degrees2Radians( ((value / this.range) * 360) - (length < 60 ? 100 : 95) ),
                           1);
                co.closePath();
        
                co.fill();
                //co.stroke();
            }


            /**
            * Draw a white circle at the centre
            */
            co.beginPath();
            co.fillStyle = 'gray';
            co.moveTo(this.centerx, this.centery);
            co.arc(this.centerx,this.centery,2,0,6.2795,false);
            co.closePath();
    
            co.fill();
        }




        /**
        * Draws the labels for the Odo
        */
        this.DrawLabels = function ()
        {
            var size       = prop['chart.text.size'];
            var font       = prop['chart.text.font'];
            var centerx    = this.centerx;
            var centery    = this.centery;
            var r          = this.radius - (prop['chart.label.area'] / 2);
            var start      = this.start;
            var end        = this.end;
            var decimals   = prop['chart.scale.decimals'];
            var labels     = prop['chart.labels'];
            var units_pre  = prop['chart.units.pre'];
            var units_post = prop['chart.units.post'];
    
            co.beginPath();
            co.fillStyle = prop['chart.text.color'];
    
            /**
            * If label are specified, use those
            */
            if (labels) {
                for (var i=0; i<labels.length; ++i) {
    
                    RG.Text2(this, {'font':font,
                                    'size':size,
                                    'x':centerx + (Math.cos(((i / labels.length) * TWOPI) - HALFPI) * (this.radius - (prop['chart.label.area'] / 2) ) ), // Sin A = Opp / Hyp
                                    'y':centery + (Math.sin(((i / labels.length) * TWOPI) - HALFPI) * (this.radius - (prop['chart.label.area'] / 2) ) ), // Cos A = Adj / Hyp
                                    'text': String(labels[i]),
                                    'valign':'center',
                                    'halign':'center',
                                    'tag': 'labels'
                                   });
                }
    
            /**
            * If not, use the maximum value
            */
            } else {
                RG.Text2(this, {'font':font,'size':size,'x':centerx + (0.588 * r ),'y':centery - (0.809 * r ),'text':RG.number_format(this, (((end - start) * (1/10)) + start).toFixed(decimals), units_pre, units_post),'halign':'center','valign':'center','angle':36,'tag': 'scale'});
                RG.Text2(this, {'font':font,'size':size,'x':centerx + (0.951 * r ),'y':centery - (0.309 * r),'text':RG.number_format(this, (((end - start) * (2/10)) + start).toFixed(decimals), units_pre, units_post),'halign':'center','valign':'center','angle':72,'tag': 'scale'});
                RG.Text2(this, {'font':font,'size':size,'x':centerx + (0.949 * r),'y':centery + (0.31 * r),'text':RG.number_format(this, (((end - start) * (3/10)) + start).toFixed(decimals), units_pre, units_post),'halign':'center','valign':'center','angle':108,'tag': 'scale'});
                RG.Text2(this, {'font':font,'size':size,'x':centerx + (0.588 * r ),'y':centery + (0.809 * r ),'text':RG.number_format(this, (((end - start) * (4/10)) + start).toFixed(decimals), units_pre, units_post),'halign':'center','valign':'center','angle':144,'tag': 'scale'});
                RG.Text2(this, {'font':font,'size':size,'x':centerx,'y':centery + r,'text':RG.number_format(this, (((end - start) * (5/10)) + start).toFixed(decimals),units_pre, units_post),'halign':'center','valign':'center','angle':180,'tag': 'scale'});
    
                RG.Text2(this, {'font':font,'size':size,'x':centerx - (0.588 * r ),'y':centery + (0.809 * r ),'text':RG.number_format(this, (((end - start) * (6/10)) + start).toFixed(decimals), units_pre, units_post),'halign':'center','valign':'center','angle':216,'tag': 'scale'});
                RG.Text2(this, {'font':font,'size':size,'x':centerx - (0.949 * r),'y':centery + (0.300 * r),'text':RG.number_format(this, (((end - start) * (7/10)) + start).toFixed(decimals), units_pre, units_post),'halign':'center','valign':'center','angle':252,'tag': 'scale'});
                RG.Text2(this, {'font':font,'size':size,'x':centerx - (0.951 * r),'y':centery - (0.309 * r),'text':RG.number_format(this, (((end - start) * (8/10)) + start).toFixed(decimals), units_pre, units_post),'halign':'center','valign':'center','angle':288,'tag': 'scale'});
                RG.Text2(this, {'font':font,'size':size,'x':centerx - (0.588 * r ),'y':centery - (0.809 * r ),'text':RG.number_format(this, (((end - start) * (9/10)) + start).toFixed(decimals), units_pre, units_post),'halign':'center','valign':'center','angle':324,'tag': 'scale'});            
                RG.Text2(this, {'font':font,'size':size,'x':centerx,'y':centery - r,'text': prop['chart.zerostart'] ? RG.number_format(this, this.start.toFixed(decimals), units_pre, units_post) : RG.number_format(this, (((end - start) * (10/10)) + start).toFixed(decimals), units_pre, units_post),'halign':'center','valign':'center','tag': 'scale'});
            }
            
            co.fill();

            /**
            * Draw the text label below the center point
            */
            if (prop['chart.value.text']) {
                co.strokeStyle = 'black';
                RG.Text2(this, {'font':font,
                                'size':size+2,
                                'x':centerx,
                                'y':centery + size + 15,
                                'text':String(prop['chart.value.units.pre'] + this.value.toFixed(prop['chart.value.text.decimals']) + prop['chart.value.units.post']),
                                'halign':'center',
                                'valign':'center',
                                'bounding':true,
                                'boundingFill':'white',
                                'tag': 'value.text'
                               });
            }
        }




        /**
        * A placeholder function
        * 
        * @param object The event object
        */
        this.getShape = function (e)
        {
        }




        /**
        * This function returns the pertinent value at the point of click
        * 
        * @param object The event object
        */
        this.getValue = function (e)
        {
            var mouseXY = RG.getMouseXY(e)
            var angle   = RG.getAngleByXY(this.centerx, this.centery, mouseXY[0], mouseXY[1]);
                angle  += HALFPI;
            
            if (mouseXY[0] >= this.centerx && mouseXY[1] <= this.centery) {
                angle -= TWOPI;
            }
    
            var value = ((angle / TWOPI) * (this.max - this.min)) + this.min;
    
            return value;
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
            var mouseXY = RG.getMouseXY(e);
            var radius  = RG.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]);
    
            if (
                   mouseXY[0] > (this.centerx - this.radius)
                && mouseXY[0] < (this.centerx + this.radius)
                && mouseXY[1] > (this.centery - this.radius)
                && mouseXY[1] < (this.centery + this.radius)
                && radius <= this.radius
                ) {
    
                return this;
            }
        }




        /**
        * This method handles the adjusting calculation for when the mouse is moved
        * 
        * @param object e The event object
        */
        this.Adjusting_mousemove = function (e)
        {
            /**
            * Handle adjusting for the Bar
            */
            if (prop['chart.adjustable'] && RG.Registry.Get('chart.adjusting') && RG.Registry.Get('chart.adjusting').uid == this.uid) {
                this.value = this.getValue(e);
                RG.Clear(ca);
                RG.RedrawCanvas(ca);
                RG.FireCustomEvent(this, 'onadjust');
            }
        }




        /**
        * This method returns the appropriate angle for a value
        * 
        * @param number value The value
        */
        this.getAngle = function (value)
        {
            // Higher than max or lower than min
            if (value > this.max || value < this.min) {
                return null;
            }
    
            var angle = (((value - this.min) / (this.max - this.min)) * TWOPI);
                angle -= HALFPI;
    
            return angle;
        }




        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            // Parse the basic colors
            prop['chart.green.color']  = this.parseSingleColorForGradient(prop['chart.green.color']);
            prop['chart.yellow.color'] = this.parseSingleColorForGradient(prop['chart.yellow.color']);
            prop['chart.red.color']    = this.parseSingleColorForGradient(prop['chart.red.color']);
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
    
                // Create the gradient
                var grad = co.createRadialGradient(this.centerx, this.centery, 0, this.centerx, this.centery, this.radius);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        }




        /**
        * Register the object
        */
        RG.Register(this);
    }