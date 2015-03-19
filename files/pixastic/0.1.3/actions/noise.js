/*
 * Pixastic Lib - Noise filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.noise = {

	process : function(params) {
		var amount = 0;
		var strength = 0;
		var mono = false;

		if (typeof params.options.amount != "undefined")
			amount = parseFloat(params.options.amount)||0;
		if (typeof params.options.strength != "undefined")
			strength = parseFloat(params.options.strength)||0;
		if (typeof params.options.mono != "undefined")
			mono = !!(params.options.mono && params.options.mono != "false");

		amount = Math.max(0,Math.min(1,amount));
		strength = Math.max(0,Math.min(1,strength));

		var noise = 128 * strength;
		var noise2 = noise / 2;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;
			var random = Math.random;

			do {
				var offsetY = (y-1)*w4;
				var x = w;
				do {
					var offset = offsetY + (x-1)*4;
					if (random() < amount) {
						if (mono) {
							var pixelNoise = - noise2 + random() * noise;
							var r = data[offset] + pixelNoise;
							var g = data[offset+1] + pixelNoise;
							var b = data[offset+2] + pixelNoise;
						} else {
							var r = data[offset] - noise2 + (random() * noise);
							var g = data[offset+1] - noise2 + (random() * noise);
							var b = data[offset+2] - noise2 + (random() * noise);
						}

						if (r < 0 ) r = 0;
						if (g < 0 ) g = 0;
						if (b < 0 ) b = 0;
						if (r > 255 ) r = 255;
						if (g > 255 ) g = 255;
						if (b > 255 ) b = 255;

						data[offset] = r;
						data[offset+1] = g;
						data[offset+2] = b;
					}
				} while (--x);
			} while (--y);
			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvasImageData();
	}
}

