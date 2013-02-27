/*
 * Pixastic Lib - Blend - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.blend = {

	process : function(params) {
		var amount = parseFloat(params.options.amount);
		var mode = (params.options.mode || "normal").toLowerCase();
		var image = params.options.image;

		amount = Math.max(0,Math.min(1,amount));

		if (!image) return false;

		if (Pixastic.Client.hasCanvasImageData()) {

			var rect = params.options.rect;
			var data = Pixastic.prepareData(params);
			var w = rect.width;
			var h = rect.height;

			params.useData = false;

			var otherCanvas = document.createElement("canvas");
			otherCanvas.width = params.canvas.width;
			otherCanvas.height = params.canvas.height;
			var otherCtx = otherCanvas.getContext("2d");
			otherCtx.drawImage(image,0,0);

			var params2 = {canvas:otherCanvas,options:params.options};
			var data2 = Pixastic.prepareData(params2);
			var dataDesc2 = params2.canvasData;

			var p = w*h;
			var pix = p*4;
			var pix1, pix2;
			var r1, g1, b1;
			var r2, g2, b2;
			var r3, g3, b3;
			var r4, g4, b4;

			var dataChanged = false;

			switch (mode) {
				case "normal" : 
					//while (p--) {
					//	data2[pix-=4] = data2[pix];
					//	data2[pix1=pix+1] = data2[pix1];
					//	data2[pix2=pix+2] = data2[pix2];
					//}
					break;

				case "multiply" : 
					while (p--) {
						data2[pix-=4] = data[pix] * data2[pix] / 255;
						data2[pix1=pix+1] = data[pix1] * data2[pix1] / 255;
						data2[pix2=pix+2] = data[pix2] * data2[pix2] / 255;
					}
					dataChanged = true;
					break;

				case "lighten" : 
					while (p--) {
						if ((r1 = data[pix-=4]) > data2[pix])
							data2[pix] = r1;
						if ((g1 = data[pix1=pix+1]) > data2[pix1])
							data2[pix1] = g1;
						if ((b1 = data[pix2=pix+2]) > data2[pix2])
							data2[pix2] = b1;
					}
					dataChanged = true;
					break;

				case "darken" : 
					while (p--) {
						if ((r1 = data[pix-=4]) < data2[pix])
							data2[pix] = r1;
						if ((g1 = data[pix1=pix+1]) < data2[pix1])
							data2[pix1] = g1;
						if ((b1 = data[pix2=pix+2]) < data2[pix2])
							data2[pix2] = b1;

					}
					dataChanged = true;
					break;

				case "darkercolor" : 
					while (p--) {
						if (((r1 = data[pix-=4])*0.3+(g1 = data[pix1=pix+1])*0.59+(b1 = data[pix2=pix+2])*0.11) <= (data2[pix]*0.3+data2[pix1]*0.59+data2[pix2]*0.11)) {
							data2[pix] = r1;
							data2[pix1] = g1;
							data2[pix2] = b1;
						}
					}
					dataChanged = true;
					break;

				case "lightercolor" : 
					while (p--) {
						if (((r1 = data[pix-=4])*0.3+(g1 = data[pix1=pix+1])*0.59+(b1 = data[pix2=pix+2])*0.11) > (data2[pix]*0.3+data2[pix1]*0.59+data2[pix2]*0.11)) {
							data2[pix] = r1;
							data2[pix1] = g1;
							data2[pix2] = b1;
						}
					}
					dataChanged = true;
					break;

				case "lineardodge" : 
					/*
					otherCtx.globalCompositeOperation = "source-over";
					otherCtx.drawImage(params.canvas, 0, 0);
					otherCtx.globalCompositeOperation = "lighter";
					otherCtx.drawImage(image, 0, 0);
					*/

					while (p--) {
						if ((r3 = data[pix-=4] + data2[pix]) > 255)
							data2[pix] = 255;
						else
							data2[pix] = r3;
						if ((g3 = data[pix1=pix+1] + data2[pix1]) > 255)
							data2[pix1] = 255;
						else
							data2[pix1] = g3;
						if ((b3 = data[pix2=pix+2] + data2[pix2]) > 255)
							data2[pix2] = 255;
						else
							data2[pix2] = b3;
					}
					dataChanged = true;

					break;

				case "linearburn" : 
					while (p--) {
						if ((r3 = data[pix-=4] + data2[pix]) < 255)
							data2[pix] = 0;
						else
							data2[pix] = (r3 - 255);
						if ((g3 = data[pix1=pix+1] + data2[pix1]) < 255)
							data2[pix1] = 0;
						else
							data2[pix1] = (g3 - 255);
						if ((b3 = data[pix2=pix+2] + data2[pix2]) < 255)
							data2[pix2] = 0;
						else
							data2[pix2] = (b3 - 255);
					}
					dataChanged = true;
					break;

				case "difference" : 
					while (p--) {
						if ((r3 = data[pix-=4] - data2[pix]) < 0)
							data2[pix] = -r3;
						else
							data2[pix] = r3;
						if ((g3 = data[pix1=pix+1] - data2[pix1]) < 0)
							data2[pix1] = -g3;
						else
							data2[pix1] = g3;
						if ((b3 = data[pix2=pix+2] - data2[pix2]) < 0)
							data2[pix2] = -b3;
						else
							data2[pix2] = b3;
					}
					dataChanged = true;
					break;

				case "screen" : 
					while (p--) {
						data2[pix-=4] = (255 - ( ((255-data2[pix])*(255-data[pix])) >> 8));
						data2[pix1=pix+1] = (255 - ( ((255-data2[pix1])*(255-data[pix1])) >> 8));
						data2[pix2=pix+2] = (255 - ( ((255-data2[pix2])*(255-data[pix2])) >> 8));
					}
					dataChanged = true;
					break;

				case "exclusion" : 
					var div_2_255 = 2 / 255;
					while (p--) {
						data2[pix-=4] = (r1 = data[pix]) - (r1 * div_2_255 - 1) * data2[pix];
						data2[pix1=pix+1] = (g1 = data[pix1]) - (g1 * div_2_255 - 1) * data2[pix1];
						data2[pix2=pix+2] = (b1 = data[pix2]) - (b1 * div_2_255 - 1) * data2[pix2];
					}
					dataChanged = true;
					break;

				case "overlay" : 
					var div_2_255 = 2 / 255;
					while (p--) {
						if ((r1 = data[pix-=4]) < 128)
							data2[pix] = data2[pix]*r1*div_2_255;
						else
							data2[pix] = 255 - (255-data2[pix])*(255-r1)*div_2_255;

						if ((g1 = data[pix1=pix+1]) < 128)
							data2[pix1] = data2[pix1]*g1*div_2_255;
						else
							data2[pix1] = 255 - (255-data2[pix1])*(255-g1)*div_2_255;

						if ((b1 = data[pix2=pix+2]) < 128)
							data2[pix2] = data2[pix2]*b1*div_2_255;
						else
							data2[pix2] = 255 - (255-data2[pix2])*(255-b1)*div_2_255;

					}
					dataChanged = true;
					break;

				case "softlight" : 
					var div_2_255 = 2 / 255;
					while (p--) {
						if ((r1 = data[pix-=4]) < 128)
							data2[pix] = ((data2[pix]>>1) + 64) * r1 * div_2_255;
						else
							data2[pix] = 255 - (191 - (data2[pix]>>1)) * (255-r1) * div_2_255;

						if ((g1 = data[pix1=pix+1]) < 128)
							data2[pix1] = ((data2[pix1]>>1)+64) * g1 * div_2_255;
						else
							data2[pix1] = 255 - (191 - (data2[pix1]>>1)) * (255-g1) * div_2_255;

						if ((b1 = data[pix2=pix+2]) < 128)
							data2[pix2] = ((data2[pix2]>>1)+64) * b1 * div_2_255;
						else
							data2[pix2] = 255 - (191 - (data2[pix2]>>1)) * (255-b1) * div_2_255;

					}
					dataChanged = true;
					break;

				case "hardlight" : 
					var div_2_255 = 2 / 255;
					while (p--) {
						if ((r2 = data2[pix-=4]) < 128)
							data2[pix] = data[pix] * r2 * div_2_255;
						else
							data2[pix] = 255 - (255-data[pix]) * (255-r2) * div_2_255;

						if ((g2 = data2[pix1=pix+1]) < 128)
							data2[pix1] = data[pix1] * g2 * div_2_255;
						else
							data2[pix1] = 255 - (255-data[pix1]) * (255-g2) * div_2_255;

						if ((b2 = data2[pix2=pix+2]) < 128)
							data2[pix2] = data[pix2] * b2 * div_2_255;
						else
							data2[pix2] = 255 - (255-data[pix2]) * (255-b2) * div_2_255;

					}
					dataChanged = true;
					break;

				case "colordodge" : 
					while (p--) {
						if ((r3 = (data[pix-=4]<<8)/(255-(r2 = data2[pix]))) > 255 || r2 == 255)
							data2[pix] = 255;
						else
							data2[pix] = r3;

						if ((g3 = (data[pix1=pix+1]<<8)/(255-(g2 = data2[pix1]))) > 255 || g2 == 255)
							data2[pix1] = 255;
						else
							data2[pix1] = g3;

						if ((b3 = (data[pix2=pix+2]<<8)/(255-(b2 = data2[pix2]))) > 255 || b2 == 255)
							data2[pix2] = 255;
						else
							data2[pix2] = b3;
					}
					dataChanged = true;
					break;

				case "colorburn" : 
					while (p--) {
						if ((r3 = 255-((255-data[pix-=4])<<8)/data2[pix]) < 0 || data2[pix] == 0)
							data2[pix] = 0;
						else
							data2[pix] = r3;

						if ((g3 = 255-((255-data[pix1=pix+1])<<8)/data2[pix1]) < 0 || data2[pix1] == 0)
							data2[pix1] = 0;
						else
							data2[pix1] = g3;

						if ((b3 = 255-((255-data[pix2=pix+2])<<8)/data2[pix2]) < 0 || data2[pix2] == 0)
							data2[pix2] = 0;
						else
							data2[pix2] = b3;
					}
					dataChanged = true;
					break;

				case "linearlight" : 
					while (p--) {
						if ( ((r3 = 2*(r2=data2[pix-=4])+data[pix]-256) < 0) || (r2 < 128 && r3 < 0)) {
							data2[pix] = 0
						} else {
							if (r3 > 255)
								data2[pix] = 255;
							else
								data2[pix] = r3;
						}
						if ( ((g3 = 2*(g2=data2[pix1=pix+1])+data[pix1]-256) < 0) || (g2 < 128 && g3 < 0)) {
							data2[pix1] = 0
						} else {
							if (g3 > 255)
								data2[pix1] = 255;
							else
								data2[pix1] = g3;
						}
						if ( ((b3 = 2*(b2=data2[pix2=pix+2])+data[pix2]-256) < 0) || (b2 < 128 && b3 < 0)) {
							data2[pix2] = 0
						} else {
							if (b3 > 255)
								data2[pix2] = 255;
							else
								data2[pix2] = b3;
						}
					}
					dataChanged = true;
					break;

				case "vividlight" : 
					while (p--) {
						if ((r2=data2[pix-=4]) < 128) {
							if (r2) {
								if ((r3 = 255 - ((255-data[pix])<<8) / (2*r2)) < 0) 
									data2[pix] = 0;
								else
									data2[pix] = r3
							} else {
								data2[pix] = 0;
							}
						} else if ((r3 = (r4=2*r2-256)) < 255) {
							if ((r3 = (data[pix]<<8)/(255-r4)) > 255) 
								data2[pix] = 255;
							else
								data2[pix] = r3;
						} else {
							if (r3 < 0) 
								data2[pix] = 0;
							else
								data2[pix] = r3
						}

						if ((g2=data2[pix1=pix+1]) < 128) {
							if (g2) {
								if ((g3 = 255 - ((255-data[pix1])<<8) / (2*g2)) < 0) 
									data2[pix1] = 0;
								else
									data2[pix1] = g3;
							} else {
								data2[pix1] = 0;
							}
						} else if ((g3 = (g4=2*g2-256)) < 255) {
							if ((g3 = (data[pix1]<<8)/(255-g4)) > 255)
								data2[pix1] = 255;
							else
								data2[pix1] = g3;
						} else {
							if (g3 < 0) 
								data2[pix1] = 0;
							else
								data2[pix1] = g3;
						}

						if ((b2=data2[pix2=pix+2]) < 128) {
							if (b2) {
								if ((b3 = 255 - ((255-data[pix2])<<8) / (2*b2)) < 0) 
									data2[pix2] = 0;
								else
									data2[pix2] = b3;
							} else {
								data2[pix2] = 0;
							}
						} else if ((b3 = (b4=2*b2-256)) < 255) {
							if ((b3 = (data[pix2]<<8)/(255-b4)) > 255) 
								data2[pix2] = 255;
							else
								data2[pix2] = b3;
						} else {
							if (b3 < 0) 
								data2[pix2] = 0;
							else
								data2[pix2] = b3;
						}
					}
					dataChanged = true;
					break;

				case "pinlight" : 
					while (p--) {
						if ((r2=data2[pix-=4]) < 128)
							if ((r1=data[pix]) < (r4=2*r2))
								data2[pix] = r1;
							else
								data2[pix] = r4;
						else
							if ((r1=data[pix]) > (r4=2*r2-256))
								data2[pix] = r1;
							else
								data2[pix] = r4;

						if ((g2=data2[pix1=pix+1]) < 128)
							if ((g1=data[pix1]) < (g4=2*g2))
								data2[pix1] = g1;
							else
								data2[pix1] = g4;
						else
							if ((g1=data[pix1]) > (g4=2*g2-256))
								data2[pix1] = g1;
							else
								data2[pix1] = g4;

						if ((r2=data2[pix2=pix+2]) < 128)
							if ((r1=data[pix2]) < (r4=2*r2))
								data2[pix2] = r1;
							else
								data2[pix2] = r4;
						else
							if ((r1=data[pix2]) > (r4=2*r2-256))
								data2[pix2] = r1;
							else
								data2[pix2] = r4;
					}
					dataChanged = true;
					break;

				case "hardmix" : 
					while (p--) {
						if ((r2 = data2[pix-=4]) < 128)
							if (255 - ((255-data[pix])<<8)/(2*r2) < 128 || r2 == 0)
								data2[pix] = 0;
							else
								data2[pix] = 255;
						else if ((r4=2*r2-256) < 255 && (data[pix]<<8)/(255-r4) < 128)
							data2[pix] = 0;
						else
							data2[pix] = 255;

						if ((g2 = data2[pix1=pix+1]) < 128)
							if (255 - ((255-data[pix1])<<8)/(2*g2) < 128 || g2 == 0)
								data2[pix1] = 0;
							else
								data2[pix1] = 255;
						else if ((g4=2*g2-256) < 255 && (data[pix1]<<8)/(255-g4) < 128)
							data2[pix1] = 0;
						else
							data2[pix1] = 255;

						if ((b2 = data2[pix2=pix+2]) < 128)
							if (255 - ((255-data[pix2])<<8)/(2*b2) < 128 || b2 == 0)
								data2[pix2] = 0;
							else
								data2[pix2] = 255;
						else if ((b4=2*b2-256) < 255 && (data[pix2]<<8)/(255-b4) < 128)
							data2[pix2] = 0;
						else
							data2[pix2] = 255;
					}
					dataChanged = true;
					break;
			}

			if (dataChanged) 
				otherCtx.putImageData(dataDesc2,0,0);

			if (amount != 1 && !Pixastic.Client.hasGlobalAlpha()) {
				var p = w*h;
				var amount2 = amount;
				var amount1 = 1 - amount;
				while (p--) {
					var pix = p*4;
					var r = (data[pix] * amount1 + data2[pix] * amount2)>>0;
					var g = (data[pix+1] * amount1 + data2[pix+1] * amount2)>>0;
					var b = (data[pix+2] * amount1 + data2[pix+2] * amount2)>>0;

					data[pix] = r;
					data[pix+1] = g;
					data[pix+2] = b;
				}
				params.useData = true;
			} else {
				var ctx = params.canvas.getContext("2d");
				ctx.save();
				ctx.globalAlpha = amount;
				ctx.drawImage(
					otherCanvas,
					0,0,rect.width,rect.height,
					rect.left,rect.top,rect.width,rect.height
				);
				ctx.globalAlpha = 1;
				ctx.restore();
			}

			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvasImageData();
	}
}