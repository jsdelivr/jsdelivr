YUI.add('y3d-texture', function (Y, NAME) {

var Lang = Y.Lang;

Y.Texture = Y.Base.create('texture', Y.Base, [], {
}, {
	ATTRS: {
		image: {
			value: null
		},

		imageUrl: {
			value: '',
			validator: Lang.isString
		},

		webglTexture: {
			value: null
		}
	}
});
Y.TextureLoader = Y.Base.create('texture-loader', Y.Base, [], {
	initializer: function() {
		var instance = this,
			textures = instance.get('textures'),
			unloadedTextures = instance.get('unloadedTextures'),
			i, texture, image, imageUrl;

		for (i = 0; i < textures.length; i++) {
			texture = textures[i];
			image = new Image();
			imageUrl = texture.get('imageUrl');

			unloadedTextures[imageUrl] = texture;

			image.onload = Y.bind(instance._onLoad, instance, texture);

			image.src = imageUrl;

			texture.set('image', image);
		}
	},

	_isEmpty: function() {
		var instance = this,
			unloadedTextures = instance.get('unloadedTextures'),
			imageUrl;

		for (imageUrl in unloadedTextures) {
			if (unloadedTextures.hasOwnProperty(imageUrl)) {
				return false;
			}
		}

		return true;
	},

	_onLoad: function(texture) {
		var instance = this,
			imageUrl = texture.get('imageUrl'),
			onLoad = instance.get('onLoad'),
			unloadedTextures = instance.get('unloadedTextures');

		delete unloadedTextures[imageUrl];

		if (instance._isEmpty()) {
			onLoad();
		}
	}
}, {
	ATTRS: {
		onLoad: {
			value: null
		},

		textures: {
			value: [],
			validator: Lang.isArray
		},

		unloadedTextures: {
			value: {}
		}
	}
});

}, 'gallery-2013.08.22-21-03', {"requires": ["base-build"]});
