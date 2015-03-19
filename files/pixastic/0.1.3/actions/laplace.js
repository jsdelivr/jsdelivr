/*
 * Pixastic Lib - Laplace filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.laplace = {
	process : function(params) {

		var strength = 1.0;
		var invert = !!(params.options.invert && params.options.invert != "false");
		var contrast = parseFloat(params.options.edgeStrength)||0;

		var greyLevel = parseInt(params.options.greyLevel)||0;

		contrast = -contrast;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			var kernel = [
				[-1, 	-1, 	-1],
				[-1, 	8, 	-1],
				[-1, 	-1, 	-1]
			];

			var weight = 1/8;

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;

				var nextY = (y == h) ? y - 1 : y;
				var prevY = (y == 1) ? 0 : y-2;

				var offsetYPrev = prevY*w*4;
				var offsetYNext = nextY*w*4;

				var x = w;
				do {
					var offset = offsetY + (x*4-4);

					var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x-2) * 4;
					var offsetNext = offsetYNext + ((x == w) ? x-1 : x) * 4;
	
					var r = ((-dataCopy[offsetPrev-4]
						- dataCopy[offsetPrev]
						- dataCopy[offsetPrev+4]
						- dataCopy[offset-4]
						- dataCopy[offset+4]
						- dataCopy[offsetNext-4]
						- dataCopy[offsetNext]
						- dataCopy[offsetNext+4])
						+ dataCopy[offset] * 8) 
						* weight;
	
					var g = ((-dataCopy[offsetPrev-3]
						- dataCopy[offsetPrev+1]
						- dataCopy[offsetPrev+5]
						- dataCopy[offset-3]
						- dataCopy[offset+5]
						- dataCopy[offsetNext-3]
						- dataCopy[offsetNext+1]
						- dataCopy[offsetNext+5])
						+ dataCopy[offset+1] * 8)
						* weight;
	
					var b = ((-dataCopy[offsetPrev-2]
						- dataCopy[offsetPrev+2]
						- dataCopy[offsetPrev+6]
						- dataCopy[offset-2]
						- dataCopy[offset+6]
						- dataCopy[offsetNext-2]
						- dataCopy[offsetNext+2]
						- dataCopy[offsetNext+6])
						+ dataCopy[offset+2] * 8)
						* weight;

					var brightness = ((r + g + b)/3) + greyLevel;

					if (contrast != 0) {
						if (brightness > 127) {
							brightness += ((brightness + 1) - 128) * contrast;
						} else if (brightness < 127) {
							brightness -= (brightness + 1) * contrast;
						}
					}
					if (invert) {
						brightness = 255 - brightness;
					}
					if (brightness < 0 ) brightness = 0;
					if (brightness > 255 ) brightness = 255;

					data[offset] = data[offset+1] = data[offset+2] = brightness;

				} while (--x);
			} while (--y);

			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvasImageData();
	}
}

