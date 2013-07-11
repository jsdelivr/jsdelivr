(function (window, api){
	var
		  noop = function (){}

		, XHR = function (options){
			this.uid = api.uid();
			this.xhr = {
				  abort: noop
				, getResponseHeader: noop
				, getAllResponseHeaders: noop
			};
			this.options = options;
		}
	;


	XHR.prototype = {
		status: 0,
		statusText: '',

		getResponseHeader: function (name){
			return this.xhr.getResponseHeader(name);
		},

		getAllResponseHeaders: function (){
			return this.xhr.getAllResponseHeaders() || {};
		},

		end: function (status, statusText){
			var _this = this, options = _this.options;

			_this.end		=
			_this.abort		= noop;
			_this.status	= status;

			if( statusText ){
				_this.statusText = statusText;
			}

			api.log('xhr.end:', status, statusText);
			options.complete(status == 200 || status == 201 ? false : _this.statusText || 'unknown', _this);

			if( _this.xhr && _this.xhr.node ){
				setTimeout(function (){
					var node = _this.xhr.node;
					try { node.parentNode.removeChild(node); } catch (e){}
					try { delete window[_this.uid]; } catch (e){}
					window[_this.uid] = _this.xhr.node = null;
				}, 9);
			}
		},

		abort: function (){
			this.end(0, 'abort');

			if( this.xhr ){
			    this.xhr.aborted = true;
				this.xhr.abort();
			}
		},

		send: function (FormData){
			var _this = this, options = this.options;

			FormData.toData(function (data){
				// Start uploading
				options.upload(options, _this);
				_this._send.call(_this, options, data);
			}, options);
		},

		_send: function (options, data){

			var _this = this, xhr, uid = _this.uid, url = options.url;

			api.log('XHR._send:', data);

			// No cache
			url += (~url.indexOf('?') ? '&' : '?') + api.uid();

			if( data.nodeName ){
				// legacy
				options.upload(options, _this);

				xhr = document.createElement('div');
				xhr.innerHTML = '<form target="'+ uid +'" action="'+ url +'" method="POST" enctype="multipart/form-data" style="position: absolute; top: -1000px; overflow: hidden; width: 1px; height: 1px;">'
							+ '<iframe name="'+ uid +'" src="javascript:false;"></iframe>'
							+ '<input value="'+ uid +'" name="callback" type="hidden"/>'
							+ '</form>'
				;

				_this.xhr.abort = function (){
					var transport = xhr.getElementsByName('iframe')[0];
					if( transport ){
						try {
							if( transport.stop ) transport.stop();
							else if( transport.contentWindow.stop ) transport.contentWindow.stop();
							else transport.contentWindow.document.execCommand('Stop');
						}
						catch (er) {}
					}
					xhr = null;
				};

				// append form-data
				var form = xhr.getElementsByTagName('form')[0];
				form.appendChild(data);

				api.log(form.parentNode.innerHTML);

				// append to DOM
				document.body.appendChild(xhr);

				// keep a reference to node-transport
				_this.xhr.node = xhr;

				// jsonp-callack
				window[uid] = function (status, statusText, response){
					_this.readyState	= 4;
					_this.responseText	= response;
					_this.end(status, statusText);
					xhr = null;
				};

				// send
				_this.readyState = 2; // loaded
				form.submit();
				form = null;
			}
			else {
				// html5
				if (this.xhr && this.xhr.aborted) {
					api.log("Error: already aborted");
					return;
				}
				xhr = _this.xhr = api.getXHR();

				if (data.params) {
				    url += (url.indexOf('?') < 0 ? "?" : "&") + data.params.join("&");
				}

				xhr.open('POST', url, true);
				xhr.withCredential = "true";

				if( !options.headers || !options.headers['X-Requested-With'] ){
					xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				}

				api.each(options.headers, function (val, key){
					xhr.setRequestHeader(key, val);
				});

				
				if ( options._chunked ) {
					// chunked upload
					if( xhr.upload ){
						xhr.upload.addEventListener('progress', function (/**Event*/evt){
							if (!data.retry) {
							    // show progress only for correct chunk uploads
								options.progress({
									  type:			evt.type
									, total:		data.size
									, loaded:		data.start + evt.loaded
									, totalSize:	data.size
								}, _this, options);
							}
						}, false);
					}

					xhr.onreadystatechange = function (){
						_this.status     = xhr.status;
						_this.statusText = xhr.statusText;
						_this.readyState = xhr.readyState;

						if( xhr.readyState == 4 ){
							for( var k in { '': 1, XML: 1, Text: 1, Body: 1 } ){
								_this['response'+k]  = xhr['response'+k];
							}
							xhr.onreadystatechange = null;
                            
							if (!xhr.status || xhr.status - 201 > 0) {
							    api.log("Error: " + xhr.status);
								// some kind of error
								// 0 - connection fail or timeout, if xhr.aborted is true, then it's not recoverable user action
								// up - server error
								if (((!xhr.status && !xhr.aborted) || 500 == xhr.status || 416 == xhr.status) && ++data.retry <= options.chunkUploadRetry) {
									// let's try again the same chunk
									// only applicable for recoverable error codes 500 && 416

									var to = xhr.status ? 0
									                    : api.chunkNetworkDownRetryTimeout;

								    // inform about recoverable problems
									options.pause(data.file, options);

									// smart restart if server reports about the last known byte
									var lkb = parseInt(xhr.getResponseHeader('X-Last-Known-Byte'), 10);
									api.log("X-Last-Known-Byte: " + lkb);
									if (lkb) {
										data.end = lkb;
									} else {
										data.end = data.start - 1;
									}

									setTimeout(function () {
									    _this._send(options, data);
									}, to);
								} else {
									// no mo retries
									_this.end(xhr.status);
								}
							} else {
								// success
								data.retry = 0;

								if (data.end == data.size - 1) {
									// finished
									_this.end(xhr.status);
								} else {
									// next chunk

									// shift position if server reports about the last known byte
									var lkb = parseInt(xhr.getResponseHeader('X-Last-Known-Byte'), 10);
									api.log("X-Last-Known-Byte: " + lkb);
									if (lkb) {
										data.end = lkb;
									}
									data.file.FileAPIReadPosition = data.end;

									setTimeout(function () {
									    _this._send(options, data);
									}, 0);
								}
							}
							xhr = null;
						}
					};

					data.start = data.end + 1;
					data.end = Math.max(Math.min(data.start + options.chunkSize, data.size ) - 1, data.start);
                    
					var slice;
					(slice = 'slice') in data.file || (slice = 'mozSlice') in data.file || (slice = 'webkitSlice') in data.file;

					xhr.setRequestHeader("Content-Range", "bytes " + data.start + "-" + data.end + "/" + data.size);
					xhr.setRequestHeader("Content-Disposition", 'attachment; filename=' + encodeURIComponent(data.name));
					xhr.setRequestHeader("Content-Type", data.type || "application/octet-stream");
                    
					slice = data.file[slice](data.start, data.end + 1);
                 
					xhr.send(slice);
					slice = null;
				} else {
					// single piece upload
					if( xhr.upload ){
						// https://github.com/blueimp/jQuery-File-Upload/wiki/Fixing-Safari-hanging-on-very-high-speed-connections-%281Gbps%29
						xhr.upload.addEventListener('progress', api.throttle(function (/**Event*/evt){
							options.progress(evt, _this, options);
						}, 100), false);
					}
				    
					xhr.onreadystatechange = function (){
						_this.status     = xhr.status;
						_this.statusText = xhr.statusText;
						_this.readyState = xhr.readyState;

						if( xhr.readyState == 4 ){
							for( var k in { '': 1, XML: 1, Text: 1, Body: 1 } ){
								_this['response'+k]  = xhr['response'+k];
							}
							xhr.onreadystatechange = null;
							_this.end(xhr.status);
							xhr = null;
						}
					};

					if( api.isArray(data) ){
						// multipart
						xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=_'+api.expando);
						data = data.join('') +'--_'+ api.expando +'--';

						/** @namespace  xhr.sendAsBinary  https://developer.mozilla.org/ru/XMLHttpRequest#Sending_binary_content */
						if( xhr.sendAsBinary ){
							xhr.sendAsBinary(data);
						}
						else {
							var bytes = Array.prototype.map.call(data, function(c){ return c.charCodeAt(0) & 0xff; });
							xhr.send(new Uint8Array(bytes).buffer);

						}
					} else {
						// FormData 
						xhr.send(data);
					}
				}
			}
		}
	};


	// @export
	api.XHR = XHR;
})(window, FileAPI);
