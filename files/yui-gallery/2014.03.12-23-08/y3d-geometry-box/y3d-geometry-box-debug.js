YUI.add('y3d-geometry-box', function (Y, NAME) {

Y.Box = Y.Base.create('box', Y.Geometry, [], {
	initializer: function() {
		var instance = this,
			depth = instance.get('depth'),
			height = instance.get('height'),
			vertices = instance.get('vertices'),
			width = instance.get('width'),
			x = width / 2,
			y = height / 2,
			z = depth / 2,
			i, mod;

		for (i = 0; i < vertices.length; i++) {
			mod = i % 3;

			if (mod === 0) {
				vertices[i] = vertices[i] * x;
			}
			else if (mod === 1) {
				vertices[i] = vertices[i] * y;
			}
			else if (mod === 2) {
				vertices[i] = vertices[i] * z;
			}
		}
	}
}, {
	ATTRS: {
		depth: {
			value: 2
		},

		height: {
			value: 2
		},

		indices: {
			value: [
				0, 1, 2, 0, 2, 3,    // Front face
				4, 5, 6, 4, 6, 7,    // Back face
				8, 9, 10, 8, 10, 11,  // Top face
				12, 13, 14, 12, 14, 15, // Bottom face
				16, 17, 18, 16, 18, 19, // Right face
				20, 21, 22, 20, 22, 23  // Left face
			]
		},

		textureCoordinates: {
			value: [
				// Front face
				0, 0,
				1, 0,
				1, 1,
				0, 1,

				// Back face
				1, 0,
				1, 1,
				0, 1,
				0, 0,

				// Top face
				0, 1,
				0, 0,
				1, 0,
				1, 1,

				// Bottom face
				1, 1,
				0, 1,
				0, 0,
				1, 0,

				// Right face
				1, 0,
				1, 1,
				0, 1,
				0, 0,

				// Left face
				0, 0,
				1, 0,
				1, 1,
				0, 1
			]
		},

		vertices: {
			value: [
				// Front face
				-1, -1,	1,
				1,  -1,	1,
				1,   1,	1,
				-1,  1,	1,

				// Back face
				-1, -1,	-1,
				-1,  1,	-1,
				1,   1,	-1,
				1,  -1, -1,

				// Top face
				-1,	1, -1,
				-1,	1,  1,
				1,  1,  1,
				1,  1, -1,

				// Bottom face
				-1, -1, -1,
				1,  -1, -1,
				1,  -1,  1,
				-1, -1,  1,

				// Right face
				1, -1, -1,
				1,  1, -1,
				1,  1,  1,
				1, -1,  1,

				// Left face
				-1, -1, -1,
				-1, -1,  1,
				-1,  1,  1,
				-1,  1, -1
			]
		},

		width: {
			value: 2
		}
	}
});

}, 'gallery-2013.08.22-21-03', {"requires": ["y3d-geometry-base"]});
