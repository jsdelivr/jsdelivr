/*
 * Pixastic Lib - Edge detection filter - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.edges = {
	process : function(params) {

		var mono = !!(params.options.mono && params.options.mono != "false");
		var invert = !!(params.options.invert && params.options.invert != "false");

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			var c = -1/8;
			var kernel = [
				[c, 	c, 	c],
				[c, 	1, 	c],
				[c, 	c, 	c]
			];

			weight = 1/c;

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
	
					var r = ((dataCopy[offsetPrev-4]
						+ dataCopy[offsetPrev]
						+ dataCopy[offsetPrev+4]
						+ dataCopy[offset-4]
						+ dataCopy[offset+4]
						+ dataCopy[offsetNext-4]
						+ dataCopy[offsetNext]
						+ dataCopy[offsetNext+4]) * c
						+ dataCopy[offset]
						) 
						* weight;
	
					var g = ((dataCopy[offsetPrev-3]
						+ dataCopy[offsetPrev+1]
						+ dataCopy[offsetPrev+5]
						+ dataCopy[offset-3]
						+ dataCopy[offset+5]
						+ dataCopy[offsetNext-3]
						+ dataCopy[offsetNext+1]
						+ dataCopy[offsetNext+5]) * c
						+ dataCopy[offset+1])
						* weight;
	
					var b = ((dataCopy[offsetPrev-2]
						+ dataCopy[offsetPrev+2]
						+ dataCopy[offsetPrev+6]
						+ dataCopy[offset-2]
						+ dataCopy[offset+6]
						+ dataCopy[offsetNext-2]
						+ dataCopy[offsetNext+2]
						+ dataCopy[offsetNext+6]) * c
						+ dataCopy[offset+2])
						* weight;

					if (mono) {
						var brightness = (r*0.3 + g*0.59 + b*0.11)||0;
						if (invert) brightness = 255 - brightness;
						if (brightness < 0 ) brightness = 0;
						if (brightness > 255 ) brightness = 255;
						r = g = b = brightness;
					} else {
						if (invert) {
							r = 255 - r;
							g = 255 - g;
							b = 255 - b;
						}
						if (r < 0 ) r = 0;
						if (g < 0 ) g = 0;
						if (b < 0 ) b = 0;
						if (r > 255 ) r = 255;
						if (g > 255 ) g = 255;
						if (b > 255 ) b = 255;
					}

					data[offset] = r;
					data[offset+1] = g;
					data[offset+2] = b;

				} while (--x);
			} while (--y);

			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvasImageData();
	}
}