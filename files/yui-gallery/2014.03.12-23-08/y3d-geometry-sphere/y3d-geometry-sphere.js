YUI.add('y3d-geometry-sphere', function (Y, NAME) {

var Lang = Y.Lang;

Y.Sphere = Y.Base.create('sphere', Y.Geometry, [], {
	initializer: function() {
		var instance = this,
			heightBands = instance.get('heightBands'),
			indices = instance.get('indices'),
			textureCoordinates = instance.get('textureCoordinates'),
			radius = instance.get('radius'),
			vertices = instance.get('vertices'),
			widthBands = instance.get('widthBands'),
			i, j, theta, sinTheta, cosTheta, phi, sinPhi, cosPhi, x, y, z, u, v, first, second;
		
		for (i = 0; i <= heightBands; i++) {
			theta = i * Math.PI / heightBands;
			sinTheta = Math.sin(theta);
			cosTheta = Math.cos(theta);

			for (j = 0; j <= widthBands; j++) {
				phi = j * 2 * Math.PI / widthBands;
				sinPhi = Math.sin(phi);
				cosPhi = Math.cos(phi);

				x = cosPhi * sinTheta;
				y = cosTheta;
				z = sinPhi * sinTheta;

				vertices.push(radius * x);
				vertices.push(radius * y);
				vertices.push(radius * z);

				u = 1 - (j / widthBands);
				v = 1 - (i / heightBands);

				textureCoordinates.push(u);
				textureCoordinates.push(v);
			}
		}

		for (i = 0; i < heightBands; i++) {
			for (j = 0; j < widthBands; j++) {
				first = (i * (widthBands + 1)) + j;
				second = first + widthBands + 1;

				indices.push(first);
				indices.push(second);
				indices.push(first + 1);

				indices.push(second);
				indices.push(second + 1);
				indices.push(first + 1);
			}
		}
	}
}, {
	ATTRS: {
		heightBands: {
			value: 32,
			validator: Lang.isNumber
		},

		radius: {
			value: 1,
			validator: Lang.isNumber
		},

		widthBands: {
			value: 32,
			validator: Lang.isNumber
		}
	}
});

}, 'gallery-2013.08.22-21-03', {"requires": ["y3d-geometry-base"]});
