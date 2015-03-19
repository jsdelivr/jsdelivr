/**
 * Uploader
 */
(function($){

var runtime;

var Uploader = xe.createApp('Uploader', {
	settings : {},
	files : [],
	init  : function(browseButton, opts) {
		if (!runtime) {
			$.each(runtimes, function(key,obj) {
				if (obj.check()) { runtime = key; return false; }
			});
		}

		this.queue = [];
		this.settings = $.extend({
			filters : {},
			params  : {}
		}, opts);
		this.settings.browse = $(browseButton);

		if (!this.settings.browse.length) throw 'The parameter browseButton is not valid object or selector.';

		var s = this.settings;
	
		if (s.dropzone) s.dropzone = $(s.dropzone);
		if (s.upload) s.upload = $(s.upload);

		runtimes[runtime].create(this, this.settings);
	},
	API_ON_START : function(sender, params) {
		if ($.isFunction(this.settings.onstart)) {
			this.settings.onstart.apply(this, params);
		}
	},
	API_ON_FINISH : function(sender, params) {
		if ($.isFunction(this.settings.onfinish)) {
			this.settings.onfinish.apply(this, params);
		}
	},
	API_ON_SELECT : function(sender, params) {
		if ($.isFunction(this.settings.onselect)) {
			this.settings.onselect.apply(this, params);
		}
	},
	API_ON_STARTONE : function(sender, params) {
		if ($.isFunction(this.settings.onstartone)) {
			this.settings.onstartone.apply(this, params);
		}
	},
	API_ON_FINISHONE : function(sender, params) {
		if ($.isFunction(this.settings.onfinishone)) {
			this.settings.onfinishone.apply(this, params);
		}
	},
	API_ON_PROGRESS  : function(sender, params) {
		if ($.isFunction(this.settings.onprogress)) {
			this.settings.onprogress.apply(this, params);
		}
	},
	API_START : function(sender, params) {
		var files = $.grep(this.files, function(file){ return (file.status != 'DONE') });

		runtimes[runtime].upload(this, this.settings, files);
	},
	API_STOP : function(sender, params) {
		runtimes[runtime].stop(this, this.settings);
	},
	API_SET_PARAM : function(sender, params) {
		this.settings.params[params[0]] = params[1];
	},
	API_DEL_PARAM : function(sender, params) {
		try {
			delete this.settings.params[params[0]];
		} catch(e){}
	}
});

// Shortcut function in jQuery
$.fn.uploader = function(opts) {
	var u = new Uploader(this.eq(0), opts);
	if (u) xe.registerApp(u);

	return u;
};

// Shortcut function in XE
xe.createUploader = function(browseButton, opts) {
	var u = new Uploader(browseButton, opts);
	if (u) xe.registerApp(u);

	return u;
};

// {{{ runtimes
var runtimes = {};

// Google Gears
runtimes.gears = {
	_desktop : null,
	create : function(uploader, settings) {
		var self = this;
		var opt  = {filter:[]};

		if (!window.google || google.gears || !google.gears.factory) this.createFactory();
		if (!this._desktop && google.gears.factory)  this._desktop = google.gears.factory.create('beta.desktop');
		if (!this._desktop) return false;

		// browse button
		settings.browse.click(function(){
			self._desktop.openFiles(onselect, opt);
			return false;
		});

		// file filters
		$.each(settings.filters, function(k,v){ opt.filter=$.merge(opt.filter,v.split(' ')) });
		opt.filter = $.map(opt.filter, function(ext){ return '.'+ext });

		// select file callback
		function onselect(files) {
			var old_length = uploader.files.length;

			$.each(files, function() {
				uploader.files.push(new File(this, this.blob.length))
			});

			uploader.cast('ON_SELECT', [uploader.files, old_length]);
		}

		// drag and drop
		if (settings.dropzone) {
			settings.dropzone
				.bind('dragover', function(){ return false; })
				.bind('drop', function(event) {
					var data  = self._desktop.getDragData(event.originalEvent, 'application/x-gears-files');
					var files = $.grep(data.files, function(file) {
						var ext = file.name.match(/\.[a-z0-9]+$/)[0] || '';
						return ($.inArray(ext, opt.filter)!=-1);
					});

					onselect(files);

					return false;
				});
		}

		// upload
		if (settings.upload) {
			settings.upload.click(function(){
				uploader.cast('START');
				return false;
			});
		}
	},
	createFactory : function() {
		var f, m;

		if (!window.google) window.google = {};
		if (!google.gears) {
			google.gears = {};
	
			if (typeof(GearsFactory)!='undefined'){f = new GearsFactory()} // Firefox
			else {
				try{ // IE
					f = new ActiveXObject('Gears.Factory');
				}catch(e){ // Safari
					if ((typeof(m=navigator.mimeTypes)!='undefined')&&(m['application/x-googlegears'])) {
						f = $('<object type="application/x-googlegears" style="display:none;width:0;height:0">').appendTo(document.documentElement);
					}
				}
			}
			if(f) google.gears.factory = f;
		}
	},
	check : function() {
		if ((window.google && google.gears && google.gears.factory) || (typeof(GearsFactory) != 'undefined')) return true;

		try {
			this.factory = new ActiveXObject('Gears.factory');
			return true;
		} catch(e) {
			var m = navigator.mimeTypes;
			if (m && m['application/x-googlegears']) return true;
		}
	},
	upload : function(uploader, settings, files) {
		if (uploader.request || !files.length) return false;

		uploader.cast('ON_START');

		(function uploadNext() {
			var file = files.shift();
			var req  = google.gears.factory.create('beta.httprequest');
			var blob = google.gears.factory.create('beta.blobbuilder');
			var bndr = '--------------xe-boundary'+random();
			var data, gap;

			$.each(settings.params, function(key, val) {
				blob.append(
					'--'+bndr+'\r\n'+
					'Content-Disposition: form-data; name="'+key+'"\r\n\r\n'+
					val+'\r\n'
				);
			});

			blob.append(
				'--'+bndr+'\r\n'+
				'Content-Disposition: form-data; name="Filedata"; filename="'+file.name+'"\r\n'+
				'Content-Type: application/octet-stream\r\n\r\n'
			);

			blob.append(file.object.blob);
			blob.append('\r\n--'+bndr+'--\r\n');

			data = blob.getAsBlob();
			gap  = data.length - file.size;

			uploader.cast('ON_STARTONE', [file]);

			req.open('POST', settings.url);
			req.setRequestHeader('Content-Type', 'multipart/form-data; boundary='+bndr);
			req.onreadystatechange = function() {
				if (req.readyState == 1) {
					file.status = 'UPLOADING';
					return;
				}
				if (req.readyState != 4) return;

				uploader.request = null;

				if (req.status == 200) {
					file.status = 'DONE';	
				} else {
					file.status = 'FAILED';
				}

				if (files.length) {
					uploadNext();
				} else {
					setTimeout(function(){ uploader.cast('ON_FINISH')  }, 0);
				}

				uploader.cast('ON_FINISHONE', [file]);
			};
			req.upload.onprogress = function(event) {
				if (event.lengthComputable) {
					file.loaded  = Math.max(event.loaded - gap, 0);
					uploader.cast('ON_PROGRESS', [file]);
				}
			};
			req.send(data);
		})();
	},
	stop : function(uploader, settings) {
		if (uploader.request) {
			uploader.request.abort();
			uploader.request = null;
		}

		uploader.cast('ON_STOP');
	}
};

// HTML5
runtimes.html5 = {
	create : function(uploader, settings) {
		var self = this;
		var filter = [];

		// filter by extension
		$.each(settings.filters, function(k,v){ filter=$.merge(filter,v.split(' ')) });

		// when file is selected
		function onselect() {
			var files = $.grep(this.files, function(file) {
				var ext  = (file.fileName.match(/\.([^\.]+)$/)[1] || '').toLowerCase();
				return (!filter.length || $.inArray(ext,filter) != -1);
			});

			if (files.length) {
				var old_length = uploader.files.length;

				$.each(files, function(idx, file){
					uploader.files.push(new File(file, file.size||file.fileSize));
				});
				uploader.cast('ON_SELECT', [uploader.files, old_length]);
			}

			this.value = '';
		}

		function make_button(event) {
			var op = this.offsetParent;
			var ow = this.offsetWidth;
			var oh = this.offsetHeight;
			var ot = this.offsetTop;
			var ol = this.offsetLeft;

			if (!uploader.browseButton) {
				uploader.browseButton = $('<div style="position:absolute;overflow:hidden;"><input type="file" name="Filedata" multiple="multiple" style="position:absolute;top:0;right:0;font-size:100px;" /></div>').appendTo(op);
				uploader.browseButton.find('>input').css({cursor:'pointer',opacity:0}).change(onselect);
			}

			uploader.browseButton.css({width:ow+'px', height:oh+'px', left:ol+'px', top:ot+'px', margin:0, padding:0});

			if (event.type == 'focus') uploader.browseButton.find('>input').focus();
		}

		// browse button
		settings.browse.bind({mouseover:make_button,focus:make_button});

		// drag and drop (available only Firefox)
		if (settings.dropzone) {
			settings.dropzone
				.bind('dragover', function(){ return false; })
				.bind('drop', function(event){
					var data = event.originalEvent.dataTransfer;
					var obj  = {files:data.files||[]};

					onselect.apply(obj);

					return false;
				});
		}

		// upload
		if (settings.upload) {
			settings.upload.click(function(){
				uploader.cast('START');
				return false;
			});
		}
	},
	check : function() {
		if (window.XMLHttpRequest) {
			var xhr = new XMLHttpRequest();
			if (!!xhr.sendAsBinary || !!xhr.upload) return true;
		}

		return false;
	},
	upload : function(uploader, settings, files) {
		if (uploader.request || !files.length) return false;

		uploader.cast('ON_START');

		(function uploadNext() {
			var file = files.shift();
			var req  = uploader.request = new XMLHttpRequest();
			var bndr = '--------------xe-boundary'+random();
			var compatFF, data, bin, gap = 0;

			// Firefox compatible mode
			compatFF = typeof(file.object.getAsBinary) == 'function';

			if (compatFF) {
				data = '';
				$.each(settings.params, function(key, val) {
					data += '--'+bndr+'\r\n';
					data += 'Content-Disposition: form-data; name="'+key+'"\r\n\r\n';
					data += val+'\r\n';
				});

				// Firefox had a bug that recognises some unicode filename as invalid string.
				// So, I made a workaround to encode the filename by RFC2231
				data += '--'+bndr+'\r\n';
				data += 'Content-Disposition: form-data; name="Filedata"; filename="=?UTF-8?B?'+Base64.encode(file.name).replace(/\//g, ':')+'?="\r\n';
				data += 'Content-Type: application/octet-stream\r\n\r\n';
				data += file.object.getAsBinary();
				data += '\r\n';
				data += '--'+bndr+'--\r\n';

				bin = null;
				gap = data.length - file.object.fileSize;
			} else {
				data = new FormData();
				$.each(settings.params, function(key, val) {
					data.append(key, val);
				});
				data.append('Filedata', file.object);
			}

			uploader.cast('ON_STARTONE', [file]);

			function nextOrFinish() {
				if (files.length) {
					uploadNext();
				} else {
					setTimeout(function(){ uploader.cast('ON_FINISH')  }, 0);
				}

				uploader.cast('ON_FINISHONE', [file]);
			}

			req.onreadystatechange = function() {
				if (req.readyState == 1) {
					file.status = 'UPLOADING';
					return;
				}
				if (req.readyState != 4) return;

				uploader.request = null;

				if (req.status == 200) {
					file.loaded = file.size;
					file.status = 'DONE';
				} else {
					file.status = 'FAILED';
				}
				nextOrFinish();
			};
			req.onerror = function(event) {
				file.status = 'FAILED';
				nextOrFinish();
			};

			if (req.upload) {
				req.upload.onprogress =
				req.upload.onload =
				function(event){
					if (event.lengthComputable) {
						file.loaded  = Math.max(event.loaded - gap, 0);
						uploader.cast('ON_PROGRESS', [file]);
					}
				};
			}

			req.open('POST', settings.url);
			if (compatFF) {
				req.setRequestHeader('Content-Type', 'multipart/form-data; boundary='+bndr);
				req.sendAsBinary(data);
			} else {
				req.send(data);
			}
		})();
	},
	stop : function(uploader, settings) {
		if (uploader.request) {
			uploader.request.abort();
			uploader.request = null;
		}

		uploader.cast('ON_STOP');
	}
};

// Adobe Flash
runtimes.flash = {
	version   : 0,
	object    : null,
	uploaders : [],
	create    : function(uploader, settings) {
		var self = this;
		var rand = random();
		var name = 'xe_flashuploader_object'+rand;
		var swf  = (window.request_uri||'/')+'common/js/plugins/uploader/uploader.swf';

		if (!window.xe_flashuploaders) window.xe_flashuploaders = [];

		function make_button(event) {
			var b  = this;
			var op = b.offsetParent;
			var ow = b.offsetWidth;
			var oh = b.offsetHeight;
			var ot = b.offsetTop;
			var ol = b.offsetLeft;
			var $div, flash, css;

			if (typeof uploader.flashindex == 'undefined') {
				uploader.flashindex = xe_flashuploaders.length;

				xe_flashuploaders.push({
					uploader  : uploader,
					settings  : settings,
					onselect  : function(files) {
						var old_length = uploader.files.length;

						$.each(files, function() {
							uploader.files.push(new File(this, this.size))
						});

						uploader.cast('ON_SELECT', [uploader.files, old_length]);
					},
					onprogress : function(fileInfo) {},
					oncomplete : function(fileInfo) {},
					onerror : function(fileInfo) {},
					oncancel : function(fileInfo) {}
				});
			}

			div   = $('#'+name+'-container');
			css   = {position:'absolute',width:ow+'px',height:oh+'px',left:ol+'px',top:ot+'px',margin:0,padding:0,overflow:'hidden'};

			if (!div.length) {
				div = $('<div />').attr('id', name+'-container').css(css).appendTo(op);
				div[0].innerHTML = ''
						+ '<object id="'+name+'" classid="clsid:D27CDB6E-AE6D-11CF-96B8-444553540000" width="100%" height="100%">'
						+ '<param name="movie" value="'+swf+'" />'
						+ '<param name="wmode" value="transparent" />'
						+ '<param name="allowScriptAccess" value="always" />'
						+ '<embed src="'+swf+'" width="100%" height="100%" name="'+name+'" type="application/x-shockwave-flash" pluginpage="http://www.macromedia.com/go/getflashplayer" wmode="transparent" allowscriptaccess="always" />'
						+ '</object>';

			}

			flash = window[name] || document[name];

			if (!uploader.flash) {
				try {
					if (!flash) throw '';

					var _settings = {};
					var pass_keys = ['filters','params','url'];

					$.each(settings, function(key,val){
						if ($.inArray(key, pass_keys) < 0) return true;
						_settings[key] = val;
					});

					flash.setConfig(uploader.flashindex, _settings);

					uploader.flash = flash;
					uploader.flash_box = $(flash).parents('div:first');
				} catch(e) {
					return setTimeout(arguments.callee, 10);
				}
			}

			if (uploader.flash) {
				uploader.flash_box.css(css);
				uploader.flash.setIndex(uploader.flashindex);
			}
		}

		// browse button
		settings.browse.bind({mouseover:make_button,focus:make_button});

		// upload
		if (settings.upload) {
			settings.upload.click(function(){
				uploader.cast('START');
				return false;
			});
		}

	},
	check : function() {
		var p = navigator.plugins, v;

		if (p && (v=p['Shockwave Flash'])) {
			v = v.description;
		} else {
			try {
				v = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
			} catch(e) {
				v = "0.0";
			}
		}

		v = v.match(/\d+/g);
		v = parseFloat(v[0]+'.'+v[1]);

		if (!isNaN(v)) this.version = v;

		return (this.version >= 9);
	},
	upload : function(uploader, settings, files) {
		if (typeof uploader.flashindex == 'undefined') return false;
		if (uploader.request || !files.length) return false;

		var g_uploader = xe_flashuploaders[uploader.flashindex];

		uploader.cast('ON_START');

		(function uploadNext(){
			var file = files.shift();

			function nextOrFinish() {
				if (files.length) {
					uploadNext();
				} else {
					setTimeout(function(){ uploader.cast('ON_FINISH')  }, 0);
				}

				uploader.cast('ON_FINISHONE', [file]);
			}

			file.status = 'UPLOADING';

			g_uploader.onprogress = function(fileInfo){
				file.loaded = fileInfo.loaded;
				uploader.cast('ON_PROGRESS', [file]);
			};

			g_uploader.oncomplete = function(fileInfo) {
				file.loaded = fileInfo.loaded;
				file.status = 'DONE';

				nextOrFinish();
			};

			g_uploader.onerror = function() {
				file.status = 'FAILED';
				nextOrFinish();
			};

			uploader.flash.startUpload(file.object.index);

			uploader.cast('ON_STARTONE', [file]);
		})();
	},
	stop : function(uploader, settings) {
		if (typeof uploader.flashindex == 'undefined') return false;
	}
};

// HTML4
runtimes.html4 = {
	create : function(uploader, settings) {
		var self   = this;
		var filter = [];

		// filter by extension
		$.each(settings.filters, function(k,v){ filter=$.merge(filter,v.split(' ')) });

		// when file is selected
		function onselect() {
			var ext  = (this.value.match(/\.([^\.]+)$/)[1] || '').toLowerCase();

			if ($.inArray(ext, filter) != -1) {
				uploader.files.push(new File(this, -1));
				uploader.cast('ON_SELECT', [uploader.files, uploader.files.length - 1]);
			}

			uploader.browseButton = null;
			$(this).parent().remove();
		}

		function make_button(event) {
			var op = this.offsetParent;
			var ow = this.offsetWidth;
			var oh = this.offsetHeight;
			var ot = this.offsetTop;
			var ol = this.offsetLeft;

			if (!uploader.browseButton) {
				uploader.browseButton = $('<div style="position:absolute;overflow:hidden;"><input type="file" name="Filedata" style="position:absolute;top:0;right:0;font-size:100px;" /></div>')
					.appendTo(op)
					.change(onselect);
				uploader.browseButton.find('>input').css({cursor:'pointer',opacity:0});
			}

			uploader.browseButton.css({width:ow+'px', height:oh+'px', left:ol+'px', top:ot+'px', margin:0, padding:0});

			if (event.type == 'focus') uploader.browseButton.find('>input').focus();
		}

		// browse button
		settings.browse.bind({mouseover:make_button,focus:make_button});

		// upload
		if (settings.upload) {
			settings.upload.click(function(){
				uploader.cast('START');
				return false;
			});
		}
	},
	check : function() {
		return true;
	},
	upload : function(uploader, settings, files) {
		if (uploader.request || !files.length) return false;

		var css = {position:'absolute',width:'1px',height:'1px',left:'-100px',top:'-100px',overflow:'hidden'};

		// callback
		if (!window.callbacks) window.callbacks = {};

		uploader.cast('ON_START');

		(function uploadNext(){
			var file = files.shift();
			var id     = 'tmp_upload_'+random();
			var iframe = $('<iframe src="about:blank" name="'+id+'"></iframe>').css(css).appendTo(document.documentElement);
			var form   = $('<form method="post" enctype="multipart/form-data" target="'+id+'"></form>').css(css).appendTo(document.documentElement);

			form.attr('action', settings.url);

			uploader.request = {iframe:iframe, form:form};

			// set parameters
			settings.params._callback = 'callbacks.'+id; // callback
			$.each(settings.params, function(k,v) {
				$('<input type="hidden" name="'+k+'" />').val(v).appendTo(form);
			});

			// set status of a file
			file.status = 'UPLOADING';

			callbacks[id] = function(fileInfo) {
				file.status = 'DONE';
				file.size = fileInfo.size;
				file.loaded = fileInfo.size;

				form.find('>input[type=file]').remove();

				uploader.cast('ON_FINISHONE', [file]);

				if (files.length) {
					setTimeout(uploadNext, 0);
				} else {
					uploader.request = null;
					uploader.cast('ON_FINISH');
				}

				setTimeout(function(){
					form.remove();
					iframe.remove();

					delete callbacks[id];
				}, 0);
			};

			form.append(file.object).submit();
		})();
	},
	stop : function(uploader, settings) {
		if (uploader.request) {
			uploader.request.iframe.attr('src', 'about:blank').remove();
			uploader.request.form.remove();
			uploader.request = null;
		}
	}
};

// }}} runtimes

var mimetypes = {
    'application/java-archive' : 'jar',
    'application/java-vm'      : 'class',
    'application/javascript'   : 'js',
    'application/msword'       : 'doc dot',
    'application/pdf'          : 'pdf',
    'application/octet-stream' : 'bin lha lzh iso dmg dist pkg exe',
    'application/postscript'   : 'ai eps ps',
    'application/rtf'          : 'rtf',
    'application/smil'         : 'smi smil',
    'application/vnd.ms-excel' : 'xls xlm xla xlc xlt xlw',
    'application/vnd.openxmlformats': 'docx pptx xlsx',
    'application/vnd.ms-powerpoint' : 'ppt pps pot',
    'application/zip'               : 'zip',
    'application/x-shockwave-flash' : 'swf swfl',
    'audio/mpeg'      : 'mpga mpega mp2 mp3',
    'audio/x-wav'     : 'wav',
    'image/bmp'       : 'bmp',
    'image/gif'       : 'gif',
    'image/jpeg'      : 'jpeg jpg jpe',
    'image/png'       : 'png',
    'image/svg+xml'   : 'svg svgz',
    'image/tiff'      : 'tiff tif',
    'text/html'       : 'htm html xhtml',
    'text/plain'      : 'asc txt text diff log',
    'video/mpeg'      : 'mpeg mpg mpe',
    'video/quicktime' : 'qt mov',
    'video/x-flv'     : 'flv',
    'video/x-ms-asf'  : 'asf',
    'video/x-ms-wmv'  : 'wmv',
    'video/x-msvideo' : 'avi'
};

function File(obj, filesize) {
	if (runtime == 'html4') {
		this.name = obj.value.match(/[^\\\/]+$/)[0];
	} else {
		this.name = obj.name || obj.fileName;
	}

	this.size   = filesize;
	this.loaded = 0;
	this.status = 'QUEUED'; // QUEUED, UPLOADING, FAILED, DONE
	this.object = obj;
};

function random() {
	return Math.floor(Math.random()*80000+10000);
}

})(jQuery);
