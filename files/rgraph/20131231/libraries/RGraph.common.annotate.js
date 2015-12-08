    /**
    * o-------------------------------------------------------------------------------o
    * | This file is part of the RGraph package. RGraph is Free software, licensed    |
    * | under the MIT license - so it's free to use for all purposes. Extended        |
    * | support is available if required and donations are always welcome! You can    |
    * | read more here:                                                               |
    * |                         http://www.rgraph.net/support                         |
    * o-------------------------------------------------------------------------------o
    */

    if (typeof(RGraph) == 'undefined') RGraph = {isRGraph:true,type:'common'};


    /**
    * This installs some event handlers
    * 
    * Checking the RGraph.Annotate flag means the annotate code only runs once
    */
    RGraph.Annotating_canvas_onmousedown = function (e)
    {
        if (e.button == 0) {

            e.target.__object__.Set('chart.mousedown', true);

            // Get the object from the canvas. Annotating must be enabled on the
            // last object defined
            var obj = e.target.__object__;

            // This starts the annotating "path" and set the color
            obj.context.beginPath();

                obj.context.strokeStyle = obj.Get('chart.annotate.color');
                obj.context.lineWidth = 1;

                var mouseXY = RGraph.getMouseXY(e);
                var mouseX  = mouseXY[0];
                var mouseY  = mouseXY[1];
            
                // Clear the annotation recording
                RGraph.Registry.Set('annotate.actions', [obj.Get('chart.annotate.color')]);
    
                // This sets the initial X/Y position
                obj.context.moveTo(mouseX, mouseY);
                RGraph.Registry.Set('annotate.last.coordinates', [mouseX,mouseY]);
                
                RGraph.Registry.Set('started.annotating', false);
                RGraph.Registry.Set('chart.annotating', obj);

                // Fire the onannotatebegin event.
                RGraph.FireCustomEvent(obj, 'onannotatebegin');
        }
        
        return false;
    }




    /**
    * This cancels annotating for ALL canvases
    */
    RGraph.Annotating_window_onmouseup = function (e)
    {
        var obj  = RGraph.Registry.Get('chart.annotating');

        if (e.button != 0 || !obj) {
            return;
        }
        
        // This cancels annotating on ALL canvas tags on the page
        var tags = document.getElementsByTagName('canvas');

        for (var i=0; i<tags.length; ++i) {
            if (tags[i].__object__) {
                tags[i].__object__.Set('chart.mousedown', false);
            }
        }

        // Store the annotations in browser storage if it's available
        if (RGraph.Registry.Get('annotate.actions') && RGraph.Registry.Get('annotate.actions').length > 0 && window.localStorage) {

            var id = '__rgraph_annotations_' + e.target.id + '__';
            var annotations  = window.localStorage[id] ? window.localStorage[id] + '|' : '';
                annotations += RGraph.Registry.Get('annotate.actions');

            // Store the annotations information in HTML5 browser storage here
            window.localStorage[id] = annotations;
        }
        
        // Clear the recorded annotations
        RGraph.Registry.Set('annotate.actions', []);
        
        // Fire the annotate event
        RGraph.FireCustomEvent(obj, 'onannotateend');
    }




    /**
    * The canvas onmousemove function
    */
    RGraph.Annotating_canvas_onmousemove = function (e)
    {
        var obj     = e.target.__object__;
        var mouseXY = RGraph.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];
        var lastXY = RGraph.Registry.Get('annotate.last.coordinates');

        if (obj.Get('chart.mousedown')) {
            
            obj.context.beginPath();
            
            if (!lastXY) {
                obj.context.moveTo(mouseX, mouseY)
            } else {
                obj.context.strokeStyle = obj.properties['chart.annotate.color'];
                obj.context.moveTo(lastXY[0], lastXY[1]);
                obj.context.lineTo(mouseX, mouseY);
            }

            RGraph.Registry.Set('annotate.actions', RGraph.Registry.Get('annotate.actions') + '|' + mouseX + ',' + mouseY);
            RGraph.Registry.Set('annotate.last.coordinates', [mouseX,mouseY]);

            RGraph.FireCustomEvent(obj, 'onannotate');
            obj.context.stroke();
        }
    }




    /**
    * Shows the mini palette used for annotations
    * 
    * @param object e The event object
    */
    RGraph.ShowPalette =
    RGraph.Showpalette = function (e)
    {
        var isSafari = navigator.userAgent.indexOf('Safari') ? true : false;

        e = RGraph.FixEventObject(e);

        var canvas  = e.target.parentNode.__canvas__;
        var context = canvas.getContext('2d');
        var obj     = canvas.__object__;
        var div     = document.createElement('DIV');
        var coords  = RGraph.getMouseXY(e);
        
        div.__object__               = obj; // The graph object
        div.className                = 'RGraph_palette';
        div.style.position           = 'absolute';
        div.style.backgroundColor    = 'white';
        div.style.border             = '1px solid black';
        div.style.left               = 0;
        div.style.top                = 0;
        div.style.padding            = '3px';
        div.style.opacity            = 0;
        div.style.boxShadow          = 'rgba(96,96,96,0.5) 3px 3px 3px';
        div.style.WebkitBoxShadow    = 'rgba(96,96,96,0.5) 3px 3px 3px';
        div.style.MozBoxShadow       = 'rgba(96,96,96,0.5) 3px 3px 3px';


        // MUST use named colors that are capitalised
        var colors = ['Black', 'Red', 'Magenta','Black','Yellow','Green','Orange', 'White', 'Cyan'];
        
        // Add the colors to the palette
        for (var i=0,len=colors.length; i<len; i+=1) {
            var div2 = document.createElement('DIV');
                div2.cssClass = 'RGraph_palette_color';
                div2.style.fontSize = '12pt';
                div2.style.cursor = 'pointer';
                div2.style.padding = '1px';
                div2.style.paddingRight = '10px';
                
                var span = document.createElement('SPAN');
                    span.style.display = 'inline-block';
                    span.style.marginRight = '3px';
                    span.style.width = '17px';
                    span.style.height = '17px';
                    span.style.backgroundColor = colors[i];
                div2.appendChild(span);
                
                div2.innerHTML += colors[i];
                

                div2.onmouseover = function ()
                {
                    this.style.backgroundColor = '#eee';
                }

                div2.onmouseout = function ()
                {
                    this.style.backgroundColor = '';
                }
                
                div2.onclick = function (e)
                {
                    var color = this.childNodes[0].style.backgroundColor;
                    
                    obj.Set('chart.annotate.color', color);
                }
            div.appendChild(div2);
        }


        document.body.appendChild(div);

        /**
        * Now the div has been added to the document, move it up and left
        */
        div.style.left   = e.pageX + 'px';
        div.style.top    = e.pageY + 'px';
        
        /**
        * Chang the position if the cursor is near the right edge of the browser window
        */
        if ((e.pageX + (div.offsetWidth + 5) ) > document.body.offsetWidth) {
            div.style.left   = (e.pageX - div.offsetWidth) + 'px';
        }

        /**
        * Store the palette div in the registry
        */
        RGraph.Registry.Set('palette', div);
        
        setTimeout("RGraph.Registry.Get('palette').style.opacity = 0.2", 50);
        setTimeout("RGraph.Registry.Get('palette').style.opacity = 0.4", 100);
        setTimeout("RGraph.Registry.Get('palette').style.opacity = 0.6", 150);
        setTimeout("RGraph.Registry.Get('palette').style.opacity = 0.8", 200);
        setTimeout("RGraph.Registry.Get('palette').style.opacity = 1", 250);

        RGraph.HideContext();

        window.onclick = function ()
        {
            RGraph.HidePalette();
        }

        // Should this be here? Yes. This function is being used as an event handler.
        e.stopPropagation();
        return false;
    }
    
    
    /**
    * Clears any annotation data from global storage
    * 
    * @param object canvas The canvas tag object
    */
    RGraph.ClearAnnotations = function (canvas)
    {
        /**
        * For BC the argument can also be the ID of the canvas
        */
        if (typeof(canvas) == 'string') {
            var id = canvas;
            canvas = document.getElementById(id);
        } else {
            var id = canvas.id
        }

        var obj = canvas.__object__;

        if (window.localStorage && window.localStorage['__rgraph_annotations_' + id + '__'] && window.localStorage['__rgraph_annotations_' + id + '__'].length) {
            window.localStorage['__rgraph_annotations_' + id + '__'] = [];
            
            RGraph.FireCustomEvent(obj, 'onannotateclear');
        }
    }




    /**
    * Replays stored annotations
    * 
    * @param object obj The graph object
    */
    RGraph.ReplayAnnotations = function (obj)
    {
        // Check for support
        if (!window.localStorage) {
            return;
        }

        var context     = obj.context;
        var annotations = window.localStorage['__rgraph_annotations_' + obj.id + '__'];
        var i, len, move, coords;

        context.beginPath();
        context.lineWidth = 2;

        if (annotations && annotations.length) {
            annotations = annotations.split('|');
        } else {
            return;
        }


        for (i=0,len=annotations.length; i<len; ++i) {

            // If the element of the array is a color - finish the path,
            // stroke it and start a new one
            if (annotations[i].match(/^[a-z]+$/)) {
                context.stroke();
                context.beginPath();

                context.strokeStyle = annotations[i];
                move = true;
                continue;
            }

            coords = annotations[i].split(',');
            coords[0] = Number(coords[0]);
            coords[1] = Number(coords[1]);

            if (move) {
                context.moveTo(coords[0], coords[1]);
                move = false;
            } else {
                context.lineTo(coords[0], coords[1]);
            }
        }
        
        context.stroke();
    }




    window.addEventListener('load', function (e)
    {
        // This delay is necessary to allow the window.onload event listener to run
        setTimeout(function ()
        {
            var tags = document.getElementsByTagName('canvas');
            for (var i=0; i<tags.length; ++i) {
                if (tags[i].__object__ && tags[i].__object__.isRGraph && tags[i].__object__.Get('chart.annotatable')) {
                    RGraph.ReplayAnnotations(tags[i].__object__);
                }
            }
        }, 100); // This delay is sufficient to wait before replaying the annotations
    }, false);