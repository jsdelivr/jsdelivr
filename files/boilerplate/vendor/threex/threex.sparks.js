// This THREEx helper makes it even easier to use spark.js with three.js
// * FIXME This is currently only with WebGL

// 
// # Code

//

var THREEx	= THREEx 	|| {};


THREEx.Sparks	= function(opts)
{
	opts		= opts	|| {};
	this._maxParticles = opts.maxParticles	|| console.assert(false);
	this._texture	= opts.texture	|| this._buildDefaultTexture();
	var counter	= opts.counter	|| console.assert(false);
	
	var vertexIndexPool = {
		__pools: [],
		// Get a new Vector
		get: function() {
			if( this.__pools.length > 0 )	return this.__pools.pop();
			console.assert(false, "pool ran out!")
			return null;
		},
		// Release a vector back into the pool
		add: function(v){ this.__pools.push(v);	}
	};
	
	
	var particles	= new THREE.Geometry();
	var vertices	= particles.vertices;
	for ( i = 0; i < this._maxParticles; i++ ) {
		var position	= new THREE.Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		vertices.push(new THREE.Vertex(position));
		vertexIndexPool.add(i);
	}

	// to handle window resize
	this._$onWindowResize	= this._onWindowResize.bind(this);
	window.addEventListener('resize', this._$onWindowResize, false);

	var attributes	= this._attributes	= {
		size	: { type: 'f', value: [] },
		aColor	: { type: 'c', value: [] }
	};

	var uniforms	= this._uniforms	= {
		texture		: { type: "t", texture: this._texture 		},
		color		: { type: "c", value: new THREE.Color(0xffffff)	},
		sizeRatio	: { type: "f", value: this._computeSizeRatio()	}
	};

	// fill attributes array
	var valuesSize	= this._attributes.size.value;
	var valuesColor	= this._attributes.aColor.value;
	for(var v = 0; v < particles.vertices.length; v++ ){
		valuesSize[v]	= 99;
		valuesColor[v]	= new THREE.Color( 0x000000 );
	}
	
	var material	= new THREE.ShaderMaterial( {
		uniforms	: this._uniforms,
		attributes	: this._attributes,
		vertexShader	: THREEx.Sparks.vertexShaderText,
		fragmentShader	: THREEx.Sparks.fragmentShaderText,

		blending	: THREE.AdditiveBlending,
		depthWrite	: false,
		transparent	: true
	});

	this._group	= new THREE.ParticleSystem( particles, material );
	//this._group.dynamic		= true;
	//this._group.sortParticles	= true;	// TODO is this needed ?	

	//// EMITTER STUFF

	var setTargetParticle = function() {					
		var vertexIdx	= vertexIndexPool.get();
		var target	= {
			vertexIdx	: vertexIdx,
			size		: function(value){ valuesSize[vertexIdx] = value;	},
			color		: function(){ return valuesColor[vertexIdx];		}
		};
		return target;
	};


	var onParticleCreated = function(particle) {
		var vertexIdx	= particle.target.vertexIdx;
		// copy particle position into three.js geometry
		vertices[vertexIdx].position	= particle.position;						
	};
	
	var onParticleDead = function(particle) {
		var vertexIdx	= particle.target.vertexIdx;

		// Hide the particle
		valuesColor[vertexIdx].setHex( 0x000000 );
		vertices[vertexIdx].position.set(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		
		// Mark particle system as available by returning to pool
		vertexIndexPool.add( vertexIdx );
	};
	
	var emitter	= this._emitter	= new SPARKS.Emitter(counter);

	emitter.addInitializer(new SPARKS.Target(null, setTargetParticle));
	emitter.addCallback("created"	, onParticleCreated	);
	emitter.addCallback("dead"	, onParticleDead	);
}


THREEx.Sparks.prototype.destroy	= function()
{
	window.removeEventListener('resize', this._$onWindowResize);

	if( this._emitter.isRunning() )	this._emitter.stop();
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

THREEx.Sparks.prototype.container	= function()
{
	return this._group;
}

THREEx.Sparks.prototype.emitter		= function()
{
	return this._emitter;
}

THREEx.Sparks.prototype.update	= function()
{
	this._group.geometry.__dirtyVertices	= true;
	this._group.geometry.__dirtyColors	= true;
	this._attributes.size.needsUpdate	= true;
	this._attributes.aColor.needsUpdate	= true;
}

//////////////////////////////////////////////////////////////////////////////////
//		handle window resize						//
//////////////////////////////////////////////////////////////////////////////////

THREEx.Sparks.prototype._onWindowResize	= function()
{
	this._uniforms.sizeRatio.value	= this._computeSizeRatio();
	this._uniforms.sizeRatio.needsUpdate	= true;
}


THREEx.Sparks.prototype._computeSizeRatio	= function()
{
	return window.innerHeight / 1024;
}


//////////////////////////////////////////////////////////////////////////////////
//		Shader Text							//
//////////////////////////////////////////////////////////////////////////////////

THREEx.Sparks.vertexShaderText	= [
	"attribute	float	size;",
	"attribute	vec4	aColor;",
	
	"uniform	float	sizeRatio;",

	"varying	vec4	vColor;",

	"void main() {",
		"vec4 mvPosition= modelViewMatrix * vec4( position, 1.0 );",
		"gl_PointSize	= size * sizeRatio * ( 150.0 / length( mvPosition.xyz ) );",
		"gl_Position	= projectionMatrix * mvPosition;",

		"vColor		= aColor;",
	"}"
].join('\n');
THREEx.Sparks.fragmentShaderText	= [
	"uniform vec3		color;",
	"uniform sampler2D	texture;",

	"varying vec4		vColor;",
	
	"void main() {",
		"vec4 outColor	= texture2D( texture, gl_PointCoord );",
		"gl_FragColor	= outColor * vec4( color * vColor.xyz, 1.0 );",
	"}"
].join('\n');

//////////////////////////////////////////////////////////////////////////////////
//		Texture								//
//////////////////////////////////////////////////////////////////////////////////

THREEx.Sparks.prototype._buildDefaultTexture	= function(size)
{
	size		= size || 128;
	var canvas	= document.createElement( 'canvas' );
	var context	= canvas.getContext( '2d' );
	canvas.width	= canvas.height	= size;
	
	var gradient	= context.createRadialGradient( canvas.width/2, canvas.height /2, 0, canvas.width /2, canvas.height /2, canvas.width /2 );				
	gradient.addColorStop( 0  , 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.2, 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.4, 'rgba(128,128,128,1)' );
	gradient.addColorStop( 1  , 'rgba(0,0,0,1)' );

	context.beginPath();
	context.arc(size/2, size/2, size/2, 0, Math.PI*2, false);
	context.closePath();
	
	context.fillStyle	= gradient;
	//context.fillStyle	= 'rgba(128,128,128,1)';
	context.fill();
			
	var texture	= new THREE.Texture( canvas );
	texture.needsUpdate = true;
	
	return texture;
}

//////////////////////////////////////////////////////////////////////////////////
//		Custom initializer TODO put it elsewhere			//
//////////////////////////////////////////////////////////////////////////////////

THREEx.Sparks.ColorSizeInitializer	= function(color, size){
	this._color	= color;
	this._size	= size;
}
THREEx.Sparks.ColorSizeInitializer.prototype.initialize	= function(emitter, particle)
{
	if( this._color !== undefined )	particle.target.color().copy(this._color);
	if( this._size !== undefined )	particle.target.size(this._size);
}
