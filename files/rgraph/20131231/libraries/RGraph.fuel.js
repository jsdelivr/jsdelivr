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
    * The Fuel widget constructor
    * 
    * @param object canvas The canvas object
    * @param int min       The minimum value
    * @param int max       The maximum value
    * @param int value     The indicated value
    */
    RGraph.Fuel = function (id, min, max, value)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(typeof id === 'object' ? id.id : id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'fuel';
        this.isRGraph          = true;
        this.min               = min;
        this.max               = max;
        this.value             = value;
        this.angles            = {};
        this.currentValue      = null;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.coordsText        = [];


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);


        // Check for support
        if (!this.canvas) {
            alert('[FUEL] No canvas support');
            return;
        }

        /**
        * The funnel charts properties
        */
        this.properties =
        {
            'chart.colors':                   ['Gradient(white:red)'],
            'chart.needle.color':             'red',
            'chart.gutter.left':              5,
            'chart.gutter.right':             5,
            'chart.gutter.top':               5,
            'chart.gutter.bottom':            5,
            'chart.text.size':                10,
            'chart.text.color':               'black', // Does not support gradients
            'chart.text.font':                'Arial',
            'chart.contextmenu':              null,
            'chart.annotatable':              false,
            'chart.annotate.color':           'black',
            'chart.zoom.factor':              1.5,
            'chart.zoom.fade.in':             true,
            'chart.zoom.fade.out':            true,
            'chart.zoom.factor':              1.5,
            'chart.zoom.fade.in':             true,
            'chart.zoom.fade.out':            true,
            'chart.zoom.hdir':                'right',
            'chart.zoom.vdir':                'down',
            'chart.zoom.frames':            25,
            'chart.zoom.delay':             16.666,
            'chart.zoom.shadow':              true,
            'chart.zoom.background':          true,
            'chart.zoom.action':              'zoom',
            'chart.adjustable':               false,
            'chart.resizable':                false,
            'chart.resize.handle.background': null,
            'chart.icon':                     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAfCAYAAAD0ma06AAAEGElEQVRIS7VXSyhtYRT+jnfe5FEMjAwUBiQGHikzRWIkkgy8YyDK+xnJK5JCeZSUGKBMiAyYkMxMJAMpSfJ+2/d8695/33NunSPnHqt2Z5+91/9/' + '/' + '/et9a/1b8Pn56dmMBhg/IWDgwNoNzc38PHxkXtN0+Tiexp9eH18fIDj1Bj63N/fw8vLS/wsmcHoqKmXT09PuL29RVFREU5OTvTJ6UIAgioQ+vLe09MTb29v8PX1RWBgICYnJ+XXIqDRWXN0dJT3nIDsWlpadP+lpSWZlD4KmL/8/' + '/7+Ls/S09N1/7y8PISHh+sK/QssDJWcHEyGCnB1dRUDAwPIzMzUx5GpAnZ1dcXy8jK2trbM5j06OsLc3JzISx8q4OzsLOOsAq6treHg4AAeHh4WJbq7u0Nzc7P+PiYmBnt7ezg9PcXExAQCAgLg5OSEx8dHuLu7Wwfc3t7G/v6+yEcjO8rIROGKaWdnZ+jr6zMDjI6OxvT0tDzr6uqS2KtksspwZ2cHjY2NuqSUhnHmilUCraysmElaWloKJpQCjI2NRX5+Pl5eXr6WlCv08/MTEMVOZDH+Zzw4CdlfX1/rDHt7ezE1NQXGkcYEKi4ulkVKYlpLGouBs/JiaGgIZL25uSlecXFxohAz/ccAz8/P4e/vj7q6Ojw8PMje5DNRy94MQ0JCUFtbK2wqKipE+sHBQbi4uPwMQ86ak5ODxMREVFdXIywsDCUlJRJDXnZlmJqaip6eHuTm5kqikGlycjIyMjL+ZrY9JSUgMzQiIgINDQ2ypaqqqkCZWXHsnjQEHB8fR0pKigAxabq7uyWOlJNxtLukTJDs7GxUVlZKDNl5oqKi8Pr6+jOAIyMjiI+Pl5JGQG4F1Qy+LN7f3fiUdGZmBsHBwRgbG8Pw8LD01ba2NmlX0rTtnTQLCwvSjEdHR3FxcSExLCwsRGRkpBR9vePzeMDyw3bT1NT0XXLiT4a7u7s4Pj4GGzd7K8GCgoKEsRR8I4Cm6hwHXV5eiv62GAE5npMTmFuBTCkzmzT7qs5Q9TlW/o6ODlvwhCHPM5SVPZIxYzNeXFxEa2srvL29YTC2GI3aMm3Zeq6urv4LMC0tDRsbG1K8k5KS9DgS0IwhKVFjSsJA22r9/f0oKCgQdvPz83JEmZ2dlcpD9maSshow0KZnlO8Csx9yK3BLKCMJPpf2xGMigdi9WXooaWdn53dxdP+amhrZh4eHh1hfX5cTW319vZyBnp+ffzNkBWBmhYaGysB/j322oCckJCArK0uGMlsJ5ubmBoPxRiMzFlomjr2MGdne3i5ANILRJEtJt6ysTG8h9gDl4am8vFwSUWron1O9LulXIOqk9pWftfdSS40yyj5Uh101wPRryuR7R1ZMX/U1pfy5IF40xcgUnGAc9wsGYxsFhy87kwAAAABJRU5ErkJggg==',
            'chart.icon.redraw':              true,
            'chart.background.image.stretch': false,
            'chart.background.image.x':       null,
            'chart.background.image.y':       null,
            'chart.labels.full':              'F',
            'chart.labels.empty':             'E',
            'chart.labels.count':             5,
            'chart.centerx':                  null,
            'chart.centery':                  null,
            'chart.radius':                   null,
            'chart.scale.visible':            false,
            'chart.scale.decimals':           0,
            'chart.units.pre':                '',
            'chart.units.post':               ''
        }
        
        /**
        * Bounds checking - if the value is outside the scale
        */
        if (this.value > this.max) this.value = this.max;
        if (this.value < this.min) this.value = this.min;





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
            * Set the current value
            */
            this.currentValue = this.value;
    
    
    
            /**
            * This is new in May 2011 and facilitates indiviual gutter settings,
            * eg chart.gutter.left
            */
            this.gutterLeft   = prop['chart.gutter.left'];
            this.gutterRight  = prop['chart.gutter.right'];
            this.gutterTop    = prop['chart.gutter.top'];
            this.gutterBottom = prop['chart.gutter.bottom'];
    
    
    
            /**
            * Get the center X and Y of the chart. This is the center of the needle bulb
            */
            this.centerx = ((ca.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;
            this.centery = ca.height - 20 - this.gutterBottom
    
    
    
            /**
            * Work out the radius of the chart
            */
            this.radius = ca.height - this.gutterTop - this.gutterBottom - 20;
            
            /**
            * You can now specify chart.centerx, chart.centery and chart.radius
            */
            if (typeof(prop['chart.centerx']) == 'number') this.centerx = prop['chart.centerx'];
            if (typeof(prop['chart.centery']) == 'number') this.centery = prop['chart.centery'];
            if (typeof(prop['chart.radius']) == 'number')  this.radius  = prop['chart.radius'];
    
    
    
    
            /**
            * Parse the colors. This allows for simple gradient syntax
            */
            if (!this.colorsParsed) {
                this.parseColors();
                
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
            /**
            * The start and end angles of the chart
            */
            this.angles.start  = (PI + HALFPI) - 0.5;
            this.angles.end    = (PI + HALFPI) + 0.5;
            this.angles.needle = this.getAngle(this.value);
    
    
    
            /**
            * Draw the labels on the chart
            */
            this.DrawLabels();
    
    
            /**
            * Draw the fuel guage
            */
            this.DrawChart();
    
    
    
            
            
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
        * This function actually draws the chart
        */
        this.DrawChart = function ()
        {
            /**
            * Draw the "Scale"
            */
            this.DrawScale();
            
            /**
            * Place the icon on the canvas
            */
            if (!ISOLD) {
                this.DrawIcon();
            }
    
    
    
            /**
            * Draw the needle
            */
            this.DrawNeedle();
        }




        /**
        * Draws the labels
        */
        this.DrawLabels = function ()
        {
            if (!prop['chart.scale.visible']) {
                var radius = (this.radius - 20);
                co.fillStyle = prop['chart.text.color'];
                
                // Draw the left label
                var y = this.centery - Math.sin(this.angles.start - PI) * (this.radius - 25);
                var x = this.centerx - Math.cos(this.angles.start - PI) * (this.radius - 25);
                RG.Text2(this, {'font':prop['chart.text.font'],
                                    'size':prop['chart.text.size'],
                                    'x':x,
                                    'y':y,
                                    'text':prop['chart.labels.empty'],
                                    'halign': 'center',
                                    'valign':'center',
                                    'tag': 'labels'
                                   });
                
                // Draw the right label
                var y = this.centery - Math.sin(this.angles.start - PI) * (this.radius - 25);
                var x = this.centerx + Math.cos(this.angles.start - PI) * (this.radius - 25);
                RG.Text2(this, {'font':prop['chart.text.font'],
                                    'size':prop['chart.text.size'],
                                    'x':x,
                                    'y':y,
                                    'text':prop['chart.labels.full'],
                                    'halign': 'center',
                                    'valign':'center',
                                    'tag': 'labels'
                                   });
            }
        }




    
        /**
        * Draws the needle
        */
        this.DrawNeedle = function ()
        {
            // Draw the actual needle
            co.beginPath();
                co.lineWidth = 5;
                co.lineCap = 'round';
                co.strokeStyle = prop['chart.needle.color'];
    
                /**
                * The angle for the needle
                */
                var angle = this.angles.needle;
    
                co.arc(this.centerx, this.centery, this.radius - 30, angle, angle + 0.0001, false);
                co.lineTo(this.centerx, this.centery);
            co.stroke();
            
            co.lineWidth = 1;
    
            // Create the gradient for the bulb
            var cx   = this.centerx + 10;
            var cy   = this.centery - 10
    
            var grad = co.createRadialGradient(cx, cy, 35, cx, cy, 0);
            grad.addColorStop(0, 'black');
            grad.addColorStop(1, '#eee');
    
            if (navigator.userAgent.indexOf('Firefox/6.0') > 0) {
                grad = co.createLinearGradient(cx + 10, cy - 10, cx - 10, cy + 10);
                grad.addColorStop(1, '#666');
                grad.addColorStop(0.5, '#ccc');
            }
    
            // Draw the bulb
            co.beginPath();
                co.fillStyle = grad;
                co.moveTo(this.centerx, this.centery);
                co.arc(this.centerx, this.centery, 20, 0, TWOPI, 0);
            co.fill();
        }
    
        
        /**
        * Draws the "scale"
        */
        this.DrawScale = function ()
        {
            var a, x, y;
    
            //First draw the fill background
            co.beginPath();
                co.strokeStyle = 'black';
                co.fillStyle = 'white';
                co.arc(this.centerx, this.centery, this.radius, this.angles.start, this.angles.end, false);
                co.arc(this.centerx, this.centery, this.radius - 10, this.angles.end, this.angles.start, true);
            co.closePath();
            co.stroke();
            co.fill();
    
            //First draw the fill itself
            var start = this.angles.start;
            var end   = this.angles.needle;
    
            co.beginPath();
                co.fillStyle = prop['chart.colors'][0];
                co.arc(this.centerx, this.centery, this.radius, start, end, false);
                co.arc(this.centerx, this.centery, this.radius - 10, end, start, true);
            co.closePath();
            //co.stroke();
            co.fill();
            
            // This draws the tickmarks
            for (a = this.angles.start; a<=this.angles.end+0.01; a+=((this.angles.end - this.angles.start) / 5)) {
                co.beginPath();
                    co.arc(this.centerx, this.centery, this.radius - 10, a, a + 0.0001, false);
                    co.arc(this.centerx, this.centery, this.radius - 15, a + 0.0001, a, true);
                co.stroke();
            }
            
            /**
            * If chart.scale.visible is specified draw the textual scale
            */
            if (prop['chart.scale.visible']) {
    
                co.fillStyle = prop['chart.text.color'];
    
                // The labels
                var numLabels  = prop['chart.labels.count'];
                var decimals   = prop['chart.scale.decimals'];
                var font       = prop['chart.text.font'];
                var size       = prop['chart.text.size'];
                var units_post = prop['chart.units.post'];
                var units_pre  = prop['chart.units.pre'];
    
                for (var i=0; i<=numLabels; ++i) {
                    a = ((this.angles.end - this.angles.start) * (i/numLabels)) + this.angles.start;
                    y = this.centery - Math.sin(a - PI) * (this.radius - 25);
                    x = this.centerx - Math.cos(a - PI) * (this.radius - 25);
                    
                    
                    RG.Text2(this, {'font':font,
                                        'size':size,
                                        'x':x,
                                        'y':y,
                                        'text': RG.number_format(this, (this.min + ((this.max - this.min) * (i/numLabels))).toFixed(decimals),units_pre,units_post),
                                        'halign': 'center',
                                        'valign':'center',
                                        'tag': 'scale'
                                       });
                }
            }
        }




        /**
        * A placeholder function that is here to prevent errors
        */
        this.getShape = function (e)
        {
        }




        /**
        * This function returns the pertinent value based on a click
        * 
        * @param  object e An event object
        * @return number   The relevant value at the point of click
        */
        this.getValue = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
            var angle   = RG.getAngleByXY(this.centerx, this.centery, mouseXY[0], mouseXY[1]);
    
            /**
            * Boundary checking
            */
            if (angle >= this.angles.end) {
                return this.max;
            } else if (angle <= this.angles.start) {
                return this.min;
            }
    
            var value = (angle - this.angles.start) / (this.angles.end - this.angles.start);
                value = value * (this.max - this.min);
                value = value + this.min;
    
            return value;
        }




        /**
        * The getObjectByXY() worker method. Don't call this call:
        * 
        * RG.ObjectRegistry.getObjectByXY(e)
        * 
        * @param object e The event object
        */
        this.getObjectByXY = function (e)
        {
            var mouseXY  = RG.getMouseXY(e);
            var angle    = RG.getAngleByXY(this.centerx, this.centery, mouseXY[0], mouseXY[1]);
            var accuracy = 15;

            var leftMin   = this.centerx - this.radius;
            var rightMax  = this.centerx + this.radius;
            var topMin    = this.centery - this.radius;
            var bottomMax = this.centery + this.radius;
    
            if (
                   mouseXY[0] > leftMin
                && mouseXY[0] < rightMax
                && mouseXY[1] > topMin
                && mouseXY[1] < bottomMax
                ) {
    
                return this;
            }
        }




        /**
        * Draws the icon
        */
        this.DrawIcon = function ()
        {
            if (!ISOLD) {
                
                if (!this.__icon__ || !this.__icon__.__loaded__) {
                    var img = new Image();
                    img.src = prop['chart.icon'];
                    img.__object__ = this;
                    this.__icon__ = img;
                
                
                    img.onload = function (e)
                    {
                        img.__loaded__ = true;
                        var obj = img.__object__;
                        //var co  = obj.context;
                        //var prop = obj.properties;
                    
                        co.drawImage(img,obj.centerx - (img.width / 2), obj.centery - obj.radius + 35);
        
                        obj.DrawNeedle();
        
                        if (prop['chart.icon.redraw']) {
                            obj.Set('chart.icon.redraw', false);
                            RG.Clear(obj.canvas);
                            RG.RedrawCanvas(ca);
                        }
                    }
                } else {
                    var img = this.__icon__;
                    co.drawImage(img,this.centerx - (img.width / 2), this.centery - this.radius + 35);
                }
            }
    
            this.DrawNeedle();
        }




        /**
        * This method handles the adjusting calculation for when the mouse is moved
        * 
        * @param object e The event object
        */
        this.Adjusting_mousemove = function (e)
        {
            /**
            * Handle adjusting for the Fuel gauge
            */
            if (prop['chart.adjustable'] && RG.Registry.Get('chart.adjusting') && RG.Registry.Get('chart.adjusting').uid == this.uid) {
                this.value = this.getValue(e);
                RG.Clear(ca);
                RG.RedrawCanvas(ca);
                RG.FireCustomEvent(this, 'onadjust');
            }
        }




        /**
        * This method gives you the relevant angle (in radians) that a particular value is
        * 
        * @param number value The relevant angle
        */
        this.getAngle = function (value)
        {
            // Range checking
            if (value < this.min || value > this.max) {
                return null;
            }
    
            var angle = (((value - this.min) / (this.max - this.min)) * (this.angles.end - this.angles.start)) + this.angles.start;
    
            return angle;
        }




        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            var props  = this.properties;
            var colors = props['chart.colors'];
    
            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForLinearGradient(colors[i]);
            }
            
            props['chart.needle.color'] = this.parseSingleColorForRadialGradient(props['chart.needle.color']);
        }




        /**
        * This parses a single color value
        */
        this.parseSingleColorForLinearGradient = function (color)
        {
            if (!color || typeof(color) != 'string') {
                return color;
            }
    
            if (color.match(/^gradient\((.*)\)$/i)) {
                
                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = co.createLinearGradient(prop['chart.gutter.left'],0,ca.width - prop['chart.gutter.right'],0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
                
            return grad ? grad : color;
        }




        /**
        * This parses a single color value
        */
        this.parseSingleColorForRadialGradient = function (color)
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
        * Now need to register all chart types. MUST be after the setters/getters are defined
        * 
        * *** MUST BE LAST IN THE CONSTRUCTOR ***
        */
        RG.Register(this);
    }