/*
 * Pixastic Lib - Lighten filter - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.lighten = {

	process : function(params) {
		var amount = parseFloat(params.options.amount) || 0;
		amount = Math.max(-1, Math.min(1, amount));

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var rect = params.options.rect;

			var p = rect.width * rect.height;

			var pix = p*4, pix1 = pix + 1, pix2 = pix + 2;
			var mul = amount + 1;

			while (p--) {
				if ((data[pix-=4] = data[pix] * mul) > 255)
					data[pix] = 255;

				if ((data[pix1-=4] = data[pix1] * mul) > 255)
					data[pix1] = 255;

				if ((data[pix2-=4] = data[pix2] * mul) > 255)
					data[pix2] = 255;

			}

			return true;

		} else if (Pixastic.Client.isIE()) {
			var img = params.image;
			if (amount < 0) {
				img.style.filter += " light()";
				img.filters[img.filters.length-1].addAmbient(
					255,255,255,
					100 * -amount
				);
			} else if (amount > 0) {
				img.style.filter += " light()";
				img.filters[img.filters.length-1].addAmbient(
					255,255,255,
					100
				);
				img.filters[img.filters.length-1].addAmbient(
					255,255,255,
					100 * amount
				);
			}
			return true;
		}
	},
	checkSupport : function() {
		return (Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE());
	}
}
