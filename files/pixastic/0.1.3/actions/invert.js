/*
 * Pixastic Lib - Invert filter - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.invert = {
	process : function(params) {
		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);

			var invertAlpha = !!params.options.invertAlpha;
			var rect = params.options.rect;

			var p = rect.width * rect.height;

			var pix = p*4, pix1 = pix + 1, pix2 = pix + 2, pix3 = pix + 3;

			while (p--) {
				data[pix-=4] = 255 - data[pix];
				data[pix1-=4] = 255 - data[pix1];
				data[pix2-=4] = 255 - data[pix2];
				if (invertAlpha)
					data[pix3-=4] = 255 - data[pix3];
			}

			return true;
		} else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " invert";
			return true;
		}
	},
	checkSupport : function() {
		return (Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE());
	}
}
