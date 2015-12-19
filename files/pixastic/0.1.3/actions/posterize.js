/*
 * Pixastic Lib - Posterize effect - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.posterize = {

	process : function(params) {

		
		var numLevels = 256;
		if (typeof params.options.levels != "undefined")
			numLevels = parseInt(params.options.levels,10)||1;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);

			numLevels = Math.max(2,Math.min(256,numLevels));
	
			var numAreas = 256 / numLevels;
			var numValues = 256 / (numLevels-1);

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;
				var x = w;
				do {
					var offset = offsetY + (x-1)*4;

					var r = numValues * ((data[offset] / numAreas)>>0);
					var g = numValues * ((data[offset+1] / numAreas)>>0);
					var b = numValues * ((data[offset+2] / numAreas)>>0);

					if (r > 255) r = 255;
					if (g > 255) g = 255;
					if (b > 255) b = 255;

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


