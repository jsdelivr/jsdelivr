jQuery(function($){
	module('JAF');

	var App = xe.createApp('App', {
		value : 1,
		init : function() {
			this.value = 2;
		},
		API_GET_VALUE : function(sender, params) {
			return this.value;
		},
		API_SET_VALUE : function(sender, params) {
			this.value = params[0];
		}
	});

	var Plugin = xe.createPlugin('Plugin', {
		API_BEFORE_GET_VALUE : function(sender, params) {
			if (params[0]) return false;
		},
		API_BEFORE_SET_VALUE : function(sender, params) {
			params[0] = params[0] * 3;
		},
		API_METHOD : function(sender, params) {
			$('#plugin-test').html(params[0]);
		}
	});

	test('Global object - xe', function(){
		equal(xe.getName(), 'Core');
		ok($.isFunction(xe.createApp), 'xe has createApp method');
		ok($.isFunction(xe.createPlugin), 'xe has createPlugin method');
		ok($.isFunction(xe.getApps), 'xe has getApps method');
		ok($.isFunction(xe.getApp), 'xe has getApp method');
		ok($.isFunction(xe.registerApp), 'xe has registerApp method');
		ok($.isFunction(xe.unregisterApp), 'xe has unregisterApp method');
		ok($.isFunction(xe.broadcast), 'xe has broadcast method');
	});
	test('App', function() {
		var app1 = new App();

		equal(app1.getName(), 'App', 'The app1 is an instance of App.');
		ok(xe.getApp('App') == null, 'The app1 is NOT registered yet.');
		
		xe.registerApp(app1);

		ok(xe.getApp('App')[0] === app1, 'The app1 is registered successfully.');
		equal(app1.cast('GET_VALUE'), 2);

		xe.unregisterApp(app1);

		ok(xe.getApp('App') == null, 'The app1 is unregistered.');
	});
	test('Plugin', function() {
		xe.registerApp(new App());

		var plugin1 = new Plugin();

		equal(plugin1.getName(), 'Plugin', 'The plugin1 is an instance of Plugin.');

		var app1 = xe.getApp('App')[0];

		app1.registerPlugin(plugin1);

		ok(typeof app1.cast('GET_VALUE', [true]) == 'undefined', 'Stop GET_VALUE action');

		var val = app1.cast('GET_VALUE');
		equal(app1.cast('GET_VALUE'), val, 'Check current value');

		app1.cast('SET_VALUE', [3]);
		equal(app1.cast('GET_VALUE'), 9, 'Before hooker should change input value 3 into');

		// original method
		var obj = $('#plugin-test');
		equal(obj.html(), '', 'There is no content');

		app1.cast('METHOD', ['hello']);
		equal(obj.html(), 'hello', 'The plugin set the content');

		obj.hide();

		xe.unregisterApp(app1);
	});
	test('Function : You can register a function as a message handler', function() {
		xe.registerApp(new App());

		function handler(sender, params) {
			params[0] = params[0] + ', world!';
		}

		var app1 = xe.getApp('App')[0];
		app1.registerPlugin(new Plugin());

		var obj = $('#plugin-test');
		app1.cast('METHOD', ['Hello']);
		equal(obj.html(), 'Hello', 'The plugin set the content');

		app1.registerHandler('BEFORE_METHOD', handler);
		app1.cast('METHOD', ['Hello']);
		equal(obj.html(), 'Hello, world!', 'The handler function changes a passed parameter.');

		xe.unregisterApp(app1);
	});

});
