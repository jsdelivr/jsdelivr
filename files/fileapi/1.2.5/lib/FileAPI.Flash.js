/**
 * FileAPI fallback to Flash
 *
 * @flash-developer  "Vladimir Demidov" <v.demidov@corp.mail.ru>
 */
(function (api, window, document){
	api.support.flash = (function (){
		var nav	= window.navigator, mime = nav.mimeTypes, has = false;

		if( nav.plugins && typeof nav.plugins['Shockwave Flash'] == 'object' ){
			has	= nav.plugins['Shockwave Flash'].description && !(mime && mime['application/x-shockwave-flash'] && !mime['application/x-shockwave-flash'].enabledPlugin);
		}
		else {
			try {
				has	= !!(window.ActiveXObject && new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
			}
			catch(er){
				api.log('ShockwaveFlash.ShockwaveFlash -- does not supported.')
			}
		}

		return	has;
	})();


	if( 1 && api.support.flash && (0 || !api.html5 || !api.support.html5 || api.cors && !api.support.cors) ) (function (){
		var
			  _attr  = api.uid()
			, _retry = 0
			, _files = {}
			, _rhttp = /^https?:/i

			, flash = {
				_fn: {},


				/**
				 * Initialization & preload flash object
				 */
				init: function (){
					var child = document.body && document.body.firstChild;

					if( child ){
						do {
							if( child.nodeType == 1 ){
								api.log('FlashAPI.Flash.init...');

								var dummy = document.createElement('div');

								_css(dummy, {
									  top: 1
									, right: 1
									, width: 5
									, height: 5
									, position: 'absolute'
								});

								child.parentNode.insertBefore(dummy, child);
								flash.publish(dummy, _attr);

								return;
							}
						}
						while( child = child.nextSibling )
					}

					if( _retry < 10 ){
						setTimeout(flash.init, ++_retry*50);
					}
				},


				/**
				 * Publish flash-object
				 *
				 * @param {HTMLElement} el
				 * @param {String} id
				 */
				publish: function (el, id){
					el.innerHTML = _makeFlashHTML({
						  id: id
						, src: _getUrl(api.flashUrl, 'r=' + api.version)
//						, src: _getUrl('http://v.demidov.boom.corp.mail.ru/uploaderfileapi/FlashFileAPI.swf?1')
						, wmode: 'transparent'
						, flashvars: 'callback=FileAPI.Flash.event'
							+ '&flashId='+ id
							+ '&storeKey='+ navigator.userAgent.match(/\d/ig).join('') +'_'+ api.version
							+ (flash.isReady || (api.pingUrl ? '&ping='+api.pingUrl : ''))
					});
				},


				ready: function (){
					flash.ready = api.F;
					flash.isReady = true;
					flash.patch();

					api.event.on(document, 'mouseover', flash.mouseover);
					api.event.on(document, 'click', function (evt){
						if( flash.mouseover(evt) ){
							evt.preventDefault
								? evt.preventDefault()
								: (evt.returnValue = true)
							;
						}
					});
				},

				getWrapper: function (node){
					do {
						if( /js-fileapi-wrapper/.test(node.className) ){
							return	node;
						}
					}
					while( (node = node.parentNode) && (node !== document.body) );
				},

				mouseover: function (evt){
					var target = api.event.fix(evt).target;

					if( /input/i.test(target.nodeName) && target.type == 'file' ){
						var state = target.getAttribute(_attr);

						// check state
						if( state == 'i' || state == 'r' ){
							// publish fail
							return	false;
						}
						else if( state != 'p' ){
							// set "init" state
							target.setAttribute(_attr, 'i');

							var
								  dummy = document.createElement('div')
								, wrapper = flash.getWrapper(target)
							;

							if( !wrapper ){
								api.log('flash.mouseover.error: js-fileapi-wrapper not found');
								return
							}

							_css(dummy, {
								  top:    0
								, left:   0
								, width:  target.offsetWidth + 100
								, height: target.offsetHeight + 100
								, zIndex: 1e6+'' // set max zIndex
								, position: 'absolute'
							});


							wrapper.appendChild(dummy);
							flash.publish(dummy, api.uid());

							// set "publish" state
							target.setAttribute(_attr, 'p');
						}

						return	true;
					}
				},

				event: function (evt){
					var type = evt.type;

					if( type == 'ready' ){
						try {
							// set "ready" state
							flash.getInput(evt.flashId).setAttribute(_attr, 'r');
						} catch (e){
						}

						flash.ready();
						setTimeout(function (){ flash.mouseenter(evt); }, 50);
						return	true;
					}
					else if( type === 'ping' ){
						api.log('(flash -> js).ping:', [evt.status, evt.savedStatus], evt.error);
					}
					else if( type === 'log' ){
						api.log('(flash -> js).log:', evt.target);
					}
					else if( type in flash ) setTimeout(function (){
						api.log('Flash.event.'+evt.type+':', evt);
						flash[type](evt);
					}, 1);
				},

				mouseenter: function (evt){
					var node = flash.getInput(evt.flashId);
					if( node ){
						// Set multiple mode
						flash.cmd(evt, 'multiple', node.getAttribute('multiple') != null);


						// Set files filter
						var accept = [], exts = {};

						api.each((node.getAttribute('accept') || '').split(/,\s*/), function (mime){
							api.accept[mime] && api.each(api.accept[mime].split(' '), function (ext){
								exts[ext] = 1;
							});
						});

						api.each(exts, function (i, ext){
							accept.push( ext );
						});

						flash.cmd(evt, 'accept', accept.length ? accept.join(',')+','+accept.join(',').toUpperCase() : '*');
					}
				},

				get: function (id){
					return	document[id] || window[id] || document.embeds[id];
				},

				getInput: function (id){
					try {
						var node = flash.getWrapper(flash.get(id));
						if( node ) return node.getElementsByTagName('input')[0];
					} catch (e){
						api.log('Can not find "input" by flashId:', id, e);
					}
				},

				select: function (evt){
					var
						  inp = flash.getInput(evt.flashId)
						, uid = api.uid(inp)
						, files = evt.target.files
						, event
					;

					api.each(files, function (file){
						api.checkFileObj(file);
					});

					_files[uid] = files;

					if( document.createEvent ){
						event = document.createEvent('Event');
						event.initEvent ('change', true, false);
						inp.dispatchEvent(event)
					}
					else if( document.createEventObject ){
						event = document.createEventObject();
						inp.fireEvent('onchange', event)
					}
				},


				cmd: function (id, name, data, last){
					try {
						api.log('(js -> flash).'+name+':', data);
						return flash.get(id.flashId || id).cmd(name, data);
					} catch (e){
						api.log('(js -> flash).onError:', e);
						if( !last ){
							// try again
							setTimeout(function (){ flash.cmd(id, name, data, true); }, 50);
						}
					}
				},


				patch: function (){
					api.flashEngine =
					api.support.transform = true;

					// FileAPI
					_inherit(api, {
						getFiles: function (input, filter, callback){
							if( callback ){
								api.filterFiles(api.getFiles(input), filter, callback);
								return null;
							}

							var files = api.isArray(input) ? input : _files[api.uid(input.target || input.srcElement || input)];


							if( !files ){
								// Файлов нету, вызываем родительский метод
								return	this.parent.apply(this, arguments);
							}


							if( filter ){
								filter	= api.getFilesFilter(filter);
								files	= api.filter(files, function (file){ return filter.test(file.name); });
							}

							return	files;
						},


						getInfo: function (file, fn){
							if( _isHtmlFile(file) ){
								this.parent.apply(this, arguments);
							}
							else {
								if( !file.__info ){
									var defer = file.__info = api.defer();

									flash.cmd(file, 'getFileInfo', {
										  id: file.id
										, callback: _wrap(function _(err, info){
											_unwrap(_);
											defer.resolve(err, file.info = info)
										})
									});
								}
								file.__info.then(fn);
							}
						}
					});


					// FileAPI.Image
					api.support.transform = true;
					api.Image && _inherit(api.Image.prototype, {
						get: function (fn, scaleMode){
							this.set({ scaleMode: scaleMode || 'noScale' }); // noScale, exactFit
							this.parent(fn);
						},

						_load: function (file, fn){
							api.log('FileAPI.Image._load:', file);

							if( _isHtmlFile(file) ){
								this.parent.apply(this, arguments);
							}
							else {
								var _this = this;
								api.getInfo(file, function (err, info){
									fn.call(_this, err, file);
								});
							}
						},

						_apply: function (file, fn){
							api.log('FileAPI.Image._apply:', file);

							if( _isHtmlFile(file) ){
								this.parent.apply(this, arguments);
							}
							else {
								var m = this.getMatrix(file.info);

								flash.cmd(file, 'imageTransform', {
									  id: file.id
									, matrix: m
									, callback: _wrap(function _(err, base64){
										api.log('FileAPI.Image._apply.callback:', err);
										_unwrap(_);

										if( err ){
											fn(err);
										}
										else if( !api.support.dataURI || base64.length > 3e4 ){
											_makeFlashImage({
												  width:	!(m.deg % 180) ? m.dw : m.dh
												, height:	(m.deg % 180) ? m.dw : m.dh
												, scale:	m.scaleMode
											}, base64, fn);
										}
										else {
											var img = new Image;
											api.event.one(img, 'error abort load', function (evt){
												fn(evt.type != 'load' && evt.type, img);
												img = null;
											});
											img.src = 'data:'+ file.type +';base64,'+ base64;
										}
									})
								});
							}
						},

						toData: function (fn){
							var file = this.file, info = file.info, matrix = this.getMatrix(info);

							if( _isHtmlFile(file) ){
								this.parent.apply(this, arguments);
							}
							else {
								if( matrix.deg == 'auto' ){
									matrix.deg = api.Image.exifOrientation[info && info.exif && info.exif.Orientation] || 0;
								}

								fn.call(this, !file.info, {
									  id:		file.id
									, flashId:	file.flashId
									, name:		file.name
									, type:		file.type
									, matrix:	matrix
								});
							}
						}
					});


					// FileAPI.Form
					_inherit(api.Form.prototype, {
						toData: function (fn){
							var items = this.items, i = items.length;

							for( ; i--; ){
								if( items[i].file && _isHtmlFile(items[i].blob) ){
									return this.parent.apply(this, arguments);
								}
							}

							api.log('flash.Form.toData');
							fn(items);
						}
					});


					// FileAPI.XHR
					_inherit(api.XHR.prototype, {
						_send: function (options, formData){
							if(
								   formData.nodeName
								|| formData.append && api.support.html5
								|| api.isArray(formData) && (typeof formData[0] === 'string')
							){
								// HTML5, Multipart or IFrame
								return	this.parent.apply(this, arguments);
							}


							var
								  data = {}
								, files = {}
								, _this = this
								, flashId
								, fileId
							;

							api.each(formData, function (item){
								if( item.file ){
									files[item.name] = item = _getFileDescr(item.blob);
									fileId  = item.id;
									flashId = item.flashId;
								}
								else {
									data[item.name] = item.blob;
								}
							});

							if( !(fileId || flashId) ){
								return this.parent.apply(this, arguments);
							} else {
								api.log('flash.XHR._send:', flashId, fileId, files);
							}

							_this.xhr = {
								headers: {},
								abort: function (){ flash.cmd(flashId, 'abort', { id: fileId }); },
								getResponseHeader: function (name){ return this.headers[name]; },
								getAllResponseHeaders: function (){ return this.headers; }
							};

							var queue = api.queue(function (){
								flash.cmd(flashId, 'upload', {
									  url: _getUrl(options.url)
									, data: data
									, files: files
									, headers: options.headers
									, callback: _wrap(function upload(evt){
										var type = evt.type, result = evt.result;

										api.log('flash.upload.'+type+':', evt);

										if( type == 'progress' ){
											evt.loaded = Math.min(evt.loaded, evt.total); // @todo fixme
											evt.lengthComputable = true;
											options.progress(evt);
										}
										else if( type == 'complete' ){
											_unwrap(upload);

											if( typeof result == 'string' ){
												_this.responseText	= result.replace(/%22/g, "\"").replace(/%5c/g, "\\").replace(/%26/g, "&").replace(/%25/g, "%");
											}

											_this.end(evt.status || 200);
										}
										else if( type == 'abort' || type == 'error' ){
											_this.end(evt.status || 0, evt.message);
											_unwrap(upload);
										}
									})
								});
							});


							// #2174: FileReference.load() call while FileReference.upload() or vice versa
							api.each(files, function (file){
								queue.inc();
								api.getInfo(file, queue.next);
							});

							queue.check();
						}
					});
				}
			}
		;


		function _makeFlashHTML(opts){
			return ('<object id="#id#" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+(opts.width || '100%')+'" height="'+(opts.height || '100%')+'">'
				+ '<param name="movie" value="#src#" />'
				+ '<param name="flashvars" value="#flashvars#" />'
				+ '<param name="swliveconnect" value="true" />'
				+ '<param name="allowscriptaccess" value="always" />'
				+ '<param name="allownetworking" value="all" />'
				+ '<param name="menu" value="false" />'
				+ '<param name="wmode" value="#wmode#" />'
				+ '<embed flashvars="#flashvars#" swliveconnect="true" allownetworking="all" allowscriptaccess="always" name="#id#" src="#src#" width="'+(opts.width || '100%')+'" height="'+(opts.height || '100%')+'" menu="false" wmode="transparent" type="application/x-shockwave-flash"></embed>'
				+ '</object>').replace(/#(\w+)#/ig, function (a, name){ return opts[name]; })
			;
		}


		function _css(el, css){
			if( el && el.style ){
				var key, val;
				for( key in css ){
					val = css[key];
					if( typeof val == 'number' ) val += 'px';
					try { el.style[key] = val; } catch (e) {}
				}
			}
		}


		function _inherit(obj, methods){
			api.each(methods, function (fn, name){
				var prev = obj[name];
				obj[name] = function (){
					this.parent = prev;
					return fn.apply(this, arguments);
				};
			});
		}

		function _isHtmlFile(file){
			return	file && !file.flashId;
		}

		function _wrap(fn){
			var id = fn.wid = api.uid();
			flash._fn[id] = fn;
			return	'FileAPI.Flash._fn.'+id;
		}


		function _unwrap(fn){
			try {
				flash._fn[fn.wid] = null;
				delete	flash._fn[fn.wid];
			}
			catch(e){}
		}


		function _getUrl(url, params){
			if( !_rhttp.test(url) ){
				if( /^\.\//.test(url) || '/' != url.charAt(0) ){
					var path = location.pathname;
					path = path.substr(0, path.lastIndexOf('/'));
					url = (path +'/'+ url).replace('/./', '/');
				}

				if( '//' != url.substr(0, 2) ){
					url = '//' + location.host + url;
				}

				if( !_rhttp.test(url) ){
					url = location.protocol + url;
				}
			}

			if( params ){
				url += (/\?/.test(url) ? '&' : '?') + params;
			}

			return	url;
		}


		function _makeFlashImage(opts, base64, fn){
			var _id, flashId = api.uid(), el = document.createElement('div');

			for( _id in opts ){
				el.setAttribute('data-img-' + _id, opts[_id]);
			}

			_css(el, opts);

			el.innerHTML = _makeFlashHTML(api.extend({
				  id: flashId
				, src: _getUrl(api.flashImageUrl, 'r='+ api.uid())
				, wmode: 'opaque'
				, flashvars: 'scale='+ opts.scale +'&callback='+_wrap(function _setData(){
					_unwrap(_setData);
					setTimeout(_setImage, 99);
					return true;
				})
			}, opts));

			function _setImage(){
				try {
					// Get flash-object by id
					var img = flash.get(flashId);
					img.setImage(base64);
				} catch (e){
					api.log('flash.setImage -- can not set "base64":', e);
				}
			}

			fn(false, el);
			el = null;
		}


		function _getFileDescr(file){
			return	{
				  id: file.id
				, name: file.name
				, matrix: file.matrix
				, flashId: file.flashId
			};
		}



		// @export
		api.Flash = flash;


		// Check dataURI support
		var dataURICheck = new Image;
		api.event.one(dataURICheck, 'error load', function (){
			api.support.dataURI = !(dataURICheck.width != 1 || dataURICheck.height != 1);
			dataURICheck = null;
			flash.init();
		});
		dataURICheck.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
	})();
})(FileAPI, window, document);
