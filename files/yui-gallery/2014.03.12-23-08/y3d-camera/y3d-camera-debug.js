YUI.add('y3d-camera', function (Y, NAME) {

Y.Camera = Y.Base.create('camera', Y.y3d.Model, [], {
	initializer: function() {
		var instance = this;

		Y.on('keypress', Y.bind(instance._onKeyPress, instance));
		Y.on('mousewheel', Y.bind(instance._onMouseWheel, instance));
	},

	getInvertedMatrix: function() {
		var instance = this,
			val = instance.get('matrix'),
			matrix = Y.WebGLMatrix.mat4.create();

		Y.WebGLMatrix.mat4.set(val, matrix);

		Y.WebGLMatrix.mat4.inverse(matrix);

		return matrix;
	},

	_onKeyPress: function(event) {
		var instance = this,
			keys = instance.get('controls.keys'),
			distance = keys.distance,
			position = instance.get('position'),
			x = position.x,
			y = position.y;

		switch (event.keyCode) {
			case keys.up:
				instance.set('position.y', y + distance);

				break;

			case keys.right:
				instance.set('position.x', x + distance);

				break;

			case keys.down:
				instance.set('position.y', y - distance);

				break;

			case keys.left:
				instance.set('position.x', x - distance);

				break;
		}
	},

	_onMouseWheel: function(event) {
		var instance = this,
			distance = instance.get('controls.mouseWheelDistance'),
			z = instance.get('position.z');

		z = z - (event.wheelDelta * distance);

		instance.set('position.z', z);
	}
}, {
	ATTRS: {
		controls: {
			value: {
				keys: {
					up: 119,
					right: 100,
					down: 115,
					left: 97,
					distance: 0.3
				},

				mouseWheelDistance: 0.1
			}
		}
	}
});

}, 'gallery-2013.08.22-21-03', {"requires": ["event-key", "event-mousewheel", "y3d-model"]});
