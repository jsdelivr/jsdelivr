(function (api, document, undef){
	'use strict';

	var
		min = Math.min,
		round = Math.round,
		getCanvas = function (){ return document.createElement('canvas'); },
		support = false,
		exifOrientation = {
			  8:	270
			, 3:	180
			, 6:	90
		}
	;

	try {
		support = getCanvas().toDataURL('image/png').indexOf('data:image/png') > -1;
	}
	catch (e){}


	function Image(file, low){
		if( !(this instanceof Image) ){
			return	new Image(file);
		}

		this.file   = file;
		this.better = !low;
		this.matrix	= {
			sx: 0,
			sy: 0,
			sw: 0,
			sh: 0,
			dx: 0,
			dy: 0,
			dw: 0,
			dh: 0,
			resize: 0, // min, max OR preview
			deg: 0
		};
	}
	Image.prototype = {
		constructor: Image,

		set: function (attrs){
			api.extend(this.matrix, attrs);
			return	this;
		},

		crop: function (x, y, w, h){
			if( w === undef ){
				w	= x;
				h	= y;
				x = y = 0;
			}
			return	this.set({ sx: x, sy: y, sw: w, sh: h || w });
		},

		resize: function (w, h, type){
			if( typeof h == 'string' ){
				type = h;
				h = w;
			}

			return	this.set({ dw: w, dh: h, resize: type });
		},

		preview: function (w, h){
			return	this.set({ dw: w, dh: h || w, resize: 'preview' });
		},

		rotate: function (deg){
			return	this.set({ deg: deg });
		},

		_load: function (image, fn){
			var self = this;
			api.readAsImage(image, function (evt){
				fn.call(self, evt.type != 'load', evt.result);
			});
		},

		_apply: function (image, fn){
			var
				  canvas = getCanvas()
				, m = this.getMatrix(image)
				, ctx = canvas.getContext('2d')
				, deg = m.deg
				, dw = m.dw
				, dh = m.dh
				, w = image.width
				, h = image.height
				, copy, buffer = image
			;


			if( this.better ){
				while( Math.min(w/dw, h/dh) > 2 ){
					w = ~~(w/2 + .5);
					h = ~~(h/2 + .5);

					copy = getCanvas();
					copy.width  = w;
					copy.height = h;

					if( buffer !== image ){
						copy.getContext('2d').drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, w, h);
						buffer = copy;
					}
					else {
						buffer = copy;
						buffer.getContext('2d').drawImage(image, m.sx, m.sy, m.sw, m.sh, 0, 0, w, h);
						m.sx = m.sy = m.sw = m.sh = 0;
					}
				}
			}

			canvas.width  = !(deg % 180) ? dw : dh;
			canvas.height =  (deg % 180) ? dw : dh;

			ctx.rotate(deg * Math.PI / 180);
			ctx.drawImage(buffer
				, m.sx, m.sy
				, m.sw || buffer.width
				, m.sh || buffer.height
				, (deg == 180 || deg == 270 ? -dw : 0)
				, (deg == 90 || deg == 180 ? -dh : 0)
				, dw, dh
			);

			fn.call(this, false, canvas);
		},

		getMatrix: function (image){
			var
				  m  = api.extend({}, this.matrix)
				, sw = m.sw = m.sw || image.width
				, sh = m.sh = m.sh || image.height
				, dw = m.dw = m.dw || m.sw
				, dh = m.dh = m.dh || m.sh
				, sf = sw/sh, df = dw/dh
				, type = m.resize
			;

			if( type == 'preview' ){
				if( dw != sw || dh != sh ){
					// Make preview
					var w, h;

					if( df >= sf ){
						w	= sw;
						h	= w / df;
					} else {
						h	= sh;
						w	= h * df;
					}

					if( w != sw || h != sh ){
						m.sx	= ~~((sw - w)/2);
						m.sy	= ~~((sh - h)/2);
						sw		= w;
						sh		= h;
					}
				}
			}
			else if( type ){
				if( type == 'min' ){
					dw = round(sf < df ? min(sw, dw) : dh*sf);
					dh = round(sf < df ? dw/sf : min(sh, dh));
				}
				else {
					dw = round(sf >= df ? min(sw, dw) : dh*sf);
					dh = round(sf >= df ? dw/sf : min(sh, dh));
				}
			}

			m.sw = sw;
			m.sh = sh;
			m.dw = dw;
			m.dh = dh;

			return	m;
		},

		_trans: function (fn){
			this._load(this.file, function (err, image){
				if( err ){
					fn(err);
				}
				else {
					this._apply(image, fn);
				}
			});
		},

		get: function (fn){
			if( api.support.transform ){
				var _this = this;

				if( _this.matrix.deg == 'auto' ){
					api.getInfo(this.file, function (err, info){
						// rotate by exif orientation
						_this.matrix.deg = exifOrientation[info && info.exif && info.exif.Orientation] || 0;
						_this._trans(fn);
					});
				}
				else {
					_this._trans(fn);
				}
			}
			else {
				fn('not_support');
			}
		},

		toData: function (fn){
			this.get(fn);
		}

	};


	Image.exifOrientation = exifOrientation;


	Image.transform = function (file, transform, autoOrientation, fn){
		api.getInfo(file, function (err, img){
			// img -- info object

			var
				  images = {}
				, queue = api.queue(function (err){
					fn(err, images);
				})
			;

			if( !err ){
				api.each(transform, function (params, name){
					if( !queue.isFail() ){
						var ImgTrans = Image(img.nodeType ? img : file);

						if( typeof params == 'function' ){
							params(img, ImgTrans);
						}
						else if( params.width ){
							ImgTrans[params.preview ? 'preview' : 'resize'](params.width, params.height, params.type);
						}
						else {
							if( params.maxWidth && (img.width > params.maxWidth || img.height > params.maxHeight) ){
								ImgTrans.resize(params.maxWidth, params.maxHeight, 'max');
							}
						}

						if( params.rotate === undef && autoOrientation ){
							params.rotate = 'auto';
						}

						ImgTrans.rotate(params.rotate);

						queue.inc();
						ImgTrans.toData(function (err, image){
							if( err ){
								queue.fail();
							}
							else {
								images[name] = image;
								queue.next();
							}
						});
					}
				});
			}
			else {
				queue.fail();
			}
		});
	};


	// @export
	api.support.canvas = api.support.transform = support;
	api.Image = Image;
})(FileAPI, document);
