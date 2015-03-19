/*global URL, webkitURL, dataURLtoBlob*/

(function (window, undef){
	'use strict';

	var
		gid = 1,
		noop = function (){},
		userAgent = navigator.userAgent,

		// https://github.com/blueimp/JavaScript-Load-Image/blob/master/load-image.js#L48
		apiURL = (window.createObjectURL && window) || (window.URL && URL.revokeObjectURL && URL) || (window.webkitURL && webkitURL),

		Blob = window.Blob,
		File = window.File,
		FileReader = window.FileReader,
		FormData = window.FormData,
		XMLHttpRequest = window.XMLHttpRequest,
		jQuery = window.jQuery,

		html5 =    !!(File && (FileReader && (window.Uint8Array || FormData || XMLHttpRequest.prototype.sendAsBinary)))
				&& !(/safari\//i.test(userAgent) && /windows/i.test(userAgent)), // BugFix: https://github.com/mailru/FileAPI/issues/25

		cors = html5 && ('withCredentials' in (new XMLHttpRequest)),
		
		chunked = html5 && !!Blob && !!(Blob.prototype.webkitSlice||Blob.prototype.mozSlice||Blob.prototype.slice),

		document = window.document,

		// https://github.com/blueimp/JavaScript-Canvas-to-Blob
		dataURLtoBlob = window.dataURLtoBlob,

		_rimg = /img/i,
		_rcanvas = /canvas/i,
		_rimgcanvas = /img|canvas/,
		_rinput = /input/i,
		_rdata = /^data:[^,]+,/,

		_pow = Math.pow,
		_round = Math.round,
		_num = Number,
		_from = function (sz) { return _round(sz * this); },

		_KB = new _num(1024),
		_MB = new _num(_pow(_KB, 2)),
		_GB = new _num(_pow(_KB, 3)),
		_TB = new _num(_pow(_KB, 4)),

		_elEvents = {}, // element event listeners
		_infoReader = [], // list of file info processors

		_readerEvents = 'abort progress error load loadend',
		_xhrPropsExport = 'status statusText readyState response responseXML responseText responseBody'.split(' '),

		currentTarget = 'currentTarget',
		preventDefault = 'preventDefault',

		api = {
			version: '1.2.5',

			cors: false,
			html5: true,
			debug: false,
			pingUrl: false,

			staticPath: './',

			flashUrl: 0, // @default: './FileAPI.flash.swf'
			flashImageUrl: 0, // @default: './FileAPI.flash.image.swf'

			// Fallback for flash
			accept: {
				  'image/*': 'art bm bmp dwg dxf cbr cbz fif fpx gif ico iefs jfif jpe jpeg jpg jps jut mcf nap nif pbm pcx pgm pict pm png pnm qif qtif ras rast rf rp svf tga tif tiff xbm xbm xpm xwd'
				, 'audio/*': 'm4a flac aac rm mpa wav wma ogg mp3 mp2 m3u mod amf dmf dsm far gdm imf it m15 med okt s3m stm sfx ult uni xm sid ac3 dts cue aif aiff wpl ape mac mpc mpp shn wv nsf spc gym adplug adx dsp adp ymf ast afc hps xs'
				, 'video/*': 'm4v 3gp nsv ts ty strm rm rmvb m3u ifo mov qt divx xvid bivx vob nrg img iso pva wmv asf asx ogm m2v avi bin dat dvr-ms mpg mpeg mp4 mkv avc vp3 svq3 nuv viv dv fli flv wpl'
			},

			chunkSize : 0,
			chunkUploadRetry : 0,
			chunkNetworkDownRetryTimeout : 2000, // milliseconds, don't flood when network is down

			KB: (_KB.from = _from, _KB),
			MB: (_MB.from = _from, _MB),
			GB: (_GB.from = _from, _GB),
			TB: (_TB.from = _from, _TB),

			expando: 'fileapi' + (new Date).getTime(),

			uid: function (obj){
				return	obj
					? (obj[api.expando] = obj[api.expando] || api.uid())
					: (++gid, api.expando + gid)
				;
			},

			log: function (){
				if( api.debug && window.console && console.log ){
					if( console.log.apply ){
						console.log.apply(console, arguments);
					}
					else {
						console.log([].join.call(arguments, ' '));
					}
				}
			},

			getXHR: function (){
				var xhr;

				if( XMLHttpRequest ){
					xhr = new XMLHttpRequest;
				}
				else if( window.ActiveXObject ){
					try {
						xhr = new ActiveXObject('MSXML2.XMLHttp.3.0');
					} catch (e) {
						xhr = new ActiveXObject('Microsoft.XMLHTTP');
					}
				}

				return  xhr;
			},

			isArray: isArray,

			support: {
				dnd:     cors && ('ondrop' in document.createElement('div')),
				cors:    cors,
				html5:   html5,
				chunked: chunked,
				dataURI: true
			},

			event: {
				  on: _on
				, off: _off
				, one: _one
				, fix: _fixEvent
			},


			throttle: function(fn, delay) {
				var id, args;

				return function _throttle(){
					args = arguments;

					if( !id ){
						fn.apply(window, args);
						id = setTimeout(function (){
							id = 0;
							fn.apply(window, args);
						}, delay);
					}
				};
			},


			F: function (){},


			parseJSON: function (str){
				var json;
				if( window.JSON && JSON.parse ){
					json = JSON.parse(str);
				}
				else {
					json = (new Function('return ('+str.replace(/([\r\n])/g, '\\$1')+');'))();
				}
				return json;
			},


			trim: function (str){
				str = String(str);
				return	str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
			},

			/**
			 * Simple Defer
			 * @return	{Object}
			 */
			defer: function (){
				var
					  list = []
					, result
					, error
					, defer = {
						resolve: function (err, res){
							defer.resolve = noop;
							error	= err || false;
							result	= res;

							while( res = list.shift() ){
								res(error, result);
							}
						},

						then: function (fn){
							if( error !== undef ){
								fn(error, result);
							} else {
								list.push(fn);
							}
						}
				};

				return	defer;
			},

			queue: function (fn){
				var
					  _idx = 0
					, _length = 0
					, _fail = false
					, _end = false
					, queue = {
						inc: function (){
							_length++;
						},

						next: function (){
							_idx++;
							setTimeout(queue.check, 0);
						},

						check: function (){
							(_idx >= _length) && !_fail && queue.end();
						},

						isFail: function (){
							return _fail;
						},

						fail: function (){
							!_fail && fn(_fail = true);
						},

						end: function (){
							if( !_end ){
								_end = true;
								fn();
							}
						}
					}
				;
				return queue;
			},


			/**
			 * For each object
			 *
			 * @param	{Object|Array}	obj
			 * @param	{Function}		fn
			 * @param	{*}				[ctx]
			 */
			each: _each,


			/**
			 * Async for
			 *
			 * @param	{Array}	array
			 */
			afor: function (array, callback){
				var i = 0, n = array.length;

				if( isArray(array) && n-- ){
					(function _next(){
						callback(n != i && _next, array[i], i++);
					})();
				}
				else {
					callback(false);
				}
			},



			/**
			 * Merge the contents of two or more objects together into the first object
			 *
			 * @param	{Object}	dst
			 * @param	{Object}	[src]
			 * @return	{Object}
			 */
			extend: function (dst){
				_each(arguments, function (src){
					_each(src, function (val, key){
						dst[key] = val;
					});
				});
				return  dst;
			},


			/**
			 * Is file instance
			 *
			 * @param  {File}  file
			 * @return {Boolean}
			 */
			isFile: function (file){
				return	html5 && file && (file instanceof File);
			},


			/**
			 * Is canvas element
			 *
			 * @param	{HTMLElement}	el
			 * @return	{Boolean}
			 */
			isCanvas: function (el){
				return	el && _rcanvas.test(el.nodeName);
			},


			getFilesFilter: function (filter){
				filter = typeof filter == 'string' ? filter : (filter.getAttribute && filter.getAttribute('accept') || '');
				return	filter ? new RegExp('('+ filter.replace(/\./g, '\\.').replace(/,/g, '|') +')$', 'i') : /./;
			},



			/**
			 * Read as DataURL
			 *
			 * @param {File|Element} file
			 * @param {Function} fn
			 */
			readAsDataURL: function (file, fn){
				if( api.isCanvas(file) ){
					_emit(file, fn, 'load', api.toDataURL(file));
				}
				else {
					_readAs(file, fn, 'DataURL');
				}
			},


			/**
			 * Read as Binary string
			 *
			 * @param {File} file
			 * @param {Function} fn
			 */
			readAsBinaryString: function (file, fn){
				if( _hasSupportReadAs('BinaryString') ){
					_readAs(file, fn, 'BinaryString');
				} else {
					// Hello IE10!
					_readAs(file, function (evt){
						if( evt.type == 'load' ){
							try {
								// dataURL -> binaryString
								evt.result = api.toBinaryString(evt.result);
							} catch (e){
								evt.type = 'error';
								evt.message = e.toString();
							}
						}
						fn(evt);
					}, 'DataURL');
				}
			},


			/**
			 * Read as ArrayBuffer
			 *
			 * @param {File} file
			 * @param {Function} fn
			 */
			readAsArrayBuffer: function(file, fn){
				_readAs(file, fn, 'ArrayBuffer');
			},


			/**
			 * Read as text
			 *
			 * @param {File} file
			 * @param {String} encoding
			 * @param {Function} fn
			 */
			readAsText: function(file, encoding, fn){
				if( !fn ){
					fn	= encoding;
					encoding = 'utf-8';
				}

				_readAs(file, fn, 'Text', encoding);
			},


			/**
			 * Convert image or canvas to DataURL
			 *
			 * @param   {Element}   el    Image or Canvas element
			 * @return  {String}
			 */
			toDataURL: function (el){
				if( typeof el == 'string' ){
					return  el;
				}
				else if( el.toDataURL ){
					return  el.toDataURL('image/png');
				}
			},


			/**
			 * Canvert string, image or canvas to binary string
			 *
			 * @param   {String|Element} val
			 * @return  {String}
			 */
			toBinaryString: function (val){
				return  window.atob(api.toDataURL(val).replace(_rdata, ''));
			},


			/**
			 * Read file or DataURL as ImageElement
			 *
			 * @param	{File|String}	file
			 * @param	{Function}		fn
			 * @param	{Boolean}		[progress]
			 */
			readAsImage: function (file, fn, progress){
				if( api.isFile(file) ){
					if( apiURL ){
						/** @namespace apiURL.createObjectURL */
						var data = apiURL.createObjectURL(file);
						if( data === undef ){
							_emit(file, fn, 'error');
						}
						else {
							api.readAsImage(data, fn, progress);
						}
					}
					else {
						api.readAsDataURL(file, function (evt){
							if( evt.type == 'load' ){
								api.readAsImage(evt.result, fn, progress);
							}
							else if( progress || evt.type == 'error' ){
								_emit(file, fn, evt, null, { loaded: evt.loaded, total: evt.total });
							}
						});
					}
				}
				else if( api.isCanvas(file) ){
					_emit(file, fn, 'load', file);
				}
				else if( _rimg.test(file.nodeName) ){
					if( file.complete ){
						_emit(file, fn, 'load', file);
					}
					else {
						var events = 'error abort load';
						_one(file, events, function _fn(evt){
							if( evt.type == 'load' && apiURL ){
								/** @namespace apiURL.revokeObjectURL */
								apiURL.revokeObjectURL(file.src);
							}

							_off(file, events, _fn);
							_emit(file, fn, evt, file);
						});
					}
				}
				else if( file.iframe ){
					_emit(file, fn, { type: 'error' });
				}
				else {
					// Created image
					var img = new Image;
					img.src = file.dataURL || file;
					api.readAsImage(img, fn, progress);
				}
			},


			/**
			 * Make file by name
			 *
			 * @param	{String}	name
			 * @return	{Array}
			 */
			checkFileObj: function (name){
				var file = {}, accept = api.accept;

				if( typeof name == 'object' ){
					file = name;
				}
				else {
					file.name = (name + '').split(/\\|\//g).pop();
				}

				if( file.type == null ){
					file.type = file.name.split('.').pop();
				}

				_each(accept, function (ext, type){
					ext = new RegExp(ext.replace(/\s/g, '|'), 'i');
					if( ext.test(file.type) ){
						file.type = type.split('/')[0] +'/'+ file.type;
					}
				});

				return	file;
			},


			/**
			 * Get drop files
			 *
			 * @param	{Event}	evt
			 * @param	{Function} callback
			 */
			getDropFiles: function (evt, callback){
				var
					  files = []
					, dataTransfer = _getDataTransfer(evt)
					, entrySupport = isArray(dataTransfer.items) && dataTransfer.items[0] && _getAsEntry(dataTransfer.items[0])
					, queue = api.queue(function (){ callback(files); })
				;

				_each((entrySupport ? dataTransfer.items : dataTransfer.files) || [], function (item){
					queue.inc();
					if( entrySupport ){
						_readEntryAsFiles(item, function (err, entryFiles){
							!err && files.push.apply(files, entryFiles);
							queue.next();
						});
					}
					else {
						_isRegularFile(item, function (yes){
							yes && files.push(item);
							queue.next();
						});
					}
				});

				queue.check();
			},


			/**
			 * Get file list
			 *
			 * @param	{HTMLInput|Event}	input
			 * @param	{String|Function}	[filter]
			 * @param	{Function}			[callback]
			 * @return	{Array|Null}
			 */
			getFiles: function (input, filter, callback){
				var files = [];

				if( callback ){
					api.filterFiles(api.getFiles(input), filter, callback);
					return null;
				}

				if( input.jquery ){
					// jQuery object
					input.each(function (){
						files = files.concat(api.getFiles(this));
					});
					input	= files;
					files	= [];
				}

				if( typeof filter == 'string' ){
					filter	= api.getFilesFilter(filter);
				}

				if( input.originalEvent ){
					// jQuery event
					input = _fixEvent(input.originalEvent);
				}
				else if( input.srcElement ){
					// IE Event
					input = _fixEvent(input);
				}


				if( input.dataTransfer ){
					// Drag'n'Drop
					input = input.dataTransfer;
				}
				else if( input.target ){
					// Event
					input = input.target;
				}

				if( input.files ){
					// Input[type="file"]
					files = input.files;
				}
				else if( !html5 && isInputFile(input) ){
					if( api.trim(input.value) ){
						files = [api.checkFileObj(input.value)];
						files[0].blob   = input;
						files[0].iframe = true;
					}
				}
				else if( isArray(input) ){
					files	= input;
				}

				return	api.filter(files, function (file){ return !filter || filter.test(file.name); });
			},


			/**
			 * Get image information
			 *
			 * @param	{File}		file
			 * @param	{Function}	fn
			 */
			getInfo: function (file, fn){
				var info = {}, readers = _infoReader.concat();

				if( api.isFile(file) ){
					(function _next(){
						var reader = readers.shift();
						if( reader ){
							if( reader.test(file.type) ){
								reader(file, function (err, res){
									if( err ){
										fn(err);
									}
									else {
										api.extend(info, res);
										_next();
									}
								});
							}
							else {
								_next();
							}
						}
						else {
							fn(false, info);
						}
					})();
				}
				else {
					fn('not_support', info);
				}
			},


			/**
			 * Add information reader
			 *
			 * @param {RegExp} mime
			 * @param {Function} fn
			 */
			addInfoReader: function (mime, fn){
				fn.test = function (type){ return mime.test(type) };
				_infoReader.push(fn);
			},


			/**
			 * Filter of array
			 *
			 * @param	{Array}		input
			 * @param	{Function}	fn
			 * @return	{Array}
			 */
			filter: function (input, fn){
				var result = [], i = 0, n = input.length, val;
				for( ; i < n; i++ ) if( i in input ){
					val = input[i];
					if( fn.call(val, val, i, input) ){
						result.push(val);
					}
				}
				return	result;
			},


			/**
			 * Filter files
			 *
			 * @param	{Array}		files
			 * @param	{Function}	eachFn
			 * @param	{Function}	resultFn
			 */
			filterFiles: function (files, eachFn, resultFn){
				if( files.length ){
					// HTML5 or Flash
					var queue = files.concat(), file, result = [], deleted = [];

					(function _next(){
						if( queue.length ){
							file = queue.shift();
							api.getInfo(file, function (err, info){
								(eachFn(file, err ? false : info) ? result : deleted).push(file);
								_next();
							});
						}
						else {
							resultFn(result, deleted);
						}
					})();
				}
				else {
					resultFn([], files);
				}
			},


			upload: function (options){
				options = api.extend({
					  prepare: api.F
					, beforeupload: api.F
					, upload: api.F
					, fileupload: api.F
					, fileprogress: api.F
					, filecomplete: api.F
					, progress: api.F
					, complete: api.F
					, pause: api.F
					, chunkSize: api.chunkSize
					, chunkUpoloadRetry: api.chunkUploadRetry
				}, options);

				if( options.imageAutoOrientation && !options.imageTransform ){
					options.imageTransform	= { rotate: 'auto' };
				}


				var
					  proxyXHR = new api.XHR(options)
					, dataArray = this._getFilesDataArray(options.files)
					, total = 0
					, loaded = 0
					, _loaded = 0
					, _part = 1 // part of total size
					, _this = this
					, _nextFile
					, _complete = false
				;


				// calc total size
				_each(dataArray, function (data){
					total += data.size;
				});

				// Array of files
				proxyXHR.files = [];
				_each(dataArray, function (data){
					proxyXHR.files.push(data.file);
				});

				// Set upload status props
				proxyXHR.total	= total;
				proxyXHR.loaded	= 0;

				// emit "beforeupload"  event
				options.beforeupload(proxyXHR, options);
				// Upload by file
				( _nextFile = function _nextFile(){
					var
						  data = dataArray.shift()
						, _file = data && data.file
						, _fileLoaded = false
						, _fileOptions = _simpleClone(options)
					;

					if( _file && _file.name === api.expando ){
						_file = null;
						api.log('[warn] FileAPI.upload() — called without files')
					}

					if( ( proxyXHR.statusText != 'abort' || proxyXHR.current ) && data ){
					    // Mark active job
					    _complete = false;

						// Set current upload file
						proxyXHR.currentFile = _file;

						// Prepare file options
						_file && options.prepare(_file, _fileOptions);

						this._getFormData(_fileOptions, data, function (form){
							if( !loaded ){
								// emit "upload" event
								options.upload(proxyXHR, options);
							}

							var xhr = new api.XHR(api.extend({}, _fileOptions, {

								upload: _file ? function (){
									// emit "fileupload" event
									options.fileupload(_file, xhr, _fileOptions);
								} : noop,

								progress: _file ? function (evt){
									if( !_fileLoaded ){
										loaded += (total * _part * (evt.loaded/evt.total) - _loaded + .5)|0;
										_loaded = loaded;

										data.total	= evt.total;
										data.loaded	= evt.loaded;

										// emit "fileprogress" event
										options.fileprogress(evt, _file, xhr, _fileOptions);

										// emit "progress" event
										options.progress({
											  type:   evt.type
											, total:  total
											, loaded: proxyXHR.loaded = loaded
											, lengthComputable: true
										}, _file, xhr, _fileOptions);
									}
								} : noop,

								complete: function (err){
									_each(_xhrPropsExport, function (name){
										proxyXHR[name] = xhr[name];
									});

									// fixed throttle event
									_fileLoaded = true;

									if( _file ){
										data.loaded	= data.total;

										// bytes loaded
										proxyXHR.loaded = (loaded += (loaded - _loaded) + (total*_part + .5)|0);

										// emit "filecomplete" event
										options.filecomplete(err, xhr, _file, _fileOptions);
									}

									// upload next file
									_nextFile.call(_this);
								}
							})); // xhr


							// share of file size from the total size
							_part = data.size / total;

							// ...
							proxyXHR.abort = function (current){ this.current = current; xhr.abort(); };

							// Start upload
							xhr.send(form);
						});
					}
					else {
						options.complete(proxyXHR.status == 200 || proxyXHR.status == 201 ? false : (proxyXHR.statusText || 'error'), proxyXHR, options);
						// Mark done state
						_complete = true;
					}
				}).call(this);

				// Append more files to the existing request
				// first - add them to the queue head/tail
				proxyXHR.append = function (files, first) {
					files = api._getFilesDataArray([].concat(files));

					_each(files, function (data) {
						total += data.size;
						proxyXHR.files.push(data.file);
						if (first) {
							dataArray.unshift(data);
						} else {
							dataArray.push(data);
						}
					});

					if (_complete) {
						_nextFile.call(_this);
					}
				}

				// Removes file from queue by file reference and returns it
				proxyXHR.remove = function (file) {
				    var idx = -1;
					_each(dataArray, function (data) {
						idx++;
						if (data.file == file) {
							return dataArray.splice(idx, 1);
						}
					});
				}

				return proxyXHR;
			},


			_getFilesDataArray: function (data){
				var files = [], oFiles = {};

				if( isInputFile(data) ){
					var tmp = api.getFiles(data);
					oFiles[data.name || 'file'] = data.getAttribute('multiple') !== null ? tmp : tmp[0];
				}
				else if( isArray(data) && isInputFile(data[0]) ){
					_each(data, function (input){
						oFiles[input.name || 'file'] = api.getFiles(input);
					});
				}
				else {
					oFiles = data;
				}

				_each(oFiles, function add(file, name){
					if( isArray(file) ){
						_each(file, function (file, idx){
							add(file, name);
						});
					}
					else if( file && file.name ){
						files.push({
							  name: name
							, file: file
							, size: file.size
							, total: file.size
							, loaded: 0
						});
					}
				});

				if( !files.length ){
					// Create fake `file` object
					files.push({ file: { name: api.expando } });
				}

				return	files;
			},


			_getFormData: function (options, data, fn){
				var
					  file = data.file
					, name = data.name
					, filename = file.name
					, filetype = file.type
					, trans = api.support.transform && options.imageTransform
					, Form = new api.Form
					, queue = api.queue(function (){ fn(Form); })
					, isOrignTrans = trans && (parseInt(trans.maxWidth || trans.minWidth || trans.width, 10) > 0 || trans.rotate)
				;


				if( api.Image && trans && (/image/.test(file.type) || _rimgcanvas.test(file.nodeType)) ){
					queue.inc();

					if( isOrignTrans ){
						// Convert to array for transform function
						trans = [trans];
					}

					api.Image.transform(file, trans, options.imageAutoOrientation, function (err, images){
						if( isOrignTrans && !err ){
							if( !dataURLtoBlob && !api.flashEngine ){
								images[0] = api.toBinaryString(images[0]);
								Form.multipart = true;
							}

							Form.append(name, images[0], filename, filetype);
						}
						else {
							if( !err ){
								_each(images, function (image, idx){
									if( !dataURLtoBlob && !api.flashEngine ){
										image = api.toBinaryString(image);
										Form.multipart = true;
									}

									Form.append(name +'['+ idx +']', image, filename, filetype);
								});

								name += '[original]';
							}

							if( err || options.imageOriginal ){
								Form.append(name, file, filename, filetype);
							}
						}

						queue.next();
					});
				}
				else if( filename !== api.expando ){
					Form.append(name, file, filename);
				}

				// Append data
				_each(options.data, function add(val, name){
					if( typeof val == 'object' ){
						_each(val, function (v, i){
							add(v, name+'['+i+']');
						});
					}
					else {
						Form.append(name, val);
					}
				});

				queue.check();
			},


			reset: function (inp){
				var parent, clone;

				if( jQuery ){
					clone = jQuery(inp).clone(true).insertBefore(inp).val('')[0];
					jQuery(inp).remove();
				} else {
					parent  = inp.parentNode;
					clone   = parent.insertBefore(inp.cloneNode(true), inp);
					clone.value = '';
					parent.removeChild(inp);

					_each(_elEvents[api.uid(inp)], function (fns, type){
						_each(fns, function (fn){
							_off(inp, type, fn);
							_on(clone, type, fn);
						})
					});
				}

				return  clone;
			},


			/**
			 * Load remote file
			 *
			 * @param   {String}    url
			 * @param   {Function}  fn
			 * @return  {XMLHttpRequest}
			 */
			load: function (url, fn){
				var xhr = api.getXHR();
				if( xhr ){
					xhr.open('GET', url, true);

					if( xhr.overrideMimeType ){
				        xhr.overrideMimeType('text/plain; charset=x-user-defined');
					}

					_on(xhr, 'progress', function (/**Event*/evt){
						/** @namespace evt.lengthComputable */
						if( evt.lengthComputable ){
							fn({ type: evt.type, loaded: evt.loaded, total: evt.total }, xhr);
						}
					});

					xhr.onreadystatechange = function(){
						if( xhr.readyState == 4 ){
							xhr.onreadystatechange = null;
							if( xhr.status == 200 ){
								url = url.split('/');
								/** @namespace xhr.responseBody */
								var file = {
								      name: url[url.length-1]
									, size: xhr.getResponseHeader('Content-Length')
									, type: xhr.getResponseHeader('Content-Type')
								};
								file.dataURL = 'data:'+file.type+';base64,' + api.encode64(xhr.responseBody || xhr.responseText);
								fn({ type: 'load', result: file });
							}
							else {
								fn({ type: 'error' });
							}
					    }
					};
				    xhr.send(null);
				} else {
					fn({ type: 'error' });
				}

				return  xhr;
			},

			encode64: function (str){
				var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', outStr = '', i = 0;

				if( typeof str !== 'string' ){
					str	= String(str);
				}

				while( i < str.length ){
					//all three "& 0xff" added below are there to fix a known bug
					//with bytes returned by xhr.responseText
					var
						  byte1 = str.charCodeAt(i++) & 0xff
						, byte2 = str.charCodeAt(i++) & 0xff
						, byte3 = str.charCodeAt(i++) & 0xff
						, enc1 = byte1 >> 2
						, enc2 = ((byte1 & 3) << 4) | (byte2 >> 4)
						, enc3, enc4
					;

					if( isNaN(byte2) ){
						enc3 = enc4 = 64;
					} else {
						enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
						enc4 = isNaN(byte3) ? 64 : byte3 & 63;
					}

					outStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
				}

				return  outStr;
			}

		} // api
	;
	

	function _each(obj, fn, ctx){
		if( obj ){
			if( isArray(obj) ){
				for( var i = 0, n = obj.length; i < n; i++ ){ if( i in obj )
					fn.call(ctx, obj[i], i, obj);
				}
			}
			else {
				for( var key in obj ) if( obj.hasOwnProperty(key) ){
					fn.call(ctx, obj[key], key, obj);
				}
			}
		}
	}


	// @private methods
	function _on(el, type, fn){
		if( el ){
			var uid = api.uid(el);

			if( !_elEvents[uid] ){
				_elEvents[uid] = {};
			}

			_each(type.split(/\s+/), function (type){
				if( jQuery ){
					jQuery.event.add(el, type, fn);
				}
				else {
					if( !_elEvents[uid][type] ){
						_elEvents[uid][type] = []
					}
					_elEvents[uid][type].push(fn);


					if( el.addEventListener ) el.addEventListener(type, fn, false);
					else if( el.attachEvent ) el.attachEvent('on'+type, fn);
					else el['on'+type] = fn;
				}
			});
		}
	}


	function _off(el, type, fn){
		if( el ){
			var uid = api.uid(el), events = _elEvents[uid] || {};

			_each(type.split(/\s+/), function (type){
				if( jQuery ){
					jQuery.event.remove(el, type, fn);
				}
				else {
					var fns = events[type] || [], i = fns.length;

					while( i-- ){
						if( fns[i] === fn ){
							fns.splice(i, 1);
							break;
						}
					}

					if( el.addEventListener ) el.removeEventListener(type, fn, false);
					else if( el.detachEvent ) el.detachEvent('on'+type, fn);
					else el['on'+type] = null;
				}
			});
		}
	}


	function _one(el, type, fn){
		_on(el, type, function _(evt){
			_off(el, type, _);
			fn(evt);
		});
	}


	function _emit(target, fn, name, res, ext){
		var evt = {
			  type:		name.type || name
			, target:	target
			, result:	res
		};
		api.extend(evt, ext);
		fn(evt);
	}


	function _hasSupportReadAs(as){
		return	FileReader && !!FileReader.prototype['readAs'+as];
	}


	function _readAs(file, fn, as, encoding){
		if( api.isFile(file) && _hasSupportReadAs(as) ){
			var Reader = new FileReader;

			// Add event listener
			_on(Reader, _readerEvents, function _fn(evt){
				var type = evt.type;
				if( type == 'progress' ){
					_emit(file, fn, evt, evt.target.result, { loaded: evt.loaded, total: evt.total })
				}
				else if( type == 'loadend' ){
					_off(Reader, _readerEvents, _fn);
					Reader = null;
				}
				else {
					_emit(file, fn, evt, evt.target.result);
				}
			});


			try {
				// ReadAs ...
				if( encoding ){
					Reader['readAs'+as](encoding, file);
				}
				else {
					Reader['readAs'+as](file);
				}
			}
			catch (err){
				_emit(file, fn, 'error', undef, { error: err.toString() });
			}
		}
		else {
			_emit(file, fn, 'error', undef, { error: 'filreader_not_support_'+as });
		}
	}


	function _isRegularFile(file, callback){
		// http://stackoverflow.com/questions/8856628/detecting-folders-directories-in-javascript-filelist-objects
		if( !file.type && (file.size % 4096) == 0 && (file.size <= 102400) ){
			if( FileReader ){
				try {
					var Reader = new FileReader();

					_one(Reader, _readerEvents, function (evt){
						var isFile = evt.type != 'error';
						callback(isFile);
						if( isFile ){
							Reader.abort();
						}
					});

					Reader.readAsDataURL(file);
				} catch( err ){
					callback(false);
				}
			}
			else {
				callback(null)
			}
		}
		else {
			callback(true);
		}
	}


	function _getAsEntry(item){
		var entry;
		if( item.getAsEntry ) entry = item.getAsEntry();
		else if( item.webkitGetAsEntry ) entry = item.webkitGetAsEntry();
		return	entry;
	}


	function _readEntryAsFiles(entry, callback){
		if( !entry ){
			// error
			callback('empty_entry');
		}
		else if( entry.isFile ){
			// Read as file
			entry.file(function(file){
				// success
				callback(false, [file]);
			}, function (){
				// error
				callback('entry_file');
			});
		}
		else if( entry.isDirectory ){
			var reader = entry.createReader(), result = [];

			reader.readEntries(function(entries, i){
				// success
				api.afor(entries, function (next, entry){
					_readEntryAsFiles(entry, function (err, files){
						if( !err ){
							result = result.concat(files);
						}

						if( next ){
							next();
						}
						else {
							callback(false, result);
						}
					});
				});
			}, function (){
				// error
				callback('directory_reader');
			});
		}
		else {
			_readEntryAsFiles(_getAsEntry(entry), callback);
		}
	}


	function isArray(ar) {
		return	(typeof ar == 'object') && ar && ('length' in ar);
	}


	function _simpleClone(obj){
		var copy = {};
		_each(obj, function (val, key){
			if( val && (typeof val === 'object') ){
				val = api.extend({}, val);
			}
			copy[key] = val;
		});
		return	copy;
	}


	function isInputFile(el){
		return	_rinput.test(el && el.tagName);
	}


	function _getDataTransfer(evt){
		return	(evt.originalEvent || evt || '').dataTransfer || {};
	}


	function _fixEvent(evt){
		if( !evt.target ) evt.target = window.event && window.event.srcElement || document;
		if( evt.target.nodeType === 3 ) evt.target = event.target.parentNode;
		return  evt;
	}


	// Add default image info reader
	api.addInfoReader(/^image/, function (file/**File*/, callback/**Function*/){
		if( !file.__dimensions ){
			var defer = file.__dimensions = api.defer();

			api.readAsImage(file, function (evt){
				var img = evt.target;
				defer.resolve(evt.type == 'load' ? false : 'error', {
					  width:  img.width
					, height: img.height
				});
				img = null;
			});
		}

		file.__dimensions.then(callback);
	});


	// Special event
	api.event.dnd = function (el, onHover, onDrop){
		var _id, _type;

		if( !onDrop ){
			onDrop = onHover;
			onHover = api.F;
		}

		if( FileReader ){
			_on(el, 'dragenter dragleave dragover', function (evt){
				var types = _getDataTransfer(evt).types, i = types && types.length;

				while( i-- ){
					if( ~types[i].indexOf('File') ){
						evt[preventDefault]();

						if( _type !== evt.type ){
							_type = evt.type;

							if( _type != 'dragleave' ){
								onHover.call(evt[currentTarget], true, evt);
							}

							clearTimeout(_id);
							_id = setTimeout(function (){
								onHover.call(evt[currentTarget], _type != 'dragleave', evt);
							}, 50);
						}
					}
				}
			});

			_on(el, 'drop', function (evt){
				evt[preventDefault]();

				_type = 0;
				onHover.call(evt[currentTarget], false, evt);

				api.getDropFiles(evt, function (files){
					onDrop.call(evt[currentTarget], files, evt);
				});
			});
		}
		else {
			api.log("Drag'n'Drop -- not supported");
		}
	};


	// Support jQuery
	if( jQuery && !jQuery.fn.dnd ){
		jQuery.fn.dnd = function (onHover, onDrop){
			return this.each(function (){
				api.event.dnd(this, onHover, onDrop);
			});
		};
	}


	// @export
	window.FileAPI  = api.extend(api, window.FileAPI);


	// @configuration
	if( !api.flashUrl ) api.flashUrl = api.staticPath + 'FileAPI.flash.swf';
	if( !api.flashImageUrl ) api.flashImageUrl = api.staticPath + 'FileAPI.flash.image.swf';
})(window);
