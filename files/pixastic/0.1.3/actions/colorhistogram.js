/*
 * Pixastic Lib - Histogram - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */


Pixastic.Actions.colorhistogram = {

	array256 : function(default_value) {
		arr = [];
		for (var i=0; i<256; i++) { arr[i] = default_value; }
		return arr
	},
 
	process : function(params) {
		var values = [];
		if (typeof params.options.returnValue != "object") {
			params.options.returnValue = {rvals:[], gvals:[], bvals:[]};
		}
		var paint = !!(params.options.paint);

		var returnValue = params.options.returnValue;
		if (typeof returnValue.values != "array") {
			returnValue.rvals = [];
			returnValue.gvals = [];
			returnValue.bvals = [];
		}
 
		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			params.useData = false;
 
			var rvals = this.array256(0);
			var gvals = this.array256(0);
			var bvals = this.array256(0);
 
			var rect = params.options.rect;

			var p = rect.width*rect.height;
			var pix = p*4;
			while (p--) {
				rvals[data[pix-=4]]++;
				gvals[data[pix+1]]++;
				bvals[data[pix+2]]++;
			}
 
			returnValue.rvals = rvals;
			returnValue.gvals = gvals;
			returnValue.bvals = bvals;

			if (paint) {
				var ctx = params.canvas.getContext("2d");
				var vals = [rvals, gvals, bvals];
				for (var v=0;v<3;v++) {
					var yoff = (v+1) * params.height / 3;
					var maxValue = 0;
					for (var i=0;i<256;i++) {
						if (vals[v][i] > maxValue)
							maxValue = vals[v][i];
					}
					var heightScale = params.height / 3 / maxValue;
					var widthScale = params.width / 256;
					if (v==0) ctx.fillStyle = "rgba(255,0,0,0.5)";
					else if (v==1) ctx.fillStyle = "rgba(0,255,0,0.5)";
					else if (v==2) ctx.fillStyle = "rgba(0,0,255,0.5)";
					for (var i=0;i<256;i++) {
						ctx.fillRect(
							i * widthScale, params.height - heightScale * vals[v][i] - params.height + yoff,
							widthScale, vals[v][i] * heightScale
						);
					}
				}
			}
			return true;
		}
	},

	checkSupport : function() {
		return Pixastic.Client.hasCanvasImageData();
	}
}