YUI.add('y3d-geometry-grid', function (Y, NAME) {

Y.Grid = Y.Base.create('grid', Y.Geometry, [], {
	initializer: function() {
		var instance = this,
			size = instance.get('size'),
			vertices = instance.get('vertices'),
			lines = instance.get('lines'),
			half = size / 2,
			x, y, z, i, index;

		for (i = 0; i <= size; i++) {
			index = 12 * i;

			x = half;
			y = 0;
			z = -half + i;
	
			vertices[index] = -x;
			vertices[index + 1] = y;
			vertices[index + 2] = z;

			vertices[index + 3] = x;
			vertices[index + 4] = y;
			vertices[index + 5] = z;

			x = -half + i;
			z = half;

			vertices[index + 6] = x;
			vertices[index + 7] = y;
			vertices[index + 8] = -z;

			vertices[index + 9] = x;
			vertices[index + 10] = y;
			vertices[index + 11] = z;

			index = 4 * i;

			lines[index] = index;
			lines[index + 1] = index + 1;

			lines[index + 2] = index + 2;
			lines[index + 3] = index + 3;
		}

		instance.set('color', 'white');
	}
}, {
	ATTRS: {
		size: {
			value: 12
		},

		wireframe: {
			value: true
		}
	}
});

}, 'gallery-2013.08.22-21-03', {"requires": ["y3d-geometry-base"]});
