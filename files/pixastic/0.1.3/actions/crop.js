/*
 * Pixastic Lib - Crop - v0.1.1
 * Copyright (c) 2008-2009 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.crop = {
	process : function(params) {
		if (Pixastic.Client.hasCanvas()) {
			var rect = params.options.rect;

			var width = rect.width;
			var height = rect.height;
			var top = rect.top;
			var left = rect.left;

			if (typeof params.options.left != "undefined")
				left = parseInt(params.options.left,10);
			if (typeof params.options.top != "undefined")
				top = parseInt(params.options.top,10);
			if (typeof params.options.height != "undefined")
				width = parseInt(params.options.width,10);
			if (typeof params.options.height != "undefined")
				height = parseInt(params.options.height,10);

			if (left < 0) left = 0;
			if (left > params.width-1) left = params.width-1;

			if (top < 0) top = 0;
			if (top > params.height-1) top = params.height-1;

			if (width < 1) width = 1;
			if (left + width > params.width)
				width = params.width - left;

			if (height < 1) height = 1;
			if (top + height > params.height)
				height = params.height - top;

			var copy = document.createElement("canvas");
			copy.width = params.width;
			copy.height = params.height;
			copy.getContext("2d").drawImage(params.canvas,0,0);

			params.canvas.width = width;
			params.canvas.height = height;
			params.canvas.getContext("2d").clearRect(0,0,width,height);

			params.canvas.getContext("2d").drawImage(copy,
				left,top,width,height,
				0,0,width,height
			);

			params.useData = false;
			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvas();
	}
}


