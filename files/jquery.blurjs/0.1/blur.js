(function ($) {
	$.fn.blurjs = function (options) {
		var canvas = document.createElement('canvas');
		var isCached = false;
		var selector = ($(this).selector).replace(/[^a-zA-Z0-9]/g, "");
		if(!canvas.getContext) {
			return;
		}
		options = $.extend({
			source: 'body',
			radius: 5,
			overlay: '',
			offset: {
				x: 0,
				y: 0
			},
			optClass: '',
			cache: false,
			cacheKeyPrefix: 'blurjs-',
			draggable: false,
			debug: false
		}, options);
		// Stackblur, courtesy of Mario Klingemann: http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
		var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
		var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

		function stackBlurCanvasRGB(a, b, c, d, f, g) {
			if(isNaN(g) || g < 1) return;
			g |= 0;
			var h = a.getContext("2d");
			var j;
			try {
				try {
					j = h.getImageData(b, c, d, f)
				} catch(e) {
					try {
						netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
						j = h.getImageData(b, c, d, f)
					} catch(e) {
						alert("Cannot access local image");
						throw new Error("unable to access local image data: " + e);
					}
				}
			} catch(e) {
				alert("Cannot access image");
				throw new Error("unable to access image data: " + e);
			}
			var k = j.data;
			var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, r_out_sum, g_out_sum, b_out_sum, r_in_sum, g_in_sum, b_in_sum, pr, pg, pb, rbs;
			var l = g + g + 1;
			var m = d << 2;
			var n = d - 1;
			var o = f - 1;
			var q = g + 1;
			var r = q * (q + 1) / 2;
			var s = new BlurStack();
			var t = s;
			for(i = 1; i < l; i++) {
				t = t.next = new BlurStack();
				if(i == q) var u = t
			}
			t.next = s;
			var v = null;
			var w = null;
			yw = yi = 0;
			var z = mul_table[g];
			var A = shg_table[g];
			for(y = 0; y < f; y++) {
				r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
				r_out_sum = q * (pr = k[yi]);
				g_out_sum = q * (pg = k[yi + 1]);
				b_out_sum = q * (pb = k[yi + 2]);
				r_sum += r * pr;
				g_sum += r * pg;
				b_sum += r * pb;
				t = s;
				for(i = 0; i < q; i++) {
					t.r = pr;
					t.g = pg;
					t.b = pb;
					t = t.next
				}
				for(i = 1; i < q; i++) {
					p = yi + ((n < i ? n : i) << 2);
					r_sum += (t.r = (pr = k[p])) * (rbs = q - i);
					g_sum += (t.g = (pg = k[p + 1])) * rbs;
					b_sum += (t.b = (pb = k[p + 2])) * rbs;
					r_in_sum += pr;
					g_in_sum += pg;
					b_in_sum += pb;
					t = t.next
				}
				v = s;
				w = u;
				for(x = 0; x < d; x++) {
					k[yi] = (r_sum * z) >> A;
					k[yi + 1] = (g_sum * z) >> A;
					k[yi + 2] = (b_sum * z) >> A;
					r_sum -= r_out_sum;
					g_sum -= g_out_sum;
					b_sum -= b_out_sum;
					r_out_sum -= v.r;
					g_out_sum -= v.g;
					b_out_sum -= v.b;
					p = (yw + ((p = x + g + 1) < n ? p : n)) << 2;
					r_in_sum += (v.r = k[p]);
					g_in_sum += (v.g = k[p + 1]);
					b_in_sum += (v.b = k[p + 2]);
					r_sum += r_in_sum;
					g_sum += g_in_sum;
					b_sum += b_in_sum;
					v = v.next;
					r_out_sum += (pr = w.r);
					g_out_sum += (pg = w.g);
					b_out_sum += (pb = w.b);
					r_in_sum -= pr;
					g_in_sum -= pg;
					b_in_sum -= pb;
					w = w.next;
					yi += 4
				}
				yw += d
			}
			for(x = 0; x < d; x++) {
				g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
				yi = x << 2;
				r_out_sum = q * (pr = k[yi]);
				g_out_sum = q * (pg = k[yi + 1]);
				b_out_sum = q * (pb = k[yi + 2]);
				r_sum += r * pr;
				g_sum += r * pg;
				b_sum += r * pb;
				t = s;
				for(i = 0; i < q; i++) {
					t.r = pr;
					t.g = pg;
					t.b = pb;
					t = t.next
				}
				yp = d;
				for(i = 1; i <= g; i++) {
					yi = (yp + x) << 2;
					r_sum += (t.r = (pr = k[yi])) * (rbs = q - i);
					g_sum += (t.g = (pg = k[yi + 1])) * rbs;
					b_sum += (t.b = (pb = k[yi + 2])) * rbs;
					r_in_sum += pr;
					g_in_sum += pg;
					b_in_sum += pb;
					t = t.next;
					if(i < o) {
						yp += d
					}
				}
				yi = x;
				v = s;
				w = u;
				for(y = 0; y < f; y++) {
					p = yi << 2;
					k[p] = (r_sum * z) >> A;
					k[p + 1] = (g_sum * z) >> A;
					k[p + 2] = (b_sum * z) >> A;
					r_sum -= r_out_sum;
					g_sum -= g_out_sum;
					b_sum -= b_out_sum;
					r_out_sum -= v.r;
					g_out_sum -= v.g;
					b_out_sum -= v.b;
					p = (x + (((p = y + q) < o ? p : o) * d)) << 2;
					r_sum += (r_in_sum += (v.r = k[p]));
					g_sum += (g_in_sum += (v.g = k[p + 1]));
					b_sum += (b_in_sum += (v.b = k[p + 2]));
					v = v.next;
					r_out_sum += (pr = w.r);
					g_out_sum += (pg = w.g);
					b_out_sum += (pb = w.b);
					r_in_sum -= pr;
					g_in_sum -= pg;
					b_in_sum -= pb;
					w = w.next;
					yi += d
				}
			}
			h.putImageData(j, b, c)
		}

		function BlurStack() {
			this.r = 0;
			this.g = 0;
			this.b = 0;
			this.a = 0;
			this.next = null
		}
		return this.each(function () {
			var $glue = $(this);
			var $source = $(options.source);
			var formattedSource = ($source.css('backgroundImage')).replace(/"/g, "").replace(/url\(|\)$/ig, "");
			ctx = canvas.getContext('2d');
			tempImg = new Image();
			tempImg.onload = function () {
				if(!isCached) {
					canvas.style.display = "none";
					canvas.width = tempImg.width;
					canvas.height = tempImg.height;
					ctx.drawImage(tempImg, 0, 0);
					stackBlurCanvasRGB(canvas, 0, 0, canvas.width, canvas.height, options.radius);
					if(options.overlay != false) {
						ctx.beginPath();
						ctx.rect(0, 0, tempImg.width, tempImg.width);
						ctx.fillStyle = options.overlay;
						ctx.fill();
					}
					var blurredData = canvas.toDataURL();
					if(options.cache) {
						try {
							if(options.debug) {
								console.log('Cache Set');
							}
							localStorage.setItem(options.cacheKeyPrefix + selector + '-' + formattedSource + '-data-image', blurredData);
						} catch(e) {
							console.log(e);
						}
					}
				} else {
					var blurredData = tempImg.src;
				}
				var attachment = $source.css('backgroundAttachment');
				var position = (attachment == 'fixed') ? '' : '-' + (($glue.offset().left) - ($source.offset().left) - (options.offset.x)) + 'px -' + (($glue.offset().top) - ($source.offset().top) - (options.offset.y)) + 'px';
				$glue.css({
					'background-image': 'url("' + blurredData + '")',
					'background-repeat': $source.css('backgroundRepeat'),
					'background-position': position,
					'background-attachment': attachment
				});
				if(options.optClass != false) {
					$glue.addClass(options.optClass);
				}
				if(options.draggable) {
					$glue.css({
						'background-attachment': 'fixed',
						'background-position': '0 0'
					});
					$glue.draggable();
				}
			};
			Storage.prototype.cacheChecksum = function (opts) {
				var newData = '';
				for(var key in opts) {
					var obj = opts[key];
					if(obj.toString() == '[object Object]') {
						newData += ((obj.x).toString() + (obj.y).toString() + ",").replace(/[^a-zA-Z0-9]/g, "");
					} else {
						newData += (obj + ",").replace(/[^a-zA-Z0-9]/g, "");
					}
				}
				var originalData = this.getItem(options.cacheKeyPrefix + selector + '-' + formattedSource + '-options-cache');
				if(originalData != newData) {
					this.removeItem(options.cacheKeyPrefix + selector + '-' + formattedSource + '-options-cache');
					this.setItem(options.cacheKeyPrefix + selector + '-' + formattedSource + '-options-cache', newData);
					if(options.debug) {
						console.log('Settings Changed, Cache Emptied');
					}
				}
			};
			var cachedData = null;
			if(options.cache) {
				localStorage.cacheChecksum(options);
				cachedData = localStorage.getItem(options.cacheKeyPrefix + selector + '-' + formattedSource + '-data-image');
			}
			if(cachedData != null) {
				if(options.debug) {
					console.log('Cache Used');
				}
				isCached = true;
				tempImg.src = (cachedData);
			} else {
				if(options.debug) {
					console.log('Source Used');
				}
				tempImg.src = formattedSource;
			}
		});
	};
})(jQuery);