YUI.add('y3d-geometry-base', function (Y, NAME) {

var Lang = Y.Lang;

Y.Geometry = Y.Base.create('geometry', Y.y3d.Model, [], {
	_generateId: function() {
        return Math.floor(Math.random() * 16777215).toString(16);
    },

	_setColor: function(val) {
		var instance = this,
			vertices = (instance.get('vertices').length / 3),
			colorArray = [],
			i;

		if (Lang.isArray(val) && val.length === 3) {
			val.push(1.0);
		}
		else if (Lang.isString(val)) {
			val = Y.Color.normalizedColorArray(val);
		}

		for (i = 0; i < vertices; i++) {
			colorArray = colorArray.concat(val);
		}

		return colorArray;
	},

	_setTexture: function(val) {
		if (Lang.isString(val)) {
			val = new Y.Texture({'imageUrl': val});
		}

		return val;
	},

	_setWireframe: function(val) {
		var instance = this,
			lines = instance.get('lines'),
			indices = instance.get('indices'),
			i;

		if (val && (lines.length == 0)) {
			for (i = 0; i < indices.length; i = i + 3) {
				lines.push(indices[i]);
				lines.push(indices[i + 1]);
				lines.push(indices[i + 1]);
				lines.push(indices[i + 2]);
				lines.push(indices[i + 2]);
				lines.push(indices[i]);
			}

			instance.set('lines', lines);
		}

		return val;
	}
}, {
	ATTRS: {
		color: {
			value: 'white',
			setter: '_setColor',
			validator: function(value) {
				return Lang.isArray(value) || Lang.isString(value);
			}
		},

		id: {
			writeOnce: true,
			valueFn: '_generateId'
		},

		indices: {
			value: [],
			validator: Lang.isArray
		},

		lines: {
			value: [],
			validator: Lang.isArray
		},

		texture: {
			value: null,
			setter: '_setTexture'
		},

		textureCoordinates: {
			value: [],
			validator: Lang.isArray
		},

		vertices: {
			value: [],
			validator: Lang.isArray
		},

		wireframe: {
			value: false,
			setter: '_setWireframe',
			validator: Lang.isBoolean
		}
	}
});

}, 'gallery-2013.08.22-21-03', {"requires": ["y3d-model", "y3d-texture"]});
