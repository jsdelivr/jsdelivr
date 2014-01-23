// define namespaces
var THREEx		= THREEx || {};
THREEx.ShaderLib	= THREEx.ShaderLib	|| {};
THREEx.UniformsLib	= THREEx.UniformsLib	|| {};

THREEx.UniformsLib['plasma']	= {
	time	: { type : "f", value:  0.0 },
	scale	: { type : "f", value:  1.0 },
	rotation: { type : "f", value:  0.0 },
	opacity	: { type : "f", value:  1.0 },

	c0	: { type : "f", value:  5.0 },
	c1	: { type : "f", value:  3.0 },
	c2	: { type : "f", value: 11.0 },
	c3	: { type : "f", value:  7.0 },
	c4	: { type : "f", value:  9.0 },
	c5	: { type : "f", value:  3.0 }	
};

THREEx.ShaderLib['plasma']	= {
	vertexShader:	[
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",
		"varying vec2 vUv;",
		"void main(){",
			"vUv	= uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);",
		"}"
	].join( "\n" ),
	fragmentShader: [
		"#ifdef GL_ES",
			"precision highp float;",
		"#endif",
		
		"varying vec2 vUv;",
		"uniform float time;",
		"uniform float scale;",
		"uniform float rotation;",
		"uniform float opacity;",
		"uniform float c0, c1, c2, c3, c4, c5;",

		// todo zoom and rotation of vec2 point
		"vec2 rotoZoom(const vec2 point, const float scale, const float rotation){",
			"vec2 tmp;",
			"tmp.x		= point.x * cos(rotation) - point.y * sin(rotation);",
			"tmp.y		= point.x * sin(rotation) + point.y * cos(rotation);",
			"tmp		= tmp * scale;",
			"return tmp;",
		"}",
		
		// based on THREE.Color.setHSV()
		// based on Mads Elvheim / Madsy http://code.google.com/p/opengl3-freenode/wiki/ColorSpaceConversions
		"vec3 HSVtoRGB(const vec3 color){",
			"float h	= color.r;",
			"float s	= color.g;",
			"float v	= color.b;",

			"float i	= floor(h * 6.0);",
			"float f	= (h * 6.0) - i;",
			"float p	= v * (1.0 - s);",
			"float q	= v * (1.0 - f * s);",
			"float t	= v * (1.0 - (1.0 - f) * s);",

			"vec3 result;",
			"if( i < 1.0 )		result = vec3(v,t,p);",
			"else if( i < 2.0 )	result = vec3(q,v,p);",
			"else if( i < 3.0 )	result = vec3(p,v,t);",
			"else if( i < 4.0 )	result = vec3(p,q,v);",
			"else if( i < 5.0 )	result = vec3(t,p,v);",
			"else if( i < 6.0 )	result = vec3(v,p,q);",
			"else 			result = vec3(v,t,p);",

			"return result;",
		"}",
		// default value
		"#ifndef ROTOZOOM",
			"#define ROTOZOOM 1",
		"#endif",
		"#ifndef USEHSV",
			"#define USEHSV 1",
		"#endif",
		
		"void main(){",
			"vec2 p		= -1.0 + 2.0 * vUv;",
			"#if ROTOZOOM",
				"p 	= rotoZoom(p, scale, rotation);",
			"#endif",

			"float cossin1	= cos(p.x*c0+sin(time*1.3)) - sin(p.y*c3-cos(time)) + sin(time);",
			"float cossin2	= cos(p.y*c1+cos(c1*time/c4)) * sin(p.x*c4*sin(time)) - cos(time);",
			"float cossin3	= cos(p.x*c2+sin(c2*time/c5)) + sin(p.y*c5+cos(time)) + cos(time);",
			//"vec3 color	= vec3(abs(cossin1*sin(p.x)), cossin2*sin(p.y), cossin3*sin(p.x));",
			"vec3 color	= vec3(abs(cossin1*sin(p.x)), 0.6 - 0.4* abs(cossin2*sin(p.y)), 0.5 - 0.3*(cossin3*sin(p.x)));",

			"#if USEHSV",
				"color	= HSVtoRGB(color);",
			"#endif",

			"gl_FragColor	= vec4(color, opacity);",
			//"gl_FragColor	= vec4(cossin1*sin(p.x), cossin2*sin(p.y), cossin3*sin(p.x), opacity);",
		"}"
	].join( "\n" )
};
