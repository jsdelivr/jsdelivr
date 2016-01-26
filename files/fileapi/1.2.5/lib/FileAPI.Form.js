(function (api, window, document){
	var
		encode = window.encodeURIComponent,
		FormData = window.FormData,
		Form = function (){
			this.items = [];
		}
	;


	Form.prototype = {

		append: function (name, blob, file, type){
			this.items.push({
				  name: name
				, blob: blob && blob.blob || (blob == void 0 ? '' : blob)
				, file: blob && (file || blob.name)
				, type:	blob && (type || blob.type)
			});
		},

		each: function (fn){
			var i = 0, n = this.items.length;
			for( ; i < n; i++ ){
				fn.call(this, this.items[i]);
			}
		},

		toData: function (fn, options){
		    // allow chunked transfer if we have only one file to send
		    // flag is used below and in XHR._send
		    options._chunked = api.support.chunked && options.chunkSize > 0 && api.filter(this.items, function (item){ return item.file; }).length == 1;

			if( !api.support.html5 ){
				api.log('FileAPI.Form.toHtmlData');
				this.toHtmlData(fn);
			}
			else if( this.multipart || !FormData ){
				api.log('FileAPI.Form.toMultipartData');
				this.toMultipartData(fn);
			}
			else if( options._chunked ){
				api.log('FileAPI.Form.toPlainData');
				this.toPlainData(fn);
			}
			else {
				api.log('FileAPI.Form.toFormData');
				this.toFormData(fn);
			}
		},

		_to: function (data, complete, next, arg){
			var queue = api.queue(function (){
				complete(data);
			});

			this.each(function (file){
				next(file, data, queue, arg);
			});

			queue.check();
		},


		toHtmlData: function (fn){
			this._to(document.createDocumentFragment(), fn, function (file, data/**DocumentFragment*/){
				var blob = file.blob, hidden;

				if( file.file ){
					api.reset(blob);
					// set new name
					blob.name = file.name;
					data.appendChild(blob);
				}
				else {
					hidden = document.createElement('input');
					hidden.name  = file.name;
					hidden.type  = 'hidden';
					hidden.value = blob;
					data.appendChild(hidden);
				}
			});
		},

		toPlainData: function (fn){
			this._to({}, fn, function (file, data, queue){
				if( file.file ){
					data.type = file.file;
				}
				if( file.blob.toBlob ){
				    // canvas
					queue.inc();
					file.blob.toBlob(function (blob){
						data.name = file.name;
						data.file = blob;
						data.size = blob.length;
						data.type = file.type;
						queue.next();
					}, 'image/png');
				}
				else if( file.file ){
				    //file
					data.name = file.blob.name;
					data.file = file.blob;
					data.size = file.blob.size;
					data.type = file.type;
				}
				else {
				    // additional data
				    if (!data.params) {
				        data.params = [];
				    }
				    data.params.push(encodeURIComponent(file.name) + "=" + encodeURIComponent(file.blob));
				}
				data.start = -1;
				data.end = data.file.FileAPIReadPosition || -1;
				data.retry = 0;
			});
		},

		toFormData: function (fn){
			this._to(new FormData, fn, function (file, data, queue){
				if( file.file ){
					data.append('_'+file.name, file.file);
				}

				if( file.blob && file.blob.toBlob ){
					queue.inc();
					file.blob.toBlob(function (blob){
						data.append(file.name, blob, file.file);
						queue.next();
					}, 'image/png');
				}
				else if( file.file ){
					data.append(file.name, file.blob, file.file);
				}
				else {
					data.append(file.name, file.blob);
				}
			});
		},


		toMultipartData: function (fn){
			this._to([], fn, function (file, data, queue, boundary){
				var
					  isFile = !!file.file
					, blob = file.blob
					, done = function (blob){
						data.push(
							  '--_' + boundary + ('\r\nContent-Disposition: form-data; name="'+ file.name +'"'+ (isFile ? '; filename="'+ encode(file.file) +'"' : '')
							+ (isFile ? '\r\nContent-Type: '+ (file.type || 'application/octet-stream') : '')
							+ '\r\n'
							+ '\r\n'+ (isFile ? blob : encode(blob))
							+ '\r\n')
						);
						queue.next();
					}
				;

				queue.inc();

				if( api.isFile(blob) ){
					api.readAsBinaryString(blob, function (evt/**Object*/){
						if( evt.type == 'load' ){
							done(evt.result);
						}
					});
				}
				else {
					done(blob);
				}
			}, api.expando);
		}
	};


	// @export
	api.Form = Form;
})(FileAPI, window, document);
