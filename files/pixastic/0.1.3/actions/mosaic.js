/*
 * Pixastic Lib - Mosaic filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.mosaic = {

	process : function(params) {
		var blockSize = Math.max(1,parseInt(params.options.blockSize,10));

		if (Pixastic.Client.hasCanvasImageData()) {
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;

			var ctx = params.canvas.getContext("2d");

			var pixel = document.createElement("canvas");
			pixel.width = pixel.height = 1;
			var pixelCtx = pixel.getContext("2d");

			var copy = document.createElement("canvas");
			copy.width = w;
			copy.height = h;
			var copyCtx = copy.getContext("2d");
			copyCtx.drawImage(params.canvas,rect.left,rect.top,w,h, 0,0,w,h);

			for (var y=0;y<h;y+=blockSize) {
				for (var x=0;x<w;x+=blockSize) {
					var blockSizeX = blockSize;
					var blockSizeY = blockSize;
		
					if (blockSizeX + x > w)
						blockSizeX = w - x;
					if (blockSizeY + y > h)
						blockSizeY = h - y;

					pixelCtx.drawImage(copy, x, y, blockSizeX, blockSizeY, 0, 0, 1, 1);
					var data = pixelCtx.getImageData(0,0,1,1).data;
					ctx.fillStyle = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
					ctx.fillRect(rect.left + x, rect.top + y, blockSize, blockSize);
				}
			}
			params.useData = false;

			return true;
		}
	},
	checkSupport : function() {
		return (Pixastic.Client.hasCanvasImageData());
	}
}