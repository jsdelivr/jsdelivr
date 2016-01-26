var Noisy = new Class({
	Implements: Options,

	options: {
		// How many percent of the image that is filled with noise,
		//   represented by a number between 0 and 1 inclusive
		intensity:          0.9,

		// The width and height of the image in pixels
		size:               200,

		// The maximum noise particle opacity,
		//   represented by a number between 0 and 1 inclusive
		opacity:            0.08,

		// A string linking to the image used if there's no canvas support
		fallback:           '',

		// Specifies wheter the particles are grayscale or colorful
		monochrome:         false
	},

	initialize: function(element, options){
		element = this.element = document.id(element);
		if (!element) return false;

		options && this.setOptions(options);
	},

	noisify: function(uri){
		var options = this.options,
			fallback = options.fallback,
			intensity = options.intensity,
			size = options.size,
			opacity = options.opacity;

		if (uri != undefined) uri = this.getCachedUri( this.options );

		if (!uri){
			if (!this.hasCanvas()){
				uri = this.options.fallback;
			} else {
				var canvas = this.getCanvas(),
					ctx = canvas.getContext('2d'),
					imgData,
					numPixels = this.getPixelIntensity(intensity, size),
					maxAlpha = this.getMaxAlpha(opacity);

				canvas.width = canvas.height = size;

				imgData = ctx.createImageData( size, size );

				// Add color to random pixels in the canvas
				this.randomizeImageData(imgData, numPixels, maxAlpha);

				uri = canvas.toDataURL('image/png');

				// In IE < 9 Data URI's are only displayed if they are < 32KB
				// Though IE < 9 doesn't officially support the canvas element,
				// certain scripts like excanvas.js will enable it and if the URI is > 32KB it won't be displayed
				if (uri.indexOf('data:image/png') != 0 || // toDataURL doesn't return anything in Android 2.2
				    Browser.ie &&
				    Browser.version < 9 &&
				    uri.length > 32768) {
					uri = fallback;
				}

			}

			this.setCachedUri(options, uri);
		}

		this.element.setStyle('background-image', 'url(' + uri + ')');

		return this;
	},

	bitwiseRandomize: function(a){
		return ~~(Math.random() * a);
	},

	updateCanvas: function(imgData){
		var canvas = this.getCanvas(),
			ctx = canvas.getContext('2d');

		ctx.putImageData(imgData, 0, 0);

		return this;
	},

	randomizeImageData: function(imgData, numPixels, maxAlpha){
		var canvas = this.getCanvas(),
			ctx = canvas.getContext('2d'),
			monochrome = this.options.monochrome;

		if (ctx) {
			while (numPixels--) { // Read about the double bitwise NOT trick here: goo.gl/6DPpt
				var x = this.bitwiseRandomize(canvas.width),
				    y = this.bitwiseRandomize(canvas.height),
				    index = (x + y * imgData.width) * 4,
				    colorChannel = numPixels % 255; // This will look random enough

				imgData.data[index  ] = colorChannel;											// red
				imgData.data[index+1] = monochrome ? colorChannel : this.bitwiseRandomize(255);	// green
				imgData.data[index+2] = monochrome ? colorChannel : this.bitwiseRandomize(255);	// blue
				imgData.data[index+3] = this.bitwiseRandomize(maxAlpha);						// alpha
			}

			this.updateCanvas(imgData);
		}

		return this;
	},

	getPixelIntensity: function(a, b){
		return Math.round( a * Math.pow( b, 2 ) );
	},

	getMaxAlpha: function(a){
		return 255 * a;
	},

	setCachedUri: function(options, uri){
		this.hasLocalStorage() && localStorage.setItem(JSON.encode(options), uri);

		return this;
	},

	getCachedUri: function(options){
		return this.hasLocalStorage() ? localStorage.getItem(JSON.encode(options)) : false;
	},

	hasLocalStorage: function(){
		try {
			localStorage.setItem('a', 'a');
			localStorage.removeItem('a');
			return true;
		} catch(e) {
			return false;
		}
	},

	setCanvas: function(){
		this.canvas = document.createElement('canvas');

		return this;
	},

	getCanvas: function(){
		var canvas = this.canvas;
		if (!canvas) {
			this.setCanvas();
			canvas = this.canvas;
		}

		return canvas;
	},

	hasCanvas: function(){
		return !!this.getCanvas();
	}


});

// Element set and get property methods for Noisy
Element.Properties.noisy = {

	set: function(options){
		var noisy = this.get('noisy');
		noisy.setOptions(options);
		return this;
	},

	get: function(){
		var noisy = this.retrieve('noisy', new Noisy(this));
		return noisy;
	}

};

// Element shortcut to Noisy-ify
Element.implement({
	noisify: function(uri){
		this.get('noisy').noisify(uri);
		return this;
	}
});