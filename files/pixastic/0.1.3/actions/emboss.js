/*
 * Pixastic Lib - Emboss filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.emboss = {
	process : function(params) {

		var strength = parseFloat(params.options.strength)||1;
		var greyLevel = typeof params.options.greyLevel != "undefined" ? parseInt(params.options.greyLevel) : 180;
		var direction = params.options.direction||"topleft";
		var blend = !!(params.options.blend && params.options.blend != "false");

		var dirY = 0;
		var dirX = 0;

		switch (direction) {
			case "topleft":			// top left
				dirY = -1;
				dirX = -1;
				break;
			case "top":			// top
				dirY = -1;
				dirX = 0;
				break;
			case "topright":			// top right
				dirY = -1;
				dirX = 1;
				break;
			case "right":			// right
				dirY = 0;
				dirX = 1;
				break;
			case "bottomright":			// bottom right
				dirY = 1;
				dirX = 1;
				break;
			case "bottom":			// bottom
				dirY = 1;
				dirX = 0;
				break;
			case "bottomleft":			// bottom left
				dirY = 1;
				dirX = -1;
				break;
			case "left":			// left
				dirY = 0;
				dirX = -1;
				break;
		}

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			var invertAlpha = !!params.options.invertAlpha;
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;

				var otherY = dirY;
				if (y + otherY < 1) otherY = 0;
				if (y + otherY > h) otherY = 0;

				var offsetYOther = (y-1+otherY)*w*4;

				var x = w;
				do {
						var offset = offsetY + (x-1)*4;

						var otherX = dirX;
						if (x + otherX < 1) otherX = 0;
						if (x + otherX > w) otherX = 0;

						var offsetOther = offsetYOther + (x-1+otherX)*4;

						var dR = dataCopy[offset] - dataCopy[offsetOther];
						var dG = dataCopy[offset+1] - dataCopy[offsetOther+1];
						var dB = dataCopy[offset+2] - dataCopy[offsetOther+2];

						var dif = dR;
						var absDif = dif > 0 ? dif : -dif;

						var absG = dG > 0 ? dG : -dG;
						var absB = dB > 0 ? dB : -dB;

						if (absG > absDif) {
							dif = dG;
						}
						if (absB > absDif) {
							dif = dB;
						}

						dif *= strength;

						if (blend) {
							var r = data[offset] + dif;
							var g = data[offset+1] + dif;
							var b = data[offset+2] + dif;

							data[offset] = (r > 255) ? 255 : (r < 0 ? 0 : r);
							data[offset+1] = (g > 255) ? 255 : (g < 0 ? 0 : g);
							data[offset+2] = (b > 255) ? 255 : (b < 0 ? 0 : b);
						} else {
							var grey = greyLevel - dif;
							if (grey < 0) {
								grey = 0;
							} else if (grey > 255) {
								grey = 255;
							}

							data[offset] = data[offset+1] = data[offset+2] = grey;
						}

				} while (--x);
			} while (--y);
			return true;

		} else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " progid:DXImageTransform.Microsoft.emboss()";
			return true;
		}
	},
	checkSupport : function() {
		return (Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE());
	}

}
