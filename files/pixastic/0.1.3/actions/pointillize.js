/*
 * Pixastic Lib - Pointillize filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.pointillize = {

	process : function(params) {
		var radius = Math.max(1,parseInt(params.options.radius,10));
		var density = Math.min(5,Math.max(0,parseFloat(params.options.density)||0));
		var noise = Math.max(0,parseFloat(params.options.noise)||0);
		var transparent = !!(params.options.transparent && params.options.transparent != "false");

		if (Pixastic.Client.hasCanvasImageData()) {
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;

			var ctx = params.canvas.getContext("2d");
			var canvasWidth = params.canvas.width;
			var canvasHeight = params.canvas.height;

			var pixel = document.createElement("canvas");
			pixel.width = pixel.height = 1;
			var pixelCtx = pixel.getContext("2d");

			var copy = document.createElement("canvas");
			copy.width = w;
			copy.height = h;
			var copyCtx = copy.getContext("2d");
			copyCtx.drawImage(params.canvas,rect.left,rect.top,w,h, 0,0,w,h);

			var diameter = radius * 2;

			if (transparent)
				ctx.clearRect(rect.left, rect.top, rect.width, rect.height);

			var noiseRadius = radius * noise;

			var dist = 1 / density;

			for (var y=0;y<h+radius;y+=diameter*dist) {
				for (var x=0;x<w+radius;x+=diameter*dist) {
					rndX = noise ? (x+((Math.random()*2-1) * noiseRadius))>>0 : x;
					rndY = noise ? (y+((Math.random()*2-1) * noiseRadius))>>0 : y;

					var pixX = rndX - radius;
					var pixY = rndY - radius;
					if (pixX < 0) pixX = 0;
					if (pixY < 0) pixY = 0;

					var cx = rndX + rect.left;
					var cy = rndY + rect.top;
					if (cx < 0) cx = 0;
					if (cx > canvasWidth) cx = canvasWidth;
					if (cy < 0) cy = 0;
					if (cy > canvasHeight) cy = canvasHeight;

					var diameterX = diameter;
					var diameterY = diameter;

					if (diameterX + pixX > w)
						diameterX = w - pixX;
					if (diameterY + pixY > h)
						diameterY = h - pixY;
					if (diameterX < 1) diameterX = 1;
					if (diameterY < 1) diameterY = 1;

					pixelCtx.drawImage(copy, pixX, pixY, diameterX, diameterY, 0, 0, 1, 1);
					var data = pixelCtx.getImageData(0,0,1,1).data;

					ctx.fillStyle = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
					ctx.beginPath();
					ctx.arc(cx, cy, radius, 0, Math.PI*2, true);
					ctx.closePath();
					ctx.fill();
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