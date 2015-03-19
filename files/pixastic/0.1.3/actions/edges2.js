/*
 * Pixastic Lib - Edge detection 2 - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 * 
 * Contribution by Oliver Hunt (http://nerget.com/, http://nerget.com/canvas/edgeDetection.js). Thanks Oliver!
 *
 */

Pixastic.Actions.edges2 = {
	process : function(params) {

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w * 4;
			var pixel = w4 + 4; // Start at (1,1)
			var hm1 = h - 1;
			var wm1 = w - 1;
			for (var y = 1; y < hm1; ++y) {
				// Prepare initial cached values for current row
				var centerRow = pixel - 4;
				var priorRow = centerRow - w4;
				var nextRow = centerRow + w4;
				
				var r1 = - dataCopy[priorRow]   - dataCopy[centerRow]   - dataCopy[nextRow];
				var g1 = - dataCopy[++priorRow] - dataCopy[++centerRow] - dataCopy[++nextRow];
				var b1 = - dataCopy[++priorRow] - dataCopy[++centerRow] - dataCopy[++nextRow];
				
				var rp = dataCopy[priorRow += 2];
				var gp = dataCopy[++priorRow];
				var bp = dataCopy[++priorRow];
				
				var rc = dataCopy[centerRow += 2];
				var gc = dataCopy[++centerRow];
				var bc = dataCopy[++centerRow];
				
				var rn = dataCopy[nextRow += 2];
				var gn = dataCopy[++nextRow];
				var bn = dataCopy[++nextRow];
				
				var r2 = - rp - rc - rn;
				var g2 = - gp - gc - gn;
				var b2 = - bp - bc - bn;
				
				// Main convolution loop
				for (var x = 1; x < wm1; ++x) {
					centerRow = pixel + 4;
					priorRow = centerRow - w4;
					nextRow = centerRow + w4;
					
					var r = 127 + r1 - rp - (rc * -8) - rn;
					var g = 127 + g1 - gp - (gc * -8) - gn;
					var b = 127 + b1 - bp - (bc * -8) - bn;
					
					r1 = r2;
					g1 = g2;
					b1 = b2;
					
					rp = dataCopy[  priorRow];
					gp = dataCopy[++priorRow];
					bp = dataCopy[++priorRow];
					
					rc = dataCopy[  centerRow];
					gc = dataCopy[++centerRow];
					bc = dataCopy[++centerRow];
					
					rn = dataCopy[  nextRow];
					gn = dataCopy[++nextRow];
					bn = dataCopy[++nextRow];
					
					r += (r2 = - rp - rc - rn);
					g += (g2 = - gp - gc - gn);
					b += (b2 = - bp - bc - bn);

					if (r > 255) r = 255;
					if (g > 255) g = 255;
					if (b > 255) b = 255;
					if (r < 0) r = 0;
					if (g < 0) g = 0;
					if (b < 0) b = 0;

					data[pixel] = r;
					data[++pixel] = g;
					data[++pixel] = b;
					//data[++pixel] = 255; // alpha

					pixel+=2;
				}
				pixel += 8;
			}
			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvasImageData();
	}
}