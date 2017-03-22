/**
 * @license jCanvas v13.11.21
 * Copyright 2013 Caleb Evans
 * Released under the MIT license
 */

(function($, document, Image, Math, parseFloat, TRUE, FALSE, NULL, UNDEFINED) {

// Define local aliases to frequently used properties
var defaults,
	merge = $.extend,
	inArray = $.inArray,
	typeOf = $.type,
	isFunction = $.isFunction,
	round = Math.round,
	PI = Math.PI,
	sin = Math.sin,
	cos = Math.cos,
	atan2 = Math.atan2,
	jQueryEventFix = $.event.fix,
	touchEventMap,
	mouseEventMap,
	drawingMap,
	cache = {},
	propCache = {},
	imageCache = {},
	baseTransforms = {
		rotate: 0,
		scaleX: 1,
		scaleY: 1,
		translateX: 0,
		translateY: 0,
		// Store all previous masks
		masks: []
	},
	cssProps,
	cssPropsObj;

// Preferences constructor (which inherits from the defaults object)
function jCanvasObject(args) {
	var params = this;
	// Merge preferences with arguments
	merge(params, args);
	return params;
}

// jCanvas function for setting property defaults (it's also an object)
function jCanvas(args) {
	if (args) {
		// Merge arguments with preferences
		merge(jCanvasObject.prototype, args);
	} else {
		// Reset preferences to defaults if nothing is passed
		jCanvas.prefs = jCanvasObject.prototype = merge({}, defaults);
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
	arrowAngle: 90,
	arrowRadius: 0,
	autosave: TRUE,
	baseline: 'middle',
	bringToFront: FALSE,
	ccw: FALSE,
	closed: FALSE,
	compositing: 'source-over',
	concavity: 0,
	cornerRadius: 0,
	count: 1,
	cropFromCenter: TRUE,
	cursor: NULL,
	cursors: NULL,
	disableEvents: FALSE,
	draggable: FALSE,
	dragGroups: NULL,
	group: NULL,
	groups: NULL,
	data: {},
	each: NULL,
	end: 360,
	fillStyle: 'transparent',
	fireDragGroupEvents: FALSE,
	fontStyle: 'normal',
	fontSize: '12pt',
	fontFamily: 'sans-serif',
	fromCenter: TRUE,
	fn: NULL,
	height: NULL,
	imageSmoothing: TRUE,
	inDegrees: TRUE,
	index: NULL,
	lineHeight: 1,
	layer: FALSE,
	load: NULL,
	mask: FALSE,
	maxWidth: NULL,
	miterLimit: 10,
	name: NULL,
	opacity: 1,
	r1: NULL,
	r2: NULL,
	radius: 0,
	repeat: 'repeat',
	respectAlign: FALSE,
	rotate: 0,
	rounded: FALSE,
	scale: 1,
	scaleX: 1,
	scaleY: 1,
	shadowBlur: 0,
	shadowColor: 'transparent',
	shadowStroke: false,
	shadowX: 0,
	shadowY: 0,
	sHeight: NULL,
	sides: 0,
	source: '',
	spread: 0,
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

// Determines if the given operand is a string
function isString(operand) {
	return (typeOf(operand) === 'string');
}

// Get 2D context for the given canvas
function _getContext(canvas) {
	return (canvas && canvas.getContext ? canvas.getContext('2d') : NULL);
}

// Clone the given transformations object
function _cloneTransforms(transforms) {
	// Clone the object itself
	transforms = merge({}, transforms);
	// Clone the object's masks array
	transforms.masks = transforms.masks.slice(0);
	return transforms;
}

// Save canvas context and update transformation stack
function _saveCanvas(ctx, data) {
	var transforms;
	ctx.save();
	transforms = _cloneTransforms(data.transforms);
	data.savedTransforms.push(transforms);
}

// Restore canvas context update transformation stack
function _restoreCanvas(ctx, data) {
	if (data.savedTransforms.length === 0) {
		// Reset transformation state if it can't be restored any more
		data.transforms = _cloneTransforms(baseTransforms);
	} else {
		// Restore canvas context
		ctx.restore();
		// Restore current transform state to the last saved state
		// Remove last saved state from transformation stack
		data.transforms = data.savedTransforms.pop();
	}
}

// Set canvas context properties
function _setGlobalProps(canvas, ctx, params) {
	// Fill style
	if (isFunction(params.fillStyle)) {
		// Handle fill styles as functions
		ctx.fillStyle = params.fillStyle.call(canvas, params);
	} else {
		// Handle fill styles as strings
		ctx.fillStyle = params.fillStyle;
	}
	// Stroke style
	if (isFunction(params.strokeStyle)) {
		// Handle stroke styles as functions
		ctx.strokeStyle = params.strokeStyle.call(canvas, params);
	} else {
		// Handle stroke styles as strings
		ctx.strokeStyle = params.strokeStyle;
	}
	ctx.lineWidth = params.strokeWidth;
	// Rounded corners for paths if chosen
	if (params.rounded) {
		ctx.lineCap = ctx.lineJoin = 'round';
	} else {
		ctx.lineCap = params.strokeCap;
		ctx.lineJoin = params.strokeJoin;
		ctx.miterLimit = params.miterLimit;
	}
	// Drop shadow
	ctx.shadowOffsetX = params.shadowX;
	ctx.shadowOffsetY = params.shadowY;
	ctx.shadowBlur = params.shadowBlur;
	ctx.shadowColor = params.shadowColor;
	// Opacity and composite operation
	ctx.globalAlpha = params.opacity;
	ctx.globalCompositeOperation = params.compositing;
	// Support cross-browser toggling of image smoothing
	if (params.imageSmoothing) {
		ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = params.imageSmoothing;
	}
}

// Optionally enable masking support for this path
function _enableMasking(ctx, data, params) {
	if (params.mask) {
		// If jCanvas autosave is enabled
		if (params.autosave) {
			// Automatically save transformation state by default
			_saveCanvas(ctx, data);
		}
		// Clip the current path
		ctx.clip();
		// Keep track of current masks
		data.transforms.masks.push(params._args);
	}
}

// Restore individual shape transformation
function _restoreTransform(ctx, params) {
	// If shape has been transformed by jCanvas
	if (params._transformed) {
		// Restore canvas context
		ctx.restore();
	}
}

// Close current canvas path
function _closePath(canvas, ctx, params) {
	var data;
	
	// Optionally close path
	if (params.closed) {
		ctx.closePath();
	}
	
	if (params.shadowStroke && params.strokeWidth !== 0) {
		// Extend the shadow to include the stroke of a drawing
		
		// Add a stroke shadow by stroking before filling
		ctx.stroke();
		ctx.fill();
		// Ensure the below stroking does not inherit a shadow
		ctx.shadowColor = 'transparent';
		ctx.shadowBlur = 0;
		// Stroke over fill as usual
		ctx.stroke();
		
	} else {
		// If shadowStroke is not enabled, stroke & fill as usual
		
		ctx.fill();
		// Prevent extra shadow created by stroke (but only when fill is present)
		if (params.fillStyle !== 'transparent') {
			ctx.shadowColor = 'transparent';
		}
		if (params.strokeWidth !== 0) {
			// Only stroke if the stroke is not 0
			ctx.stroke();
		}
		
	}
	
	// Optionally close path
	if (!params.closed) {
		ctx.closePath();
	}
	
	// Restore individual shape transformation
	_restoreTransform(ctx, params);
	
	// Mask shape if chosen
	if (params.mask) {
		// Retrieve canvas data
		data = _getCanvasData(canvas);
		_enableMasking(ctx, data, params);
	}
		
}

// Rotate canvas (internal)
function _rotateCanvas(ctx, params, transforms) {
	
	// Get conversion factor for radians
	params._toRad = (params.inDegrees ? (PI / 180) : 1);
	
	// Rotate canvas using shape as center of rotation
	ctx.translate(params.x, params.y);
	ctx.rotate(params.rotate * params._toRad);
	ctx.translate(-params.x, -params.y);
	
	// If transformation data was given
	if (transforms) {
		// Update transformation data
		transforms.rotate += (params.rotate * params._toRad);
	}
}

// Scale canvas (internal)
function _scaleCanvas(ctx, params, transforms) {
	
	// Scale both the x- and y- axis using the 'scale' property
	if (params.scale !== 1) {
		params.scaleX = params.scaleY = params.scale;
	}
	
	// Scale canvas using shape as center of rotation
	ctx.translate(params.x, params.y);
	ctx.scale(params.scaleX, params.scaleY);
	ctx.translate(-params.x, -params.y);
	
	// If transformation data was given
	if (transforms) {
		// Update transformation data
		transforms.scaleX *= params.scaleX;
		transforms.scaleY *= params.scaleY;
	}
}

// Translate canvas (internal)
function _translateCanvas(ctx, params, transforms) {
	
	// Translate both the x- and y-axis using the 'translate' property
	if (params.translate) {
		params.translateX = params.translateY = params.translate;
	}
	
	// Translate canvas
	ctx.translate(params.translateX, params.translateY);
	
	// If transformation data was given
	if (transforms) {
		// Update transformation data
		transforms.translateX += params.translateX;
		transforms.translateY += params.translateY;
	}
}

// Transform (translate, scale, or rotate) shape
function _transformShape(canvas, ctx, params, width, height) {
	
	// Get conversion factor for radians
	params._toRad = (params.inDegrees ? (PI / 180) : 1);
	
	// Convert arrow angle to radians
	params.arrowAngle *= params._toRad;
	
	params._transformed = TRUE;
	ctx.save();
	
	// Always draw from center unless otherwise specified
	if (height === UNDEFINED) {
		height = width;
	}
	
	// Optionally measure (x, y) position from top-left corner
	if (!params.fromCenter && !params._centered) {
		params.x += width / 2;
		params.y += height / 2;
		params._centered = TRUE;
	}
		
	// Optionally rotate shape
	if (params.rotate) {
		_rotateCanvas(ctx, params, {});
	}
	// Optionally scale shape
	if (params.scale !== 1 || params.scaleX !== 1 || params.scaleY !== 1) {
		_scaleCanvas(ctx, params, {});
	}
	// Optionally translate shape
	if (params.translate || params.translateX || params.translateY) {
		_translateCanvas(ctx, params, {});
	}
		
}

/* Plugin API */

// Extend jCanvas with a user-defined method
jCanvas.extend = function extend(plugin) {
	
	// Merge properties with defaults
	jCanvas.defaults = merge(defaults, plugin.props);
	jCanvas();
	
	// Create plugin
	if (plugin.name) {
		$.fn[plugin.name] = function self(args) {
			var $canvases = this, canvas, e, ctx,
				params, layer;
						
			for (e = 0; e < $canvases.length; e += 1) {
				canvas = $canvases[e];
				ctx = _getContext(canvas);
				if (ctx) {
					
					params = new jCanvasObject(args);
					layer = _addLayer(canvas, params, args, self);
					
					_setGlobalProps(canvas, ctx, params);
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
function _getCanvasData(canvas) {
	var data;
	if (cache._canvas === canvas && cache._data) {
		
		// Retrieve canvas data from cache if possible
		data = cache._data;
		
	} else {
		
		// Get canvas data
		data = $.data(canvas, 'jCanvas');
		if (!data) {
			
			// Create canvas data object if it does not already exist
			data = {
				// The associated canvas element
				canvas: canvas,
				// Layers array
				layers: [],
				// Layer mappings
				layer: {
					names: {},
					groups: {}
				},
				// All layers that intersect with the event coordinates (regardless of visibility)
				intersecting: [],
				// The topmost layer whose area contains the event coordinates
				lastIntersected: NULL,
				cursor: $(canvas).css('cursor'),
				// Properties for the current drag event
				drag: {},
				// Data for the current event
				event: {
					type: NULL,
					x: NULL,
					y: NULL
				},
				// Events which already have been bound to the canvas
				events: {},
				// The canvas's current transformation state
				transforms: _cloneTransforms(baseTransforms),
				savedTransforms: [],
				// Whether a layer is being animated or not
				animating: FALSE,
				// The layer currently being animated
				animated: NULL,
				// The percentage complete (from 0 to 1) of the current animation
				pos: 0,
				// The device pixel ratio
				pixelRatio: 1,
				// Whether pixel ratio transformations have been applied
				scaled: false
			};
			// Use jQuery to store canvas data
			$.data(canvas, 'jCanvas', data);
			
		}
		// Cache canvas data for faster retrieval
		cache._canvas = canvas;
		cache._data = data;
		
	}
	return data;
}

// Get jCanvas layers array
$.fn.getLayers = function getLayers(callback) {
	var canvas = this[0],
		data, layers, l,
		matching = [];
	// If element is a canvas
	if (canvas && canvas.getContext) {
		
		data = _getCanvasData(canvas);
		// Retrieve layers array for this canvas
		layers = data.layers;
		
		// If a callback function is given
		if (isFunction(callback)) {
			
			// Filter the layers array using the callback
			for (l = 0; l < layers.length; l += 1) {
				if (callback.call(canvas, layers[l])) {
					// Add layer to array of matching layers if test passes
					matching.push(layers[l]);
				}
			}
			
		} else {
			// Otherwise, get all layers
			
			matching = layers;
			
		}
		
	}
	return matching;
};

// Initialize all of a layer's associated jCanvas events
function _addLayerEvents($canvas, data, layer) {
	var eventName;
	// Determine which jCanvas events need to be bound to this layer
	for (eventName in jCanvas.events) {
		if (jCanvas.events.hasOwnProperty(eventName)) {
			// If layer has callback function to complement it
			if (layer[eventName] || (layer.cursors && layer.cursors[eventName])) {
				// Bind event to layer
				_addLayerEvent($canvas, data, layer, eventName);
			}
		}
	}
}

// Initialize the given event on the given layer
function _addLayerEvent($canvas, data, layer, eventName) {
	// Use touch events if appropriate
	eventName = _getTouchEventName(eventName);
	// Bind event to layer
	jCanvas.events[eventName]($canvas, data);
	layer._event = TRUE;
}

// Enable drag support for this layer
function _enableDrag($canvas, data, layer) {
	var dragHelperEvents, eventName, i;
	// Only make layer draggable if necessary
	if (layer.draggable || layer.cursor || layer.cursors) {
		
		// Organize helper events which enable drag support
		dragHelperEvents = ['mousedown', 'mousemove', 'mouseup'];
		
		// Bind each helper event to the canvas
		for (i = 0; i < dragHelperEvents.length; i += 1) {
			// Use touch events if appropriate
			eventName = dragHelperEvents[i];
			// Bind event
			_addLayerEvent($canvas, data, layer, eventName);
		}
				
		// If cursor mouses out of canvas while dragging, cancel drag
		if (!data.events.mouseoutdrag) {
			$canvas.bind('mouseout.jCanvas', function() {
				// Retrieve the layer whose drag event was canceled
				var layer = data.drag.layer;
				if (layer) {
					// Cancel dragging
					data.drag = {};
					// Trigger dragcancel event if defined
					if (layer.dragcancel) {
						layer.dragcancel.call($canvas[0], layer);
					}
					$canvas.drawLayers();
				}
			});
			// Indicate that an event handler has been bound
			data.events.mouseoutdrag = TRUE;
		}
		
		// Indicate that this layer has events bound to it
		layer._event = TRUE;
		
	}
}

// Update a layer property map if property is changed
function _updateLayerName($canvas, data, layer, props) {
	var nameMap = data.layer.names;
	
	// If layer name is being added, not changed
	if (!props) {
		
		props = layer;
		
	} else {
		
		// Remove old layer name entry because layer name has changed
		if (props.name !== UNDEFINED && isString(layer.name) && layer.name !== props.name) {
			delete nameMap[layer.name];
		}
		
	}
	
	// Add new entry to layer name map with new name
	if (isString(props.name)) {
		nameMap[props.name] = layer;
	}
}

// Create or update the data map for the given layer and group type
function _updateLayerGroups($canvas, data, layer, props) {
	var groupMap = data.layer.groups,
		group, groupName, g,
		index, l;
	
	// Fallback for deprecated group property
	if (layer.group !== NULL) {
		layer.groups = [layer.group];
		if (layer.dragGroupWithLayer) {
			layer.dragGroups = [layer.group];
		}
	}
	if (props && props.group !== UNDEFINED) {
		if (props.group === NULL) {
			props.groups = NULL;
		} else {
			props.groups = [props.group];
			if (props.dragGroupWithLayer) {
				props.dragGroups = [props.group];
			}
		}
	}
	
	// If group name is not changing
	if (!props) {
		
		props = layer;
		
	} else {
		
		// Remove layer from all of its associated groups
		if (props.groups !== UNDEFINED && layer.groups !== NULL) {
			for (g = 0; g < layer.groups.length; g += 1) {
				groupName = layer.groups[g];
				group = groupMap[groupName];
				if (group) {
					// Remove layer from its old layer group entry
					for (l = 0; l < group.length; l += 1) {
						if (group[l] === layer) {
							// Keep track of the layer's initial index
							index = l;
							// Remove layer once found
							group.splice(l, 1);
							break;
						}
					}
					// Remove layer group entry if group is empty
					if (group.length === 0) {
						delete groupMap[groupName];
					}
				}
			}
		}
		
	}
		
	// Add layer to new group if a new group name is given
	if (props.groups !== UNDEFINED && props.groups !== NULL) {
				
		for (g = 0; g < props.groups.length; g += 1) {
			
			groupName = props.groups[g];
			
			group = groupMap[groupName];
			if (!group) {
				// Create new group entry if it doesn't exist
				group = groupMap[groupName] = [];
				group.name = groupName;
			}
			if (index === UNDEFINED) {
				// Add layer to end of group unless otherwise stated
				index = group.length;
			}
			// Add layer to its new layer group
			group.splice(index, 0, layer);
		
		}
		
	}
}

// Get a single jCanvas layer object
$.fn.getLayer = function getLayer(layerId) {
	var canvas = this[0],
		data = _getCanvasData(canvas),
		layers = data.layers,
		idType = typeOf(layerId),
		layer, l;
	
	if (layerId && layerId.layer) {
		
		// Return the actual layer object if given
		layer = layerId;
		
	} else if (idType === 'number') {
		
		// Retrieve the layer using the given index
			
		// Allow for negative indices
		if (layerId < 0) {
			layerId = layers.length + layerId;
		}
		// Get layer with the given index
		layer = layers[layerId];
		
	} else if (idType === 'regexp') {
		
		// Get layer with the name that matches the given regex
		for (l = 0; l < layers.length; l += 1) {
			// Check if layer matches name
			if (isString(layers[l].name) && layers[l].name.match(layerId)) {
				layer = layers[l];
				break;
			}
		}
		
	} else {
		
		// Get layer with the given name
		layer = data.layer.names[layerId];
		
	}
	return layer;
};

// Get all layers in the given group
$.fn.getLayerGroup = function getLayerGroup(groupId) {
	var idType = typeOf(groupId),
		groups, groupName, group,
		data;
	
	if (idType === 'array') {
		
		// Return layer group if given
		return groupId;
		
	} else if (idType === 'regexp') {
		
		// Get canvas data
		data = _getCanvasData(this[0]);
		groups = data.groups;
		// Loop through all layers groups for this canvas
		for (groupName in groups) {
			// Find a group whose name matches the given regex
			if (groupName.match(groupId)) {
				group = groups[groupName];
				// Stop after finding the first matching group
				break;
			}
		}
		
	} else {
		
		// Find layer group with the given group name
		data = _getCanvasData(this[0]);
		group = data.layer.groups[groupId];
		
	}
	return group;
};

// Get index of layer in layers array
$.fn.getLayerIndex = function getLayerIndex(layerId) {
	var $canvases = this,
		layers = $canvases.getLayers(),
		layer = $canvases.getLayer(layerId);
	
	return inArray(layer, layers);
};

// Set properties of a layer
$.fn.setLayer = function setLayer(layerId, props) {
	var $canvases = this, $canvas, e,
		data, layer;
	
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		data = _getCanvasData($canvases[e]);
		
		layer = $($canvases[e]).getLayer(layerId);
		if (layer) {
			
			// Update layer property mappings
			_updateLayerName($canvas, data, layer, props);
			_updateLayerGroups($canvas, data, layer, props);
			
			// If index was given
			if (props.index !== UNDEFINED) {
				// Move layer to that new index
				$canvas.moveLayer(layer, props.index);
			}
			
			// Merge properties with layer
			merge(layer, props);
						
			// Update layer events
			_addLayerEvents($canvas, data, layer);
			_enableDrag($canvas, data, layer);
			
		}
	}
	return $canvases;
};

// Set properties of all layers in the given group
$.fn.setLayerGroup = function setLayerGroup(groupId, props) {
	var $canvases = this, $canvas, e,
		group, l;
	
	for (e = 0; e < $canvases.length; e += 1) {
		// Get layer group
		$canvas = $($canvases[e]);
		
		group = $canvas.getLayerGroup(groupId);
		// If group exists
		if (group) {
			
			// Loop through layers in group
			for (l = 0; l < group.length; l += 1) {
				
				// Merge given properties with layer
				$canvas.setLayer(group[l], props);
				
			}
			
		}
	}
	return $canvases;
};

// Set properties of all layers (optionally filtered by a callback)
$.fn.setLayers = function setLayers(props, callback) {
	var $canvases = this, $canvas, e,
		layers, l;
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		
		layers = $canvas.getLayers(callback);
		// Loop through all layers
		for (l = 0; l < layers.length; l += 1) {
			// Set properties of each layer
			$canvas.setLayer(layers[l], props);
		}
	}
	return $canvases;
};

// Move a layer's placement in the layers array
$.fn.moveLayer = function moveLayer(layerId, index) {
	var $canvases = this, $canvas, e,
		layers, layer;
		
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		
		// Retrieve layers array and desired layer
		layers = $canvas.getLayers();
		layer = $canvas.getLayer(layerId);
		if (layer) {
			
			// Ensure layer index is accurate
			layer.index = inArray(layer, layers);
			
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
$.fn.removeLayer = function removeLayer(layerId) {
	var $canvases = this, $canvas, e, data,
		layers, layer;
		
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		data = _getCanvasData($canvases[e]);
		
		// Retrieve layers array and desired layer
		layers = $canvas.getLayers();
		layer = $canvas.getLayer(layerId);
		// Remove layer if found
		if (layer) {
			
			// Ensure layer index is accurate
			layer.index = inArray(layer, layers);
			layers.splice(layer.index, 1);
			
			// Update layer name map
			_updateLayerName($canvas, data, layer, {
				name: NULL
			});
			// Update layer group map
			_updateLayerGroups($canvas, data, layer, {
				groups: NULL
			});
			
		}
	}
	return $canvases;
};

// Remove all layers in the group with the given ID
$.fn.removeLayerGroup = function removeLayerGroup(groupId) {
	var $canvases = this, $canvas, e, data,
		layers, group, layer, l;
	
	if (groupId !== UNDEFINED) {
		for (e = 0; e < $canvases.length; e += 1) {
			$canvas = $($canvases[e]);
			data = _getCanvasData($canvases[e]);
			
			layers = $canvas.getLayers();
			group = $canvas.getLayerGroup(groupId);
			// Remove layer group using given group name
			if (group) {
				
				// Loop through layers in group
				for (l = 0; l < group.length; l += 1) {
					
					layer = group[l];
					// Ensure layer's index property is accurate
					layer.index = inArray(layer, layers);
					// Check if layer group matches name
					layers.splice(layer.index, 1);
					
					// Update layer name map
					_updateLayerName($canvas, data, layer, {
						name: NULL
					});
					
				}
				
				// Delete group entry
				delete data.layer.groups[group.name];
				
			}
		}
	}
	return $canvases;
};

// Remove all layers
$.fn.removeLayers = function removeLayers() {
	var $canvases = this, $canvas, e,
		data;
	
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		data = _getCanvasData($canvases[e]);
		
		// Setting an array's length to 0 will empty the array
		data.layers.length = 0;
		// Update layer mappings
		data.layer.names = {};
		data.layer.groups = {};
	}
	return $canvases;
};

// Add an existing layer to a layer group
$.fn.addLayerToGroup = function addLayerToGroup(layerId, groupName) {
	var $canvases = this, $canvas, e,
		layer, groups = [];
	
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		layer = $canvas.getLayer(layerId);
		
		// If layer is not already in group
		if (layer.groups && inArray(groupName, layer.groups) === -1) {
			
			// Clone groups list
			groups = layer.groups.slice(0);
			
			// Add layer to group
			groups.push(groupName);
		
			// Update layer group mappings
			$canvas.setLayer(layer, {
				groups: groups
			});
		
		}
				
	}
	return $canvases;
};

// Remove an existing layer from a layer group
$.fn.removeLayerFromGroup = function removeLayerFromGroup(layerId, groupName) {
	var $canvases = this, $canvas, e,
		layer, groups = [],
		index;
	
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		layer = $canvas.getLayer(layerId);
		
		// Find index of layer in group
		index = inArray(groupName, layer.groups);
		
		// If layer is in group
		if (index !== -1) {
			
			// Clone groups list			
			groups = layer.groups.slice(0);
			
			// Remove layer from group
			groups.splice(index, 1);
					
			// Update layer group mappings	
			$canvas.setLayer(layer, {
				groups: groups
			});
								
		}
						
	}
	return $canvases;
};

// Get topmost layer that intersects with event coordinates
function _getIntersectingLayer(data) {
	var layer, i, m;
	
	// Store the topmost layer
	layer = {};
	
	// Get the topmost layer whose visible area intersects event coordinates
	for (i = data.intersecting.length - 1; i >= 0; i -= 1) {
		
		// Get current layer
		layer = data.intersecting[i];
		
		// If layer has previous masks
		if (layer._masks) {
			
			// Search previous masks to ensure layer is visible at event coordinates
			for (m = layer._masks.length - 1; m >= 0; m -= 1) {
			
				// If mask does not intersect event coordinates
				if (!layer._masks[m].intersects) {
					// Indicate that the mask does not intersect event coordinates
					layer.intersects = FALSE;
					// Stop searching previous masks
					break;
				}
			
			}
		
			// If event coordinates intersect all previous masks
			if (layer.intersects) {
				// Stop searching for topmost layer
				break;
			}
			
		}
		
	}
	return layer;
}

// Draw individual layer (internal)
function _drawLayer($canvas, ctx, layer, nextLayerIndex) {
	if (layer && layer.visible && layer._method) {
		if (nextLayerIndex) {
			layer._next = nextLayerIndex;
		} else {
			layer._next = NULL;
		}
		// If layer is an object, call its respective method
		layer._method.call($canvas, layer);
	}
}

// Draw individual layer
$.fn.drawLayer = function drawLayer(layerId) {
	var $canvases = this, e, ctx,
		$canvas, layer;
		
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		ctx = _getContext($canvases[e]);
		
		// Retrieve the specified layer
		layer = $canvas.getLayer(layerId);
		_drawLayer($canvas, ctx, layer);
	}
	return $canvases;
};

// Handle dragging of the currently-dragged layer
function _handleLayerDrag($canvas, data, eventType) {
	var layers, layer, l,
		drag, dragGroups,
		group, groupName, g;
	
	drag = data.drag;
	layer = drag.layer;
	dragGroups = layer.dragGroups || [];
	layers = data.layers;
			
	if ((eventType === 'mousemove' || eventType === 'touchmove')) {
		// Detect when user starts dragging and when user is in the process of dragging layer
			
		// Check if layer has started to drag
		if (!drag.dragging) {
			
			// Signify that a layer on the canvas is being dragged
			drag.dragging = TRUE;
									
			// Optionally bring layer to front when drag starts
			if (layer.bringToFront) {
				// Remove layer from its original position
				layers.splice(layer.index, 1);
				// Bring layer to front
				// push() returns the new array length
				layer.index = layers.push(layer);
			}
	
			// Move group with layer on dragstart
			for (g = 0; g < dragGroups.length; g += 1) {
				
				groupName = dragGroups[g];
				group = data.layer.groups[groupName];
				if (layer.groups && group) {
																		
					for (l = 0; l < group.length; l += 1) {
						if (group[l] !== layer) {
							group[l]._startX = group[l].x;
							group[l]._startY = group[l].y;
							group[l]._endX = layer._eventX;
							group[l]._endY = layer._eventY;
							// Optionally bring all layers in drag group to front when drag starts
							if (group[l].bringToFront) {
								group[l].index = inArray(group[l], layers);
								// Remove layer from its original position in layers array
								layers.splice(
									group[l].index,
									1
								);
								// Bring layer to front
								layers.splice(-1, 0, group[l]);
								// Ensure layer index is accurate
								group[l].index = layers.length - 2;
							}
							// Trigger dragstart event if defined
							if (group[l].dragstart && layer.fireDragGroupEvents) {
								group[l].dragstart.call($canvas[0], group[l]);
							}
						
						}
					}
										
				}
				
			}
	
			// Set drag properties for this layer
			drag._startX = layer._startX = layer.x;
			drag._startY = layer._startY = layer.y;
			drag._endX = layer._endX = layer._eventX;
			drag._endY = layer._endY = layer._eventY;
			
			triggerLayerEvent($canvas, layer, 'dragstart');
			
		}
		
		// Calculate position after drag
		layer.x = layer._eventX - (drag._endX - drag._startX);
		layer.y = layer._eventY - (drag._endY - drag._startY);
				
		// Move groups with layer on drag
		for (g = 0; g < dragGroups.length; g += 1) {
			
			groupName = dragGroups[g];
			group = data.layer.groups[groupName];
			if (layer.groups && group) {
			
				for (l = 0; l < group.length; l += 1) {
					if (group[l] !== layer) {
						group[l].x = layer._eventX - (group[l]._endX - group[l]._startX);
						group[l].y = layer._eventY - (group[l]._endY - group[l]._startY);
						// Trigger drag event if defined
						if (group[l].drag && layer.fireDragGroupEvents) {
							group[l].drag.call($canvas[0], group[l]);
						}
					}
				}
			
			}
			
		}
		
		// Trigger drag event if defined
		triggerLayerEvent($canvas, layer, 'drag');
		
	} else if ((eventType === 'mouseup' || eventType === 'touchend')) {
		// Detect when user stops dragging layer
		
		// Trigger dragstop event if defined
		if (drag.dragging) {
			triggerLayerEvent($canvas, layer, 'dragstop');
			drag.dragging = FALSE;
		}
				
		// Move drag groups with layer on dragstop
		for (g = 0; g < dragGroups.length; g += 1) {
			
			groupName = dragGroups[g];
			group = data.layer.groups[groupName];
			if (layer.groups && group) {
				for (l = 0; l < group.length; l += 1) {
					if (group[l] !== layer) {
						// Trigger dragstop event if defined
						if (group[l].dragstop && layer.fireDragGroupEvents) {
							group[l].dragstop.call($canvas[0], group[l]);
						}
					}
				}
			}
		
		}
		
		// Cancel dragging
		data.drag = {};
	
	}
}

// Trigger the given event on the given layer
function triggerLayerEvent($canvas, layer, eventType, cursor) {
	
	// If cursor was not explicitly provided
	if (!cursor) {
	
		if (layer.cursors) {
			// Use cursors property if given
			cursor = layer.cursors[eventType];
		} else {
			// Otherwise, fallback to deprecated cursor property
			cursor = layer.cursor;
		}
	
	}
		
	// If cursor is defined	
	if (cursor) {
		// Set canvas cursor
		$canvas.css({
			cursor: cursor
		});
	}

	// Run the user-defined callback function
	if (layer[eventType]) {
		layer[eventType].call($canvas[0], layer);
	}
}

// Draw all layers (or, if given, only layers starting at an index)
$.fn.drawLayers = function drawLayers(args) {
	var $canvases = this, $canvas, e, ctx,
		// Internal parameters for redrawing the canvas
		params = merge({}, args),
		// Other variables
		layers, layer, lastLayer, l, lastIndex,
		data, eventCache, eventType,
		drag;
	
	// The layer index from which to start redrawing the canvas
	if (!params.index) {
		params.index = 0;
	}
		
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			data = _getCanvasData($canvases[e]);
												
			// Clear canvas first unless otherwise directed
			if (params.clear !== FALSE) {
				$canvas.clearCanvas();
			}
			
			// Cache the layers array
			layers = data.layers;
							
			// Draw layers from first to last (bottom to top)
			for (l = params.index; l < layers.length; l += 1) {
				layer = layers[l];
								
				// Ensure layer index is up-to-date
				layer.index = l;
												
				// Prevent any one event from firing excessively
				if (params.resetFire) {
					layer._fired = FALSE;
				}
				// Optionally disable events temporarily
				layer._event = !layer.disableEvents;
				// Draw layer
				_drawLayer($canvas, ctx, layer, l + 1);
				// Store list of previous masks for each layer
				layer._masks = data.transforms.masks.slice(0);
								
				// Allow image layers to load before drawing successive layers
				if (layer._method === $.fn.drawImage && layer.visible) {
					break;
				}
				
			}
			
			// Store the latest
			lastIndex = l;
			
			// Get first layer that intersects with event coordinates
			layer = _getIntersectingLayer(data);
									
			eventCache = data.event;
			eventType = eventCache.type;
			// Use mouse event callbacks if no touch event callbacks are given
			if (!layer[eventType]) {
				eventType = getMouseEventName(eventType);
			}
			// Cache the drag object
			drag = data.drag;
			
			lastLayer = data.lastIntersected;
								
			// Manage mouseout event
			if (lastLayer !== NULL && layer !== lastLayer && lastLayer._hovered && !lastLayer._fired) {
												
				data.lastIntersected = NULL;
				lastLayer._fired = TRUE;
				lastLayer._hovered = FALSE;
				
				triggerLayerEvent($canvas, lastLayer, 'mouseout', data.cursor);
							
			}
				
			// Check events for intersecting layer
			if (layer._event && layer.intersects) {
				
				data.lastIntersected = layer;
																
				// Detect mouseover events
				if (layer.mouseover || layer.mouseout || layer.cursor || layer.cursors) {
								
					if (!layer._hovered && !layer._fired) {
												
						// Prevent events from firing excessively
						layer._fired = TRUE;
						layer._hovered = TRUE;
						
						triggerLayerEvent($canvas, layer, 'mouseover');
											
					}
				
				}
																								
				// Detect any other mouse event
				if (!layer._fired) {
				
					// Prevent event from firing twice unintentionally
					layer._fired = TRUE;
					eventCache.type = NULL;
					
					triggerLayerEvent($canvas, layer, eventType);
				
				}
			
				// Use the mousedown event to start drag
				if (layer.draggable && (eventType === 'mousedown' || eventType === 'touchstart')) {
														
					// Keep track of drag state
					drag.layer = layer;
							
				}
			
			}
		
			// Dragging a layer works independently from other events
			
			if (drag.layer) {
				_handleLayerDrag($canvas, data, eventType);
			}

			// If the last layer has been drawn
			if (lastIndex === layers.length) {
				
				// Reset list of intersecting layers
				data.intersecting.length = 0;
				// Reset transformation stack
				data.transforms = _cloneTransforms(baseTransforms);
				data.savedTransforms.length = 0;
				
			}
		
		}
	}
	return $canvases;
};

// Add a jCanvas layer (internal)
function _addLayer(canvas, params, args, method) {
	var $canvas, layers, layer = params,
		data;
	
	// Store arguments object for later use
	params._args = args;
	params.canvas = canvas;
	
	// Convert all draggable drawings into jCanvas layers
	if (params.draggable || params.dragGroups) {
		params.layer = TRUE;
		params.draggable = TRUE;
	}
	
	// Determine the layer's type using the available information
	if (method) {
		params._method = method;
	} else if (params.method) {
		params._method = $.fn[params.method];
	} else if (params.type) {
		params._method = $.fn[drawingMap[params.type]];
	} else {
		params._method = function() {};
	}
		
	// If layer hasn't been added yet
	if (params.layer && !params._layer) {
		// Add layer to canvas
						
		$canvas = $(canvas);
		layers = $canvas.getLayers();
				
		data = _getCanvasData(canvas);
					
		// Ensure layers are unique across canvases by cloning them
		layer = new jCanvasObject(params);
		// Indicate that this is a layer for future checks
		layer.layer = TRUE;
		layer._layer = TRUE;
			
		// Update layer group mappings
		_updateLayerName($canvas, data, layer);
		_updateLayerGroups($canvas, data, layer);
		
		// Check for any associated jCanvas events and enable them
		_addLayerEvents($canvas, data, layer);
		
		// Optionally enable drag-and-drop support and cursor support
		_enableDrag($canvas, data, layer);
		
		// Copy _event property to parameters object
		params._event = layer._event;
				
		// Add layer to end of array if no index is specified
		if (layer.index === NULL) {
			layer.index = layers.length;
		}
		
		// Add layer to layers array at specified index
		layers.splice(layer.index, 0, layer);
	}
	return layer;
}

// Add a jCanvas layer
$.fn.addLayer = function addLayer(args) {
	var $canvases = this, e, ctx,
		params;
	
	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			params = new jCanvasObject(args);
			params.layer = TRUE;
			_addLayer($canvases[e], params, args);
			
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
function _showProps(obj) {
	var cssProp, p;
	for (p = 0; p < cssProps.length; p += 1) {
		cssProp = cssProps[p];
		obj[cssProp] = obj['_' + cssProp];
	}
}
function _hideProps(obj, reset) {
	var cssProp, p;
	for (p = 0; p < cssProps.length; p += 1) {
		cssProp = cssProps[p];
		// Hide property using same name with leading underscore
		obj['_' + cssProp] = obj[cssProp];
		cssPropsObj[cssProp] = TRUE;
		if (reset) {
			delete obj[cssProp];
		}
	}
}

// Evaluate property values that are functions
function _evalFnValues(canvas, layer, obj) {
	var propName;
	for (propName in obj) {
		if (obj.hasOwnProperty(propName)) {
			if (isFunction(obj[propName])) {
				obj[propName] = obj[propName].call(canvas, layer, propName);
			}
		}
	}
	return obj;
}

// Convert a color value to RGB
function toRgb(color) {
	var originalColor, elem,
		rgb = [],
		multiple = 1;
	
	// Deal with hexadecimal colors and color names
	if (color.match(/^#?\w+$/gi)) {
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
	if (color.match(/^rgb/gi)) {
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
	if (typeOf(fx.start) !== 'array') {
		fx.start = toRgb(fx.start);
		fx.end = toRgb(fx.end);
	}
	fx.now = [];
	
	// If colors are RGBA, animate transparency
	if (fx.start[3] !== 1 || fx.end[3] !== 1) {
		n = 4;
	}
		
	// Calculate current frame for red, green, blue, and alpha
	for (i = 0; i < n; i += 1) {
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
$.fn.animateLayer = function animateLayer() {
	var $canvases = this, $canvas, e, ctx,
		args = ([]).slice.call(arguments, 0),
		data, layer, props;
			
	// Deal with all cases of argument placement
	/*
		0. layer name/index
		1. properties
		2. duration/options
		3. easing
		4. complete function
		5. step function
	*/
	
	if (typeOf(args[2]) === 'object') {
	
		// Accept an options object for animation
		args.splice(2, 0, args[2].duration || NULL);
		args.splice(3, 0, args[3].easing || NULL);
		args.splice(4, 0, args[4].done || args[4].complete || NULL);
		args.splice(5, 0, args[5].step || NULL);
			
	} else {
	
		if (args[2] === UNDEFINED) {
			// If object is the last argument
			args.splice(2, 0, NULL);
			args.splice(3, 0, NULL);
			args.splice(4, 0, NULL);
		} else if (isFunction(args[2])) {
			// If callback comes after object
			args.splice(2, 0, NULL);
			args.splice(3, 0, NULL);
		}
		if (args[3] === UNDEFINED) {
			// If duration is the last argument
			args[3] = NULL;
			args.splice(4, 0, NULL);
		} else if (isFunction(args[3])) {
			// If callback comes after duration
			args.splice(3, 0, NULL);
		}

	}
	
	// Run callback function when animation completes
	function complete($canvas, data, layer) {
		
		return function() {
			
			_showProps(layer);
		
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
			
			// Throttle animation to improve efficiency
			if (layer._pos !== fx.pos) {
				
				layer._pos = fx.pos;
				
				_showProps(layer);
			
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

			}
			
		};
		
	}
	
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			data = _getCanvasData($canvases[e]);
			
			// If a layer object was passed, use it the layer to be animated
			layer = $canvas.getLayer(args[0]);
						
			// Ignore layers that are functions
			if (layer && layer._method !== $.fn.draw) {
				
				// Do not modify original object
				props = merge({}, args[1]);
				
				props = _evalFnValues($canvases[e], layer, props);
											
				// Bypass jQuery CSS Hooks for CSS properties (width, opacity, etc.)
				_hideProps(props, TRUE);
				_hideProps(layer);
				
				// Fix for jQuery's vendor prefixing support, which affects how width/height/opacity are animated
				layer.style = cssPropsObj;
											
				// Animate layer
				$(layer).animate(props, {
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
$.fn.animateLayerGroup = function animateLayerGroup(groupId) {
	var $canvases = this, $canvas, e,
		args = ([]).slice.call(arguments, 0),
		group, l;
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		group = $canvas.getLayerGroup(groupId);
		
		if (group) {
		
			// Animate all layers in the group
			for (l = 0; l < group.length; l += 1) {
			
				$canvas.animateLayer.apply($canvas, [group[l]].concat(args.slice(1)));
			
			}
		
		}
	}
	return $canvases;
};

// Delay layer animation by a given number of milliseconds
$.fn.delayLayer = function delayLayer(layerId, duration) {
	var $canvases = this, e, layer;
	duration = duration || 0;
	
	for (e = 0; e < $canvases.length; e += 1) {
		layer = $($canvases[e]).getLayer(layerId);
		$(layer).delay(duration);
	}
	return $canvases;
};

// Delay animation all layers in a layer group
$.fn.delayLayerGroup = function delayLayerGroup(groupId, duration) {
	var $canvases = this, $canvas, e,
		group, layer, l;
	duration = duration || 0;
	
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		
		group = $canvas.getLayerGroup(groupId);
		// Delay all layers in the group
		if (group) {
			
			for (l = 0; l < group.length; l += 1) {
				// Delay each layer in the group
				layer = group[l];
				if (layer) {
					$(layer).delay(duration);
				}
			}
			
		}
	}
	return $canvases;
};

// Stop layer animation
$.fn.stopLayer = function stopLayer(layerId, clearQueue) {
	var $canvases = this, $canvas, e,
		layer;
	
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		
		layer = $canvas.getLayer(layerId);
		if (layer) {
			
			$(layer).stop(clearQueue);
			
		}
	}
	return $canvases;
};

// Stop animation of all layers in a layer group
$.fn.stopLayerGroup = function stopLayerGroup(groupId, clearQueue) {
	var $canvases = this, $canvas, e,
		group, layer, l;
	
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		
		group = $canvas.getLayerGroup(groupId);
		// Stop all layers in the group
		if (group) {
			
			for (l = 0; l < group.length; l += 1) {
				// Stop each layer in the group
				layer = group[l];
				if (layer) {
					$(layer).stop(clearQueue);
				}
			}
			
		}
	}
	return $canvases;
};

// Enable animation for color properties
function _supportColorProps(props) {
	var p;
	for (p = 0; p < props.length; p += 1) {
		$.fx.step[props[p]] = animateColor;
	}
}

// Enable animation for color properties
_supportColorProps([
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
touchEventMap = {
	'mousedown': 'touchstart',
	'mouseup': 'touchend',
	'mousemove': 'touchmove'
};
// Map standard touch events to mouse events
mouseEventMap = {
	'touchstart': 'mousedown',
	'touchend': 'mouseup',
	'touchmove': 'mousemove'
};

// Convert mouse event name to a corresponding touch event name (if possible)
function _getTouchEventName(eventName) {
	// Detect touch event support
	if (window.ontouchstart !== undefined) {
		if (touchEventMap[eventName]) {
			eventName = touchEventMap[eventName];
		}
	}
	return eventName;
}
// Convert touch event name to a corresponding mouse event name
function getMouseEventName(eventName) {
	if (mouseEventMap[eventName]) {
		eventName = mouseEventMap[eventName];
	}
	return eventName;
}

// Bind event to jCanvas layer using standard jQuery events
function createEvent(eventName) {
	
	jCanvas.events[eventName] = function($canvas, data) {
		var helperEventName, eventCache;

		// Retrieve canvas's event cache
		eventCache = data.event;
		
		// Both mouseover/mouseout events will be managed by a single mousemove event
		helperEventName = (eventName === 'mouseover' || eventName === 'mouseout') ? 'mousemove' : eventName;
				
		// Ensure a single DOM event is not bound more than once
		if (!data.events[helperEventName]) {
			// Bind one canvas event which handles all layer events of that type
			$canvas.bind(helperEventName + '.jCanvas', function(event) {
				// Cache current mouse position and redraw layers
				eventCache.x = event.offsetX;
				eventCache.y = event.offsetY;
				eventCache.type = helperEventName;
				eventCache.event = event;
				// Redraw layers on every trigger of the event
				$canvas.drawLayers({
					resetFire: TRUE
				});
				// Prevent default event behavior
				event.preventDefault();
			});
			// Prevent this event from being bound twice
			data.events[helperEventName] = TRUE;
		}
	};
}
function createEvents(eventNames) {
	var n;
	for (n = 0; n < eventNames.length; n += 1) {
		createEvent(eventNames[n]);
	}
}
// Populate jCanvas events object with some standard events
createEvents([
	'click',
	'dblclick',
	'mousedown',
	'mouseup',
	'mousemove',
	'mouseover',
	'mouseout',
	'touchstart',
	'touchmove',
	'touchend'
]);

// Check if event fires when a drawing is drawn
function _detectEvents(canvas, ctx, params) {
	var layer, data, eventCache, intersects,
		transforms, x, y, angle;

	// Use the layer object stored by the given parameters object
	layer = params._args;
	// Canvas must have event bindings
	if (layer && layer._event) {

		data = _getCanvasData(canvas);
		eventCache = data.event;
		if (eventCache.x !== NULL && eventCache.y !== NULL) {
			// Respect user-defined pixel ratio
			x = eventCache.x * data.pixelRatio;
			y = eventCache.y * data.pixelRatio;
			// Determine if the given coordinates are in the current path
			intersects = ctx.isPointInPath(x, y) || (ctx.isPointInStroke && ctx.isPointInStroke(x, y));
		}
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

		if (angle !== 0) {
			// Rotate coordinates if coordinate space has been rotated
			layer._eventX = (x * cos(-angle)) - (y * sin(-angle));
			layer._eventY = (y * cos(-angle)) + (x * sin(-angle));
		} else {
			// Otherwise, no calculations need to be made
			layer._eventX = x;
			layer._eventY = y;
		}

		// Scale coordinates
		layer._eventX /= transforms.scaleX;
		layer._eventY /= transforms.scaleY;
		
		// If layer intersects with cursor, add it to the list
		if (intersects) {
			data.intersecting.push(layer);
		}
		layer.intersects = intersects;
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
			offset = $(event.currentTarget).offset();
			if (offset) {
				event.offsetX = event.pageX - offset.left;
				event.offsetY = event.pageY - offset.top;
			}
		} else if (touches) {
			// Enable offsetX and offsetY for mobile devices
			offset = $(event.currentTarget).offset();
			if (offset) {
				event.offsetX = touches[0].pageX - offset.left;
				event.offsetY = touches[0].pageY - offset.top;
			}
		}
	
	}
	return event;
};

/* Drawing API */

// Map drawing names with their respective method names
drawingMap = {
	'arc': 'drawArc',
	'bezier': 'drawBezier',
	'ellipse': 'drawEllipse',
	'function': 'draw',
	'image': 'drawImage',
	'line': 'drawLine',
	'polygon': 'drawPolygon',
	'slice': 'drawSlice',
	'quadratic': 'drawQuadratic',
	'rectangle': 'drawRect',
	'text': 'drawText',
	'vector': 'drawVector'
};

// Draw on canvas using a function
$.fn.draw = function draw(args) {
	var $canvases = this, $canvas, e, ctx,
		params = new jCanvasObject(args),
		layer;
			
	// Draw using any other method
	if (drawingMap[params.type]) {
		
		$canvases[drawingMap[params.type]](params);
		
	} else {
	
		for (e = 0; e < $canvases.length; e += 1) {
			$canvas = $($canvases[e]);
			ctx = _getContext($canvases[e]);
			if (ctx) {
			
				params = new jCanvasObject(args);
				layer = _addLayer($canvases[e], params, args, draw);
				if (params.visible) {
											
					if (params.fn) {
						// Call the given user-defined function
						params.fn.call($canvases[e], ctx, params);
					}
			
				}
			
			}
		}
	
	}
	return $canvases;
};

// Clear canvas
$.fn.clearCanvas = function clearCanvas(args) {
	var $canvases = this, e, ctx,
		params = new jCanvasObject(args),
		layer;
		
	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
						
			if (params.width === NULL || params.height === NULL) {
				// Clear entire canvas if width/height is not given
				
				// Reset current transformation temporarily to ensure that the entire canvas is cleared
				ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, $canvases[e].width, $canvases[e].height);
				ctx.restore();
				
			} else {
				// Otherwise, clear the defined section of the canvas
								
				// Transform clear rectangle
				layer = _addLayer($canvases[e], params, args, clearCanvas);
				_transformShape($canvases[e], ctx, params, params.width, params.height);
				ctx.clearRect(params.x - (params.width / 2), params.y - (params.height / 2), params.width, params.height);
				// Restore previous transformation
				_restoreTransform(ctx, params);
				
			}
			
		}
	}
	return $canvases;
};

/* Transformation API */

// Restore canvas
$.fn.saveCanvas = function saveCanvas(args) {
	var $canvases = this, e, ctx,
		params, layer,
		data, i;
	
	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			data = _getCanvasData($canvases[e]);
			
			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, saveCanvas);
			
			// Restore a number of times using the given count
			for (i = 0; i < params.count; i += 1) {
				_saveCanvas(ctx, data);
			}
			
		}
	}
	return $canvases;
};

// Restore canvas
$.fn.restoreCanvas = function restoreCanvas(args) {
	var $canvases = this, e, ctx,
		params, layer,
		data, i;
	
	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			data = _getCanvasData($canvases[e]);
			
			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, restoreCanvas);
			
			// Restore a number of times using the given count
			for (i = 0; i < params.count; i += 1) {
				_restoreCanvas(ctx, data);
			}
			
		}
	}
	return $canvases;
};

// Restore canvas
$.fn.restoreCanvasOnRedraw = function restoreCanvasOnRedraw(args) {
	var $canvases = this,
		params = merge({}, args);
	params.layer = TRUE;
	$canvases.restoreCanvas(params);
	return $canvases;
};

// Rotate canvas
$.fn.rotateCanvas = function rotateCanvas(args) {
	var $canvases = this, e, ctx,
		params, layer,
		data;
	
	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			data = _getCanvasData($canvases[e]);
			
			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, rotateCanvas);
			
			// Autosave transformation state by default
			if (params.autosave) {
				// Automatically save transformation state by default
				_saveCanvas(ctx, data);
			}
			_rotateCanvas(ctx, params, data.transforms);
		}
		
	}
	return $canvases;
};

// Scale canvas
$.fn.scaleCanvas = function scaleCanvas(args) {
	var $canvases = this, e, ctx,
		params, layer,
		data;
		
	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			data = _getCanvasData($canvases[e]);

			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, scaleCanvas);
			
			// Autosave transformation state by default
			if (params.autosave) {
				// Automatically save transformation state by default
				_saveCanvas(ctx, data);
			}
			_scaleCanvas(ctx, params, data.transforms);
			
		}
	}
	return $canvases;
};

// Translate canvas
$.fn.translateCanvas = function translateCanvas(args) {
	var $canvases = this, e, ctx,
		params, layer,
		data;

	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			data = _getCanvasData($canvases[e]);

			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, translateCanvas);
			
			// Autosave transformation state by default
			if (params.autosave) {
				// Automatically save transformation state by default
				_saveCanvas(ctx, data);
			}
			_translateCanvas(ctx, params, data.transforms);
			
		}
	}
	return $canvases;
};

/* Shape API */

// Draw rectangle
$.fn.drawRect = function drawRect(args) {
	var $canvases = this, e, ctx,
		params, layer,
		x1, y1, x2, y2, r;

	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawRect);
			if (params.visible) {
			
				_setGlobalProps($canvases[e], ctx, params);
				_transformShape($canvases[e], ctx, params, params.width, params.height);
				
				ctx.beginPath();
				x1 = params.x - (params.width / 2);
				y1 = params.y - (params.height / 2);
				r = params.cornerRadius;
				if (r) {
					// Draw rectangle with rounded corners if cornerRadius is defined
					
					params.closed = TRUE;
					x2 = params.x + (params.width / 2);
					y2 = params.y + (params.height / 2);
					// Prevent over-rounded corners
					if ((x2 - x1) - (2 * r) < 0) {
						r = (x2 - x1) / 2;
					}
					if ((y2 - y1) - (2 * r) < 0) {
						r = (y2 - y1) / 2;
					}
					ctx.moveTo(x1 + r, y1);
					ctx.lineTo(x2 - r, y1);
					ctx.arc(x2 - r, y1 + r, r, 3 * PI / 2, PI * 2, FALSE);
					ctx.lineTo(x2, y2 - r);
					ctx.arc(x2 - r, y2 - r, r, 0, PI / 2, FALSE);
					ctx.lineTo(x1 + r, y2);
					ctx.arc(x1 + r, y2 - r, r, PI / 2, PI, FALSE);
					ctx.lineTo(x1, y1 + r);
					ctx.arc(x1 + r, y1 + r, r, PI, 3 * PI / 2, FALSE);
					
				} else {
					
					// Otherwise, draw rectangle with square corners
					ctx.rect(x1, y1, params.width, params.height);
					
				}
				// Check for jCanvas events
				_detectEvents($canvases[e], ctx, params);
				// Close rectangle path
				_closePath($canvases[e], ctx, params);
				
			}
		}
	}
	return $canvases;
};

// Get a coterminal angle between 0 and 2pi for the given angle
function _getCoterminal(angle) {
	while (angle < 0) {
		angle += (2 * PI);
	}
	return angle;
}

// Retrieves the x-coordinate for the given angle in a circle
function _getX(params, angle) {
	return params.x + (params.radius * cos(angle));
}
// Retrieves the y-coordinate for the given angle in a circle
function _getY(params, angle) {
	return params.y + (params.radius * sin(angle));
}

// Draw arc or circle
$.fn.drawArc = function drawArc(args) {
	var $canvases = this, e, ctx,
		params, layer,
		x1, y1, x2, y2,
		x3, y3, x4, y4,
		diff;
			
	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawArc);
			if (params.visible) {
				
				_setGlobalProps($canvases[e], ctx, params);
				_transformShape($canvases[e], ctx, params, params.radius * 2);
				
				if (!params.inDegrees && params.end === 360) {
					// Convert default end angle to radians if necessary	
					params.end = PI * 2;
				}
				
				// Convert angles to radians
				params.start *= params._toRad;
				params.end *= params._toRad;
				// Consider 0deg due north of arc
				params.start -= (PI / 2);
				params.end -= (PI / 2);
				
				// Draw arc
				ctx.beginPath();
				ctx.arc(params.x, params.y, params.radius, params.start, params.end, params.ccw);
				
				diff = PI / 180 * 1;
				// Ensure arrows are pointed correctly for CCW arcs
				if (params.ccw) {
					diff *= -1;
				}
				// Calculate coordinates for start arrow
				x1 = _getX(params, params.start + diff);
				y1 = _getY(params, params.start + diff);
				x2 = _getX(params, params.start);
				y2 = _getY(params, params.start);
				// Calculate coordinates for end arrow
				x3 = _getX(params, params.end + diff);
				y3 = _getY(params, params.end + diff);
				x4 = _getX(params, params.end);
				y4 = _getY(params, params.end);
				
				// Optionally add arrows to path
				_addArrows(
					$canvases[e], ctx, params,
					x1, y1,
					x2, y2,
					x4, y4,
					x3, y3
				);
				
				// Check for jCanvas events
				_detectEvents($canvases[e], ctx, params);
				// Optionally close path
				_closePath($canvases[e], ctx, params);
			
			}
			
		}
	}
	return $canvases;
};

// Draw ellipse
$.fn.drawEllipse = function drawEllipse(args) {
	var $canvases = this, e, ctx,
		params, layer,
		controlW,
		controlH;
	
	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {

			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawEllipse);
			if (params.visible) {
				
				_setGlobalProps($canvases[e], ctx, params);
				_transformShape($canvases[e], ctx, params, params.width, params.height);
				
				// Calculate control width and height
				controlW = params.width * (4 / 3);
				controlH = params.height;
				
				// Create ellipse using curves
				ctx.beginPath();
				ctx.moveTo(params.x, params.y - (controlH / 2));
				// Left side
				ctx.bezierCurveTo(params.x - (controlW / 2), params.y - (controlH / 2), params.x - (controlW / 2), params.y + (controlH / 2), params.x, params.y + (controlH / 2));
				// Right side
				ctx.bezierCurveTo(params.x + (controlW / 2), params.y + (controlH / 2), params.x + (controlW / 2), params.y - (controlH / 2), params.x, params.y - (controlH / 2));
				// Check for jCanvas events
				_detectEvents($canvases[e], ctx, params);
				// Always close path
				params.closed = TRUE;
				_closePath($canvases[e], ctx, params);
				
			}
		}
	}
	return $canvases;
};

// Draw a regular (equal-angled) polygon
$.fn.drawPolygon = function drawPolygon(args) {
	var $canvases = this, e, ctx,
		params, layer,
		theta, dtheta, hdtheta,
		apothem,
		x, y, i;
	
	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawPolygon);
			if (params.visible) {
				
				_setGlobalProps($canvases[e], ctx, params);
				_transformShape($canvases[e], ctx, params, params.radius * 2);
				
				// Polygon's central angle
				dtheta = (2 * PI) / params.sides;
				// Half of dtheta
				hdtheta = dtheta / 2;
				// Polygon's starting angle
				theta = hdtheta + (PI / 2);
				// Distance from polygon's center to the middle of its side
				apothem = params.radius * cos(hdtheta);
				
				// Calculate points and draw
				ctx.beginPath();
				for (i = 0; i < params.sides; i += 1) {
					
					// Draw side of polygon
					x = params.x + (params.radius * cos(theta));
					y = params.y + (params.radius * sin(theta));
					
					// Plot point on polygon
					ctx.lineTo(x, y);
					
					// Project side if chosen
					if (params.concavity) {
						// Sides are projected from the polygon's apothem
						x = params.x + ((apothem + (-apothem * params.concavity)) * cos(theta + hdtheta));
						y = params.y + ((apothem + (-apothem * params.concavity)) * sin(theta + hdtheta));
						ctx.lineTo(x, y);
					}
					
					// Increment theta by delta theta
					theta += dtheta;
					
				}
				// Check for jCanvas events
				_detectEvents($canvases[e], ctx, params);
				// Always close path
				params.closed = TRUE;
				_closePath($canvases[e], ctx, params);
				
			}
		}
	}
	return $canvases;
};

// Draw pie-shaped slice
$.fn.drawSlice = function drawSlice(args) {
	var $canvases = this, $canvas, e, ctx,
		params, layer,
		angle, dx, dy;
		
	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawSlice);
			if (params.visible) {
								
				_setGlobalProps($canvases[e], ctx, params);
				_transformShape($canvases[e], ctx, params, params.radius * 2);
								
				// Perform extra calculations
				
				// Convert angles to radians										
				params.start *= params._toRad;
				params.end *= params._toRad;
				// Consider 0deg at north of arc
				params.start -= (PI / 2);
				params.end -= (PI / 2);
				
				// Find positive equivalents of angles
				params.start = _getCoterminal(params.start);
				params.end = _getCoterminal(params.end);
				// Ensure start angle is less than end angle
				if (params.end < params.start) {
					params.end += (2 * PI);
				}
				
				// Calculate angular position of slice
				angle = ((params.start + params.end) / 2);
				
				// Calculate ratios for slice's angle
				dx = (params.radius * params.spread * cos(angle));
				dy = (params.radius * params.spread * sin(angle));
				
				// Adjust position of slice
				params.x += dx;
				params.y += dy;
				
				// Draw slice
				ctx.beginPath();
				ctx.arc(params.x, params.y, params.radius, params.start, params.end, params.ccw);
				ctx.lineTo(params.x, params.y);
				// Check for jCanvas events
				_detectEvents($canvases[e], ctx, params);
				// Always close path
				params.closed = TRUE;
				_closePath($canvases[e], ctx, params);
				
			}
			
		}
	}
	return $canvases;
};

/* Path API */

// Add arrow to path using the given properties
function _addArrow(canvas, ctx, params, x1, y1, x2, y2) {
	var leftX, leftY,
		rightX, rightY,
		offsetX, offsetY,
		angle;
	
	// If arrow radius is given and path is not closed
	if (params.arrowRadius && !params.closed) {
		
		// Calculate angle
		angle = atan2((y2 - y1), (x2 - x1));
		// Adjust angle correctly
		angle -= PI;
		// Calculate offset to place arrow at edge of path
		offsetX = (params.strokeWidth * cos(angle));
		offsetY = (params.strokeWidth * sin(angle));
		
		// Calculate coordinates for left half of arrow
		leftX = x2 + (params.arrowRadius * cos(angle + (params.arrowAngle / 2)));
		leftY = y2 + (params.arrowRadius * sin(angle + (params.arrowAngle / 2)));
		// Calculate coordinates for right half of arrow
		rightX = x2 + (params.arrowRadius * cos(angle - (params.arrowAngle / 2)));
		rightY = y2 + (params.arrowRadius * sin(angle - (params.arrowAngle / 2)));
		
		// Draw left half of arrow
		ctx.moveTo(leftX - offsetX, leftY - offsetY);
		ctx.lineTo(x2 - offsetX, y2 - offsetY);
		// Draw right half of arrow
		ctx.lineTo(rightX - offsetX, rightY - offsetY);
		
		// Visually connect arrow to path
		ctx.moveTo(x2 - offsetX, y2 - offsetY);
		ctx.lineTo(x2 + offsetX, y2 + offsetY);
		
	}
}

// Add start and/or end arrows to path
function _addArrows(canvas, ctx, params, x1, y1, x2, y2, x3, y3, x4, y4) {
	if (params.startArrow) {
		// Optionally draw arrow at start point of path
		_addArrow(canvas, ctx, params, x1, y1, x2, y2);
	}
	if (params.endArrow) {
		// Optionally draw arrow at end point of path
		_addArrow(canvas, ctx, params, x3, y3, x4, y4);
	}
}

// Draw line
$.fn.drawLine = function drawLine(args) {
	var $canvases = this, e, ctx,
		params, layer,
		l, lx, ly;

	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {
			
			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawLine);
			if (params.visible) {
				
				_setGlobalProps($canvases[e], ctx, params);
				_transformShape($canvases[e], ctx, params, 0);
				
				// Draw each point
				l = 1;
				ctx.beginPath();
				while (TRUE) {
					
					// Calculate next coordinates
					lx = params['x' + l];
					ly = params['y' + l];
					
					// If coordinates are given
					if (lx !== UNDEFINED && ly !== UNDEFINED) {
						
						// Draw next line
						ctx.lineTo(lx + params.x, ly + params.y);
						l += 1;
						
					} else {
						
						// Otherwise, stop drawing
						break;
						
					}
					
				}
				l -= 1;
				// Optionally add arrows to path
				_addArrows(
					$canvases[e],
					ctx,
					params,
					params.x2 + params.x,
					params.y2 + params.y,
					params.x1 + params.x,
					params.y1 + params.y,
					params['x' + (l - 1)] + params.x,
					params['y' + (l - 1)] + params.y,
					params['x' + l] + params.x,
					params['y' + l] + params.y
				);
				// Check for jCanvas events
				_detectEvents($canvases[e], ctx, params);
				// Optionally close path
				_closePath($canvases[e], ctx, params);
			
			}
			
		}
	}
	return $canvases;
};

// Draw quadratic curve
$.fn.drawQuadratic = function drawQuadratic(args) {
	var $canvases = this, e, ctx,
		params, layer,
		l, lx, ly, lcx, lcy;

	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {

			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawQuadratic);
			if (params.visible) {
				
				_setGlobalProps($canvases[e], ctx, params);
				_transformShape($canvases[e], ctx, params, 0);
				
				// Draw each point
				l = 2;
				ctx.beginPath();
				ctx.moveTo(params.x1 + params.x, params.y1 + params.y);
				while (TRUE) {
					
					// Calculate next coordinates
					lx = params['x' + l];
					ly = params['y' + l];
					lcx = params['cx' + (l - 1)];
					lcy = params['cy' + (l - 1)];
					
					// If coordinates are given
					if (lx !== UNDEFINED && ly !== UNDEFINED && lcx !== UNDEFINED && lcy !== UNDEFINED) {
						
						// Draw next curve
						ctx.quadraticCurveTo(lcx + params.x, lcy + params.y, lx + params.x, ly + params.y);
						l += 1;
						
					} else {
						
						// Otherwise, stop drawing
						break;
						
					}
					
				}
				l -= 1;
				// Optionally add arrows to path
				_addArrows(
					$canvases[e],
					ctx,
					params,
					params.cx1 + params.x,
					params.cy1 + params.y,
					params.x1 + params.x,
					params.y1 + params.y,
					params['cx' + (l - 1)] + params.x,
					params['cy' + (l - 1)] + params.y,
					params['x' + l] + params.x,
					params['y' + l] + params.y
				);
				// Check for jCanvas events
				_detectEvents($canvases[e], ctx, params);
				// Optionally close path
				_closePath($canvases[e], ctx, params);
			
			}
		}
	}
	return $canvases;
};

// Draw Bezier curve
$.fn.drawBezier = function drawBezier(args) {
	var $canvases = this, e, ctx,
		params, layer,
		l , lc,
		lx, ly,
		lcx1, lcy1,
		lcx2, lcy2;

	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {

			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawBezier);
			if (params.visible) {
			
				_setGlobalProps($canvases[e], ctx, params);
				_transformShape($canvases[e], ctx, params, 0);
				
				// Draw each point
				l = 2;
				lc = 1;
				ctx.beginPath();
				ctx.moveTo(params.x1 + params.x, params.y1 + params.y);
				while (TRUE) {
					
					// Calculate next coordinates
					lx = params['x' + l];
					ly = params['y' + l];
					lcx1 = params['cx' + lc];
					lcy1 = params['cy' + lc];
					lcx2 = params['cx' + (lc + 1)];
					lcy2 = params['cy' + (lc + 1)];
					
					// If next coordinates are given
					if (lx !== UNDEFINED && ly !== UNDEFINED && lcx1 !== UNDEFINED && lcy1 !== UNDEFINED && lcx2 !== UNDEFINED && lcy2 !== UNDEFINED) {
						
						// Draw next curve
						ctx.bezierCurveTo(lcx1 + params.x, lcy1 + params.y, lcx2 + params.x, lcy2 + params.y, lx + params.x, ly + params.y);
						l += 1;
						lc += 2;
						
					} else {
						
						// Otherwise, stop drawing
						break;
						
					}
					
				}
				l -= 1;
				lc -= 2;
				// Optionally add arrows to path
				_addArrows(
					$canvases[e],
					ctx,
					params,
					params.cx1 + params.x,
					params.cy1 + params.y,
					params.x1 + params.x,
					params.y1 + params.y,
					params['cx' + (lc + 1)] + params.x,
					params['cy' + (lc + 1)] + params.y,
					params['x' + l] + params.x,
					params['y' + l] + params.y
				);
				// Check for jCanvas events
				_detectEvents($canvases[e], ctx, params);
				// Optionally close path
				_closePath($canvases[e], ctx, params);
			
			}
		}
	}
	return $canvases;
};

// Draw vector
$.fn.drawVector = function drawVector(args) {
	var $canvases = this, e, ctx,
		params, layer,
		l, angle, length,
		x, y, x2, y2, x3, y3, x4, y4;

	for (e = 0; e < $canvases.length; e += 1) {
		ctx = _getContext($canvases[e]);
		if (ctx) {

			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawVector);
			if (params.visible) {
			
				_setGlobalProps($canvases[e], ctx, params);
				_transformShape($canvases[e], ctx, params, 0);
				
				// Draw each point
				l = 1;
				ctx.beginPath();
				x = x3 = x4 = x2 = params.x;
				y = y3 = y4 = y2 = params.y;
				// The vector starts at the given (x, y) coordinates
				ctx.moveTo(params.x, params.y);
				while (TRUE) {
					
					angle = params['a' + l];
					length = params['l' + l];
					
					if (angle !== UNDEFINED && length !== UNDEFINED) {
						// Convert the angle to radians with 0 degrees starting at north
						angle *= params._toRad;
						angle -= (PI / 2);
						// Keep track of last two coordinates
						x3 = x4;
						y3 = y4;
						// Compute (x, y) coordinates from angle and length
						x4 += (length * cos(angle));
						y4 += (length * sin(angle));
						// Store the second point
						if (l === 1) {
							x2 = x4;
							y2 = y4;
						}
						ctx.lineTo(x4, y4);
						l += 1;
					} else {
						// Otherwise, stop drawing
						break;
					}
					
				}
				// Optionally add arrows to path
				_addArrows(
					$canvases[e],
					ctx, params,
					x2, y2,
					params.x, params.y,
					x3, y3,
					x4, y4
				);
				// Check for jCanvas events
				_detectEvents($canvases[e], ctx, params);
				// Optionally close path
				_closePath($canvases[e], ctx, params);
		
			}
		}
	}
	return $canvases;
};

/* Text API */

// Calculate font string and set it as the canvas font
function setCanvasFont(ctx, params) {
	// Otherwise, use the given font attributes
	if (!isNaN(Number(params.fontSize))) {
		// Give font size units if it doesn't have any
		params.fontSize += 'px';
	}
	// Set font using given font properties
	ctx.font = params.fontStyle + ' ' + params.fontSize + ' ' + params.fontFamily;
}

// Measure canvas text
function _measureText(canvas, ctx, params, lines) {
	var originalSize, curWidth, l;
	
	// Used cached width/height if possible
	if (propCache.text === params.text && propCache.fontStyle === params.fontStyle && propCache.fontSize === params.fontSize && propCache.fontFamily === params.fontFamily && propCache.maxWidth === params.maxWidth && propCache.lineHeight === params.lineHeight) {
				
		params.width = propCache.width;
		params.height = propCache.height;
		
	} else {
		// Calculate text dimensions only once
								
		// Calculate width of first line (for comparison)
		params.width = ctx.measureText(lines[0]).width;
		
		// Get width of longest line
		for (l = 1; l < lines.length; l += 1) {
			
			curWidth = ctx.measureText(lines[l]).width;
			// Ensure text's width is the width of its longest line
			if (curWidth > params.width) {
				params.width = curWidth;
			}
			
		}
		
		// Save original font size
		originalSize = canvas.style.fontSize;
		// Temporarily set canvas font size to retrieve size in pixels
		canvas.style.fontSize = params.fontSize;
		// Save text width and height in parameters object
		params.height = parseFloat($.css(canvas, 'fontSize')) * lines.length * params.lineHeight;
		// Reset font size to original size
		canvas.style.fontSize = originalSize;
	}
}

// Wrap a string of text within a defined width
function _wrapText(ctx, params) {
	var allText = params.text,
		// Maximum line width (optional)
		maxWidth = params.maxWidth,
		// Lines created by manual line breaks (\n)
		manualLines = allText.split('\n'),
		// All lines created manually and by wrapping
		allLines = [],
		// Other variables
		lines, line, l,
		text, words, w;
	
	// Loop through manually-broken lines
	for (l = 0; l < manualLines.length; l += 1) {
		
		text = manualLines[l];
		// Split line into list of words
		words = text.split(' ');
		lines = [];
		line = '';
		
		// If text is short enough initially
		// Or, if the text consists of only one word
		if (words.length === 1 || ctx.measureText(text).width < maxWidth) {
		
			// No need to wrap text
			lines = [text];
		
		} else {
		
			// Wrap lines
			for (w = 0; w < words.length; w += 1) {
			
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
				if (w !== (words.length - 1)) {
					line += ' ';
				}
			}
			// The last word should always be pushed
			lines.push(line);
		
		}
		// Remove extra space at the end of each line
		allLines = allLines.concat(
			lines
			.join('\n')
			.replace(/( (\n))|( $)/gi, '$2')
			.split('\n')
		);
		
	}
	
	return allLines;
}

// Draw text
$.fn.drawText = function drawText(args) {
	var $canvases = this, $canvas, e, ctx,
		params, layer,
		lines, l, x, y;

	for (e = 0; e < $canvases.length; e += 1) {
		$canvas = $($canvases[e]);
		ctx = _getContext($canvases[e]);
		if (ctx) {

			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawText);
			if (params.visible) {
				
				_setGlobalProps($canvases[e], ctx, params);
				
				// Set text-specific properties
				ctx.textBaseline = params.baseline;
				ctx.textAlign = params.align;
				
				// Set canvas font using given properties
				setCanvasFont(ctx, params);
										
				if (params.maxWidth !== NULL) {
					// Wrap text using an internal function
					lines = _wrapText(ctx, params);
				} else {
					// Convert string of text to list of lines
					lines = params.text
					.toString()
					.split('\n');
				}
								
				// Calculate text's width and height
				_measureText($canvases[e], ctx, params, lines);
				
				// If text is a layer
				if (args && params.layer) {
					// Copy calculated width/height to layer object
					args.width = params.width;
					args.height = params.height;
				}
				
				_transformShape($canvases[e], ctx, params, params.width, params.height);
				
				// Adjust text position to accomodate different horizontal alignments
				x = params.x;
				if (params.align === 'left') {
					if (params.respectAlign) {
						// Realign text to the left if chosen
						params.x += params.width / 2;
					} else {
						// Center text block by default
						x -= params.width / 2;
					}
				} else if (params.align === 'right') {
					if (params.respectAlign) {
						// Realign text to the right if chosen
						params.x -= params.width / 2;
					} else {
						// Center text block by default
						x += params.width / 2;
					}
				}
												
				// Draw each line of text separately
				for (l = 0; l < lines.length; l += 1) {
					
					ctx.shadowColor = params.shadowColor;
					// Add line offset to center point, but subtract some to center everything
					y = params.y + (l * params.height / lines.length) - ((lines.length - 1) * params.height / lines.length) / 2;
					
					// Fill & stroke text
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
					_detectEvents($canvases[e], ctx, params);
					// Close path and configure masking
					ctx.closePath();
				}
				_restoreTransform(ctx, params);
				
			}
		}
	}
	// Cache jCanvas parameters object for efficiency
	propCache = params;
	return $canvases;
};

// Measure text width/height using the given parameters
$.fn.measureText = function measureText(args) {
	var $canvases = this, ctx,
		params, lines;
	
	// Attempt to retrieve layer
	params = $canvases.getLayer(args);
	// If layer does not exist or if returned object is not a jCanvas layer
	if (!params || (params && !params._layer)) {
		params = new jCanvasObject(args);
	}
	
	ctx = _getContext($canvases[0]);
	if (ctx) {
	
		// Set canvas font using given properties
		setCanvasFont(ctx, params);
		// Calculate width and height of text
		lines = _wrapText(ctx, params);
		_measureText($canvases[0], ctx, params, lines);
		
		
	}

	return params;
};

/* Image API */

// Draw image
$.fn.drawImage = function drawImage(args) {
	var $canvases = this, canvas, e, ctx, data,
		params, layer,
		img, imgCtx, source;
		
	// Draw image function
	function draw(e, ctx, data, params, layer) {
		
		// Set global canvas properties
		_setGlobalProps($canvases[e], ctx, params);
		
		// If width and sWidth are not defined, use image width
		if (params.width === NULL && params.sWidth === NULL) {
			params.width = params.sWidth = img.width;
		}
		// If width and sHeight are not defined, use image height
		if (params.height === NULL && params.sHeight === NULL) {
			params.height = params.sHeight = img.height;
		}
		
		// Ensure image layer's width and height are accurate
		if (layer) {
			layer.width = params.width;
			layer.height = params.height;
		}
									
		// Only crop image if all cropping properties are given
		if (params.sWidth !== NULL && params.sHeight !== NULL && params.sx !== NULL && params.sy !== NULL) {
						
			// If width is not defined, use the given sWidth
			if (params.width === NULL) {
				params.width = params.sWidth;
			}
			// If height is not defined, use the given sHeight
			if (params.height === NULL) {
				params.height = params.sHeight;
			}
			
			// Optionally crop from top-left corner of region
			if (!params.cropFromCenter) {
				params.sx += params.sWidth / 2;
				params.sy += params.sHeight / 2;
			}
			
			// Ensure cropped region does not escape image boundaries
			
			// Top
			if ((params.sy - (params.sHeight / 2)) < 0) {
				params.sy = (params.sHeight / 2);
			}
			// Bottom
			if ((params.sy + (params.sHeight / 2)) > img.height) {
				params.sy = img.height - (params.sHeight / 2);
			}
			// Left
			if ((params.sx - (params.sWidth / 2)) < 0) {
				params.sx = (params.sWidth / 2);
			}
			// Right
			if ((params.sx + (params.sWidth / 2)) > img.width) {
				params.sx = img.width - (params.sWidth / 2);
			}
											
			// Position/transform image if necessary
			_transformShape($canvases[e], ctx, params, params.width, params.height);
			
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
			
		} else {
			// Show entire image if no crop region is defined
			
			// Position/transform image if necessary
			_transformShape($canvases[e], ctx, params, params.width, params.height);
						
			// Draw image on canvas
			ctx.drawImage(
				img,
				params.x - params.width / 2,
				params.y - params.height / 2,
				params.width,
				params.height
			);
			
		}
						
		// Draw invisible rectangle to allow for events and masking
		ctx.beginPath();
		ctx.rect(
			params.x - params.width / 2,
			params.y - params.height / 2,
			params.width,
			params.height
		);
		// Check for jCanvas events
		_detectEvents($canvases[e], ctx, params);
		// Close path and configure masking
		ctx.closePath();
		_restoreTransform(ctx, params);
		_enableMasking(ctx, data, params);
	}
	// On load function
	function onload(canvas, e, ctx, data, params, layer) {
		return function() {
			draw(e, ctx, data, params, layer);
			// Run callback function if defined
			if (params.load) {
				params.load.call(canvas, layer);
			}
			// Continue drawing successive layers after this image layer has loaded
			if (params.layer) {
				// Store list of previous masks for each layer
				params._args._masks = data.transforms.masks.slice(0);
				if (params._next) {
					// Draw successive layers
					$(canvas).drawLayers({
						clear: FALSE,
						resetFire: TRUE,
						index: params._next
					});
				}
			}
		};
	}
	for (e = 0; e < $canvases.length; e += 1) {
		canvas = $canvases[e];
		ctx = _getContext($canvases[e]);
		if (ctx) {

			data = _getCanvasData($canvases[e]);
			params = new jCanvasObject(args);
			layer = _addLayer($canvases[e], params, args, drawImage);
			if (params.visible) {
				
				// Cache the given source
				source = params.source;
	
				imgCtx = source.getContext;
				if (source.src || imgCtx) {
					// Use image or canvas element if given
					img = source;
				} else if (source) {
					if (imageCache[source] !== UNDEFINED) {
						// Get the image element from the cache if possible
						img = imageCache[source];
					} else {
						// Otherwise, get the image from the given source URL
						img = new Image();
						img.src = source;
						// Save image in cache for improved performance
						imageCache[source] = img;
					}
				}
						
				if (img) {
					if (img.complete || imgCtx) {
						// Draw image if already loaded
						onload(canvas, e, ctx, data, params, layer)();
					} else {
						// Otherwise, draw image when it loads
						$(img).bind('load', onload(canvas, e, ctx, data, params, layer));
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
$.fn.createPattern = function createPattern(args) {
	var $canvases = this, ctx,
		params,
		img, imgCtx,
		pattern, source;
		
	// Function to be called when pattern loads
	function onload() {
		// Create pattern
		pattern = ctx.createPattern(img, params.repeat);
		// Run callback function if defined
		if (params.load) {
			params.load.call($canvases[0], pattern);
		}
	}
	
	ctx = _getContext($canvases[0]);
	if (ctx) {
	
		params = new jCanvasObject(args);
	
		// Cache the given source
		source = params.source;
		
		// Draw when image is loaded (if load() callback function is defined)
		
		if (isFunction(source)) {
			// Draw pattern using function if given

			img = $('<canvas />')[0];
			img.width = params.width;
			img.height = params.height;
			imgCtx = _getContext(img);
			source.call(img, imgCtx);
			onload();
			
		} else {
			// Otherwise, draw pattern using source image
			
			imgCtx = source.getContext;
			if (source.src || imgCtx) {
				// Use image element if given
				img = source;
			} else {
				// Use URL if given to get the image
				img = new Image();
				img.src = source;
			}
			
			// Create pattern if already loaded
			if (img.complete || imgCtx) {
				onload();
			} else {
				$(img).bind('load', onload);
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
$.fn.createGradient = function createGradient(args) {
	var $canvases = this, ctx,
		params,
		gradient,
		stops = [], nstops,
		start, end,
		i, a, n, p;
	
	params = new jCanvasObject(args);
	ctx = _getContext($canvases[0]);
	if (ctx) {
		
		// Gradient coordinates must be numbers
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
		for (i = 1; params['c' + i] !== UNDEFINED; i += 1) {
			if (params['s' + i] !== UNDEFINED) {
				stops.push(params['s' + i]);
			} else {
				stops.push(NULL);
			}
		}
		nstops = stops.length;
		
		// Define start stop if not already defined
		if (stops[0] === NULL) {
			stops[0] = 0;
		}
		// Define end stop if not already defined
		if (stops[nstops - 1] === NULL) {
			stops[nstops - 1] = 1;
		}
		
		// Loop through color stops to fill in the blanks
		for (i = 0; i < nstops; i += 1) {
			// A progression, in this context, is defined as all of the color stops between and including two known color stops
			
			if (stops[i] !== NULL) {
				// Start a new progression if stop is a number
				
				// Number of stops in current progression
				n = 1;
				// Current iteration in current progression
				p = 0;
				start = stops[i];

				// Look ahead to find end stop
				for (a = (i + 1); a < nstops; a += 1) {
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
			
			} else if (stops[i] === NULL) {
				// Calculate stop if not initially given
				p += 1;
				stops[i] = start + (p * ((end - start) / n));
			}
			// Add color stop to gradient object
			gradient.addColorStop(stops[i], params['c' + (i + 1)]);
		}

	} else {
		gradient = NULL;
	}
	return gradient;
};

// Get pixels on the canvas
$.fn.setPixels = function setPixels(args) {
	var $canvases = this,
		canvas, e, ctx,
		params, layer,
		px,
		imgData, data, i, len;
	
	for (e = 0; e < $canvases.length; e += 1) {
		canvas = $canvases[e];
		ctx = _getContext(canvas);
		if (ctx) {
			
			params = new jCanvasObject(args);
			layer = _addLayer(canvas, params, args, setPixels);
			// Measure (x, y) from center of region by default
			_transformShape($canvases[e], ctx, params, params.width, params.height);
			
			// Use entire canvas of x, y, width, or height is not defined
			if (params.width === NULL || params.height === NULL) {
				params.width = canvas.width;
				params.height = canvas.height;
				params.x = params.width / 2;
				params.y = params.height / 2;
			}
			
			if (params.width !== 0 && params.height !== 0) {
				// Only set pixels if width and height are not zero
				
				imgData = ctx.getImageData(params.x - (params.width / 2), params.y - (params.height / 2), params.width, params.height);
				data = imgData.data;
				len = data.length;
				
				// Loop through pixels with the "each" callback function
				if (params.each) {
					for (i = 0; i < len; i += 4) {
						px = {
							r: data[i],
							g: data[i + 1],
							b: data[i + 2],
							a: data[i + 3]
						};
						params.each.call(canvas, px, params);
						data[i] = px.r;
						data[i + 1] = px.g;
						data[i + 2] = px.b;
						data[i + 3] = px.a;
					}
				}
				// Put pixels on canvas
				ctx.putImageData(imgData, params.x - (params.width / 2), params.y - (params.height / 2));
				ctx.restore();
			
			}
			
		}
	}
	return $canvases;
};

// Get canvas image as data URL
$.fn.getCanvasImage = function getCanvasImage(type, quality) {
	var canvas = this[0];
	// JPEG quality defaults to 1
	if (quality === UNDEFINED) {
		quality = 1;
	}
	return (canvas && canvas.toDataURL ? canvas.toDataURL('image/' + type, quality) : NULL);
};

// Scale canvas based on the device's pixel ratio
$.fn.detectPixelRatio = function detectPixelRatio(callback) {
	var $canvases = this,
		$canvas, canvas, e, ctx,
		devicePixelRatio, backingStoreRatio, ratio,
		oldWidth, oldHeight,
		data;
	
	for (e = 0; e < $canvases.length; e += 1) {
		// Get canvas and its associated data
		canvas = $canvases[e];
		$canvas = $($canvases[e]);
		ctx = _getContext(canvas);
		data = _getCanvasData($canvases[e]);
		
		// If canvas has not already been scaled with this method
		if (!data.scaled) {
			
			// Determine device pixel ratios
			devicePixelRatio = window.devicePixelRatio || 1;
			backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
				ctx.mozBackingStorePixelRatio ||
				ctx.msBackingStorePixelRatio ||
				ctx.oBackingStorePixelRatio ||
				ctx.backingStorePixelRatio || 1;
		
			// Calculate general ratio based on the two given ratios
			ratio = devicePixelRatio / backingStoreRatio;
			
			if (ratio !== 1) {
				// Scale canvas relative to ratio
				
				// Get the current canvas dimensions for future use
				oldWidth = canvas.width;
				oldHeight = canvas.height;

				// Resize canvas relative to the determined ratio
				canvas.width = oldWidth * ratio;
				canvas.height = oldHeight * ratio;
			
				// Scale canvas back to original dimensions via CSS
				canvas.style.width = oldWidth + 'px';
				canvas.style.height = oldHeight + 'px';
			
				// Scale context to counter the manual scaling of canvas
				ctx.scale(ratio, ratio);
			
			}
		
			// Set pixel ratio on canvas data object
			data.pixelRatio = ratio;
			// Ensure that this method can only be called once for any given canvas
			data.scaled = TRUE;
			
			// Call the given callback function with the ratio as its only argument
			if (callback) {
				callback.call(canvas, ratio);
			}
			
		}
		
	}
	return $canvases;
};

// Enable canvas feature detection with $.support
$.support.canvas = ($('<canvas />')[0].getContext);

// Export jCanvas functions
jCanvas.defaults = defaults;
jCanvas.transformShape = _transformShape;
jCanvas.detectEvents = _detectEvents;
jCanvas.closePath = _closePath;
jCanvas.getTouchEventName = _getTouchEventName;
$.jCanvas = jCanvas;

}(jQuery, document, Image, Math, parseFloat, true, false, null));
