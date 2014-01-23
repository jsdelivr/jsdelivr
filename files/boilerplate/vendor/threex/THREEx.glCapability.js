/**
 * Define namespace
*/
if(typeof THREEx === "undefined")	var THREEx	= {};


/**
 * return the capability of a WebGl context
 *
 * TODO to rewrite
 * - heavily wased on webglreport on sourceforge
 * - is there other/better properties
 * - should i get a more readable output ?
 *   - another function ?
 *
 * @param {WebGLRenderingContext} webgl context
 * @returns {Object} capabilities
*/
THREEx.glCapability	= function(gl)
{
	// sanity check - gl context MUST BE WebGLRenderingContext
	console.assert(gl instanceof WebGLRenderingContext)
	// TODO find better names
	var prout	= ['VERSION', 'SHADING_LANGUAGE_VERSION', 'VENDOR', 'RENDERER'];
	var pixDepth	= ['RED_BITS', 'GREEN_BITS', 'BLUE_BITS', 'ALPHA_BITS', 'DEPTH_BITS', 'STENCIL_BITS'];
	var slota	= ['MAX_RENDERBUFFER_SIZE', 'MAX_COMBINED_TEXTURE_IMAGE_UNITS', 'MAX_CUBE_MAP_TEXTURE_SIZE'
				, 'MAX_FRAGMENT_UNIFORM_VECTORS', 'MAX_TEXTURE_IMAGE_UNITS'
				, 'MAX_TEXTURE_SIZE', 'MAX_VERTEX_ATTRIBS'
				, 'MAX_VERTEX_ATTRIBS', 'MAX_VERTEX_TEXTURE_IMAGE_UNITS'
				, 'MAX_VERTEX_UNIFORM_VECTORS'];	
	var sloti	= ['ALIASED_LINE_WIDTH_RANGE', 'ALIASED_POINT_SIZE_RANGE', 'MAX_VIEWPORT_DIMS'];
	
	var info	= {};
	var collect	= function(arr){
		arr.forEach(function(parameter){
			//console.log('parameter', parameter)
			info[parameter]	= gl.getParameter(gl[parameter])
		})
	}
	
	collect(prout);
	collect(pixDepth);
	collect(slota);
	collect(sloti)
	
	// special case to get the extensions
	info['SUPPORTED_EXTENSIONS']	= gl.getSupportedExtensions()
	
	//console.log("info");
	//console.dir(info)
	return info;
}
