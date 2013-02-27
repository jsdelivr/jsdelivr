/*
 * Pixastic Lib - Blur filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.blur = {
	process : function(params) {

		if (typeof params.options.fixMargin == "undefined")
			params.options.fixMargin = true;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			/*
			var kernel = [
				[0.5, 	1, 	0.5],
				[1, 	2, 	1],
				[0.5, 	1, 	0.5]
			];
			*/

			var kernel = [
				[0, 	1, 	0],
				[1, 	2, 	1],
				[0, 	1, 	0]
			];

			var weight = 0;
			for (var i=0;i<3;i++) {
				for (var j=0;j<3;j++) {
					weight += kernel[i][j];
				}
			}

			weight = 1 / (weight*2);

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;

				var prevY = (y == 1) ? 0 : y-2;
				var nextY = (y == h) ? y - 1 : y;

				var offsetYPrev = prevY*w*4;
				var offsetYNext = nextY*w*4;

				var x = w;
				do {
					var offset = offsetY + (x*4-4);

					var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x-2) * 4;
					var offsetNext = offsetYNext + ((x == w) ? x-1 : x) * 4;
	
					data[offset] = (
						/*
						dataCopy[offsetPrev - 4]
						+ dataCopy[offsetPrev+4] 
						+ dataCopy[offsetNext - 4]
						+ dataCopy[offsetNext+4]
						+ 
						*/
						(dataCopy[offsetPrev]
						+ dataCopy[offset-4]
						+ dataCopy[offset+4]
						+ dataCopy[offsetNext])		* 2
						+ dataCopy[offset] 		* 4
						) * weight;

					data[offset+1] = (
						/*
						dataCopy[offsetPrev - 3]
						+ dataCopy[offsetPrev+5] 
						+ dataCopy[offsetNext - 3] 
						+ dataCopy[offsetNext+5]
						+ 
						*/
						(dataCopy[offsetPrev+1]
						+ dataCopy[offset-3]
						+ dataCopy[offset+5]
						+ dataCopy[offsetNext+1])	* 2
						+ dataCopy[offset+1] 		* 4
						) * weight;

					data[offset+2] = (
						/*
						dataCopy[offsetPrev - 2] 
						+ dataCopy[offsetPrev+6] 
						+ dataCopy[offsetNext - 2] 
						+ dataCopy[offsetNext+6]
						+ 
						*/
						(dataCopy[offsetPrev+2]
						+ dataCopy[offset-2]
						+ dataCopy[offset+6]
						+ dataCopy[offsetNext+2])	* 2
						+ dataCopy[offset+2] 		* 4
						) * weight;

				} while (--x);
			} while (--y);

			return true;

		} else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " progid:DXImageTransform.Microsoft.Blur(pixelradius=1.5)";

			if (params.options.fixMargin) {
				params.image.style.marginLeft = (parseInt(params.image.style.marginLeft,10)||0) - 2 + "px";
				params.image.style.marginTop = (parseInt(params.image.style.marginTop,10)||0) - 2 + "px";
			}

			return true;
		}
	},
	checkSupport : function() {
		return (Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE());
	}
}