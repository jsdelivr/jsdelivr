/*
 * Pixastic Lib - Resize - v0.1.0
 * Copyright (c) 2009 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.resize = {
	process : function(params) {
		if (Pixastic.Client.hasCanvas()) {
			var width = parseInt(params.options.width,10);
			var height = parseInt(params.options.height,10);
			var canvas = params.canvas;

			if (width < 1) width = 1;
			if (width < 2) width = 2;

			var copy = document.createElement("canvas");
			copy.width = width;
			copy.height = height;

			copy.getContext("2d").drawImage(canvas,0,0,width,height);
			canvas.width = width;
			canvas.height = height;

			canvas.getContext("2d").drawImage(copy,0,0);

			params.useData = false;
			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvas();
	}
}


