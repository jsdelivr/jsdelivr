/*
* Zoomy 1.4.6 - jQuery plugin
* http://zoomy.me
*
* Copyright (c) 2012 Jacob Lowe (http://redeyeoperations.com)
* Licensed under the MIT (MIT-LICENSE.txt)

*
* Built for jQuery library
* http://jquery.com
*
* Addition fixes and modifications done by Larry Battle ( blarry@bateru.com )
* Code has been refactored and the logic has been corrected.
*
*/


(function($) {
    
  // @object ZoomyS Object - Holds alot of data for each instance of Zoomy
  'use strict';
  var ZoomyS = {
    count : [],
    pos: null
  };

  /** @method     zoomy   Function    - Plugin for jQuery
   *  @param      event   String      - Event to initiate Zoomy
   *  @param      options object      - Options Object that holds optons for configuration
   */
  $.fn.zoomy = function (event, options) {

    
    // @variable defaults Object - Is overwritten by options Object
    var defaults = {
      zoomSize    : 200,
      round       : true,
      glare       : true,
      clickable   : false,
      attr        : 'href',
      border      : '5px solid #999',
      zoomInit    : null,  //callback for when zoom initializes
      zoomStart   : null, // callback for when zoom starts
      zoomStop    : null // callback for when the zoom ends
    },
      //Test for touch
      touch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) ? true : false,
      cssTranforms = (function () {
          var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition',v;
          if(typeof s[p] == 'string') {return true; }

          // Tests for vendor specific prop
          v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
          p = p.charAt(0).toUpperCase() + p.substr(1);
          for(var i=0; i<v.length; i++) {
            if(typeof s[v[i] + p] == 'string') { return true; }
          }
          return false;
      }()),
      
      //Change default event on touch
      defaultEvent = (touch) ? 'touchstart' : 'click',
      

      /* @object      utils   Object      - Set of utitlities needed for Zoomy
       * @method      pos     Object      - position utitlities
       *
       * @method      stop    Function    - Helper to calculate stops for crash detection
       * @param       x       Interger    - Thumnail images position
       * @param       z       Interger    - Size of the Zoom element
       * @param       o       Interger    - Size of border to offset it
       * @param       s       Interger    - Postion of Stop ^^
       *
       * @method      mouse   Function    - Mouse position relative to image
       * @param       x       Interger    - Offest from page
       * @param       y       Interger    - Offset from thumbnail
       * @param       h       Interger    - Half the size of the Zoom Element
       *
       * @method      zoom    Funtion     - Postion of Zoomy Element
       * @param       x       Interger    - Offset from page
       * @param       y       Interger    - Element positon
       * @param       z       Interger    - Ratio of Zoom
       * @param       h       Interger    - Half the size of Zoomt Element
       * @param       o       Interger    - Size of border to offset it
       *
       */
      utils = {
        pos: {
          stop    : function (x , z, o, s) {
            return (x - z - o) + s;
          },
          mouse   : function (x, y, h) {
            return x - y - h;     
          },
          zoom    : function (x, y, z, h, o) {
            return ((x - y) / z) - h + o;
          }
        },
        /* @method  css   Function  - Compiles and Object of Css properties
         */
        css: function(a){

          if(typeof a !== 'undefined' && a.length > 0){

            var translate = 'translate3d(' + a[2]+ 'px, ' + a[3] + 'px, 0)';
            var movement  = (cssTranforms) ? {
              '-webkit-transform'   : translate,
              '-moz-transform'      : translate,
              '-ms-tranform'        : translate,
              '-o-tranform'         : translate,
              'transform'           : translate 
            } : {
              'top'   : a[3] + 'px',
              'left'  : a[2] + 'px'
            };

            return $.extend({'backgroundPosition'  : '-' + a[0] + 'px ' + '-' + a[1] + 'px'}, movement);
          }else{
            return {};
          }
        },
        //asspect ratio
        ratio: function(x, y){
          return x / y;   
        },
        setParams: function(zoom){

          var id = zoom.attr('rel');

          ZoomyS[id].size         = {};
          ZoomyS[id].size.full    = options.zoomSize + (ZoomyS[id].zoom.border * 2);
          ZoomyS[id].size.half    = ZoomyS[id].size.full / 2;
          ZoomyS[id].size.ratioX  = utils.ratio(ZoomyS[id].css.width, ZoomyS[id].zoom.x);
          ZoomyS[id].size.ratioY  = utils.ratio(ZoomyS[id].css.height, ZoomyS[id].zoom.y);
          ZoomyS[id].size.zoomX   = ZoomyS[id].zoom.x - ZoomyS[id].size.full; 
          ZoomyS[id].size.zoomY   = ZoomyS[id].zoom.y - ZoomyS[id].size.full;

          ZoomyS[id].stop         = {};
          ZoomyS[id].stop.main    = ZoomyS[id].size.half - (ZoomyS[id].size.half * ZoomyS[id].size.ratioX) - (ZoomyS[id].zoom.border * ZoomyS[id].size.ratioX) + ZoomyS[id].zoom.border;
          ZoomyS[id].stop.right   = utils.pos.stop(ZoomyS[id].css.width, ZoomyS[id].size.full, ZoomyS[id].zoom.border, ZoomyS[id].stop.main);
          ZoomyS[id].stop.bottom  = utils.pos.stop(ZoomyS[id].css.height, ZoomyS[id].size.full, ZoomyS[id].zoom.border, ZoomyS[id].stop.main);
        }

      },

      /* @object  change  Object    - Handle events that directly effect the Elements
       * 
       * @method  move    Function  - Calculates and handles moving the Zoomy Element
       * @param   ele     Object    - The main element or the anchor tag wrapping img
       * @param   zoom    Oject     - The Zoomy Element
       * @param   e       Object    - The event object for mousemove or touchmove. 
       *
       * @method  classes Function  - Toggles classes on main element
       * @param   ele     Object    - The main element or the anchor tag wrapping img
       *
       * @method  enter   Function  - Handles the start of Zoomy
       * @param   ele     Object    - The main element or the anchor tag wrapping img
       * @param   zoom    Oject     - The Zoomy Element
       *
       * @method  leave   Function  - Handles the stopping of Zoomy 
       * @param   ele     Object    - The main element or the anchor tag wrapping img
       * @param   zoom    Oject     - The Zoomy Element
       * @param   x       Interger  - Flag to handle at diffent state of Zoomy.
       *
       * @method  callback  Function  - Executes a callback function if one is passed
       * @param   type      Function  - The actual callback function
       * @param   zoom      Object    - The Zoomy Object to pull data from
       */
      change = {

        collision : function(posX, posY, dataset){

          // Test for collisions
          var a   = -dataset.stop.main <= posX,
            e2  = -dataset.stop.main > posX,
            b   = -dataset.stop.main <= posY,
            f   = -dataset.stop.main > posY,
            d   = dataset.stop.bottom > posY,
            g   = dataset.stop.bottom <= posY,
            c   = dataset.stop.right > posX,
            j   = dataset.stop.right <= posX;
            
            // Results of collision
          return(a && b && c && d) ? 0 : (e2) ? (b && d) ? 1 : (f) ? 2 : (g) ? 3 : null : (f) ? (c) ? 4 : 5 : (j) ? (d) ? 6 : 7 : (g) ? 8 : null;

        },

        possibilities : function(index, dataset, leftX, topY, posX, posY){

          var fn = {
          // In the Center       
            0 : [leftX, topY, posX, posY],
            
          // On Left Side
            1 : [0, topY, -dataset.stop.main, posY],

          // On the Top Left Corner
            2 : [0, 0, -dataset.stop.main, -dataset.stop.main],
            
          //On the Bottom Left Corner
            3 : [0, dataset.size.zoomY, -dataset.stop.main, dataset.stop.bottom],
            
          // On the Top
            4 : [leftX, 0, posX, -dataset.stop.main],
            
          //On the Top Right Corner
            5 : [dataset.size.zoomX, 0, dataset.stop.right, -dataset.stop.main],
            
          //On the Right Side
            6 : [dataset.size.zoomX, topY, dataset.stop.right, posY],
                       
          //On the Bottom Right Corner
            7 : [dataset.size.zoomX, dataset.size.zoomY, dataset.stop.right, dataset.stop.bottom],
            
          //On the Bottom    
            8 : [leftX, dataset.size.zoomY, posX, dataset.stop.bottom]
          };

          return fn[index];

        },
      
        // Move Zoom Cursor
        move : function (ele, zoom, e) {
       
          // need to stop as many of these variable in data object to avoid recalulation of variables
          var id        = zoom.attr('rel'),
            l           = ele.offset(),
            dataset     = ZoomyS[id],
            yOffset     = (touch) ? -70 : 0,
            // only dynamic variables
            posX        = utils.pos.mouse(e.pageX, l.left , dataset.size.half),
            posY        = utils.pos.mouse(e.pageY + yOffset , l.top, dataset.size.half),
            leftX       = utils.pos.zoom(e.pageX, l.left, dataset.size.ratioX, dataset.size.half, ZoomyS[id].zoom.border),
            topY        = utils.pos.zoom(e.pageY + yOffset, l.top , dataset.size.ratioY, dataset.size.half, ZoomyS[id].zoom.border),

            cssArrIndex = change.collision(posX, posY, dataset),   
            //Compile CSS object to move Zoomy
            move = utils.css(change.possibilities(cssArrIndex, dataset, leftX, topY, posX, posY));
            //Uncomment to see Index number for collision type
            //console.log(cssArrIndex)
          // And Actual Call    
          zoom.css(move);
  
        },
        
        // Change classes for original image effect
        classes : function (ele) {
          var i = ele.find('.zoomy').attr('rel');
          if (ZoomyS[i].state === 0 || ZoomyS[i].state === null) {
            ele.removeClass('inactive');
          } else {
            ele.addClass('inactive');
          }
        },
        
        // Enter zoom area start up Zoom again
        enter : function (ele, zoom) {
          var i = zoom.attr('rel');
          ZoomyS[i].state = 1;
          zoom.css('visibility', 'visible');
          change.classes(ele);
        },
        
        // Leave zoom area
        leave : function (ele, zoom, x) {
          var i = zoom.attr('rel');
          if (x !== null) {
            ZoomyS[i].state = null;
          } else {
            ZoomyS[i].state = 0;
          }
          zoom.css('visibility', 'hidden');
          change.classes(ele);
        },
        
        // Callback handler (startZoom && stopZoom)
        callback : function (type, zoom) {
          var callbackFunc = type,
            zoomId = zoom.attr('rel');
        
          if (callbackFunc !== null && typeof callbackFunc === 'function') {
            
            callbackFunc($.extend({}, ZoomyS[zoomId], ZoomyS.pos));
            
          }
        
        }
      
      
      },
      
      // Styling Object, holds pretty much all styling except for some minor tweeks
      style = {

        //getting border-radius
        round : function (x, y) {
          return (!options.round) ? 0 : ( x === undefined) ?  '100%'  :  options.zoomSize / 2 + 'px ' +  options.zoomSize  / 2 + 'px 0px 0px';
        },

        //setting glare
        glare : function (zoom) {
          zoom
            .children('span')
            .css({
              height          : options.zoomSize / 2,
              width           : options.zoomSize - 10,
              margin          : ($.browser.msie && parseInt($.browser.version, 10) === 9) ? 0 : '5px auto',
              'border-radius' : style.round(0)
          });
        },
        
        //getting border
        border: function (zoom) {
        
          var borderRaw   = options.border.replace(/^\s*|\s*$/g,''),
            borderArr   = borderRaw.split(' '),
            interger    = parseFloat(borderArr[0]),
            size        = (borderArr.length > 2 && interger * 1 === interger ) ? interger : 0;
            
          return [borderRaw, size];
        },

        // styling element appropiatly
        params : function (ele, zoom) {
          var img             = ele.children('img'),
          
            // TODO: Create function to filter out percents
            border          = style.border(zoom),
            //margining
            margin          = {
              'marginTop'     : img.css('margin-top'),
              'marginRight'   : img.css('margin-right'),
              'marginBottom'  : img.css('margin-bottom'),
              'marginLeft'    : img.css('margin-left')
            },
            //floats
            floats          = {
              'float': img.css('float')
            },
            
            //Zoomy needs these to work
            zoomMin         = {
              'display': 'block',
              height: img.height(),
              width: img.width(),
              'position': 'relative'
            },
            
            //Checking parent text align
            parentCenter    = function () {
          
              //Checking for parent text-align center
              var textAlign = ele.parent('*:first').css('text-align');
              if (textAlign === 'center') {
                margin.marginRight  = 'auto';
                margin.marginLeft   = 'auto';
              }
  
            },
            id  = zoom.attr('rel'),
            css = {};
                
          if (floats['float'] === 'none') {
            parentCenter();
          }
          
          $.extend(css, margin, floats, zoomMin);
          
          ZoomyS[id].css = css;
      
          if (!options.glare) {
            zoom.children('span').css({
              height  : options.zoomSize - 10,
              width   : options.zoomSize - 10
            });
          }

          zoom.css({
            height          : options.zoomSize,
            width           : options.zoomSize,
            top             : 0,
            left            : 0,
            'border-radius' : style.round(undefined, border[1]),
            border          : border[0]
          });

          img.css('margin', '0px');
          img.one("load", function () {
          
            ele.css(ZoomyS[id].css);

            if(ele.parent('.zoomy-wrap').length){
              ele.parent('.zoomy-wrap').css(ZoomyS[id].css);
            }

          }).each(function () {
            if (this.complete || ($.browser.msie && parseInt($.browser.version, 10) === 6)) {
              $(this).trigger("load");
            }
          });
      
        }
      
      },
      
      // Build Object, Elements are added to the DOM here 
      build = {
      
        // Load Zoom Image
        image : function (image, zoom) {
          var id = zoom.attr('rel');

          //Move the Zoomy out of the screen view while loading img
          zoom.show().css({top:'-9999px', left: '-9999px'});
      
          if (zoom.find('img').attr('src') !== image) {
            zoom.find('img').attr('src', image).load(function () {
            
              var assets  = (options.glare) ?  '<span/>' : '',
              border      = style.border(zoom);

            
              ZoomyS[id].zoom = {
                'x'     : zoom.find('img').width(),
                'y'     : zoom.find('img').height(),
                'border': border[1]
              };
  
              zoom.append(assets)
                .css({
                  'background-image': 'url(' + image + ')',
                  top: '0px',
                  left: '0px',
                  visibility: 'hidden'
                })
                .find('img')
                .remove();
              
              style.glare(zoom);
              utils.setParams(zoom);
              
            }).each(function () {
            
              if (this.complete || ($.browser.msie && parseInt($.browser.version, 10) === 6)) {
              
                $(this).trigger("load");
                
              }
            });
      
          }
        },

        // Add zoom element to page
        zoom : function (ele, i) {
        
          //Adding Initial State   
          ZoomyS[i] = {
            state: null,
            index : i
          };
          
          ZoomyS.count.push(0);
          
          // Picking from the right attibute  
          var image = (typeof (ele.attr(options.attr)) === 'string' && options.attr !== 'href') ?  ele.attr(options.attr) : ele.attr('href'),
            zoom = null,
            initCallback = options.zoomInit,
            eventHandler = function () {
              var eventlist = [], //List of Actual Events
                //User Interface Device filter for touch and mouse
                uid = {
                move    : (touch) ? 'touchmove' : 'mousemove',
                begin   : (touch) ? 'touchstart' : 'mouseover',
                end     : (touch) ? 'touchend' : 'mouseleave',
                quick   : (touch) ? 'tap' : 'click'
                },
                zoomMove = function (e, originalEvent) {

                  e = (touch) ? (originalEvent) ? originalEvent.touches[0] || originalEvent.changedTouches[0] : e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;
                  
                  change.move(ele, zoom, e);
                
                },
                zoomStart = function () {
                  change.enter(ele, zoom);
                  
                  ele.bind(uid.move, zoomMove);
                      
                  /* Start Zoom Callback */
                  change.callback(options.zoomStart, zoom);
                },
                zoomStop = function (x) {
                
                  change.leave(ele, zoom, x);
                  
                  ele.unbind(uid.move, zoomMove);
                      
                  /* Start Zoom Callback */  
                  change.callback(options.zoomStop, zoom);
                },
                //New handle to hold start
                 startHandle = function(e, originalEvent){
                  
                   e = (touch) ? (originalEvent) ? originalEvent.touches[0] || originalEvent.changedTouches[0] : e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;
                   
                   ZoomyS.pos = e;
                   
                   if (ZoomyS[i].state === 0) {
                     zoomStart();
                   }
                   
                 },
                 
                 //New handle to hold stop
                 stopHandle = function(e){
                   
                   ZoomyS.pos = e;
                 
                   if (ZoomyS[i].state === 1) {
                     
                     zoomStop(null);
                       
                   }
                   
                 },
                //List of Possible Events
                events = {      
                  event: function (e) {
                  
                    ZoomyS.pos = e;
                  
                    if (!options.clickable) {
                      e.preventDefault();
                    }
                  
                    if (ZoomyS[i].state === 0 || ZoomyS[i].state === null) {
                       
                      zoomStart();
                      
                      //Fix on click show and positioning issues
                      e = (touch && typeof e.originalEvent === 'object' ) ? e.originalEvent.changedTouches[0] || e.originalEvent.touches[0] : e;
                      
                      change.move(ele, zoom, e);
                    
                    } else if (ZoomyS[i].state === 1 && event !== 'mouseover' && event !== 'mouseenter') {
                      
                      zoomStop(0);
                    
                    }
                      
                  },
                  'mouseover' : startHandle,
                  'mouseleave': stopHandle,
                  
                  //New Added Events for touch
                  'touchstart': startHandle,
                  'touchend'  : stopHandle,
                  'click'     : function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                };
               
              // Making sure there is only one mouse over event & Click returns false when it suppose to
              if (event === 'mouseover' || event === 'touchstart') {
                eventlist[event] = events.event;
              } else {
                eventlist[event] = events.event;
                eventlist[uid.begin] = events[uid.begin];
              }
              
              if (!options.clickable && event !== 'click') {
                eventlist.click = events.click;
              }
              eventlist[uid.end] = events[uid.end];

              // Binding Events to element
              if(touch){

                // Handling Events a bit differntly
                var count = 0, 
                    btn = $('.zoomy-btn-' + i),
                    wrp = btn.parent('div'),
                    addEvents = function(e){
                      count = 0;
                      ele.bind(eventlist);
                      ele.trigger('touchstart', e.originalEvent);
                      ele.trigger('touchmove', e.originalEvent);
                      wrp.addClass('active');
                    },
                    removeEvents = function(){
                      wrp.removeClass('active');
                      ele.trigger('touchend');
                      ele.unbind(eventlist);
                    };
                // TODO setup events so that the image cannot be clicked
                    
                btn.bind({
                  'touchstart': addEvents, 
                  'touchmove': function(e){
                    var that = $(this);
                    count += 1;
                    ele.trigger('touchmove', e.originalEvent);
                    e.preventDefault();
                    setTimeout(function(){
                      if(count === 1){
                        that.trigger('touchend');
                      }
                    },200);
                  },'touchend': removeEvents
                });

                //Disabling taphold
                document.oncontextmenu = function() {return false;};
                $(document).mousedown(function(e){
                      if ( e.button === 2 ){
                          return false; 
                      }
                      return true;
                });

              
              }else{
              
                ele.bind(eventlist);
                
              }
              
              $(window).resize(function(){
              
                ele
                .attr('style', '')
                .parent('.zoomy-wrap')
                .attr('style', '');
                
                window.setTimeout(function(){
                
                style.params(ele, zoom);
                
                }, 100);
                
              
              });
              
            },
            //Add Button if  is touch
            magColor = '#efefef',
            icon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" overflow="inherit" xml:space="preserve">\
                <defs>\
                  <filter id="drop-shadow">\
                    <feGaussianBlur in="SourceAlpha" result="blur-out" stdDeviation="1" />\
                    <feOffset in="blur-out" result="the-shadow" dx="0" dy="1"/>\
                    <feBlend in="SourceGraphic" in2="the-shadow" mode="normal"/>\
                  </filter>\
                </defs>\
                <path filter="url(#drop-shadow)" fill="' + magColor + '" d="M23.265,30.324l-9.887,9.887l-3.64-3.641l9.942-9.941c-2.687-4.42-2.134-10.246,1.668-14.049 c4.469-4.469,11.732-4.451,16.224,0.04c4.491,4.491,4.509,11.754,0.04,16.224C33.723,32.732,27.718,33.223,23.265,30.324z M24.601,15.833c-2.681,2.681-2.67,7.039,0.024,9.733s7.053,2.705,9.733,0.025c2.682-2.681,2.671-7.04-0.023-9.734 C31.641,13.162,27.282,13.152,24.601,15.833z"/>\
              </svg>',

            button = (touch) ? ['<div class="zoomy-wrap" />', '<div class=" zoomy-btn zoomy-btn-' + i + '">' + icon + '</div>'] : ['', ''];
      
          //Creating Zoomy Element
          ele
            .addClass('parent-zoom')
            .wrap(button[0])
            .append('<div class="zoomy zoom-obj-' + i + '" rel="' + i + '"><img id="tmp"/></div>' )
            .after(button[1]);
          
          //Setting the Zoom Variable towards the right zoom object
          zoom = $('.zoom-obj-' + i);
          
          eventHandler();
            
          
          if (initCallback !== null && typeof initCallback === 'function') {
            initCallback(ele);
          }
          
          // Set basic parameters
          style.params(ele, zoom);
          
          // Load zoom image 
          build.image(image, zoom);
        
        },
        
        // Initialize element to add to page, check for initial image to be loaded 
        init : function (ele, img) {

          //Programmically make an img to have better results with loading
          var nImg = $('<img />').attr('src', img.attr('src'));
          
          // listen for a load
          nImg.one("load", function () {
          
            // Ready to build zoom
            build.zoom(ele, ZoomyS.count.length);
        
          }).each(function () {
      
            if (this.complete || ($.browser.msie && parseInt($.browser.version, 10) === 6)) {
        
              $(this).trigger("load");
          
            }
          });
        }
      };
 
    //Fallback if there is no event but there are options 
    if (typeof (event) === 'object' && options === undefined) {
    
      options = event;

      event = defaultEvent;
      
    } else if (event === undefined) {
    
      event = defaultEvent;
      
    }
  
    //overriding defaults with options
    options = $.extend(defaults, options);

    $(this).each(function () {
    
      var ele = $(this),
        img = ele.find('img');
       
      // Start Building Zoom
      build.init(ele, img);
     
    });
  };
}(jQuery));