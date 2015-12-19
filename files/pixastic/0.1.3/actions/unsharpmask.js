/*
 * Pixastic Lib - USM - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */


Pixastic.Actions.unsharpmask = {
	process : function(params) {

		var amount = (parseFloat(params.options.amount)||0);
		var blurAmount = parseFloat(params.options.radius)||0;
		var threshold = parseFloat(params.options.threshold)||0;

		amount = Math.min(500,Math.max(0,amount)) / 2;
		blurAmount = Math.min(5,Math.max(0,blurAmount)) / 10;
		threshold = Math.min(255,Math.max(0,threshold));

		threshold--;
		var thresholdNeg = -threshold;

		amount *= 0.016;
		amount++;

		if (Pixastic.Client.hasCanvasImageData()) {
			var rect = params.options.rect;

			var blurCanvas = document.createElement("canvas");
			blurCanvas.width = params.width;
			blurCanvas.height = params.height;
			var blurCtx = blurCanvas.getContext("2d");
			blurCtx.drawImage(params.canvas,0,0);

			var scale = 2;
			var smallWidth = Math.round(params.width / scale);
			var smallHeight = Math.round(params.height / scale);

			var copy = document.createElement("canvas");
			copy.width = smallWidth;
			copy.height = smallHeight;

			var steps = Math.round(blurAmount * 20);

			var copyCtx = copy.getContext("2d");
			for (var i=0;i<steps;i++) {
				var scaledWidth = Math.max(1,Math.round(smallWidth - i));
				var scaledHeight = Math.max(1,Math.round(smallHeight - i));

				copyCtx.clearRect(0,0,smallWidth,smallHeight);

				copyCtx.drawImage(
					blurCanvas,
					0,0,params.width,params.height,
					0,0,scaledWidth,scaledHeight
				);
	
				blurCtx.clearRect(0,0,params.width,params.height);
	
				blurCtx.drawImage(
					copy,
					0,0,scaledWidth,scaledHeight,
					0,0,params.width,params.height
				);
			}

			var data = Pixastic.prepareData(params);
			var blurData = Pixastic.prepareData({canvas:blurCanvas,options:params.options});
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;
				var x = w;
				do {
					var offset = offsetY + (x*4-4);

					var difR = data[offset] - blurData[offset];
					if (difR > threshold || difR < thresholdNeg) {
						var blurR = blurData[offset];
						blurR = amount * difR + blurR;
						data[offset] = blurR > 255 ? 255 : (blurR < 0 ? 0 : blurR);
					}

					var difG = data[offset+1] - blurData[offset+1];
					if (difG > threshold || difG < thresholdNeg) {
						var blurG = blurData[offset+1];
						blurG = amount * difG + blurG;
						data[offset+1] = blurG > 255 ? 255 : (blurG < 0 ? 0 : blurG);
					}

					var difB = data[offset+2] - blurData[offset+2];
					if (difB > threshold || difB < thresholdNeg) {
						var blurB = blurData[offset+2];
						blurB = amount * difB + blurB;
						data[offset+2] = blurB > 255 ? 255 : (blurB < 0 ? 0 : blurB);
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



