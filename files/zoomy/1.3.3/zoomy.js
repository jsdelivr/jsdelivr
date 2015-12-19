/*
* Zoomy 1.3.3 - jQuery plugin
* http://redeyeops.com/plugins/zoomy
*
* Copyright (c) 2010 Jacob Lowe (http://redeyeoperations.com)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* Built for jQuery library
* http://jquery.com
*
* Addition fixes and modifications done by Larry Battle ( blarry@bateru.com )
* Code has been refactored and the logic has been corrected.
*
*/


(function ($) {
        
// global zoomys state, Indexed, 0 = no zoom, 1 = zoom;
    
    'use strict';
    var ZoomyS = {
	    count : [],
	    pos: null
	};


    $.fn.zoomy = function (event, options) {

	//defaults && option list
	    var defaults = {
		    zoomSize: 200,
		    round: true,
		    glare: true,
		    clickable: false,
		    attr: 'href',
		    border: '5px solid #999',
		    zoomInit: null,  //callback for when zoom initializes
		    zoomStart: null, // callback for when zoom starts
		    zoomStop: null // callback for when the zoom ends
	    },
		    defaultEvent = 'click',
		    
		    
		    change = {
			
				// Move Zoom Cursor
				
				move : function (ele, zoom, e) {
				    var ratio = function (x, y) {
					    var z = x / y;
					    return z;
					},
					    id = zoom.attr('rel'),
					    l = ele.offset(),
					    theOffset = ZoomyS[id].zoom.border,
					    zoomImgX = ZoomyS[id].zoom.x,
					    zoomImgY = ZoomyS[id].zoom.y,
					    tnImgX = ZoomyS[id].css.width,
					    tnImgY = ZoomyS[id].css.height,
					    zoomSize = options.zoomSize + (theOffset * 2),
					    halfSize = zoomSize / 2,
					    ratioX = ratio(tnImgX, zoomImgX),
					    ratioY = ratio(tnImgY, zoomImgY),
					    stop = halfSize - (halfSize * ratioX) - (theOffset * ratioX) + theOffset,
					    stopPos = function (x) {
						var p = (x - zoomSize - theOffset) + stop;
						return p;
					    },
					    rightStop = stopPos(tnImgX),
					    bottomStop = stopPos(tnImgY),
					    zoomY = zoomImgY - zoomSize,
					    zoomX = zoomImgX - zoomSize,
					    mousePos = function (x, y) {
						var p = x - y - halfSize;    
						return p;
					    },
					    zoomPos = function (x, y, z) {
						var p = ((x - y) / z) - halfSize + theOffset;
						return p;
					    },
					    cdCreate = function (a, b, c, d) {
						var bgPos = '-' + a + 'px ' + '-' + b + 'px',
						    o = {
							backgroundPosition: bgPos,
							left: c,
							top: d
						    };
						return o;
					    },
					    posX = mousePos(e.pageX, l.left),
					    posY = mousePos(e.pageY, l.top),
					    leftX = zoomPos(e.pageX, l.left, ratioX),
					    topY = zoomPos(e.pageY, l.top, ratioY),
					    
					    // Collision Detection Possiblities
					    
					    arrPosb = {
						
						// In the Center
						
						    0 : [leftX, topY, posX, posY],
						    
						// On Left Side
						
						    1 : [0, topY, -stop, posY],
						    
						// On the Top Left Corner
						
						    2 : [0, 0, -stop, -stop],
						    
						//On the Bottom Left Corner
						
						    3 : [0, zoomY, -stop, bottomStop],
						    
						// On the Top
						
						    4 : [leftX, 0, posX, -stop],
						    
						//On the Top Right Corner
						
						    5 : [zoomX, 0, rightStop, -stop],
						    
						//On the Right Side
						    
						    6 : [zoomX, topY, rightStop, posY],
						    
						
						//On the Bottom Right Corner
						
						    7 : [zoomX, zoomY, rightStop, bottomStop],
						    
						//On the Bottom    
						
						    8 : [leftX, zoomY, posX, bottomStop]
					    },
					    
					    // Test for collisions
					    
					    a = -stop <= posX,
					    e2 = -stop > posX,
					    b = -stop <= posY,
					    f = -stop > posY,
					    d = bottomStop > posY,
					    g = bottomStop <= posY,
					    c = rightStop > posX,
					    j = rightStop <= posX,
					    
					    
					    // Results
					    
					    cssArrIndex = (a && b && c && d) ? 0 : (e2) ? (b && d) ? 1 : (f) ? 2 : (g) ? 3 : null : (f) ? (c) ? 4 : 5 : (j) ? (d) ? 6 : 7 : (g) ? 8 : null,
					    
					    //Create CSS object to move Zoomy
					    
					    move = cdCreate(arrPosb[cssArrIndex][0], arrPosb[cssArrIndex][1], arrPosb[cssArrIndex][2], arrPosb[cssArrIndex][3], arrPosb[cssArrIndex][4], arrPosb[cssArrIndex][5]);
					    
					    
					    //Uncomment to see Index number for collision type
					    //console.log(cssArrIndex)
					    
				// And Actual Call
					    
				    zoom.css(move || {});
	
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
			
			    round : function (x, y) {
				var cssObj  = (!options.round) ? 0 : ( x === undefined) ?  options.zoomSize + y / 2 +  'px'  :  options.zoomSize / 2 + 'px ' +  options.zoomSize  / 2 + 'px 0px 0px';
				return cssObj;
			    },
			
			    glare : function (zoom) {
				    zoom.children('span').css({
					    height: options.zoomSize / 2,
					    width: options.zoomSize - 10,
					    margin: ($.browser.msie && parseInt($.browser.version, 10) === 9) ? 0 : '5px auto',
					    'border-radius': style.round(0)
				    });
			    },
			    
			    border: function (zoom) {
                
				var borderRaw = options.border.replace(/^\s*|\s*$/g,''),
				    borderArr = borderRaw.split(' '),
				    interger = parseFloat(borderArr[0]),
				    size = (borderArr.length > 2 && interger * 1 === interger ) ? interger : 0;
				    
				    
				    
				return [borderRaw, size];
			    },
			    
			    params : function (ele, zoom) {
				    var img = ele.children('img'),
				    
					    // TODO: Create function to filter out percents
					    border = style.border(zoom),
					    
					    margin = {
							'marginTop': img.css('margin-top'),
							'marginRight': img.css('margin-right'),
							'marginBottom': img.css('margin-bottom'),
							'marginLeft': img.css('margin-left')
					    },
						
					    floats = {
						    'float': img.css('float')
					    },
					    
					    //Zoomy needs these to work
					    
					    zoomMin = {
						    'display': 'block',
						    height: img.height(),
						    width: img.width(),
						    'position': 'relative'
						
					    },
					    
					    //A lil bit of geneology o.0
					    
					    parentCenter = function () {
						    
						    //Checking for parent text-align center
						    
						    var textAlign = ele.parent('*:first').css('text-align');
						    if (textAlign === 'center') {
							    margin.marginRight = 'auto';
							    margin.marginLeft = 'auto';
							
						    }
	
					    },
					    id = zoom.attr('rel'),
					    css = {};
					    
				    
				    
				    if (floats['float'] === 'none') {
					    parentCenter();
				    }
				    
				    $.extend(css, margin, floats, zoomMin);
				    
				    ZoomyS[id].css = css;
			
				    if (!options.glare) {
					    zoom.children('span').css({
						    height: options.zoomSize - 10,
						    width: options.zoomSize - 10
					    });
				    }
			
				    
				    zoom.css({
					    height: options.zoomSize,
					    width: options.zoomSize,
					    'border-radius': style.round(undefined, border[1]),
					    border: border[0]
				    });
			    
			
			
				    img.css('margin', '0px');
			
			
				    img.one("load", function () {
					    ele.css(ZoomyS[id].css);
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
				    zoom.show().css({top: '-999999px', left: '-999999px'});
			
				    if (zoom.find('img').attr('src') !== image) {
					    zoom.find('img').attr('src', image).load(function () {
						
						    var assets = (options.glare) ?  '<span/>' : '',
							border = style.border(zoom);

						    image = image.replace(/ /g, '%20');
						
						    ZoomyS[id].zoom = {
							    'x': zoom.find('img').width(),
							    'y': zoom.find('img').height(),
							    'border': border[1]
						    };
	
						    zoom.append(assets)
							    .css({
								    'background-image': 'url(' + image + ')'
							    })
							    .find('img')
							    .remove();
						    
						    style.glare(zoom);
						    
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
						    var eventlist = [],	//List of Actual Events
							    zoomMove = function (e) {
								
								    change.move(ele, zoom, e);
								    
								    //ZoomyS.pos = e;
								
							    },
							    zoomStart = function () {
								    change.enter(ele, zoom);
								    
								    ele.bind('mousemove', zoomMove);
										    
								    /* Start Zoom Callback */
										
								    change.callback(options.zoomStart, zoom);
							    },
							    zoomStop = function (x) {
								    change.leave(ele, zoom, x);
								    
								    ele.unbind('mousemove', zoomMove);
										    
								    /* Start Zoom Callback */
										
								    change.callback(options.zoomStop, zoom);
							    },
							    events = {		//List of Possible Events
								    event: function (e) {
									
									    ZoomyS.pos = e;
									
									    if (!options.clickable) {
										    e.preventDefault();
									    }
									
									    if (ZoomyS[i].state === 0 || ZoomyS[i].state === null) {
									       
										    zoomStart();
										    
										    //Fix on click show and positioning issues
										    
										    change.move(ele, zoom, e);
										
									    } else if (ZoomyS[i].state === 1 && event !== 'mouseover' && event !== 'mouseenter') {
										    
										    zoomStop(0);
										
									    }
									    
									    
									    
									    
									    
								    },
								    'mouseover': function (e) {
									
									    ZoomyS.pos = e;
									
									    if (ZoomyS[i].state === 0) {
										    zoomStart();
									    }
									    
									    
								
								    },
								    'mouseleave': function (e) {
									
									    ZoomyS.pos = e;
								
									    if (ZoomyS[i].state === 1) {
										
										    zoomStop(null);
											    
									    }
									
								    },
								    'click': function () {
									    return false;
								    }
							    };
						    
						    
						    
						    
						    // Making sure there is only one mouse over event & Click returns false when it suppose to
						    
						    
						    if (event === 'mouseover') {
							    eventlist[event] = events.event;
						    } else {
							    eventlist[event] = events.event;
							    eventlist.mouseover = events.mouseover;
						    }
						    
						    if (!options.clickable && event !== 'click') {
							    eventlist.click = events.click;
						    }
						    eventlist.mouseleave = events.mouseleave;
						    
						    
						    
						    // Binding Events to element
						    
						    ele.bind(eventlist);
						
					    };
					    
				    eventHandler();
					
				    //Creating Zoomy Element
				    ele.addClass('parent-zoom').append('<div class="zoomy zoom-obj-' + i + '" rel="' + i + '"><img id="tmp"/></div>');
				    
				    
				    //Setting the Zoom Variable towards the right zoom object
				    
				    zoom = $('.zoom-obj-' + i);
					    
				    
				    if (initCallback !== null && typeof initCallback === 'function') {
					    initCallback(ele);
				    }
				    
				    // Set basic parameters
				    
				    style.params(ele, zoom);
				    
				    // Load zoom image 
				    
				    build.image(image, zoom);
				    
				    //Event Handler added 1.2
				    
				    
				
			    },
			    
			    // Initialize element to add to page, check for initial image to be loaded
			    
			    init : function (ele, img) {
				    
				    
				    img.one("load", function () {
					
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