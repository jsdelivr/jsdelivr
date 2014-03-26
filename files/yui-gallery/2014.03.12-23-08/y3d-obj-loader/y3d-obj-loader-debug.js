YUI.add('y3d-obj-loader', function (Y, NAME) {

var Lang = Y.Lang;

Y.ObjLoader = Y.Base.create('obj-loader', Y.Base, [], {
	load: function() {
		var instance = this,
			geometry = instance.get('geometry'),
			src = instance.get('src'),
			lines = src.split('\n'),
			i, line, values;

		for (i = 0; i < lines.length; i++) {
			line = lines[i].trim();
			values = line.split(/\s+/);

			if (line.indexOf('f ') === 0) {
				instance._parseFace(geometry, values);
			}
			else if (line.indexOf('v ') === 0) {
				instance._parseVertice(geometry, values);
			}
		}

		geometry.set('color', 'white');

		return geometry;
	},

	_parseFace: function(geometry, values) {
		var instance = this,
			indices = geometry.get('indices'),
			i1 = instance._parseIndex(values[1]),
			i2 = instance._parseIndex(values[2]),
			i3 = instance._parseIndex(values[3]),
			i4;

		if (values.length === 4) {
			indices.push(i1, i2, i3);
		}
		else if (values.length === 5) {
			i4 = instance._parseIndex(values[4]);

			indices.push(i1, i2, i3, i1, i3, i4);
		}
	},

	_parseIndex: function(value) {
		var index = value.split(/\//)[0];

		index = parseInt(index, 10) - 1;

		return index;
	},

	_parseVertice: function(geometry, values) {
		var vertices = geometry.get('vertices'),
			v1 = parseFloat(values[1], 10),
			v2 = parseFloat(values[2], 10),
			v3 = parseFloat(values[3], 10);

		vertices.push(v1, v2, v3);
	}
}, {
	ATTRS: {
		geometry: {
			value: new Y.Geometry()
		},

		src: {
			value: '',
			validator: Lang.isString
		}
	}
});

}, 'gallery-2013.09.04-21-56', {"requires": ["y3d-geometry-base"]});
