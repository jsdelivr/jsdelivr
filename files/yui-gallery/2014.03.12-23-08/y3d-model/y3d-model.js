YUI.add('y3d-model', function (Y, NAME) {

Y.namespace('y3d').Model = Y.Base.create('model', Y.Base, [], {
	initializer: function() {
		var instance = this;

		instance._updateMatrix();

		instance.after('positionChange', instance._updateMatrix);
		instance.after('rotationChange', instance._updateMatrix);
	},

	_setPosition: function(val) {
		var instance = this,
			position = instance.get('position') || {x: 0, y: 0, z: 0};

		position.x = (val.x !== undefined) ? val.x : position.x;
		position.y = (val.y !== undefined) ? val.y : position.y;
		position.z = (val.z !== undefined) ? val.z : position.z;

		return position;
	},

	_setRotation: function(val) {
		var instance = this,
			rotation = instance.get('rotation') || {x: 0, y: 0, z: 0};

		rotation.x = (val.x !== undefined) ? val.x : rotation.x;
		rotation.y = (val.y !== undefined) ? val.y : rotation.y;
		rotation.z = (val.z !== undefined) ? val.z : rotation.z;

		return rotation;
	},

	_updateMatrix: function() {
		var instance = this,
			matrix = Y.WebGLMatrix.mat4.create(),
			position = instance.get('position'),
			rotation = instance.get('rotation');

		Y.WebGLMatrix.mat4.identity(matrix);

		instance.set('matrix', matrix);

		Y.WebGLMatrix.mat4.translate(matrix, [position.x, position.y, position.z]);

		Y.WebGLMatrix.mat4.rotateX(matrix, (rotation.x * (Math.PI / 180)));
		Y.WebGLMatrix.mat4.rotateY(matrix, (rotation.y * (Math.PI / 180)));
		Y.WebGLMatrix.mat4.rotateZ(matrix, (rotation.z * (Math.PI / 180)));
	}
}, {
	ATTRS: {
		matrix: {
			value: null
		},

		position: {
			value: {
				x: 0,
				y: 0,
				z: 0
			},
			setter: '_setPosition'
		},

		rotation: {
			value: {
				x: 0,
				y: 0,
				z: 0
			},
			setter: '_setRotation'
		}
	}
});

}, 'gallery-2013.08.22-21-03', {"requires": ["base-build", "y3d-matrix"]});
