YUI.add('y3d-light', function (Y, NAME) {

var Lang = Y.Lang;

Y.Light = Y.Base.create('light', Y.Base, [], {
	_setColor: function(value) {
		if (Lang.isString(value)) {
			value = Y.Color.normalizedColorArray(value);
		}

		return value;
	}
}, {
	ATTRS: {
		color: {
			value: 'white',
			setter: '_setColor'
		},

		direction: {
			value: [0, 0, 0]
		}
	}
});

}, 'gallery-2013.08.15-00-45', {"requires": ["base-build", "y3d-color"]});
