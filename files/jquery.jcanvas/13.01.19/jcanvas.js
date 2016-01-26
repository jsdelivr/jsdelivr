/**
 * @license jCanvas v13.01.19
 * Copyright 2013 Caleb Evans
 * Released under the MIT license
 */

// Import frequently used globals
(function($, document, Image, Math, parseFloat, TRUE, FALSE, NULL, UNDEFINED) {

// Define local aliases to frequently used properties
var defaults,
	prefs,
	merge = $.extend,
	round = Math.round,
	PI = Math.PI,
	sin = Math.sin,
	cos = Math.cos,
	jQueryEventFix = $.event.fix,
	mouseEventMap,
	touchEventMap,
	drawingMap,
	cache = {},
	cssProps,
	cssPropsObj;

// Preferences constructor (which inherits from the defaults object)
function jCanvasObject() {}

// jCanvas function for setting property defaults (it's also an object)
function jCanvas(args) {
	if (args) {
		// Merge arguments with preferences
		merge(prefs, args);
	} else {
		// Reset preferences to defaults if nothing is passed
		jCanvas.prefs = prefs = jCanvasObject.prototype = merge({}, defaults);
	}
	return this;
}
// Allow jCanvas function to be "chained" to other methods
$.fn.jCanvas = jCanvas;

// Events object for maintaining jCanvas event initiation functions
jCanvas.events = {};

// jCanvas default property values
defaults = {
	align: 'center',
	autosave: TRUE,
	baseline: 'middle',
	bringToFront: FALSE,
	ccw: FALSE,
	closed: FALSE,
	compositing: 'source-over',
	cornerRadius: 0,
	cropFromCenter: TRUE,
	disableDrag: FALSE,
	disableEvents: FALSE,
	domain: NULL,
	draggable: FALSE,
	data: {},
	each: NULL,
	end: 360,
	fillStyle: 'transparent',
	font: '',
	fontStyle: 'normal',
	fontSize: '12pt',
	fontFamily: 'sans-serif',
	fromCenter: TRUE,
	fn: NULL,
	graph: 'y',
	height: NULL,
	imageSmoothing: TRUE,
	inDegrees: TRUE,
	lineHeight: 1,
	load: NULL,
	mask: FALSE,
	maxWidth: NULL,
	method: NULL,
	miterLimit: 10,
	opacity: 1,
	projection: 0,
	r1: NULL,
	r2: NULL,
	radius: 0,
	range: NULL,
	repeat: 'repeat',
	rotate: 0,
	rounded: FALSE,
	scale: 1,
	scaleX: 1,
	scaleY: 1,
	shadowBlur: 0,
	shadowColor: 'transparent',
	shadowX: 0,
	shadowY: 0,
	sHeight: NULL,
	sides: 3,
	source: '',
	start: 0,
	strokeCap: 'butt',
	strokeJoin: 'miter',
	strokeStyle: 'transparent',
	strokeWidth: 1,
	sWidth: NULL,
	sx: NULL,
	sy: NULL,
	text: '',
	translate: 0,
	translateX: 0,
	translateY: 0,
	type: NULL,
	visible: TRUE,
	width: NULL,
	x: 0,
	y: 0
};

// Copy defaults to preferences object
jCanvas();

/* Internal helper methods */

// Get canvas context
function getContext(canvas) {
	return (canvas && canvas.getContext ? canvas.getContext('2d') : NULL);
}

// Set canvas context properties
function setGlobalProps(ctx, params) {
	var imageSmoothingEnabled;
	// Fill/stroke styles
	ctx.fillStyle = params.fillStyle;
	ctx.strokeStyle = params.strokeStyle;
	ctx.lineWidth = params.strokeWidth;
	// Rounded corners for paths if chosen
	if (params.rounded) {
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	} else {
		ctx.lineCap = params.strokeCap;
		ctx.lineJoin = params.strokeJoin;
		ctx.miterLimit = params.miterLimit;
	}
	// Drop shadow styles
	ctx.shadowOffsetX = params.shadowX;
	ctx.shadowOffsetY = params.shadowY;
	ctx.shadowBlur = params.shadowBlur;
	ctx.shadowColor = params.shadowColor;
	// Opacity and composite operation
	ctx.globalAlpha = params.opacity;
	ctx.globalCompositeOperation = params.compositing;
	// Support cross-browser toggling of image smoothing
	if (params.imageSmoothing) {
		imageSmoothingEnabled = 'imageSmoothingEnabled';
		ctx['webkit' + imageSmoothingEnabled] = ctx['webkit' + imageSmoothingEnabled] = params.imageSmoothing;
	}
}

// Close current canvas path
function closePath(canvas, ctx, params) {
	var data;
	
	// Close path if chosen
	if (params.closed) {
		ctx.closePath();
	}
	ctx.fill();
	// Prevent extra shadow created by stroke (but only when fill is present)
	if (params.fillStyle !== 'transparent') {
		ctx.shadowColor = 'transparent';
	}
	// Only stroke if the stroke
	if (params.strokeWidth !== 0) {
		ctx.stroke();
	}
	// Close path if chosen
	if (!params.closed) {
		ctx.closePath();
	}
	// Restore individual shape transformation
	if (params._transformed) {
		ctx.restore();
	}
	// Enable masking support for this path if chosen
	if (params.mask) {
		if (params.autosave) {
			// Automatically save transformation state by default
			ctx.save();
			data = getCanvasData(canvas);
			data.transforms.mask = TRUE;
			data.savedTransforms = merge({}, data.transforms);
		}
		ctx.clip();
	}
}

// Rotate canvas (internal)
function rotateCanvas(ctx, params, transforms) {
	params._toRad = (params.inDegrees ? PI/180 : 1);

	ctx.translate(params.x, params.y);
	ctx.rotate(params.rotate * params._toRad);
	ctx.translate(-params.x, -params.y);
	// Update transformation data
	transforms.rotate += params.rotate * params._toRad;
}

// Scale canvas (internal)
function scaleCanvas(ctx, params, transforms) {
	
	// Scale both the x- and y- axis using the 'scale' property
	if (params.scale !== 1) {
		params.scaleX = params.scaleY = params.scale;
	}
	// Scale shape
	ctx.translate(params.x, params.y);
	ctx.scale(params.scaleX, params.scaleY);
	ctx.translate(-params.x, -params.y);
	// Update transformation data
	transforms.scaleX *= params.scaleX;
	transforms.scaleY *= params.scaleY;
}

// Translate canvas (internal)
function translateCanvas(ctx, params, transforms) {
	
	// Translate both the x- and y-axis using the 'translate' property
	if (params.translate) {
		params.translateX = params.translateY = params.translate;
	}
	// Translate shape
	ctx.translate(params.translateX, params.translateY);
	transforms.translateX += params.translateX;
	transforms.translateY += params.translateY;
}

// Transform (translate, scale, or rotate) shape
function transformShape(ctx, params, width, height) {
			
	// Measure angles in chosen units
	params._toRad = (params.inDegrees ? PI/180 : 1);
	
	params._transformed = TRUE;
	ctx.save();
	
	// Always draw from center unless otherwise specified
	if (height === UNDEFINED) {
		height = width;
	}
	if (!params.fromCenter && !params._centered) {
		params.x += width / 2;
		params.y += height / 2;
		params._centered = TRUE;
	}
	
	// Rotate shape if chosen
	if (params.rotate) {
		rotateCanvas(ctx, params, {});
	}
	// Scale shape if chosen
	if (params.scale !== 1 || params.scaleX !== 1 || params.scaleY !== 1) {
		scaleCanvas(ctx, params, {});
	}
	if (params.translate || params.translateX || params.translateY) {
		translateCanvas(ctx, params, {});
	}
}

/* Plugin API */

// Extend jCanvas with user-defined methods
jCanvas.extend = function(plugin) {
	
	// Merge properties with defaults
	jCanvas.defaults = merge(defaults, plugin.props);
	jCanvas();
	
	// Create plugin
	if (plugin.name) {
		$.fn[plugin.name] = function self(args) {
			var $canvases = this, canvas, e, ctx,
				params = merge(new jCanvasObject(), args);
						
			for (e=0; e<$canvases.length; e+=1) {
				canvas = $canvases[e];
				ctx = getContext(canvas);
				if (ctx) {
					args = addLayer(canvas, params, args, self);
					setGlobalProps(ctx, params);
					plugin.fn.call(canvas, ctx, params);
				}
			}
			return $canvases;
		};
	}
	return $.fn[plugin.name];
};

/* Layer API */

// Retrieved the stored jCanvas data for a canvas element
function getCanvasData(canvas) {
	var data;
	if (cache.canvas === canvas && cache._data) {
		// Retrieve canvas data from cache if possible
		data = cache._data;
	} else {
		// Get canvas data
		data = $.data(canvas, 'jCanvas');
		// Create canvas data object if it does not already exist
		if (!data) {
			data = {
				layers: [],
				intersects: [],
				drag: {},
				event: {},
				transforms: {
					rotate: 0,
					scaleX: 1,
					scaleY: 1,
					translateX: 0,
					translateY: 0,
					mask: FALSE
				},
				animating: FALSE,
				animated: NULL
			};
			data.savedTransforms = merge({}, data.transforms);
			$.data(canvas, 'jCanvas', data);
		}
		// Cache canvas data
		cache.canvas = canvas;
		cache._data = data;
	}
	return data;
}

// Get jCanvas layers array
$.fn.getLayers = function() {
	var canvas = this[0], layers;
	if (!canvas || !canvas.getContext) {
		layers = [];
	} else {
		layers = getCanvasData(canvas).layers;
	}
	return layers;
};

// Get a single jCanvas layer object
$.fn.getLayer = function(id) {
	var layers = this.getLayers(),
		idType = $.type(id),
		layer, l;
	
	if (id && id.layer) {
		// Return the layer itself if given
		layer = id;
	} else if (idType === 'number') {
		// Retrieve the layer using the given index
			
		// Allow for negative indices
		if (id < 0) {
			id = layers.length + id;
		}
		// Get layer based on given index
		layer = layers[id];
	} else {
		// Get layer based on given layer name
		for (l=0; l<layers.length; l+=1) {
			// Ensure layer's index property is accurate
			layers[l].index = l;
			// Check if layer matches name
			if (layers[l].name === id || (idType === 'regexp' && layers[l].name.match(id))) {
				layer = layers[l];
				break;
			}
		}
	}
	return layer;
};

// Set properties of a layer
$.fn.setLayer = function(id, props) {
	var $canvases = this, e,
		layer;
	for (e=0; e<$canvases.length; e+=1) {
		layer = $($canvases[e]).getLayer(id);
		if (layer) {
			// Merge properties with layer
			merge(layer, props);
		}
	}
	return $canvases;
};

// Move a layer's placement in the layers array
$.fn.moveLayer = function(id, index) {
	var $canvases = this, $canvas, e,
		layers, layer;
		
	for (e=0; e<$canvases.length; e+=1) {
		$canvas = $($canvases[e]);
		// Retrieve layers array and desired layer
		layers = $canvas.getLayers();
		layer = $canvas.getLayer(id);
		if (layer) {
			// Remove layer from its current placement
			layers.splice(layer.index, 1);
			// Add layer in its new placement
			layers.splice(index, 0, layer);
			// Handle negative indices
			if (index < 0) {
				index = layers.length + index;
			}
			// Update layer's stored index
			layer.index = index;
		}
	
	}
	return $canvases;
};

// Remove a jCanvas layer
$.fn.removeLayer = function(id) {
	var $canvases = this, $canvas, e,
		layers, layer;
		
	for (e=0; e<$canvases.length; e+=1) {
		$canvas = $($canvases[e]);
		// Retrieve layers array and desired layer
		layers = $canvas.getLayers();
		layer = $canvas.getLayer(id);
		
		// Remove layer if found
		if (layer) {
			layers.splice(layer.index, 1);
		}
		
	}
	return $canvases;
};

// Remove all jCanvas layers
$.fn.removeLayers = function() {
	var $canvases = this, e,
		layers;
	for (e=0; e<$canvases.length; e+=1) {
		layers = $($canvases[e]).getLayers();
		// Setting an array's length to 0 will empty the array
		layers.length = 0;
	}
	return $canvases;
};

// Get all layers in the given group
$.fn.getLayerGroup = function(id) {
	var layers = this.getLayers(),
		idType = $.type(id),
		group = [], l;
	
	if (idType === 'array') {
		// Return layer group if given
		return id;
	} else {
		// Otherwise, find layers in group based on group name
		for (l=0; l<layers.length; l+=1) {
			// Ensure layer's index property is accurate
			layers[l].index = l;
			// Include layer is associated with group
			if (layers[l].group === id || (idType === 'regexp' && layers[l].group.match(id))) {
				group.push(layers[l]);
			}
		}
	}
	return group;
};

// Set properties of all layers in the given group
$.fn.setLayerGroup = function(id, props) {
	var $canvases = this, $canvas, e,
		group, l;
	
	for (e=0; e<$canvases.length; e+=1) {
		// Get layer group
		$canvas = $($canvases[e]);
		group = $canvas.getLayerGroup(id);
		for (l=0; l<group.length; l+=1) {
			// Merge given properties with layer
			merge(group[l], props);
		}
	}
	return $canvases;
};

// Remove all layers within a specific group
$.fn.removeLayerGroup = function(id) {
	var $canvases = this, $canvas, e,
		idType = $.type(id),
		layers, l;
	
	if (id !== UNDEFINED) {
		for (e=0; e<$canvases.length; e+=1) {
			$canvas = $($canvases[e]);
			layers = $canvas.getLayers();
			// Get layer based on given layer name
			for (l=0; l<layers.length; l+=1) {
				// Ensure layer's index property is accurate
				layers[l].index = l;
				// Check if layer matches name
				if (layers[l].group === id || (idType === 'regexp' && layers[l].group.match(id))) {
					layers.splice(l, 1);
					l -= 1;
				}
			}
		}
	}
	return $canvases;
};

// Draw individual layer (internal)
function drawLayer($canvas, ctx, layer) {
	if (layer && layer.visible) {
		if (layer.method === $.fn.draw) {
			// If layer is a function, call it
			layer.fn.call($canvas[0], ctx);
		} else if (layer.method) {
			// If layer is an object, call its respective method
			layer.method.call($canvas, layer);
		}
	}
}

// Draw an individual layer
$.fn.drawLayer = function(name) {
	var $canvases = this, e, ctx,
		$canvas, layer;
		
	for (e=0; e<$canvases.length; e+=1) {
		$canvas = $($canvases[e]);
		ctx = getContext($canvases[e]);
		// Retrieve the specified layer
		layer = $canvas.getLayer(name);
		drawLayer($canvas, ctx, layer);
	}
	return $canvases;
};

// Draw all layers (or only the given layers)
$.fn.drawLayers = function(_resetFire) {
	var $canvases = this, $canvas, e, ctx,
		layers, layer, l,
		data, eventCache, eventType,
		drag, callback;
	
	for (e=0; e<$canvases.length; e+=1) {
		$canvas = $($canvases[e]);
		ctx = getContext($canvases[e]);
		if (ctx) {
			data = getCanvasData($canvases[e]);
			
			// Clear canvas first
			$canvas.clearCanvas();
			
			layers = data.layers;
			
			// Draw layers from first to last (bottom to top)
			for (l=0; l<layers.length; l+=1) {
				layer = layers[l];
				
				// Ensure layer index is up-to-date
				layer.index = l;
									
				// Prevent any one event from firing excessively
				if (_resetFire) {
					layer._fired = FALSE;
				}
				// Disable events temporarily if chosen
				layer._event = !layer.disableEvents;
				// Draw layer
				drawLayer($canvas, ctx, layer);
				
				// Trigger mouseout event if necessary
				if (layer._mousedout) {
					layer._mousedout = FALSE;
					layer._fired = TRUE;
					layer._hovered = FALSE;
					if (layer.mouseout) {
						layer.mouseout.call($canvases[e], layer);
					}
					// Revert cursor when mousing off layer
					if (layer.cursor && layer._cursor) {
						$canvas.css({
							cursor: layer._cursor
						});
					}
				}
				
			}
			
			layer = data.intersects[data.intersects.length-1] || {};
			eventCache = data.event;
			eventType = eventCache.type;
			// Use mouse event callbacks if no touch event callbacks are given
			if (!layer[eventType]) {
				eventType = getMouseEventName(eventType);
			}
			callback = layer[eventType];
			drag = data.drag;
			
			// Check events for intersecting layer
			if (layer._event) {
										
				// Detect mouseover events
				if (layer.mouseover || layer.mouseout || layer.cursor) {
					if (!layer._hovered && !layer._fired) {
						layer._fired = TRUE;
						layer._hovered = TRUE;
						if (layer.mouseover) {
							layer.mouseover.call($canvases[e], layer);
						}
						// Set cursor when mousing over layer
						if (layer.cursor) {
							layer._cursor = $canvas.css('cursor');
							$canvas.css({
								cursor: layer.cursor
							});
						}
					}
				}
													
				// Detect any other mouse event
				if (callback && !layer._fired) {
					layer._fired = TRUE;
					callback.call($canvases[e], layer);
					// Prevent event from being "transferred" to another layer
					eventCache.type = NULL;
				}
				
				// Use the mousedown event to start drag
				if (layer.draggable && !layer.disableDrag && (eventType === 'mousedown' || eventType === 'touchstart')) {
						
					// Being layer to front when drag starts (if chosen)
					if (layer.bringToFront) {
						layers.splice(layer.index, 1);
						// The push() method returns the new length of the array
						layer.index = layers.push(layer);
					}
					
					// Keep track of drag state
					drag.layer = layer;
					drag.dragging = TRUE;
					drag.startX = layer.startX = layer.x;
					drag.startY = layer.startY = layer.y;
					drag.endX = layer.endX = layer._eventX;
					drag.endY = layer.endY = layer._eventY;
					
					// Trigger dragstart event if defined
					if (layer.dragstart) {
						layer.dragstart.call($canvases[e], layer);
					}
				}
				
			}
			
			// Dragging a layer works independently from other events
			if (drag.layer) {
				
				// Use the mouseup event to stop the drag
				if (drag.dragging && (eventType === 'mouseup' || eventType === 'touchend')) {
					// Trigger dragstop event if defined
					if (drag.layer.dragstop) {
						drag.layer.dragstop.call($canvases[e], drag.layer);
					}
					data.drag = {};
				}
				// Regardless of whether the cursor is on the layer, drag the layer until drag stops
				if (drag.dragging && (eventType === 'mousemove' || eventType === 'touchmove')) {
					drag.layer.x = drag.layer._eventX - (drag.endX - drag.startX);
					drag.layer.y = drag.layer._eventY - (drag.endY - drag.startY);
					// Trigger drag event if defined
					if (drag.layer.drag) {
						drag.layer.drag.call($canvases[e], drag.layer);
					}
				}
			}
			
			data.intersects = [];
		}
	}
	return $canvases;
};

// Add a jCanvas layer (internal)
function addLayer(canvas, params, layer, method) {
	var $canvas, layers, event,
		data, dragHelperEvents, i;
	layer = layer || {};
	
	// Store arguments object for later use
	params._args = layer;
	layer.canvas = params.canvas = canvas;
	
	// Only add layer if it hasn't been added before
	if (params.layer && !params._layer) {
		
		$canvas = $(canvas);
		layers = $canvas.getLayers();
				
		// Associate a jCanvas method with layer
		layer.method = $.fn[layer.method] || method;
		data = getCanvasData(canvas);
		
		// Ensure layers are unique across canvases by cloning them
		layer = merge(new jCanvasObject(), layer);
		
		// Check for any associated jCanvas events and enable them
		for (event in jCanvas.events) {
			if (jCanvas.events.hasOwnProperty(event) && layer[event]) {
				event = getTouchEventName(event);
				jCanvas.events[event]($canvas, data);
				layer._event = TRUE;
			}
		}
		
		// Enable drag-and-drop support and cursor support
		if (layer.draggable || layer.cursor) {
			layer._event = TRUE;
			dragHelperEvents = ['mousedown', 'mousemove', 'mouseup'];
			for (i=0; i<dragHelperEvents.length; i+=1) {
				event = getTouchEventName(dragHelperEvents[i]);
				jCanvas.events[event]($canvas, data);
			}
			// If cursor mouses out of canvas while dragging, cancel drag
			if (!data.mouseout) {
				$canvas.bind('mouseout.jCanvas', function() {
					data.drag = {};
					$canvas.drawLayers();
				});
				data.mouseout = TRUE;
			}
		}

		// Set layer properties and add to stack
		layer.layer = TRUE;
		layer._layer = TRUE;
		// Add layer to end of array if no index is specified
		if (layer.index === UNDEFINED) {
			layer.index = layers.length;
		}
		// Add layer to layers array at specified index
		layers.splice(layer.index, 0, layer);
	}
	return layer;
}

// Add a jCanvas layer
$.fn.addLayer = function(args) {
	var $canvases = this, e, ctx,
		args = fnToObj(args),
		params = merge(new jCanvasObject(), args);
		
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {
			params.layer = TRUE;
			// Find the method that corresponds with the given drawing type
			if (params.type && !params.method) {
				params.method = $.fn[drawingMap[params.type]];
			}
			args = addLayer($canvases[e], params, args, params.method);
		}
	}
	return $canvases;
};

/* Animation API */

// Define properties used in both CSS and jCanvas
cssProps = [
	'width',
	'height',
	'opacity',
	'lineHeight'
];
cssPropsObj = {};

// Hide/show jCanvas/CSS properties so they can be animated using jQuery
function showProps(obj) {
	var i;
	for (i=0; i<cssProps.length; i+=1) {
		obj[cssProps[i]] = obj['_' + cssProps[i]];
	}
}
function hideProps(obj, reset) {
	var i;
	for (i=0; i<cssProps.length; i+=1) {
		obj['_' + cssProps[i]] = obj[cssProps[i]];
		cssPropsObj[cssProps[i]] = 1;
		if (reset) {
			delete obj[cssProps[i]];
		}
	}
}

// Convert a color value to RGB
function toRgb(color) {
	var originalColor, elem,
		rgb = [],
		multiple = 1;
	
	// Deal with hexadecimal colors and color names
	if (color.match(/^#?\w+$/i)) {
		// Deal with complete transparency
		if (color === 'transparent') {
			color = 'rgba(0,0,0,0)';
		}
		elem = document.head;
		originalColor = elem.style.color;
		elem.style.color = color;
		color = $.css(elem, 'color');
		elem.style.color = originalColor;
	}
	// Parse RGB string
	if (color.match(/^rgb/i)) {
		rgb = color.match(/\d+/gi);
		// Deal with RGB percentages
		if (color.match(/%/gi)) {
			multiple = 2.55;
		}
		rgb[0] *= multiple;
		rgb[1] *= multiple;
		rgb[2] *= multiple;
		// Ad alpha channel if given
		if (rgb[3] !== UNDEFINED) {
			rgb[3] = parseFloat(rgb[3]);
		} else {
			rgb[3] = 1;
		}
	}
	return rgb;
}

// Animate a hex or RGB color
function animateColor(fx) {
	var n = 3,
		i;
	// Only parse start and end colors once
	if (typeof fx.start !== 'object') {
		fx.start = toRgb(fx.start);
		fx.end = toRgb(fx.end);
	}
	fx.now = [];
	
	// If colors are RGBA, animate transparency
	if (fx.start[3] !== 1 || fx.end[3] !== 1) {
		n = 4;
	}
		
	// Calculate current frame for red, green, blue, and alpha
	for (i=0; i<n; i+=1) {
		fx.now[i] = fx.start[i] + (fx.end[i] - fx.start[i]) * fx.pos;
		// Only the red, green, and blue values must be integers
		if (i < 3) {
			fx.now[i] = round(fx.now[i]);
		}
	}
	if (fx.start[3] !== 1 || fx.end[3] !== 1) {
		// Only use RGBA if RGBA colors are given
		fx.now = 'rgba(' + fx.now.join(',') + ')';
	} else {
		// Otherwise, animate as solid colors
		fx.now.slice(0, 3);
		fx.now = 'rgb(' + fx.now.join(',') + ')';
	}
	// Animate colors for both canvas layers and DOM elements
	if (fx.elem.nodeName) {
		fx.elem.style[fx.prop] = fx.now;
	} else {
		fx.elem[fx.prop] = fx.now;
	}
}

// Animate jCanvas layer
$.fn.animateLayer = function() {
	var $canvases = this, $canvas, e, ctx,
		args = ([]).slice.call(arguments, 0),
		data, layer;
			
	// Deal with all cases of argument placement
	/*
		0. layer name/index
		1. properties
		2. duration/options
		3. easing
		4. complete function
		5. step function
	*/
	
	if (typeof args[0] === 'object' && !args[0].layer) {
		// Animate first layer by default
		args.unshift(0);
	}
	
	if (typeof args[2] === 'object') {
	
		// Accept an options object for animation
		args.splice(2, 0, args[2].duration || NULL);
		args.splice(3, 0, args[3].easing || NULL);
		args.splice(4, 0, args[4].complete || NULL);
		args.splice(5, 0, args[5].step || NULL);
			
	} else {
	
		if (args[2] === UNDEFINED) {
			// If object is the last argument
			args.splice(2, 0, NULL);
			args.splice(3, 0, NULL);
			args.splice(4, 0, NULL);
		} else if (typeof args[2] === 'function') {
			// If callback comes after object
			args.splice(2, 0, NULL);
			args.splice(3, 0, NULL);
		}
		if (args[3] === UNDEFINED) {
			// If duration is the last argument
			args[3] = NULL;
			args.splice(4, 0, NULL);
		} else if (typeof args[3] === 'function') {
			// If callback comes after duration
			args.splice(3, 0, NULL);
		}

	}
	
	// Run callback function when animation completes
	function complete($canvas, data, layer) {
		return function() {
			showProps(layer);
			// Prevent multiple redraw loops
			if (!data.animating || data.animated === layer) {
				// Redraw layers on last frame
				$canvas.drawLayers();
			}
			// Run callback function at the end of the animation
			if (args[4]) {
				args[4].call($canvas[0], layer);
			}
			// Signify the end of an animation loop
			layer._animating = FALSE;
			data.animating = FALSE;
			data.animated = NULL;
		};
	}
	// Redraw layers on every frame of the animation
	function step($canvas, data, layer) {
		return function(now, fx) {
			showProps(layer);
			// Signify the start of an animation loop
			if (!layer._animating && !data.animating) {
				layer._animating = TRUE;
				data.animating = TRUE;
				data.animated = layer;
			}
			// Prevent multiple redraw loops
			if (!data.animating || data.animated === layer) {
				// Redraw layers for every frame
				$canvas.drawLayers();
			}
			// Run callback function for every frame (if specified)
			if (args[5]) {
				args[5].call($canvas[0], now, fx, layer);
			}
		};
	}

	// Do not modify original object
	args[1] = merge({}, args[1]);
	hideProps(args[1], TRUE);

	for (e=0; e<$canvases.length; e+=1) {
		$canvas = $($canvases[e]);
		ctx = getContext($canvases[e]);
		if (ctx) {
			data = getCanvasData($canvases[e]);
			
			// If a layer object was passed, use it the layer to be animated
			layer = $canvas.getLayer(args[0]);
				
			// Ignore layers that are functions
			if (layer && layer.method !== $.fn.draw) {
				
				// Bypass jQuery CSS Hooks for CSS properties (width, opacity, etc.)
				hideProps(layer);
								
				// Fix for jQuery's vendor prefixing support, which affects how width/height/opacity are animated
				layer.style = cssPropsObj;
													
				// Animate layer
				$(layer).animate(args[1], {
					duration: args[2],
					easing: ($.easing[args[3]] ? args[3] : NULL),
					// When animation completes
					complete: complete($canvas, data, layer),
					// Redraw canvas for every animation frame
					step: step($canvas, data, layer)
				});
			}
		}
	}
	return $canvases;
};

// Animate all layers in a layer group
$.fn.animateLayerGroup = function(id) {
	var $canvases = this, $canvas, e,
		args = ([]).slice.call(arguments, 0),
		group, l;
	for (e=0; e<$canvases.length; e+=1) {
		$canvas = $($canvases[e]);
		group = $canvas.getLayerGroup(id);
		// Animate all layers in the group
		for (l=0; l<group.length; l+=1) {
			$canvas.animateLayer.apply($canvas, [group[l]].concat(args.slice(1)));
		}
	}
};

// Delay layer animation by a given number of milliseconds
$.fn.delayLayer = function(id, duration) {
	var $canvases = this, e, layer;
	duration = duration || 0;
	
	for (e=0; e<$canvases.length; e+=1) {
		layer = $($canvases[e]).getLayer(id);
		$(layer).delay(duration);
	}
	return $canvases;
};

// Delay animation all layers in a layer group
$.fn.delayLayerGroup = function(id, duration) {
	var $canvases = this, $canvas, e,
		group, l;
	duration = duration || 0;
	
	for (e=0; e<$canvases.length; e+=1) {
		$canvas = $($canvases[e]);
		group = $canvas.getLayerGroup(id);
		// Delay all layers in the group
		for (l=0; l<group.length; l+=1) {
			$canvas.delayLayer.call($canvas, group[l], duration);
		}
	}
};

// Stop layer animation
$.fn.stopLayer = function(id, clearQueue) {
	var $canvases = this, e, layer;
	
	for (e=0; e<$canvases.length; e+=1) {
		layer = $($canvases[e]).getLayer(id);
		$(layer).stop(clearQueue);
	}
	return $canvases;
};

// Stop animation of all layers in a layer group
$.fn.stopLayerGroup = function(id, clearQueue) {
	var $canvases = this, $canvas, e,
		group, l;
	
	for (e=0; e<$canvases.length; e+=1) {
		$canvas = $($canvases[e]);
		group = $canvas.getLayerGroup(id);
		// Stop all layers in the group
		for (l=0; l<group.length; l+=1) {
			$canvas.stopLayer.call($canvas, group[l], clearQueue);
		}
	}
};

// Enable animation for color properties
function supportColorProps(props) {
	var p;
	for (p=0; p<props.length; p+=1) {
		$.fx.step[props[p]] = animateColor;
	}
}

// Enable animation for color properties
supportColorProps([
	'color',
	'backgroundColor',
	'borderColor',
	'borderTopColor',
	'borderRightColor',
	'borderBottomColor',
	'borderLeftColor',
	'fillStyle',
	'outlineColor',
	'strokeStyle',
	'shadowColor'
]);

/* Event API */

// Map standard mouse events to touch events
mouseEventMap = {
	'mousedown': 'touchstart',
	'mouseup': 'touchend',
	'mousemove': 'touchmove'
};
// Map standard touch events to mouse events
touchEventMap = {
	'touchstart': 'mousedown',
	'touchend': 'mouseup',
	'touchmove': 'mousemove'
};

// Convert mouse event name to a corresponding touch event name (if possible)
function getTouchEventName(eventName) {
	// Detect touch event support
	if ('ontouchstart' in window) {
		if (mouseEventMap[eventName]) {
			eventName = mouseEventMap[eventName];
		}
	}
	return eventName;
}
// Convert touch event name to a corresponding mouse event name
function getMouseEventName(eventName) {
	if (touchEventMap[eventName]) {
		eventName = touchEventMap[eventName];
	}
	return eventName;
}

// Bind event to jCanvas layer using standard jQuery events
function createEvent(eventName) {
	
	jCanvas.events[eventName] = function($canvas, data) {
		
		// Use touch events instead of mouse events for mobile devices
		eventName = getTouchEventName(eventName);
		
		// Both mouseover/mouseout events will be managed by a single mousemove event
		var helperEventName = (eventName === 'mouseover' || eventName === 'mouseout') ? 'mousemove' : eventName,
		// Retrieve canvas's event cache
		eventCache = data.event;
		
		// Ensure a single DOM event is not bound more than once
		if (!data[helperEventName]) {
			// Bind one canvas event which handles all layer events of that type
			$canvas.bind(helperEventName + '.jCanvas', function(event) {
				// Cache current mouse position and redraw layers
				eventCache.x = event.offsetX;
				eventCache.y = event.offsetY;
				eventCache.type = helperEventName;
				eventCache.event = event;
				$canvas.drawLayers(TRUE);
				event.preventDefault();
			});
			data[helperEventName] = TRUE;
		}
	};
}
// Populate jCanvas events object with some standard events
createEvent('click');
createEvent('dblclick');
createEvent('mousedown');
createEvent('mouseup');
createEvent('mousemove');
createEvent('mouseover');
createEvent('mouseout');
createEvent('touchstart');
createEvent('touchmove');
createEvent('touchend');

// Check if event fires when a drawing is drawn
function detectEvents(canvas, ctx, params) {
	var layer, data, eventCache, over,
		transforms, x, y, angle;
	
	// Use the layer object stored by the given parameters object
	layer = params._args;
	
	// Canvas must have event bindings
	if (layer._event) {
		
		data = getCanvasData(canvas);
		eventCache = data.event;
		over = ctx.isPointInPath(eventCache.x, eventCache.y);
		transforms = data.transforms;
			
		// Allow callback functions to retrieve the mouse coordinates
		layer.eventX = layer.mouseX = eventCache.x;
		layer.eventY = layer.mouseY = eventCache.y;
		layer.event = eventCache.event;
		
		// Adjust coordinates to match current canvas transformation
		
		// Keep track of some transformation values
		angle = data.transforms.rotate;
		x = layer.eventX;
		y = layer.eventY;
		
		// Rotate coordinates
		layer._eventX = (x * cos(-angle)) - (y * sin(-angle));
		layer._eventY = (y * cos(-angle)) + (x * sin(-angle));
		
		// Scale coordinates
		layer._eventX /= transforms.scaleX;
		layer._eventY /= transforms.scaleY;
		
		// Detect mouseout events
		if (!over && layer._hovered && !layer._fired) {
			layer._mousedout = TRUE;
		}
			
		// If layer intersects with cursor, add it to the list
		if (over) {
			data.intersects.push(layer);
		}
	}
}

// Normalize offsetX and offsetY for all browsers
$.event.fix = function(event) {
	var offset, originalEvent, touches;
	
	event = jQueryEventFix.call($.event, event);
	originalEvent = event.originalEvent;
	
	// originalEvent does not exist for manually-triggered events
	if (originalEvent) {
		
		touches = originalEvent.changedTouches;
		
		// If offsetX and offsetY are not supported, define them
		if (event.pageX !== UNDEFINED && event.offsetX === UNDEFINED) {
			offset = $(event.target).offset();
			if (offset) {
				event.offsetX = event.pageX - offset.left;
				event.offsetY = event.pageY - offset.top;
			}
		} else if (touches) {
			// Enable offsetX and offsetY for mobile devices
			offset = $(originalEvent.target).offset();
			if (offset) {
				event.offsetX = touches[0].pageX - offset.left;
				event.offsetY = touches[0].pageY - offset.top;
			}
		}
	
	}
	return event;
};

/* Drawing API */

// Map drawing names with their respective methods
drawingMap = {
	'arc': 'drawArc',
	'bezier': 'drawBezier',
	'circle': 'drawArc',
	'ellipse': 'drawEllipse',
	'function': 'draw',
	'image': 'drawImage',
	'line': 'drawLine',
	'polygon': 'drawPolygon',
	'quadratic': 'drawQuadratic',
	'rectangle': 'drawRect',
	'text': 'drawText',
	'vector': 'drawVector'
};

// Convert function argument to fn property of object (for compatibility)
function fnToObj(args) {
	if (typeof args === 'function') {
		args = {
			method: $.fn.draw,
			fn: args
		};
	}
	return args;
}

// Draw on canvas using a function
$.fn.draw = function self(args) {
	var $canvases = this, e, ctx,
		args = fnToObj(args),
		params = merge(new jCanvasObject(), args);
	
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx && params.fn) {
			args = addLayer($canvases[e], params, args, self);
			// Call any given user-defined function
			if (params.visible) {
				params.fn.call($canvases[e], ctx);
			}
		}
	}
	return $canvases;
};

// Clear canvas
$.fn.clearCanvas = function(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args);

	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {

			// Save current transformation
			transformShape(ctx, params, params.width, params.height);
			
			// Reset current transformation temporarily to ensure the entire canvas is cleared
			ctx.setTransform(1, 0, 0, 1, 0, 0);
					
			// Clear entire canvas if any area properties are not given
			if (!params.x || !params.y || !params.width || !params.height) {
				ctx.clearRect(0, 0, $canvases[e].width, $canvases[e].height);
			} else {
				// Otherwise, clear the defined section of the canvas
				ctx.clearRect(params.x-params.width/2, params.y-params.height/2, params.width, params.height);
			}
			// Restore previous transformation
			ctx.restore();
			
		}
	}
	return $canvases;
};

/* Transformation API */

// Save canvas
$.fn.saveCanvas = function() {
	var $canvases = this, e, ctx,
		data;
	
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {
			data = getCanvasData($canvases[e]);
			
			ctx.save();
			data.savedTransforms = merge({}, data.transforms);
		}
	}
	return $canvases;
};

// Restore canvas
$.fn.restoreCanvas = function() {
	var $canvases = this, e, ctx,
		data;
	
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {
			data = getCanvasData($canvases[e]);
			
			ctx.restore();
			data.transforms = merge({}, data.savedTransforms);
		}
	}
	return $canvases;
};

// Restore canvas
$.fn.restoreCanvasOnRedraw = function(args) {
	var params = {
		layer: TRUE,
		fn: function() {
			$(this).restoreCanvas();
		}
	};
	merge(params, args);
	return this.draw(params);
};

// Translate canvas
$.fn.translateCanvas = function(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		data;

	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {
			data = getCanvasData($canvases[e]);
			
			// Autosave transformation state by default
			if (params.autosave) {ctx.save();}
			translateCanvas(ctx, params, data.transforms);
		}
	}
	return $canvases;
};

// Scale canvas
$.fn.scaleCanvas = function(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		data;
		
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {
			data = getCanvasData($canvases[e]);
			
			// Autosave transformation state by default
			if (params.autosave) {ctx.save();}
			scaleCanvas(ctx, params, data.transforms);
		}
	}
	return $canvases;
};

// Rotate canvas
$.fn.rotateCanvas = function(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		data;
	
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {
			data = getCanvasData($canvases[e]);
			
			// Autosave transformation state by default
			if (params.autosave) {ctx.save();}
			rotateCanvas(ctx, params, data.transforms);
		}
	}
	return $canvases;
};

/* Shape API */

// Draw rectangle
$.fn.drawRect = function self(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		x1, y1, x2, y2, r;

	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {
		
			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
			
				setGlobalProps(ctx, params);
				transformShape(ctx, params, params.width, params.height);
				
				ctx.beginPath();
				x1 = params.x - params.width/2;
				y1 = params.y - params.height/2;
				r = params.cornerRadius;
				// Draw a rounded rectangle if chosen
				if (r) {
					params.closed = TRUE;
					x2 = params.x + params.width/2;
					y2 = params.y + params.height/2;
					// Prevent over-rounded corners
					if ((x2 - x1) - (2 * r) < 0) {
						r = (x2 - x1) / 2;
					}
					if ((y2 - y1) - (2 * r) < 0) {
						r = (y2 - y1) / 2;
					}
					ctx.moveTo(x1+r, y1);
					ctx.lineTo(x2-r, y1);
					ctx.arc(x2-r, y1+r, r, 3*PI/2, PI*2, FALSE);
					ctx.lineTo(x2, y2-r);
					ctx.arc(x2-r, y2-r, r, 0, PI/2, FALSE);
					ctx.lineTo(x1+r, y2);
					ctx.arc(x1+r, y2-r, r, PI/2, PI, FALSE);
					ctx.lineTo(x1, y1+r);
					ctx.arc(x1+r, y1+r, r, PI, 3*PI/2, FALSE);
				} else {
					ctx.rect(x1, y1, params.width, params.height);
				}
				// Check for jCanvas events
				if (params._event) {
					detectEvents($canvases[e], ctx, params);
				}
				// Close path if chosen
				closePath($canvases[e], ctx, params);
				
			}
		}
	}
	return $canvases;
};

// Draw arc or circle
$.fn.drawArc = function self(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args);
	args = args || {};

	// Change default end angle to radians if necessary
	if (!params.inDegrees && params.end === 360) {
		args.end = params.end = PI * 2;
	}
	
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {

			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
				
				setGlobalProps(ctx, params);
				transformShape(ctx, params, params.radius*2);
				
				// Draw arc
				ctx.beginPath();
				ctx.arc(params.x, params.y, params.radius, (params.start*params._toRad)-(PI/2), (params.end*params._toRad)-(PI/2), params.ccw);
				// Check for jCanvas events
				if (params._event) {
					detectEvents($canvases[e], ctx, params);
				}
				// Close path if chosen
				closePath($canvases[e], ctx, params);
			
			}
		}
	}
	return $canvases;
};

// Draw ellipse
$.fn.drawEllipse = function self(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		controlW = params.width * 4/3,
		controlH = params.height;
	params.closed = TRUE;
	
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {

			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
		
				setGlobalProps(ctx, params);
				transformShape(ctx, params, params.width, params.height);
				
				// Create ellipse using curves
				ctx.beginPath();
				ctx.moveTo(params.x, params.y-controlH/2);
				// Left side
				ctx.bezierCurveTo(params.x-controlW/2, params.y-controlH/2, params.x-controlW/2, params.y+controlH/2, params.x, params.y+controlH/2);
				// Right side
				ctx.bezierCurveTo(params.x+controlW/2, params.y+controlH/2, params.x+controlW/2, params.y-controlH/2, params.x, params.y-controlH/2);
				// Check for jCanvas events
				if (params._event) {
					detectEvents($canvases[e], ctx, params);
				}
				// Close path if chosen
				closePath($canvases[e], ctx, params);
				
			}
		}
	}
	return $canvases;
};

// Draw a regular (equal-angled) polygon
$.fn.drawPolygon = function self(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		// Polygon's central angle
		dtheta = (2 * PI) / params.sides,
		// Half of dtheta
		hdtheta = PI / params.sides,
		// Polygon's starting angle
		theta = hdtheta + (PI / 2),
		// Distance from polygon's center to the middle of its side
		apothem = params.radius * cos(dtheta / 2),
		x, y, i;
	params.closed = TRUE;
		
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {

			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
				
				setGlobalProps(ctx, params);
				transformShape(ctx, params, params.radius*2);
				
				// Calculate points and draw
				ctx.beginPath();
				for (i=0; i<params.sides; i+=1) {
					// Draw side of polygon
					x = params.x + round(params.radius * cos(theta));
					y = params.y + round(params.radius * sin(theta));
					ctx.lineTo(x, y);
					// Project side if chosen
					if (params.projection) {
						// Sides are projected from the polygon's apothem
						x = params.x + round((apothem + apothem*params.projection) * cos(theta + hdtheta));
						y = params.y + round((apothem + apothem*params.projection) * sin(theta + hdtheta));
						ctx.lineTo(x, y);
					}
					theta += dtheta;
				}
				// Check for jCanvas events
				if (params._event) {
					detectEvents($canvases[e], ctx, params);
				}
				// Close path if chosen
				closePath($canvases[e], ctx, params);
				
			}
		}
	}
	return $canvases;
};

/* Path API */

// Draw line
$.fn.drawLine = function self(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		l, lx, ly;

	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {

			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
				
				setGlobalProps(ctx, params);
				transformShape(ctx, params, 0);
				
				// Draw each point
				l = 1;
				ctx.beginPath();
				while (TRUE) {
					lx = params['x' + l];
					ly = params['y' + l];
					if (lx !== UNDEFINED && ly !== UNDEFINED) {
						ctx.lineTo(lx+params.x, ly+params.y);
						l += 1;
					} else {
						break;
					}
				}
				// Check for jCanvas events
				if (params._event) {
					detectEvents($canvases[e], ctx, params);
				}
				// Close path if chosen
				closePath($canvases[e], ctx, params);
			
			}
			
		}
	}
	return $canvases;
};

// Draw quadratic curve
// The drawQuad() method has been deprecated
$.fn.drawQuadratic = $.fn.drawQuad = function self(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		l, lx, ly, lcx, lcy;

	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {

			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
				
				setGlobalProps(ctx, params);
				transformShape(ctx, params, 0);
				
				// Draw each point
				l = 2;
				ctx.beginPath();
				ctx.moveTo(params.x1+params.x, params.y1+params.y);
				while (TRUE) {
					lx = params['x' + l];
					ly = params['y' + l];
					lcx = params['cx' + (l-1)];
					lcy = params['cy' + (l-1)];
					if (lx !== UNDEFINED && ly !== UNDEFINED && lcx !== UNDEFINED && lcy !== UNDEFINED) {
						ctx.quadraticCurveTo(lcx+params.x, lcy+params.y, lx+params.x, ly+params.y);
						l += 1;
					} else {
						break;
					}
				}
				// Check for jCanvas events
				if (params._event) {
					detectEvents($canvases[e], ctx, params);
				}
				// Close path if chosen
				closePath($canvases[e], ctx, params);
			
			}
		}
	}
	return $canvases;
};

// Draw Bezier curve
$.fn.drawBezier = function self(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		l , lc,
		lx, ly,
		lcx1, lcy1,
		lcx2, lcy2;

	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {

			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
			
				setGlobalProps(ctx, params);
				transformShape(ctx, params, 0);
				
				// Draw each point
				l = 2;
				lc = 1;
				ctx.beginPath();
				ctx.moveTo(params.x1+params.x, params.y1+params.y);
				while (TRUE) {
					lx = params['x' + l];
					ly = params['y' + l];
					lcx1 = params['cx' + lc];
					lcy1 = params['cy' + lc];
					lcx2 = params['cx' + (lc+1)];
					lcy2 = params['cy' + (lc+1)];
					if (lx !== UNDEFINED && ly !== UNDEFINED && lcx1 !== UNDEFINED && lcy1 !== UNDEFINED && lcx2 !== UNDEFINED && lcy2 !== UNDEFINED) {
						ctx.bezierCurveTo(lcx1+params.x, lcy1+params.y, lcx2+params.x, lcy2+params.y, lx+params.x, ly+params.y);
						l += 1;
						lc += 2;
					} else {
						break;
					}
				}
				// Check for jCanvas events
				if (params._event) {
					detectEvents($canvases[e], ctx, params);
				}
				// Close path if chosen
				closePath($canvases[e], ctx, params);
			
			}
		}
	}
	return $canvases;
};

// Draw vector
$.fn.drawVector = function self(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		i, angle, length, x, y;

	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx) {

			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
			
				setGlobalProps(ctx, params);
				transformShape(ctx, params, 0);
				
				// Draw each point
				i = 1;
				ctx.beginPath();
				x = params.x;
				y = params.y;
				// The vector starts at the given (x, y) coordinates
				ctx.moveTo(params.x, params.y);
				while (TRUE) {
					angle = params['a' + i];
					length = params['l' + i];
					if (angle !== UNDEFINED && length !== UNDEFINED) {
						// Convert the angle to radians with 0deg starting at north
						angle = (angle * params._toRad) - (PI / 2);
						// Compute (x, y) coordinates from angle and length
						x += (length * Math.cos(angle));
						y += (length * Math.sin(angle));
						ctx.lineTo(x, y);
						i += 1;
					} else {
						break;
					}
				}
				// Check for jCanvas events
				if (params._event) {
					detectEvents($canvases[e], ctx, params);
				}
				// Close path if chosen
				closePath($canvases[e], ctx, params);
		
			}
		}
	}
	return $canvases;
};

// Begin the path of a graph
function beginGraphPath(e, ctx, params, domain, range) {
	// Restrict domain and range using a rectangular mask
	ctx.save();
	ctx.beginPath();
	ctx.rect(domain[0], range[0], (domain[1] - domain[0]), (range[1] - range[0]));
	ctx.clip();
	
	// Begin path of graph
	transformShape(ctx, params, 0);
	ctx.beginPath();
}

// Close the path of a graph
function closeGraphPath(canvas, ctx, params) {
	// Check for jCanvas events
	if (params._event) {
		detectEvents(canvas, ctx, params);
	}
	ctx.restore();
	closePath(canvas, ctx, params);
}

// Graph a mathematical function as a path
$.fn.drawGraph = function self(args) {
	var $canvases = this, e, ctx,
		params = merge(new jCanvasObject(), args),
		graph, domain, range,
		canvasWidth, canvasHeight,
		x, y, r, t;
		
	for (e=0; e<$canvases.length; e+=1) {
		ctx = getContext($canvases[e]);
		if (ctx && params.fn) {
			
			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
			
				setGlobalProps(ctx, params);
							
				// Cache graph information
				graph = params.graph;
				domain = params.domain;
				range = params.range;
				
				// Cache canvas dimensions (for later calculating the domain/range)
				canvasWidth = $canvases[e].width;
				canvasHeight = $canvases[e].height;
				
				// Fill in missing domain values
				if (domain === NULL) {
					domain = [NULL, NULL];
				}
				if (domain[0] === NULL) {
					domain[0] = 0;
				}
				if (domain[1] === NULL) {
					domain[1] = canvasWidth;
				}
				// Fill in missing range values
				if (range === NULL) {
					range = [NULL, NULL];
				}
				if (range[0] === NULL) {
					range[0] = 0;
				}
				if (range[1] === NULL) {
					range[1] = canvasHeight;
				}
				
				beginGraphPath(e, ctx, params, domain, range);
				
				if (graph === 'y') {
					// Graph function
											
					for (x=domain[0]-params.x; x<=domain[1]-params.x; x+=1) {
						
						// Compute y-value from x-value
						y = params.fn(x, params);
						if (y === NULL) {
							closeGraphPath($canvases[e], ctx, params);
							beginGraphPath(e, ctx, params, domain, range);
						} else {
							ctx.lineTo(x + params.x, y + params.y);
						}
						
					}
				
				} else if (graph === 'x') {
					// Graph inverse function
					
					for (y=range[0]-params.y; y<=range[1]-params.y; y+=1) {
						
						//Compute x-value from y-value
						x = params.fn(y, params);
						if (x === NULL) {
							closeGraphPath($canvases[e], ctx, params);
							beginGraphPath(e, ctx, params, domain, range);
						} else {
							ctx.lineTo(x + params.x, y + params.y);
						}
						
					}
					
				} else if (graph === 'r') {
					// Graph polar functions
							
					for (t=0; t<2*PI; t+=PI/180) {
						
						// Compute radius, x, and y from angle value
						r = params.fn(t, params);
						x = r * cos(t);
						y = r * sin(t);
						
						if (x === NULL || y === NULL) {
							closeGraphPath($canvases[e], ctx, params);
							beginGraphPath(ctx, params, domain, range);
						} else {
							ctx.lineTo(x + params.x, y + params.y);
						}
						
					}
				
				}
				
				closeGraphPath($canvases[e], ctx, params);
			
			}
		}
	}

};

/* Text API */

// Calculate font string and set it as the canvas font
function setCanvasFont(ctx, params) {
	if (params.font) {
		// Prefer the font string if given
		ctx.font = params.font;
	} else {
		// Otherwise, use the given font attributes
		if (!isNaN(Number(params.fontSize))) {
			// Pixels are the default units
			params.fontSize += 'px';
		}
		ctx.font = params.fontStyle + ' ' + params.fontSize + ' ' + params.fontFamily;
	}
}

// Measure canvas text
function measureText(canvas, e, ctx, params, lines) {
	var originalSize, sizeMatch,
		sizeExp = /\b(\d*\.?\d*)\w\w\b/gi,
		l, curWidth;
	
	// Used cached width/height if possible
	if (cache.text === params.text && cache.font === params.font && cache.fontStyle === params.fontStyle && cache.fontSize === params.fontSize && cache.fontFamily === params.fontFamily && cache.maxWidth === params.maxWidth && cache.lineHeight === params.lineHeight) {
		
		params.width = cache.width;
		params.height = cache.height;
		
	} else if (!e) {
		// Calculate text dimensions only once
								
		// Calculate width of first line (for comparison)
		params.width = ctx.measureText(lines[0]).width;
		
		// Get width of longest line
		for (l=1; l<lines.length; l+=1) {
			curWidth = ctx.measureText(lines[l]).width;
			// Ensure text's width is the width of its longest line
			if (curWidth > params.width) {
				params.width = curWidth;
			}
		}
		
		// Save original font size
		originalSize = canvas.style.fontSize;
		if (params.font) {
			// Get specified font size using pattern
			sizeMatch = params.font.match(sizeExp);
			if (sizeMatch) {
				canvas.style.fontSize = params.font.match(sizeExp)[0];
			}
		} else {
			// Otherwise, use the given font size
			canvas.style.fontSize = params.fontSize;
		}
		// Save text width and height in parameters object
		params.height = parseFloat($.css(canvas, 'fontSize')) * lines.length * params.lineHeight;
		// Reset font size to original size
		canvas.style.fontSize = originalSize;
	}
}

// Wrap a string of text within a defined width
function wrapText(ctx, params) {
	var text = params.text,
		maxWidth = params.maxWidth,
		words = text.split(' '), w,
		lines = [],
		line = '';
		
	if (ctx.measureText(text).width < maxWidth || words.length === 1) {
		// If text is short enough initially, do nothing else
		// Or, if the text consists of only one word, do nothing else
		lines = [text];
	} else {
		// Wrap lines
		for (w=0; w<words.length; w+=1) {
			
			// Once line gets too wide, push word to next line
			if (ctx.measureText(line + words[w]).width > maxWidth) {
				// This check prevents empty lines from being created
				if (line !== '') {
					lines.push(line);
				}
				// Start new line and repeat process
				line = '';
			}
			// Add words to line until the line is too wide
			line += words[w];
			// Do not add a space after the last word
			if (w !== words.length-1) {
				line += ' ';
			}
		}
		// The last word should always be pushed
		lines.push(line);
		
	}
	return lines;
}

// Draw text
$.fn.drawText = function self(args) {
	var $canvases = this, $canvas, e, ctx,
		params = merge(new jCanvasObject(), args),
		lines, l, x, y;

	for (e=0; e<$canvases.length; e+=1) {
		$canvas = $($canvases[e]);
		ctx = getContext($canvases[e]);
		if (ctx) {

			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
				
				setGlobalProps(ctx, params);
				
				// Set text-specific properties
				ctx.textBaseline = params.baseline;
				ctx.textAlign = params.align;
				
				// Set canvas font using given properties
				setCanvasFont(ctx, params);
										
				if (!e && params.maxWidth !== NULL) {
					// Wrap text using an internal function
					lines = wrapText(ctx, params);
					// Remove unnecessary white space
					lines = lines
						.join('\n')
						.replace(/( (\n))|( $)/gi, '$2')
						.split('\n');
				} else if (!e) {
					// Convert string of text to list of lines
					lines = String(params.text).split('\n');
				}
				
				// Calculate text's width and height
				measureText($canvases[e], e, ctx, params, lines);
				transformShape(ctx, params, params.width, params.height);
				
				// Adjust text position to accomodate different horizontal alignments
				if (!e) {
					x = params.x;
					if (params.align === 'left') {
						x -= params.width / 2;
					} else if (params.align === 'right') {
						x += params.width / 2;
					}
				}
				
				// Draw each line of text separately
				for (l=0; l<lines.length; l+=1) {
					ctx.shadowColor = params.shadowColor;
					// Add line offset to center point, but subtract some to center everything
					y = params.y + (l * params.height / lines.length) - ((lines.length - 1) * params.height / lines.length) / 2;
					ctx.fillText(lines[l], x, y);
					// Prevent extra shadow created by stroke (but only when fill is present)
					if (params.fillStyle !== 'transparent') {
						ctx.shadowColor = 'transparent';
					}
					ctx.strokeText(lines[l], x, y);
				}
							
				// Detect jCanvas events
				if (params._event) {
					ctx.beginPath();
					ctx.rect(
						params.x - params.width / 2,
						params.y - params.height / 2,
						params.width,
						params.height
					);
					ctx.restore();
					detectEvents($canvases[e], ctx, params);
					ctx.closePath();
				} else {
					ctx.restore();
				}
				
			}
		}
	}
	cache = params;
	return $canvases;
};

// Measure text width/height using the given parameters
$.fn.measureText = function(args) {
	var $canvases = this, ctx,
		params;
	
	if (args !== UNDEFINED && (typeof args !== 'object' || args.layer)) {
		// If layer identifier is given, get that layer
		params = $canvases.getLayer(args);
	} else {
		// If object is given, just use that
		params = merge(new jCanvasObject(), args);
	}
		
	ctx = getContext($canvases[0]);
	if (ctx && params.text !== UNDEFINED) {
		// Set canvas font using given properties
		setCanvasFont(ctx, params);
		// Calculate width and height of text
		measureText($canvases[0], 0, ctx, params, params.text.split('\n'));
	}
	return params;
};

/* Image API */

// Draw image
$.fn.drawImage = function self(args) {
	var $canvases = this, canvas, e, ctx,
		params = merge(new jCanvasObject(), args),
		img, imgCtx, source, scaleFactor;
	
	// Cache the given source
	source = params.source;
	
	// Use image or canvas element, if not, an image URL
	imgCtx = source.getContext;
	if (source.src || imgCtx) {
		img = source;
	} else if (source) {
		img = new Image();
		img.src = source;
	}
	
	// Draw image function
	function draw(e, ctx) {
	
		// Calculate image dimensions only once
		if (e === 0) {
		
			scaleFactor = img.width / img.height;
						
			// Show entire image if no cropping region is defined
			
			// If width and sWidth are not defined, use image width
			if (params.width === NULL && params.sWidth === NULL) {
				args.width = params.width = params.sWidth = img.width;
			}
			// If width and sHeight are not defined, use image height
			if (params.height === NULL && params.sHeight === NULL) {
				args.height = params.height = params.sHeight = img.height;
			}
			
			// If width is not defined, use the given sWidth
			if (params.width === NULL && params.sWidth !== NULL) {
				params.width = params.sWidth;
			}
			// If height is not defined, use the given sHeight
			if (params.height === NULL && params.sHeight !== NULL) {
				params.height = params.sHeight;
			}
			
			// If sWidth is not defined, use image width
			if (params.sWidth === NULL && params.width !== NULL) {
				args.sWidth = params.sWidth = img.width;
			}
			// If sHeight is not defined, use image height
			if (params.sHeight === NULL && params.height !== NULL) {
				args.sHeight = params.sHeight = img.height;
			}
			
			// If no sx/sy defined, use center of image (or top-left corner if cropFromCenter is FALSE)
			if (params.sx === NULL) {
				if (params.cropFromCenter) {
					params.sx = img.width / 2;
				} else {
					params.sx = 0;
				}
			}
			if (params.sy === NULL) {
				if (params.cropFromCenter) {
					params.sy = img.height / 2;
				} else {
					params.sy = 0;
				}
			}
			
			// Crop from top-left corner if cropFromCenter is FALSE
			if (!params.cropFromCenter) {
				params.sx += params.sWidth/2;
				params.sy += params.sHeight/2;
			}
			
			// Ensure cropped region does not extend beyond image boundary
			if ((params.sx + params.sWidth / 2) > img.width) {
				params.sx = img.width - params.sWidth / 2;
			}
			if ((params.sx - params.sWidth/2) < 0) {
				params.sx = params.sWidth / 2;
			}
			if ((params.sy - params.sHeight / 2) < 0) {
				params.sy = params.sHeight / 2;
			}
			if ((params.sy + params.sHeight / 2) > img.height) {
				params.sy = img.height - params.sHeight / 2;
			}
			
			// If only width is present
			if (params.width !== NULL && params.height === NULL) {
				args.height = params.height = params.width / scaleFactor;
			// If only height is present
			} else if (params.width === NULL && params.height !== NULL) {
				args.width = params.width = params.height * scaleFactor;
			// If width and height are both absent
			} else if (params.width === NULL && params.height === NULL) {
				args.width = params.width = img.width;
				args.height = params.height = img.height;
			}
			
		}
		
		// Only position image
		transformShape(ctx, params, params.width, params.height);
							
		// Draw image
		ctx.drawImage(
			img,
			params.sx - params.sWidth / 2,
			params.sy - params.sHeight / 2,
			params.sWidth,
			params.sHeight,
			params.x - params.width / 2,
			params.y - params.height / 2,
			params.width,
			params.height
		);
		// Ensure the rectangle is actually invisible (still allow stroking)
		ctx.fillStyle = 'transparent';
		// Draw invisible rectangle to allow for events and masking
		ctx.beginPath();
		ctx.rect(
			params.x - params.width / 2,
			params.y - params.height / 2,
			params.width,
			params.height
		);
		// Check for jCanvas events
		if (params._event) {
			detectEvents($canvases[e], ctx, params);
		}
		// Close path and mask (if chosen)
		closePath($canvases[e], ctx, params);
	}
	// On load function
	function onload(canvas, e, ctx) {
		return function() {
			draw(e, ctx);
			// Run callback function if defined
			if (params.load) {
				params.load.call(canvas, args);
			}
		};
	}
	// Draw image if already loaded
	for (e=0; e<$canvases.length; e+=1) {
		canvas = $canvases[e];
		ctx = getContext($canvases[e]);
		if (ctx) {

			args = addLayer($canvases[e], params, args, self);
			if (params.visible) {
			
				setGlobalProps(ctx, params);
					
				// Draw image if already loaded
				if (img) {
					if (img.complete || imgCtx) {
						onload(canvas, e, ctx)();
					} else {
						img.onload = onload(canvas, e, ctx);
						// Fix onload() bug in IE9
						img.src = img.src;
					}
				}
			
			}
		}
	}
	return $canvases;
};

// Create canvas pattern
// The pattern() method has been deprecated
$.fn.createPattern = $.fn.pattern = function(args) {
	var $canvases = this,
		ctx, params = merge(new jCanvasObject(), args),
		img, pattern, imgCtx, source;

	// Create pattern when image loads
	function create() {
		// Create pattern
		pattern = ctx.createPattern(img, params.repeat);
	}
	function onload() {
		create();
		// Run callback function if defined
		if (params.load) {
			params.load.call($canvases[0], pattern);
		}
	}
	
	ctx = getContext($canvases[0]);
	if (ctx) {
	
		// Cache the given source
		source = params.source;
		
		// Draw when image is loaded (if load() callback function is defined)
		if (typeof source === 'function') {
			
			img = document.createElement('canvas');
			img.width = params.width;
			img.height = params.height;
			imgCtx = getContext(img);
			source.call(img, imgCtx);
			onload();
			
		} else {
			
			// Use image element, if not, a image URL
			imgCtx = source.getContext;
			if (source.src || imgCtx) {
				img = source;
			} else {
				img = new Image();
				img.src = source;
			}
			
			// Draw image if already loaded
			if (img.complete || imgCtx) {
				onload();
			} else {
				img.onload = onload;
				// Fix onload() bug in IE9
				img.src = img.src;
			}
			
		}
	} else {
		pattern = NULL;
	}
	return pattern;
};

// Create a canvas gradient object
// The gradient() method has been deprecated
$.fn.createGradient = $.fn.gradient = function(args) {
	var $canvases = this, ctx,
		params = merge(new jCanvasObject(), args),
		gradient,
		stops = [], nstops,
		start, end,
		i, a, n, p;
	
	ctx = getContext($canvases[0]);
	if (ctx) {
		
		// Gradient coordinates must be defined
		params.x1 = params.x1 || 0;
		params.y1 = params.y1 || 0;
		params.x2 = params.x2 || 0;
		params.y2 = params.y2 || 0;
		
		if (params.r1 !== NULL || params.r2 !== NULL) {
			// Create radial gradient if chosen
			gradient = ctx.createRadialGradient(params.x1, params.y1, params.r1, params.x2, params.y2, params.r2);
		} else {
			// Otherwise, create a linear gradient by default
			gradient = ctx.createLinearGradient(params.x1, params.y1, params.x2, params.y2);
		}

		// Count number of color stops
		for (i=1; params['c' + i] !== UNDEFINED; i+=1) {
			if (params['s' + i] !== UNDEFINED) {
				stops.push(params['s' + i]);
			} else {
				stops.push(NULL);
			}
		}
		nstops = stops.length;
		
		// Define start and end stops if not already defined
		if (stops[0] === NULL) {
			stops[0] = 0;
		}
		if (stops[nstops-1] === NULL) {
			stops[nstops-1] = 1;
		}
		
		// Loop through color stops to fill in the blanks
		for (i=0; i<nstops; i+=1) {
			// A progression, in this context, is defined as all of the color stops between and including two known color stops
			
			// If stop is a number, start a new progression
			if (stops[i] !== NULL) {
				
				// Number of stops in current progression
				n = 1;
				// Current iteration in current progression
				p = 0;
				start = stops[i];

				// Look ahead to find end stop
				for (a=(i+1); a<nstops; a+=1) {
					if (stops[a] !== NULL) {
						// If this future stop is a number, make it the end stop for this progression
						end = stops[a];
						break;
					} else {
						// Otherwise, keep looking ahead
						n += 1;
					}
				}
				
				// Ensure start stop is not greater than end stop
				if (start > end) {
					stops[a] = stops[i];
				}
			
			// If stop must be calculated
			} else if (stops[i] === NULL) {
				p += 1;
				stops[i] = start + (p * ((end - start) / n));
			}
			gradient.addColorStop(stops[i], params['c' + (i+1)]);
		}

	} else {
		gradient = NULL;
	}
	return gradient;
};

// Get pixels on the canvas
$.fn.setPixels = function self(args) {
	var $canvases = this,
		canvas, e, ctx,
		params = merge(new jCanvasObject(), args),
		px = {},
		imgData, data, i, len;
	
	for (e=0; e<$canvases.length; e+=1) {
		canvas = $canvases[e];
		ctx = getContext(canvas);
		if (ctx) {
			
			args = addLayer(canvas, params, args, self);
			// Measure (x, y) from center of region by default
			transformShape(ctx, params, params.width, params.height);
			
			// Use entire canvas of x, y, width, or height is not defined
			if (!params.x || !params.y || !params.width || !params.height) {
				params.width = canvas.width;
				params.height = canvas.height;
				params.x = params.width / 2;
				params.y = params.height / 2;
			}
			imgData = ctx.getImageData(params.x-params.width/2, params.y-params.height/2, params.width, params.height);
			data = imgData.data;
			len = data.length;
			px = [];
						
			// Loop through pixels with the "each" callback function
			if (params.each) {
				for (i=0; i<len; i+=4) {
					px.r = data[i];
					px.g = data[i+1];
					px.b = data[i+2];
					px.a = data[i+3];
					params.each.call(canvas, px);
					data[i] = px.r;
					data[i+1] = px.g;
					data[i+2] = px.b;
					data[i+3] = px.a;
				}
			}
			// Put pixels on canvas
			ctx.putImageData(imgData, params.x-params.width/2, params.y-params.height/2);
			ctx.restore();
			
		}
	}
	return $canvases;
};

// Get canvas image as data URL
$.fn.getCanvasImage = function(type, quality) {
	var canvas = this[0];
	// JPEG quality defaults to 1
	if (quality === UNDEFINED) {
		quality = 1;
	}
	return (canvas && canvas.toDataURL ? canvas.toDataURL('image/' + type, quality) : NULL);
};

// Enable canvas feature detection with $.support
$.support.canvas = (document.createElement('canvas').getContext !== UNDEFINED);

// Export jCanvas functions
jCanvas.defaults = defaults;
jCanvas.detectEvents = detectEvents;
jCanvas.closePath = closePath;
$.jCanvas = jCanvas;

}(jQuery, document, Image, Math, parseFloat, true, false, null));