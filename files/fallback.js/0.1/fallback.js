/* fallback.js v0.1 | https://github.com/sgarbesi/fallback.js | Salvatore Garbesi <sal@dolox.com> | (c) 2013 Dolox Inc. */

fallback = {
	callback: null,

	ready_invoke: true,
	ready_functions: [],

	head: document.getElementsByTagName('head')[0],

	libraries: {},
	libraries_count: 0,

	loaded: {},
	loaded_count: 0,

	broken: {},
	broken_count: 0,

	shim: {}
};

fallback.initialize = function() {
	var library, url, urls;

	for (library in this.libraries) {
		urls = this.libraries[library];

		if (!(urls instanceof Array)) {
			this.libraries[library] = urls = [urls];
		}

		this.libraries_count++;

		if (!this.shim[library]) {
			this.spawn(library, urls[0], 0);
		}
	}
};

fallback.completed = function() {
	if (this.libraries_count == this.loaded_count + this.broken_count) {
		if (this.ready_invoke) {
			this.ready_invocation();
		}

		this.callback(this.loaded, this.broken);
	}
};

fallback.error = function(library, index) {
	index = parseInt(index);

	if (!this.broken[library]) {
		this.broken[library] = [];
	}

	this.broken[library][this.broken[library].length] = this.libraries[library][index];

	if (index < this.libraries[library].length - 1) {
		this.spawn(library, this.libraries[library][index + 1], index + 1);
	} else {
		this.broken_count++;
	}

	this.completed();
};

fallback.load = function(libraries, options) {
	this.ready_invoke = true;

	if (options) {
		if (options.ready_invoke === false) {
			this.ready_invoke = options.ready_invoke;
		}

		if (!options.callback || (options.callback && ({}).toString.call(options.callback) !== '[object Function]')) {
			options.callback = function() {};
		}

		if (options.shim) {
			this.shim = options.shim;
		}
	} else {
		options = {};
		options.callback = function() {};
	}

	this.callback = options.callback;
	this.libraries = libraries;
	this.initialize();
};

fallback.ready = function(callback) {
	this.ready_functions[this.ready_functions.length] = callback;
};

fallback.ready_invocation = function() {
	if (this.ready_functions) {
		for (var index in this.ready_functions) {
			this.ready_functions[index](this.loaded, this.broken);
		}
	}
};

fallback.spawn = function(library, url, index) {
	var element;
	
	if (url.indexOf('.css') > -1) {
		element = document.createElement('link');
		element.rel = 'stylesheet';
		element.href = url;
	} else {
		element = document.createElement('script');
		element.src = url;
	}

	element.onload = function() {
		fallback.success(library, index);
	};

	element.onerror = function() {
		fallback.error(library, index);
	};

	this.head.appendChild(element);
};

fallback.success = function(library, index) {
	this.loaded[library] = this.libraries[library][index];
	this.loaded_count++;
	
	if (this.shim) {
		this.shim_invocation(library);
	}

	this.completed();
};

fallback.shim_invocation = function() {
	for (var shim in this.shim) {
		var count = 0;

		if (!this.loaded[shim]) {
			for (var index in this.shim[shim]) {

				if (this.loaded[this.shim[shim][index]]) {
					count++;
				}
			}

			if (count == this.shim[shim].length) {
				this.spawn(shim, this.libraries[shim][0], 0);
				delete this.shim[shim];
			}
		}
	}
};

window.fallback = fallback;