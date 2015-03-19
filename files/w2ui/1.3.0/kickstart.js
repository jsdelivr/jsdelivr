/* kicstart 0.x (c) http://w2ui.com/kickstart, vitmalina@gmail.com */
var app = (function (app) {
	// private scope
	var timer_start;
	var timer_lap;

	// public scope
	app.user 		= {};
	app.config 		= {};
	app.modules 	= {};
	app.header		= header;
	app.timer		= timer;
	app.lap			= lap;
	app.register	= register;
	app.load		= load;
	app.get 		= get;
	app.include 	= include;
	// in other files
	app.action		= null;		// function - main event loop
	app.start		= null;		// funciton - starting point
	app.session		= null;		// function - returns user session
	app.login		= null;		// function - performs login
	app.logout		= null;		// function	- performs logout
	app.forgot		= null;		// function - persforms forgot password

	init();
	return app;

	/***********************************
	/*  -- IMPLEMENTATION
	*/

	function header(msg) {
		$('#app-header').html(msg);
	}

	function timer() {
		timer_start = (new Date()).getTime();
		timer_lap   = (new Date()).getTime();
		console.log('Start Timer');
	}

	function lap(name) {
		if (typeof name != 'string') name = ''; else name = ' "' + name + '"';
		console.log('Total:', (new Date()).getTime() - timer_start, 'Lap'+ name + ':', (new Date()).getTime() - timer_lap);
		timer_lap = (new Date()).getTime();
	}

	// ===========================================
	// -- Register module

	function register(name, module) {
		// check if modules id defined
		if (!app.modules.hasOwnProperty(name)) {
			console.log('ERROR: Module '+ name +' is not defined. You need to define the module in /app/conf/modules.js');
			return false;
		}
		// check if the module already registered
		if (app.hasOwnProperty(name) && app[name].render == 'function') {
			console.log('ERROR: Module '+ name +' is already registered.');
			return false;
		}
		// load module assets
		app.get(app.modules[name].assets, function (files) {
			// initiate module
			var callBack = app[name].callBack;
			app[name] = module(files, app[name].params);
			callBack();
		});
	}

	// ===========================================
	// -- Loads modules or calls .render()
	// -- if module was previously loaded

	function load(names, params, callBack) {
		if (!$.isArray(names)) names = [names];
		if (typeof params == 'function') {
			callBack = params;
			params   = {};
		}
		if (!params) params = {};
		var modCount = names.length;
		for (var n in names) {
			var name = names[n];
			if (typeof app.modules[name] == 'undefined') {
				modCount--;
				console.log('ERROR: module "'+ name +'" is not defined. Define it in app/conf/modules.js.');
				return;
			}
			// init module and pass params
			app[name] = app[name] || {};
			app[name].params = $.extend({}, params);
			app[name].callBack = callBack;
			// check if was loaded before 
			if (app.modules[name] && app.modules[name].isLoaded === true) {
				modCount--;
				if (typeof app[name].render == 'undefined') {
					console.log('ERROR: Loader: module "'+ name + '" has no render() method.');
				} else {
					app[name].render();
					isFinished();
				}
			} else {
				$.ajax({ url : app.modules[name].url, dataType: "script" })
					.always(function () { // arguments are either same as done or fail
						modCount--;
					})
					.done(function (data, status, xhr) {
						app.modules[name].isLoaded = true;
						isFinished();
					})
					.fail(function (xhr, err, errData) {
						if (err == 'error') {
							console.log('ERROR: Loader: module "'+ name +'" failed to load ('+ app.modules[name].url +').');
						} else {
							console.log('ERROR: Loader: module "'+ name + '" is loaded ('+ app.modules[name].url +'), but with a parsing error(s) in line '+ errData.line +': '+ errData.message);
							app.modules[name].isLoaded = true;
							isFinished();
						}
					});
			}
		}

		function isFinished() {
			if (typeof callBack == 'function' && modCount == 0) callBack(true);
		}
	}

	// ===========================================
	// -- Loads a set of files and returns 
	// -- its contents to the callBack function

	function get(files, callBack) {
		var bufferObj = {};
		var bufferLen = files.length;
		
		for (var i in files) {
			// need a closure
			(function () {
				var index = i;
				var path  = files[i];
				$.ajax({
					url		: path,
					dataType: 'text',
					success : function (data, success, responseObj) {
						if (success != 'success') {
							console.log('ERROR: Loader: error while getting a file '+ path +'.');
							return;
						}
						bufferObj[index] = responseObj.responseText;
						loadDone();

					},
					error : function (data, err, errData) {
						if (err == 'error') {
							console.log('ERROR: Loader: failed to load '+ files[i] +'.');
						} else {
							console.log('ERROR: Loader: file "'+ files[i] + '" is loaded, but with a parsing error(s) in line '+ errData.line +': '+ errData.message);
							bufferObj[index] = responseObj.responseText;
							loadDone();
						}
					}
				});
			})();
		}
		// internal counter
		function loadDone() {
			bufferLen--;
			if (bufferLen <= 0) callBack(bufferObj);
		}
	}

	// ===========================================
	// -- Includes all files as scripts in order to see error line

	function include(files) {
		if (typeof files == 'string') files = [files];
		for (var i in files) {
			$(document).append('<script type="text/javascript" src="'+ files[i] +'"></script>');
		}
	}

	// =================================================
	// -- INTERNAL METHODS

	function init() {
		// -- load utils
		app.get(['app/conf/session.js'], function (data) {
			try { for (var i in data) eval(data[i]); } catch (e) { }
			// if login page - do not init
			if (document.location.href.indexOf('login.html') > 0) return;
			// -- if no user info
			app.user = app.session();
			if ($.isEmptyObject(app.user)) {
				document.location = 'login.html';
				return;
			}
			// -- load dependencies
			var files = [
				'app/conf/action.js', 
				'app/conf/modules.js', 
				'app/conf/config.js', 
				'app/conf/start.js' 
			];
			app.get(files, function (data) {
				try {
					for (var i in data) eval(data[i]);
				} catch (e) {
					app.include(files);
				}
				// init application UI
				$('#app-toolbar').w2toolbar(app.config.app_toolbar);
				$('#app-tabs').w2tabs(app.config.app_tabs);
				$('#app-main').w2layout(app.config.app_layout);
				// popin
				//$().w2popup({ width: 300, height: 65, body: 
				//	'<div style="font-size: 18px; color: #666; text-align: center; padding-top: 15px">Loading....</div>'} );
				setTimeout(function () {
					$('#app-container').fadeIn(200);
					//$('#app-container').css({ '-webkit-transform': 'scale(1)', opacity: 1 });
					setTimeout(function () {
						var top = 0;
						// app toolbar
						if (app.config.show.toolbar) {
							$('#app-toolbar').css('height', '30px').show();
							top += 30;
						} else {
							$('#app-toolbar').hide();
						}
						// app tabs
						if (app.config.show.tabs) {
							$('#app-tabs').css({ 'top': top + 'px', 'height': '30px' }).show();
							top += 30;
						} else {
							$('#app-tabs').hide();
						}
						$('#app-top').css('height', top + 'px').show();
						// app header
						if (app.config.show.header) {
							$('#app-header').css({ 'top': top + 'px', 'height': '60px' }).show();
							top += 60;
						} else {
							$('#app-header').hide();
						}
						$('#app-main').css('top', top + 'px');
						// init app
						if (typeof app.start == 'function') app.start();
					}, 200);
				}, 100);
			});
		});
	}

}) (app || {});
