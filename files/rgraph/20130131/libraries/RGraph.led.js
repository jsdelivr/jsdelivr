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
    * The LED lights constructor
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.LED = function (id, text)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'led';
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);


        /**
        * Set the string that is to be displayed
        */
        this.text = text.toLowerCase();
        
        /**
        * The letters and numbers
        */
        this.lights = {

            '#': [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]],
            '-': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
            '_': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]],
            '*': [[0,0,0,0],[0,0,0,0],[1,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,1],[0,0,0,0]],
            '<': [[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]],
            '>': [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0]],
            '%': [[0,0,0,0],[0,0,0,0],[1,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,1],[0,0,0,0]],
            '¡': [[0,0,1,0],[0,0,0,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
            '!': [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0],[0,0,1,0]],
            '¿': [[0,0,1,0],[0,0,0,0],[0,0,1,0],[0,1,1,0],[1,0,0,0],[1,0,0,0],[0,1,1,1]],
            '?': [[1,1,1,0],[0,0,0,1],[0,0,0,1],[0,1,1,0],[0,1,0,0],[0,0,0,0],[0,1,0,0]],
            '+': [[0,0,0,0],[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]],
            '/': [[0,0,0,0],[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[0,0,0,0],[0,0,0,0]],
            ',': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,1,0,0]],
            '.': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,0,0]],
            ';': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,0],[0,0,1,0],[0,1,0,0]],
            ':': [[0,0,0,0],[0,0,0,0],[0,1,0,0],[0,0,0,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]],
            '"': [[1,0,1,0],[1,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
            '[': [[1,1,1,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,0]],
            ']': [[0,1,1,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,1,1,1]],
            '(': [[0,0,1,1],[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,1]],
            ')': [[1,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,1,1,0],[1,1,0,0]],
            'R': [[1,0,0,0],[1,1,0,0],[1,1,1,0],[1,1,1,1],[1,1,1,0],[1,1,0,0],[1,0,0,0]],
            'L': [[0,0,0,1],[0,0,1,1],[0,1,1,1],[1,1,1,1],[0,1,1,1],[0,0,1,1],[0,0,0,1]],
            'a': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]],
            'b': [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0]],
            'c': [[0,1,1,0],[1,0,0,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,1],[0,1,1,0]],
            'd': [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,0]],
            'e': [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
            'f': [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]],
            'g': [[0,1,1,0],[1,0,0,1],[1,0,0,0],[1,0,1,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
            'h': [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]],
            'i': [[0,1,1,1],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,1,1,1]],
            'j': [[0,1,1,1],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,1,0,0]],
            'k': [[1,0,0,1],[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1],[1,0,0,1]],
            'l': [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
            'm': [[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]],
            'n': [[1,0,0,1],[1,1,0,1],[1,0,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]],
            'o': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
            'p': [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]],
            'q': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,1,1],[0,1,1,1]],
            'r': [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,1,1,0],[1,0,1,0],[1,0,0,1],[1,0,0,1]],
            's': [[0,1,1,0],[1,0,0,1],[1,0,0,0],[0,1,1,0],[0,0,0,1],[1,0,0,1],[0,1,1,0]],
            't': [[1,1,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
            'u': [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
            'v': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0],[0,1,0]],
            'w': [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1],[0,1,1,0]],
            'x': [[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,0,1,0],[0,1,0,1],[0,1,0,1],[0,1,0,1]],
            'y': [[0,1,0,1],[0,1,0,1],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
            'z': [[1,1,1,1],[0,0,0,1],[0,0,1,0],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,1,1,1]],
            ' ': [[],[],[],[],[], [], []],
            '0': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
            '1': [[0,0,1,0],[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,1,1,1]],
            '2': [[0,1,1,0],[1,0,0,1],[0,0,0,1],[0,0,1,0],[0,1,,0],[1,0,0,0],[1,1,1,1]],
            '3': [[0,1,1,0],[1,0,0,1],[0,0,0,1],[0,1,1,0],[0,0,0,1],[1,0,0,1],[0,1,1,0]],
            '4': [[1,0,0,0],[1,0,0,0],[1,0,1,0],[1,0,1,0],[1,1,1,1],[0,0,1,0],[0,0,1,0]],
            '5': [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,1],[1,0,0,1],[0,1,1,0]],
            '6': [[0,1,1,0],[1,0,0,1],[1,0,0,0],[1,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
            '7': [[1,1,1,1],[0,0,0,1],[0,0,0,1],[0,0,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
            '8': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
            '9': [[0,1,1,1],[1,0,0,1],[1,0,0,1],[0,1,1,1],[0,0,0,1],[0,0,0,1],[0,0,0,1]]
        }

        // Various config type stuff
        this.properties = {
            'chart.background':    'white',
            'chart.dark':          '#eee',
            'chart.light':         '#f66',
            'chart.zoom.factor':   1.5,
            'chart.zoom.fade.in':  true,
            'chart.zoom.fade.out': true,
            'chart.zoom.hdir':     'right',
            'chart.zoom.vdir':     'down',
            'chart.zoom.frames':   25,
            'chart.zoom.delay':    16.666,
            'chart.zoom.shadow':   true,
            'chart.zoom.background': true,
            'chart.zoom.action':     'zoom',
            'chart.resizable':              false,
            'chart.resize.handle.adjust':   [0,0],
            'chart.resize.handle.background': null,
            'chart.radius':                   null
        }

        // Check for support
        if (!this.canvas) {
            alert('[LED] No canvas support');
            return;
        }
        
        RGraph.Register(this);
    }


    /**
    * A setter
    * 
    * @param name  string The name of the property to set
    * @param value mixed  The value of the property
    */
    RGraph.LED.prototype.Set = function (name, value)
    {
        name = name.toLowerCase();

        /**
        * This should be done first - prepend the propertyy name with "chart." if necessary
        */
        if (name.substr(0,6) != 'chart.') {
            name = 'chart.' + name;
        }

        this.properties[name.toLowerCase()] = value;
    }


    /**
    * A getter
    * 
    * @param name  string The name of the property to get
    */
    RGraph.LED.prototype.Get = function (name)
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
    * This draws the LEDs
    */
    RGraph.LED.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');


        /**
        * Parse the colors. This allows for simple gradient syntax
        */
        if (!this.colorsParsed) {

            this.parseColors();
            
            // Don't want to do this again
            this.colorsParsed = true;
        }


        // First clear the canvas, using the background colour
        // Removed March 4th 2012
        //RGraph.Clear(this.canvas, this.Get('chart.background'));// ??? Hmmmm
        
        for (var l=0; l<this.text.length; l++) {
            this.DrawLetter(this.text.charAt(l), l);
        }
        
        /**
        * Set the title attribute on the canvas
        */
        this.canvas.title = RGraph.rtrim(this.text);

        /**
        * Setup the context menu if required
        */
        if (this.Get('chart.contextmenu')) {
            RGraph.ShowContext(this);
        }

        
        /**
        * This function enables resizing
        */
        if (this.Get('chart.resizable')) {
            RGraph.AllowResizing(this);
        }


        /**
        * This installs the event listeners
        */
        RGraph.InstallEventListeners(this);
        
        /**
        * Fire the RGraph ondraw event
        */
        RGraph.FireCustomEvent(this, 'ondraw');
    }


    /**
    * Draws a single letter
    * 
    * @param string lights The lights to draw to draw
    * @param int    index  The position of the letter
    */
    RGraph.LED.prototype.DrawLetter = function (letter, index)
    {
        var light    = this.Get('chart.light');
        var dark     = this.Get('chart.dark');
        var lights   = (this.lights[letter] ? this.lights[letter] : [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]);


        /**
        * Now allow user specified radius of the size of the lights
        */
        if (typeof(this.Get('chart.radius')) == 'number') {
            radius = Number(this.Get('chart.radius'));
            diameter = 2 * radius;
            lwidth   = diameter * 5;
        } else {
            var radius   = ((this.canvas.width / this.text.length) / 5) / 2;
            var diameter = radius * 2;
            var lwidth   = diameter * 5;
        }

        //var lheight = diameter * 7;
        //if (lheight > this.canvas.height) {
        //    lheight  = this.canvas.height;
        //    diameter = (lheight / 7);
        //    radius   = (diameter / 2);
        //    lwidth   = diameter * 5;
        //}

        for (var i=0; i<7; i++) {
            for (var j=0; j<5; j++) {

                var x = (j * diameter) + (index * lwidth) + radius;
                var y = ((i * diameter)) + radius;

                // Draw a circle
                this.context.fillStyle   = (lights[i][j] ? light : dark);
                this.context.strokeStyle = (lights[i][j] ? '#ccc' : 'rgba(0,0,0,0)');
                this.context.beginPath();
                this.context.arc(x, y, radius, 0, 6.28, 0);

                this.context.stroke();
                this.context.fill();
            }
        }
    }



    /**
    * A place holder
    * 
    * @param object e The event object
    */
    RGraph.LED.prototype.getValue = function (e)
    {
        return this.text;
    }



    /**
    * This allows for easy specification of gradients
    */
    RGraph.LED.prototype.parseColors = function ()
    {
        if (typeof(this.properties['chart.background']) == 'string') this.properties['chartbackground'] = this.parseSingleColorForGradient(this.properties['chart.background']);
        if (typeof(this.properties['chart.dark']) == 'string') this.properties['chart.dark'] = this.parseSingleColorForGradient(this.properties['chart.dark']);
        if (typeof(this.properties['chart.light']) == 'string') this.properties['chart.light'] = this.parseSingleColorForGradient(this.properties['chart.light']);
    }



    /**
    * This parses a single color value
    */
    RGraph.LED.prototype.parseSingleColorForGradient = function (color)
    {
        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':');

            // Create the gradient
            var grad = this.context.createLinearGradient(0,0,0,this.canvas.height);

            var diff = 1 / (parts.length - 1);

            grad.addColorStop(0, RGraph.trim(parts[0]));

            for (var j=1; j<parts.length; ++j) {
                grad.addColorStop(j * diff, RGraph.trim(parts[j]));
            }
        }
        
        return grad ? grad : color;
    }