/*
 * Pixastic Lib - Horizontal flip - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.fliph = {
	process : function(params) {
		if (Pixastic.Client.hasCanvas()) {
			var rect = params.options.rect;
			var copyCanvas = document.createElement("canvas");
			copyCanvas.width = rect.width;
			copyCanvas.height = rect.height;
			copyCanvas.getContext("2d").drawImage(params.image, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

			var ctx = params.canvas.getContext("2d");
			ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
			ctx.scale(-1,1);
			ctx.drawImage(copyCanvas, -rect.left-rect.width, rect.top, rect.width, rect.height)
			params.useData = false;

			return true;		

		} else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " fliph";
			return true;
		}
	},
	checkSupport : function() {
		return (Pixastic.Client.hasCanvas() || Pixastic.Client.isIE());
	}
}

