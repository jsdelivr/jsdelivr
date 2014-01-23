var THREEx		= THREEx || {};

THREEx.SkyMap	= {};

THREEx.SkyMap.buildMesh	= function(urls, opts)
{
	// get parameters
	opts		= opts || {}
	var cubeSize	= opts.cubeSize !== undefined ? opts.cubeSize	: 100000;

	// load the cube textures
	var texture	= THREE.ImageUtils.loadTextureCube( urls );
	
	// init the cube shadder
	var shader	= THREE.ShaderUtils.lib["cube"];
	var uniforms	= THREE.UniformsUtils.clone( shader.uniforms );
	uniforms['tCube'].texture= textureCube;
	var material = new THREE.MeshShaderMaterial({
		fragmentShader	: shader.fragmentShader,
		vertexShader	: shader.vertexShader,
		uniforms	: uniforms
	});

	// build the geometry
	var geometry	= new THREE.CubeGeometry( cubeSize, cubeSize, cubeSize, 1, 1, 1, null, true );

	// build the skybox Mesh
	var mesh	= new THREE.Mesh( geometry, material );
	return mesh;
}

/**
 * Build the urls array for THREEx.SkyMap.buildMesh()
*/
THREEx.SkyMap.UrlsPosx	= function(prefix, extension)
{
	return [
		prefix + "posx" + extension,
		prefix + "negx" + extension,
		prefix + "posy" + extension,
		prefix + "negy" + extension,
		prefix + "posz" + extension,
		prefix + "negz" + extension
	];
	return urls;	
}

/**
 * Build the urls array for THREEx.SkyMap.buildMesh()
*/
THREEx.SkyMap.UrlsPx	= function(prefix, extension)
{
	return [
		prefix + "px" + extension,
		prefix + "nx" + extension,
		prefix + "py" + extension,
		prefix + "ny" + extension,
		prefix + "pz" + extension,
		prefix + "nz" + extension
	];
	return urls;	
}
