(function(
	userConfig,
	defaultConfig
){
	// summary:
	//		This is the "source loader" and is the entry point for Dojo during development. You may also load Dojo with
	//		any AMD-compliant loader via the package main module dojo/main.
	// description:
	//		This is the "source loader" for Dojo. It provides an AMD-compliant loader that can be configured
	//		to operate in either synchronous or asynchronous modes. After the loader is defined, dojo is loaded
	//		IAW the package main module dojo/main. In the event you wish to use a foreign loader, you may load dojo as a package
	//		via the package main module dojo/main and this loader is not required; see dojo/package.json for details.
	//
	//		In order to keep compatibility with the v1.x line, this loader includes additional machinery that enables
	//		the dojo.provide, dojo.require et al API. This machinery is loaded by default, but may be dynamically removed
	//		via the has.js API and statically removed via the build system.
	//
	//		This loader includes sniffing machinery to determine the environment; the following environments are supported:
	//
	//		- browser
	//		- node.js
	//		- rhino
	//
	//		This is the so-called "source loader". As such, it includes many optional features that may be discadred by
	//		building a customized verion with the build system.

	// Design and Implementation Notes
	//
	// This is a dojo-specific adaption of bdLoad, donated to the dojo foundation by Altoviso LLC.
	//
	// This function defines an AMD-compliant (http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition)
	// loader that can be configured to operate in either synchronous or asynchronous modes.
	//
	// Since this machinery implements a loader, it does not have the luxury of using a load system and/or
	// leveraging a utility library. This results in an unpleasantly long file; here is a road map of the contents:
	//
	//	 1. Small library for use implementing the loader.
	//	 2. Define the has.js API; this is used throughout the loader to bracket features.
	//	 3. Define the node.js and rhino sniffs and sniff.
	//	 4. Define the loader's data.
	//	 5. Define the configuration machinery.
	//	 6. Define the script element sniffing machinery and sniff for configuration data.
	//	 7. Configure the loader IAW the provided user, default, and sniffing data.
	//	 8. Define the global require function.
	//	 9. Define the module resolution machinery.
	//	10. Define the module and plugin module definition machinery
	//	11. Define the script injection machinery.
	//	12. Define the window load detection.
	//	13. Define the logging API.
	//	14. Define the tracing API.
	//	16. Define the AMD define function.
	//	17. Define the dojo v1.x provide/require machinery--so called "legacy" modes.
	//	18. Publish global variables.
	//
	// Language and Acronyms and Idioms
	//
	// moduleId: a CJS module identifier, (used for public APIs)
	// mid: moduleId (used internally)
	// packageId: a package identifier (used for public APIs)
	// pid: packageId (used internally); the implied system or default package has pid===""
	// pack: package is used internally to reference a package object (since javascript has reserved words including "package")
	// prid: plugin resource identifier
	// The integer constant 1 is used in place of true and 0 in place of false.

	// define a minimal library to help build the loader
	var	noop = function(){
		},

		isEmpty = function(it){
			for(var p in it){
				return 0;
			}
			return 1;
		},

		toString = {}.toString,

		isFunction = function(it){
			return toString.call(it) == "[object Function]";
		},

		isString = function(it){
			return toString.call(it) == "[object String]";
		},

		isArray = function(it){
			return toString.call(it) == "[object Array]";
		},

		forEach = function(vector, callback){
			if(vector){
				for(var i = 0; i < vector.length;){
					callback(vector[i++]);
				}
			}
		},

		mix = function(dest, src){
			for(var p in src){
				dest[p] = src[p];
			}
			return dest;
		},

		makeError = function(error, info){
			return mix(new Error(error), {src:"dojoLoader", info:info});
		},

		uidSeed = 1,

		uid = function(){
			// Returns a unique indentifier (within the lifetime of the document) of the form /_d+/.
			return "_" + uidSeed++;
		},

		// FIXME: how to doc window.require() api

		// this will be the global require function; define it immediately so we can start hanging things off of it
		req = function(
			config,		  //(object, optional) hash of configuration properties
			dependencies, //(array of commonjs.moduleId, optional) list of modules to be loaded before applying callback
			callback	  //(function, optional) lamda expression to apply to module values implied by dependencies
		){
			return contextRequire(config, dependencies, callback, 0, req);
		},

		// the loader uses the has.js API to control feature inclusion/exclusion; define then use throughout
		global = this,

		doc = global.document,

		element = doc && doc.createElement("DiV"),

		has = req.has = function(name){
			return isFunction(hasCache[name]) ? (hasCache[name] = hasCache[name](global, doc, element)) : hasCache[name];
		},

		hasCache = has.cache = defaultConfig.hasCache;

	has.add = function(name, test, now, force){
		(hasCache[name]===undefined || force) && (hasCache[name] = test);
		return now && has(name);
	};

	 0 && has.add("host-node", userConfig.has && "host-node" in userConfig.has ?
		userConfig.has["host-node"] :
		(typeof process == "object" && process.versions && process.versions.node && process.versions.v8));
	if( 0 ){
		// fixup the default config for node.js environment
		require("./_base/configNode.js").config(defaultConfig);
		// remember node's require (with respect to baseUrl==dojo's root)
		defaultConfig.loaderPatch.nodeRequire = require;
	}

	 0 && has.add("host-rhino", userConfig.has && "host-rhino" in userConfig.has ?
		userConfig.has["host-rhino"] :
		(typeof load == "function" && (typeof Packages == "function" || typeof Packages == "object")));
	if( 0 ){
		// owing to rhino's lame feature that hides the source of the script, give the user a way to specify the baseUrl...
		for(var baseUrl = userConfig.baseUrl || ".", arg, rhinoArgs = this.arguments, i = 0; i < rhinoArgs.length;){
			arg = (rhinoArgs[i++] + "").split("=");
			if(arg[0] == "baseUrl"){
				baseUrl = arg[1];
				break;
			}
		}
		load(baseUrl + "/_base/configRhino.js");
		rhinoDojoConfig(defaultConfig, baseUrl, rhinoArgs);
	}

	// userConfig has tests override defaultConfig has tests; do this after the environment detection because
	// the environment detection usually sets some has feature values in the hasCache.
	for(var p in userConfig.has){
		has.add(p, userConfig.has[p], 0, 1);
	}

	//
	// define the loader data
	//

	// the loader will use these like symbols if the loader has the traceApi; otherwise
	// define magic numbers so that modules can be provided as part of defaultConfig
	var	requested = 1,
		arrived = 2,
		nonmodule = 3,
		executing = 4,
		executed = 5;

	if( 0 ){
		// these make debugging nice; but using strings for symbols is a gross rookie error; don't do it for production code
		requested = "requested";
		arrived = "arrived";
		nonmodule = "not-a-module";
		executing = "executing";
		executed = "executed";
	}

	var legacyMode = 0,
		sync = "sync",
		xd = "xd",
		syncExecStack = [],
		dojoRequirePlugin = 0,
		checkDojoRequirePlugin = noop,
		transformToAmd = noop,
		getXhr;
	if( 0 ){
		req.isXdUrl = noop;

		req.initSyncLoader = function(dojoRequirePlugin_, checkDojoRequirePlugin_, transformToAmd_){
			// the first dojo/_base/loader loaded gets to define these variables; they are designed to work
			// in the presense of zero to many mapped dojo/_base/loaders
			if(!dojoRequirePlugin){
				dojoRequirePlugin = dojoRequirePlugin_;
				checkDojoRequirePlugin = checkDojoRequirePlugin_;
				transformToAmd = transformToAmd_;
			}

			return {
				sync:sync,
				requested:requested,
				arrived:arrived,
				nonmodule:nonmodule,
				executing:executing,
				executed:executed,
				syncExecStack:syncExecStack,
				modules:modules,
				execQ:execQ,
				getModule:getModule,
				injectModule:injectModule,
				setArrived:setArrived,
				signal:signal,
				finishExec:finishExec,
				execModule:execModule,
				dojoRequirePlugin:dojoRequirePlugin,
				getLegacyMode:function(){return legacyMode;},
				guardCheckComplete:guardCheckComplete
			};
		};

		if( 1 ){
			// in legacy sync mode, the loader needs a minimal XHR library

			var locationProtocol = location.protocol,
				locationHost = location.host;
			req.isXdUrl = function(url){
				if(/^\./.test(url)){
					// begins with a dot is always relative to page URL; therefore not xdomain
					return false;
				}
				if(/^\/\//.test(url)){
					// for v1.6- backcompat, url starting with // indicates xdomain
					return true;
				}
				// get protocol and host
				// \/+ takes care of the typical file protocol that looks like file:///drive/path/to/file
				// locationHost is falsy if file protocol => if locationProtocol matches and is "file:", || will return false
				var match = url.match(/^([^\/\:]+\:)\/+([^\/]+)/);
				return match && (match[1] != locationProtocol || (locationHost && match[2] != locationHost));
			};


			// note: to get the file:// protocol to work in FF, you must set security.fileuri.strict_origin_policy to false in about:config
			 1 || has.add("dojo-xhr-factory", 1);
			has.add("dojo-force-activex-xhr",  1  && !doc.addEventListener && window.location.protocol == "file:");
			has.add("native-xhr", typeof XMLHttpRequest != "undefined");
			if(has("native-xhr") && !has("dojo-force-activex-xhr")){
				getXhr = function(){
					return new XMLHttpRequest();
				};
			}else{
				// if in the browser an old IE; find an xhr
				for(var XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'], progid, i = 0; i < 3;){
					try{
						progid = XMLHTTP_PROGIDS[i++];
						if(new ActiveXObject(progid)){
							// this progid works; therefore, use it from now on
							break;
						}
					}catch(e){
						// squelch; we're just trying to find a good ActiveX progid
						// if they all fail, then progid ends up as the last attempt and that will signal the error
						// the first time the client actually tries to exec an xhr
					}
				}
				getXhr = function(){
					return new ActiveXObject(progid);
				};
			}
			req.getXhr = getXhr;

			has.add("dojo-gettext-api", 1);
			req.getText = function(url, async, onLoad){
				var xhr = getXhr();
				xhr.open('GET', fixupUrl(url), false);
				xhr.send(null);
				if(xhr.status == 200 || (!location.host && !xhr.status)){
					if(onLoad){
						onLoad(xhr.responseText, async);
					}
				}else{
					throw makeError("xhrFailed", xhr.status);
				}
				return xhr.responseText;
			};
		}
	}else{
		req.async = 1;
	}

	//
	// loader eval
	//
	var eval_ =
		// use the function constructor so our eval is scoped close to (but not in) in the global space with minimal pollution
		new Function('return eval(arguments[0]);');

	req.eval =
		function(text, hint){
			return eval_(text + "\r\n////@ sourceURL=" + hint);
		};

	//
	// loader micro events API
	//
	var listenerQueues = {},
		error = "error",
		signal = req.signal = function(type, args){
			var queue = listenerQueues[type];
			// notice we run a copy of the queue; this allows listeners to add/remove
			// other listeners without affecting this particular signal
			forEach(queue && queue.slice(0), function(listener){
				listener.apply(null, isArray(args) ? args : [args]);
			});
		},
		on = req.on = function(type, listener){
			// notice a queue is not created until a client actually connects
			var queue = listenerQueues[type] || (listenerQueues[type] = []);
			queue.push(listener);
			return {
				remove:function(){
					for(var i = 0; i<queue.length; i++){
						if(queue[i]===listener){
							queue.splice(i, 1);
							return;
						}
					}
				}
			};
		};

	// configuration machinery; with an optimized/built defaultConfig, all configuration machinery can be discarded
	// lexical variables hold key loader data structures to help with minification; these may be completely,
	// one-time initialized by defaultConfig for optimized/built versions
	var
		aliases
			// a vector of pairs of [regexs or string, replacement] => (alias, actual)
			= [],

		paths
			// CommonJS paths
			= {},

		pathsMapProg
			// list of (from-path, to-path, regex, length) derived from paths;
			// a "program" to apply paths; see computeMapProg
			= [],

		packs
			// a map from packageId to package configuration object; see fixupPackageInfo
			= {},

		map = req.map
			// AMD map config variable; dojo/_base/kernel needs req.map to figure out the scope map
			= {},

		mapProgs
			// vector of quads as described by computeMapProg; map-key is AMD map key, map-value is AMD map value
			= [],

		modules
			// A hash:(mid) --> (module-object) the module namespace
			//
			// pid: the package identifier to which the module belongs (e.g., "dojo"); "" indicates the system or default package
			// mid: the fully-resolved (i.e., mappings have been applied) module identifier without the package identifier (e.g., "dojo/io/script")
			// url: the URL from which the module was retrieved
			// pack: the package object of the package to which the module belongs
			// executed: 0 => not executed; executing => in the process of tranversing deps and running factory; executed => factory has been executed
			// deps: the dependency vector for this module (vector of modules objects)
			// def: the factory for this module
			// result: the result of the running the factory for this module
			// injected: (0 | requested | arrived) the status of the module; nonmodule means the resource did not call define
			// load: plugin load function; applicable only for plugins
			//
			// Modules go through several phases in creation:
			//
			// 1. Requested: some other module's definition or a require application contained the requested module in
			//	  its dependency vector or executing code explicitly demands a module via req.require.
			//
			// 2. Injected: a script element has been appended to the insert-point element demanding the resource implied by the URL
			//
			// 3. Loaded: the resource injected in [2] has been evalated.
			//
			// 4. Defined: the resource contained a define statement that advised the loader about the module. Notice that some
			//	  resources may just contain a bundle of code and never formally define a module via define
			//
			// 5. Evaluated: the module was defined via define and the loader has evaluated the factory and computed a result.
			= {},

		cacheBust
			// query string to append to module URLs to bust browser cache
			= "",

		cache
			// hash:(mid | url)-->(function | string)
			//
			// A cache of resources. The resources arrive via a config.cache object, which is a hash from either mid --> function or
			// url --> string. The url key is distinguished from the mid key by always containing the prefix "url:". url keys as provided
			// by config.cache always have a string value that represents the contents of the resource at the given url. mid keys as provided
			// by configl.cache always have a function value that causes the same code to execute as if the module was script injected.
			//
			// Both kinds of key-value pairs are entered into cache via the function consumePendingCache, which may relocate keys as given
			// by any mappings *iff* the config.cache was received as part of a module resource request.
			//
			// Further, for mid keys, the implied url is computed and the value is entered into that key as well. This allows mapped modules
			// to retrieve cached items that may have arrived consequent to another namespace.
			//
			 = {},

		urlKeyPrefix
			// the prefix to prepend to a URL key in the cache.
			= "url:",

		pendingCacheInsert
			// hash:(mid)-->(function)
			//
			// Gives a set of cache modules pending entry into cache. When cached modules are published to the loader, they are
			// entered into pendingCacheInsert; modules are then pressed into cache upon (1) AMD define or (2) upon receiving another
			// independent set of cached modules. (1) is the usual case, and this case allows normalizing mids given in the pending
			// cache for the local configuration, possibly relocating modules.
			 = {},

		dojoSniffConfig
			// map of configuration variables
			// give the data-dojo-config as sniffed from the document (if any)
			= {};

	if( 1 ){
		var consumePendingCacheInsert = function(referenceModule){
				var p, item, match, now, m;
				for(p in pendingCacheInsert){
					item = pendingCacheInsert[p];
					match = p.match(/^url\:(.+)/);
					if(match){
						cache[urlKeyPrefix + toUrl(match[1], referenceModule)] =  item;
					}else if(p=="*now"){
						now = item;
					}else if(p!="*noref"){
						m = getModuleInfo(p, referenceModule);
						cache[m.mid] = cache[urlKeyPrefix + m.url] = item;
					}
				}
				if(now){
					now(createRequire(referenceModule));
				}
				pendingCacheInsert = {};
			},

			escapeString = function(s){
				return s.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(c){ return "\\" + c; });
			},

			computeMapProg = function(map, dest){
				// This routine takes a map as represented by a JavaScript object and initializes dest, a vector of
				// quads of (map-key, map-value, refex-for-map-key, length-of-map-key), sorted decreasing by length-
				// of-map-key. The regex looks for the map-key followed by either "/" or end-of-string at the beginning
				// of a the search source. Notice the map-value is irrelevent to the algorithm
				dest.splice(0, dest.length);
				for(var p in map){
					dest.push([
						p,
						map[p],
						new RegExp("^" + escapeString(p) + "(\/|$)"),
						p.length]);
				}
				dest.sort(function(lhs, rhs){ return rhs[3] - lhs[3]; });
				return dest;
			},

			fixupPackageInfo = function(packageInfo){
				// calculate the precise (name, location, main, mappings) for a package
				var name = packageInfo.name;
				if(!name){
					// packageInfo must be a string that gives the name
					name = packageInfo;
					packageInfo = {name:name};
				}
				packageInfo = mix({main:"main"}, packageInfo);
				packageInfo.location = packageInfo.location ? packageInfo.location : name;

				// packageMap is depricated in favor of AMD map
				if(packageInfo.packageMap){
					map[name] = packageInfo.packageMap;
				}

				if(!packageInfo.main.indexOf("./")){
					packageInfo.main = packageInfo.main.substring(2);
				}

				// now that we've got a fully-resolved package object, push it into the configuration
				packs[name] = packageInfo;
			},

			delayedModuleConfig
				// module config cannot be consummed until the loader is completely initialized; therefore, all
				// module config detected during booting is memorized and applied at the end of loader initialization
				// TODO: this is a bit of a kludge; all config should be moved to end of loader initialization, but
				// we'll delay this chore and do it with a final loader 1.x cleanup after the 2.x loader prototyping is complete
				= [],


			config = function(config, booting, referenceModule){
				for(var p in config){
					if(p=="waitSeconds"){
						req.waitms = (config[p] || 0) * 1000;
					}
					if(p=="cacheBust"){
						cacheBust = config[p] ? (isString(config[p]) ? config[p] : (new Date()).getTime() + "") : "";
					}
					if(p=="baseUrl" || p=="combo"){
						req[p] = config[p];
					}
					if( 0  && p=="async"){
						// falsy or "sync" => legacy sync loader
						// "xd" => sync but loading xdomain tree and therefore loading asynchronously (not configurable, set automatically by the loader)
						// "legacyAsync" => permanently in "xd" by choice
						// "debugAtAllCosts" => trying to load everything via script injection (not implemented)
						// otherwise, must be truthy => AMD
						// legacyMode: sync | legacyAsync | xd | false
						var mode = config[p];
						req.legacyMode = legacyMode = (isString(mode) && /sync|legacyAsync/.test(mode) ? mode : (!mode ? sync : false));
						req.async = !legacyMode;
					}
					if(config[p]!==hasCache){
						// accumulate raw config info for client apps which can use this to pass their own config
						req.rawConfig[p] = config[p];
						p!="has" && has.add("config-"+p, config[p], 0, booting);
					}
				}

				// make sure baseUrl exists
				if(!req.baseUrl){
					req.baseUrl = "./";
				}
				// make sure baseUrl ends with a slash
				if(!/\/$/.test(req.baseUrl)){
					req.baseUrl += "/";
				}

				// now do the special work for has, packages, packagePaths, paths, aliases, and cache

				for(p in config.has){
					has.add(p, config.has[p], 0, booting);
				}

				// for each package found in any packages config item, augment the packs map owned by the loader
				forEach(config.packages, fixupPackageInfo);

				// for each packagePath found in any packagePaths config item, augment the packageConfig
				// packagePaths is depricated; remove in 2.0
				for(baseUrl in config.packagePaths){
					forEach(config.packagePaths[baseUrl], function(packageInfo){
						var location = baseUrl + "/" + packageInfo;
						if(isString(packageInfo)){
							packageInfo = {name:packageInfo};
						}
						packageInfo.location = location;
						fixupPackageInfo(packageInfo);
					});
				}

				// notice that computeMapProg treats the dest as a reference; therefore, if/when that variable
				// is published (see dojo-publish-privates), the published variable will always hold a valid value.

				// this must come after all package processing since package processing may mutate map
				computeMapProg(mix(map, config.map), mapProgs);
				forEach(mapProgs, function(item){
					item[1] = computeMapProg(item[1], []);
					if(item[0]=="*"){
						mapProgs.star = item;
					}
				});

				// push in any paths and recompute the internal pathmap
				computeMapProg(mix(paths, config.paths), pathsMapProg);

				// aliases
				forEach(config.aliases, function(pair){
					if(isString(pair[0])){
						pair[0] = new RegExp("^" + escapeString(pair[0]) + "$");
					}
					aliases.push(pair);
				});

				if(booting){
					delayedModuleConfig.push({config:config.config});
				}else{
					for(p in config.config){
						var module = getModule(p, referenceModule);
						module.config = mix(module.config || {}, config.config[p]);
					}
				}

				// push in any new cache values
				if(config.cache){
					consumePendingCacheInsert();
					pendingCacheInsert = config.cache;
					if(config.cache["*noref"]){
						consumePendingCacheInsert();
					}
				}

				signal("config", [config, req.rawConfig]);
			};

		//
		// execute the various sniffs; userConfig can override and value
		//

		if( 0  ||  0 ){
			// the sniff regex looks for a src attribute ending in dojo.js, optionally preceeded with a path.
			// match[3] returns the path to dojo.js (if any) without the trailing slash. This is used for the
			// dojo location on CDN deployments and baseUrl when either/both of these are not provided
			// explicitly in the config data; this is the 1.6- behavior.

			var scripts = doc.getElementsByTagName("script"),
				i = 0,
				script, dojoDir, src, match;
			while(i < scripts.length){
				script = scripts[i++];
				if((src = script.getAttribute("src")) && (match = src.match(/(((.*)\/)|^)dojo\.js(\W|$)/i))){
					// sniff dojoDir and baseUrl
					dojoDir = match[3] || "";
					defaultConfig.baseUrl = defaultConfig.baseUrl || dojoDir;

					// sniff configuration on attribute in script element
					src = (script.getAttribute("data-dojo-config") || script.getAttribute("djConfig"));
					if(src){
						dojoSniffConfig = req.eval("({ " + src + " })", "data-dojo-config");
					}

					// sniff requirejs attribute
					if( 0 ){
						var dataMain = script.getAttribute("data-main");
						if(dataMain){
							dojoSniffConfig.deps = dojoSniffConfig.deps || [dataMain];
						}
					}
					break;
				}
			}
		}

		if( 0 ){
			// pass down doh.testConfig from parent as if it were a data-dojo-config
			try{
				if(window.parent != window && window.parent.require){
					var doh = window.parent.require("doh");
					doh && mix(dojoSniffConfig, doh.testConfig);
				}
			}catch(e){}
		}

		// configure the loader; let the user override defaults
		req.rawConfig = {};
		config(defaultConfig, 1);

		// do this before setting userConfig/sniffConfig to allow userConfig/sniff overrides
		if( 0 ){
			packs.dojo.location = dojoDir;
			if(dojoDir){
				dojoDir += "/";
			}
			packs.dijit.location = dojoDir + "../dijit/";
			packs.dojox.location = dojoDir + "../dojox/";
		}

		config(userConfig, 1);
		config(dojoSniffConfig, 1);

	}else{
		// no config API, assume defaultConfig has everything the loader needs...for the entire lifetime of the application
		paths = defaultConfig.paths;
		pathsMapProg = defaultConfig.pathsMapProg;
		packs = defaultConfig.packs;
		aliases = defaultConfig.aliases;
		mapProgs = defaultConfig.mapProgs;
		modules = defaultConfig.modules;
		cache = defaultConfig.cache;
		cacheBust = defaultConfig.cacheBust;

		// remember the default config for other processes (e.g., dojo/config)
		req.rawConfig = defaultConfig;
	}


	if( 0 ){
		req.combo = req.combo || {add:noop};
		var	comboPending = 0,
			combosPending = [],
			comboPendingTimer = null;
	}


	// build the loader machinery iaw configuration, including has feature tests
	var	injectDependencies = function(module){
			// checkComplete!=0 holds the idle signal; we're not idle if we're injecting dependencies
			guardCheckComplete(function(){
				forEach(module.deps, injectModule);
				if( 0  && comboPending && !comboPendingTimer){
					comboPendingTimer = setTimeout(function() {
						comboPending = 0;
						comboPendingTimer = null;
						req.combo.done(function(mids, url) {
							var onLoadCallback= function(){
								// defQ is a vector of module definitions 1-to-1, onto mids
								runDefQ(0, mids);
								checkComplete();
							};
							combosPending.push(mids);
							injectingModule = mids;
							req.injectUrl(url, onLoadCallback, mids);
							injectingModule = 0;
						}, req);
					}, 0);
				}
			});
		},

		contextRequire = function(a1, a2, a3, referenceModule, contextRequire){
			var module, syntheticMid;
			if(isString(a1)){
				// signature is (moduleId)
				module = getModule(a1, referenceModule, true);
				if(module && module.executed){
					return module.result;
				}
				throw makeError("undefinedModule", a1);
			}
			if(!isArray(a1)){
				// a1 is a configuration
				config(a1, 0, referenceModule);

				// juggle args; (a2, a3) may be (dependencies, callback)
				a1 = a2;
				a2 = a3;
			}
			if(isArray(a1)){
				// signature is (requestList [,callback])
				if(!a1.length){
					a2 && a2();
				}else{
					syntheticMid = "require*" + uid();

					// resolve the request list with respect to the reference module
					for(var mid, deps = [], i = 0; i < a1.length;){
						mid = a1[i++];
						deps.push(getModule(mid, referenceModule));
					}

					// construct a synthetic module to control execution of the requestList, and, optionally, callback
					module = mix(makeModuleInfo("", syntheticMid, 0, ""), {
						injected: arrived,
						deps: deps,
						def: a2 || noop,
						require: referenceModule ? referenceModule.require : req,
						gc: 1 //garbage collect
					});
					modules[module.mid] = module;

					// checkComplete!=0 holds the idle signal; we're not idle if we're injecting dependencies
					injectDependencies(module);

					// try to immediately execute
					// if already traversing a factory tree, then strict causes circular dependency to abort the execution; maybe
					// it's possible to execute this require later after the current traversal completes and avoid the circular dependency.
					// ...but *always* insist on immediate in synch mode
					var strict = checkCompleteGuard && legacyMode!=sync;
					guardCheckComplete(function(){
						execModule(module, strict);
					});
					if(!module.executed){
						// some deps weren't on board or circular dependency detected and strict; therefore, push into the execQ
						execQ.push(module);
					}
					checkComplete();
				}
			}
			return contextRequire;
		},

		createRequire = function(module){
			if(!module){
				return req;
			}
			var result = module.require;
			if(!result){
				result = function(a1, a2, a3){
					return contextRequire(a1, a2, a3, module, result);
				};
				module.require = mix(result, req);
				result.module = module;
				result.toUrl = function(name){
					return toUrl(name, module);
				};
				result.toAbsMid = function(mid){
					return toAbsMid(mid, module);
				};
				if( 0 ){
					result.undef = function(mid){
						req.undef(mid, module);
					};
				}
				if( 0 ){
					result.syncLoadNls = function(mid){
						var nlsModuleInfo = getModuleInfo(mid, module),
							nlsModule = modules[nlsModuleInfo.mid];
						if(!nlsModule || !nlsModule.executed){
							cached = cache[nlsModuleInfo.mid] || cache[urlKeyPrefix + nlsModuleInfo.url];
							if(cached){
								evalModuleText(cached);
								nlsModule = modules[nlsModuleInfo.mid];
							}
						}
						return nlsModule && nlsModule.executed && nlsModule.result;
					};
				}

			}
			return result;
		},

		execQ =
			// The list of modules that need to be evaluated.
			[],

		defQ =
			// The queue of define arguments sent to loader.
			[],

		waiting =
			// The set of modules upon which the loader is waiting for definition to arrive
			{},

		setRequested = function(module){
			module.injected = requested;
			waiting[module.mid] = 1;
			if(module.url){
				waiting[module.url] = module.pack || 1;
			}
			startTimer();
		},

		setArrived = function(module){
			module.injected = arrived;
			delete waiting[module.mid];
			if(module.url){
				delete waiting[module.url];
			}
			if(isEmpty(waiting)){
				clearTimer();
				 0  && legacyMode==xd && (legacyMode = sync);
			}
		},

		execComplete = req.idle =
			// says the loader has completed (or not) its work
			function(){
				return !defQ.length && isEmpty(waiting) && !execQ.length && !checkCompleteGuard;
			},

		runMapProg = function(targetMid, map){
			// search for targetMid in map; return the map item if found; falsy otherwise
			if(map){
			for(var i = 0; i < map.length; i++){
				if(map[i][2].test(targetMid)){
					return map[i];
				}
			}
			}
			return 0;
		},

		compactPath = function(path){
			var result = [],
				segment, lastSegment;
			path = path.replace(/\\/g, '/').split('/');
			while(path.length){
				segment = path.shift();
				if(segment==".." && result.length && lastSegment!=".."){
					result.pop();
					lastSegment = result[result.length - 1];
				}else if(segment!="."){
					result.push(lastSegment= segment);
				} // else ignore "."
			}
			return result.join("/");
		},

		makeModuleInfo = function(pid, mid, pack, url){
			if( 0 ){
				var xd= req.isXdUrl(url);
				return {pid:pid, mid:mid, pack:pack, url:url, executed:0, def:0, isXd:xd, isAmd:!!(xd || (packs[pid] && packs[pid].isAmd))};
			}else{
				return {pid:pid, mid:mid, pack:pack, url:url, executed:0, def:0};
			}
		},

		getModuleInfo_ = function(mid, referenceModule, packs, modules, baseUrl, mapProgs, pathsMapProg, alwaysCreate){
			// arguments are passed instead of using lexical variables so that this function my be used independent of the loader (e.g., the builder)
			// alwaysCreate is useful in this case so that getModuleInfo never returns references to real modules owned by the loader
			var pid, pack, midInPackage, mapProg, mapItem, url, result, isRelative, requestedMid;
			requestedMid = mid;
			isRelative = /^\./.test(mid);
			if(/(^\/)|(\:)|(\.js$)/.test(mid) || (isRelative && !referenceModule)){
				// absolute path or protocol of .js filetype, or relative path but no reference module and therefore relative to page
				// whatever it is, it's not a module but just a URL of some sort
				// note: pid===0 indicates the routine is returning an unmodified mid

				return makeModuleInfo(0, mid, 0, mid);
			}else{
				// relative module ids are relative to the referenceModule; get rid of any dots
				mid = compactPath(isRelative ? (referenceModule.mid + "/../" + mid) : mid);
				if(/^\./.test(mid)){
					throw makeError("irrationalPath", mid);
				}
				// at this point, mid is an absolute mid

				// map the mid
				if(referenceModule){
					mapItem = runMapProg(referenceModule.mid, mapProgs);
				}
				mapItem = mapItem || mapProgs.star;
				mapItem = mapItem && runMapProg(mid, mapItem[1]);

				if(mapItem){
					mid = mapItem[1] + mid.substring(mapItem[3]);
					}

				match = mid.match(/^([^\/]+)(\/(.+))?$/);
				pid = match ? match[1] : "";
				if((pack = packs[pid])){
					mid = pid + "/" + (midInPackage = (match[3] || pack.main));
				}else{
					pid = "";
				}

				// search aliases
				var candidateLength = 0,
					candidate = 0;
				forEach(aliases, function(pair){
					var match = mid.match(pair[0]);
					if(match && match.length>candidateLength){
						candidate = isFunction(pair[1]) ? mid.replace(pair[0], pair[1]) : pair[1];
					}
				});
				if(candidate){
					return getModuleInfo_(candidate, 0, packs, modules, baseUrl, mapProgs, pathsMapProg, alwaysCreate);
				}

				result = modules[mid];
				if(result){
					return alwaysCreate ? makeModuleInfo(result.pid, result.mid, result.pack, result.url) : modules[mid];
				}
			}
			// get here iff the sought-after module does not yet exist; therefore, we need to compute the URL given the
			// fully resolved (i.e., all relative indicators and package mapping resolved) module id

			// note: pid!==0 indicates the routine is returning a url that has .js appended unmodified mid
			mapItem = runMapProg(mid, pathsMapProg);
			if(mapItem){
				url = mapItem[1] + mid.substring(mapItem[3]);
			}else if(pid){
				url = pack.location + "/" + midInPackage;
			}else if( 0 ){
				url = "../" + mid;
			}else{
				url = mid;
			}
			// if result is not absolute, add baseUrl
			if(!(/(^\/)|(\:)/.test(url))){
				url = baseUrl + url;
			}
			url += ".js";
			return makeModuleInfo(pid, mid, pack, compactPath(url));
		},

		getModuleInfo = function(mid, referenceModule){
			return getModuleInfo_(mid, referenceModule, packs, modules, req.baseUrl, mapProgs, pathsMapProg);
		},

		resolvePluginResourceId = function(plugin, prid, referenceModule){
			return plugin.normalize ? plugin.normalize(prid, function(mid){return toAbsMid(mid, referenceModule);}) : toAbsMid(prid, referenceModule);
		},

		dynamicPluginUidGenerator = 0,

		getModule = function(mid, referenceModule, immediate){
			// compute and optionally construct (if necessary) the module implied by the mid with respect to referenceModule
			var match, plugin, prid, result;
			match = mid.match(/^(.+?)\!(.*)$/);
			if(match){
				// name was <plugin-module>!<plugin-resource-id>
				plugin = getModule(match[1], referenceModule, immediate);

				if( 0  && legacyMode == sync && !plugin.executed){
					injectModule(plugin);
					if(plugin.injected===arrived && !plugin.executed){
						guardCheckComplete(function(){
							execModule(plugin);
						});
					}
					if(plugin.executed){
						promoteModuleToPlugin(plugin);
					}else{
						// we are in xdomain mode for some reason
						execQ.unshift(plugin);
					}
				}



				if(plugin.executed === executed && !plugin.load){
					// executed the module not knowing it was a plugin
					promoteModuleToPlugin(plugin);
				}

				// if the plugin has not been loaded, then can't resolve the prid and  must assume this plugin is dynamic until we find out otherwise
				if(plugin.load){
					prid = resolvePluginResourceId(plugin, match[2], referenceModule);
					mid = (plugin.mid + "!" + (plugin.dynamic ? ++dynamicPluginUidGenerator + "!" : "") + prid);
				}else{
					prid = match[2];
					mid = plugin.mid + "!" + (++dynamicPluginUidGenerator) + "!waitingForPlugin";
				}
				result = {plugin:plugin, mid:mid, req:createRequire(referenceModule), prid:prid};
			}else{
				result = getModuleInfo(mid, referenceModule);
			}
			return modules[result.mid] || (!immediate && (modules[result.mid] = result));
		},

		toAbsMid = req.toAbsMid = function(mid, referenceModule){
			return getModuleInfo(mid, referenceModule).mid;
		},

		toUrl = req.toUrl = function(name, referenceModule){
			var moduleInfo = getModuleInfo(name+"/x", referenceModule),
				url= moduleInfo.url;
			return fixupUrl(moduleInfo.pid===0 ?
				// if pid===0, then name had a protocol or absolute path; either way, toUrl is the identify function in such cases
				name :
				// "/x.js" since getModuleInfo automatically appends ".js" and we appended "/x" to make name look likde a module id
				url.substring(0, url.length-5)
			);
		},

		nonModuleProps = {
			injected: arrived,
			executed: executed,
			def: nonmodule,
			result: nonmodule
		},

		makeCjs = function(mid){
			return modules[mid] = mix({mid:mid}, nonModuleProps);
		},

		cjsRequireModule = makeCjs("require"),
		cjsExportsModule = makeCjs("exports"),
		cjsModuleModule = makeCjs("module"),

		runFactory = function(module, args){
			req.trace("loader-run-factory", [module.mid]);
			var factory = module.def,
				result;
			 0  && syncExecStack.unshift(module);
			if( 0 ){
				try{
					result= isFunction(factory) ? factory.apply(null, args) : factory;
				}catch(e){
					signal(error, module.result = makeError("factoryThrew", [module, e]));
				}
			}else{
				result= isFunction(factory) ? factory.apply(null, args) : factory;
			}
			module.result = result===undefined && module.cjs ? module.cjs.exports : result;
			 0  && syncExecStack.shift(module);
		},

		abortExec = {},

		defOrder = 0,

		promoteModuleToPlugin = function(pluginModule){
			var plugin = pluginModule.result;
			pluginModule.dynamic = plugin.dynamic;
			pluginModule.normalize = plugin.normalize;
			pluginModule.load = plugin.load;
			return pluginModule;
		},

		resolvePluginLoadQ = function(plugin){
			// plugins is a newly executed module that has a loadQ waiting to run

			// step 1: traverse the loadQ and fixup the mid and prid; remember the map from original mid to new mid
			// recall the original mid was created before the plugin was on board and therefore it was impossible to
			// compute the final mid; accordingly, prid may or may not change, but the mid will definitely change
			var map = {};
			forEach(plugin.loadQ, function(pseudoPluginResource){
				// manufacture and insert the real module in modules
				var prid = resolvePluginResourceId(plugin, pseudoPluginResource.prid, pseudoPluginResource.req.module),
					mid = plugin.dynamic ? pseudoPluginResource.mid.replace(/waitingForPlugin$/, prid) : (plugin.mid + "!" + prid),
					pluginResource = mix(mix({}, pseudoPluginResource), {mid:mid, prid:prid, injected:0});
				if(!modules[mid]){
					// create a new (the real) plugin resource and inject it normally now that the plugin is on board
					injectPlugin(modules[mid] = pluginResource);
				} // else this was a duplicate request for the same (plugin, rid) for a nondynamic plugin

				// pluginResource is really just a placeholder with the wrong mid (because we couldn't calculate it until the plugin was on board)
				// mark is as arrived and delete it from modules; the real module was requested above
				map[pseudoPluginResource.mid] = modules[mid];
				setArrived(pseudoPluginResource);
				delete modules[pseudoPluginResource.mid];
			});
			plugin.loadQ = 0;

			// step2: replace all references to any placeholder modules with real modules
			var substituteModules = function(module){
				for(var replacement, deps = module.deps || [], i = 0; i<deps.length; i++){
					replacement = map[deps[i].mid];
					if(replacement){
						deps[i] = replacement;
					}
				}
			};
			for(var p in modules){
				substituteModules(modules[p]);
			}
			forEach(execQ, substituteModules);
		},

		finishExec = function(module){
			req.trace("loader-finish-exec", [module.mid]);
			module.executed = executed;
			module.defOrder = defOrder++;
			 0  && forEach(module.provides, function(cb){ cb(); });
			if(module.loadQ){
				// the module was a plugin
				promoteModuleToPlugin(module);
				resolvePluginLoadQ(module);
			}
			// remove all occurences of this module from the execQ
			for(i = 0; i < execQ.length;){
				if(execQ[i] === module){
					execQ.splice(i, 1);
				}else{
					i++;
				}
			}
			// delete references to synthetic modules
			if (/^require\*/.test(module.mid)) {
				delete modules[module.mid];
			}
		},

		circleTrace = [],

		execModule = function(module, strict){
			// run the dependency vector, then run the factory for module
			if(module.executed === executing){
				req.trace("loader-circular-dependency", [circleTrace.concat(module.mid).join("->")]);
				return (!module.def || strict) ? abortExec :  (module.cjs && module.cjs.exports);
			}
			// at this point the module is either not executed or fully executed


			if(!module.executed){
				if(!module.def){
					return abortExec;
				}
				var mid = module.mid,
					deps = module.deps || [],
					arg, argResult,
					args = [],
					i = 0;

				if( 0 ){
					circleTrace.push(mid);
					req.trace("loader-exec-module", ["exec", circleTrace.length, mid]);
				}

				// for circular dependencies, assume the first module encountered was executed OK
				// modules that circularly depend on a module that has not run its factory will get
				// the premade cjs.exports===module.result. They can take a reference to this object and/or
				// add properties to it. When the module finally runs its factory, the factory can
				// read/write/replace this object. Notice that so long as the object isn't replaced, any
				// reference taken earlier while walking the deps list is still valid.
				module.executed = executing;
				while(i < deps.length){
					arg = deps[i++];
					argResult = ((arg === cjsRequireModule) ? createRequire(module) :
									((arg === cjsExportsModule) ? module.cjs.exports :
										((arg === cjsModuleModule) ? module.cjs :
											execModule(arg, strict))));
					if(argResult === abortExec){
						module.executed = 0;
						req.trace("loader-exec-module", ["abort", mid]);
						 0  && circleTrace.pop();
						return abortExec;
					}
					args.push(argResult);
				}
				runFactory(module, args);
				finishExec(module);
				 0  && circleTrace.pop();
			}
			// at this point the module is guaranteed fully executed

			return module.result;
		},


		checkCompleteGuard = 0,

		guardCheckComplete = function(proc){
			try{
				checkCompleteGuard++;
				proc();
			}finally{
				checkCompleteGuard--;
			}
			if(execComplete()){
				signal("idle", []);
			}
		},

		checkComplete = function(){
			// keep going through the execQ as long as at least one factory is executed
			// plugins, recursion, cached modules all make for many execution path possibilities
			if(checkCompleteGuard){
				return;
			}
			guardCheckComplete(function(){
				checkDojoRequirePlugin();
				for(var currentDefOrder, module, i = 0; i < execQ.length;){
					currentDefOrder = defOrder;
					module = execQ[i];
					execModule(module);
					if(currentDefOrder!=defOrder){
						// defOrder was bumped one or more times indicating something was executed (note, this indicates
						// the execQ was modified, maybe a lot (for example a later module causes an earlier module to execute)
						checkDojoRequirePlugin();
						i = 0;
					}else{
						// nothing happened; check the next module in the exec queue
						i++;
					}
				}
			});
		};


	if( 0 ){
		req.undef = function(moduleId, referenceModule){
			// In order to reload a module, it must be undefined (this routine) and then re-requested.
			// This is useful for testing frameworks (at least).
			var module = getModule(moduleId, referenceModule);
			setArrived(module);
			delete modules[module.mid];
		};
	}

	if( 1 ){
		if(has("dojo-loader-eval-hint-url")===undefined){
			has.add("dojo-loader-eval-hint-url", 1);
		}

		var fixupUrl= function(url){
				url += ""; // make sure url is a Javascript string (some paths may be a Java string)
				return url + (cacheBust ? ((/\?/.test(url) ? "&" : "?") + cacheBust) : "");
			},

			injectPlugin = function(
				module
			){
				// injects the plugin module given by module; may have to inject the plugin itself
				var plugin = module.plugin;

				if(plugin.executed === executed && !plugin.load){
					// executed the module not knowing it was a plugin
					promoteModuleToPlugin(plugin);
				}

				var onLoad = function(def){
						module.result = def;
						setArrived(module);
						finishExec(module);
						checkComplete();
					};

				if(plugin.load){
					plugin.load(module.prid, module.req, onLoad);
				}else if(plugin.loadQ){
					plugin.loadQ.push(module);
				}else{
					// the unshift instead of push is important: we don't want plugins to execute as
					// dependencies of some other module because this may cause circles when the plugin
					// loadQ is run; also, generally, we want plugins to run early since they may load
					// several other modules and therefore can potentially unblock many modules
					plugin.loadQ = [module];
					execQ.unshift(plugin);
					injectModule(plugin);
				}
			},

			// for IE, injecting a module may result in a recursive execution if the module is in the cache

			cached = 0,

			injectingModule = 0,

			injectingCachedModule = 0,

			evalModuleText = function(text, module){
				// see def() for the injectingCachedModule bracket; it simply causes a short, safe curcuit
				if(has("config-stripStrict")){
					text = text.replace(/"use strict"/g, '');
				}
				injectingCachedModule = 1;
				if( 0 ){
					try{
						if(text===cached){
							cached.call(null);
						}else{
							req.eval(text, has("dojo-loader-eval-hint-url") ? module.url : module.mid);
						}
					}catch(e){
						signal(error, makeError("evalModuleThrew", module));
					}
				}else{
					if(text===cached){
						cached.call(null);
					}else{
						req.eval(text, has("dojo-loader-eval-hint-url") ? module.url : module.mid);
					}
				}
				injectingCachedModule = 0;
			},

			injectModule = function(module){
				// Inject the module. In the browser environment, this means appending a script element into
				// the document; in other environments, it means loading a file.
				//
				// If in synchronous mode, then get the module synchronously if it's not xdomainLoading.

				var mid = module.mid,
					url = module.url;
				if(module.executed || module.injected || waiting[mid] || (module.url && ((module.pack && waiting[module.url]===module.pack) || waiting[module.url]==1))){
					return;
				}
				setRequested(module);

				if( 0 ){
					var viaCombo = 0;
					if(module.plugin && module.plugin.isCombo){
						// a combo plugin; therefore, must be handled by combo service
						// the prid should have already been converted to a URL (if required by the plugin) during
						// the normalze process; in any event, there is no way for the loader to know how to
						// to the conversion; therefore the third argument is zero
						req.combo.add(module.plugin.mid, module.prid, 0, req);
						viaCombo = 1;
					}else if(!module.plugin){
						viaCombo = req.combo.add(0, module.mid, module.url, req);
					}
					if(viaCombo){
						comboPending= 1;
						return;
					}
				}

				if(module.plugin){
					injectPlugin(module);
					return;
				} // else a normal module (not a plugin)


				var onLoadCallback = function(){
					runDefQ(module);
					if(module.injected !== arrived){
						// the script that contained the module arrived and has been executed yet
						// nothing was added to the defQ (so it wasn't an AMD module) and the module
						// wasn't marked as arrived by dojo.provide (so it wasn't a v1.6- module);
						// therefore, it must not have been a module; adjust state accordingly
						setArrived(module);
						mix(module, nonModuleProps);
						req.trace("loader-define-nonmodule", [module.url]);
					}

					if( 0  && legacyMode){
						// must call checkComplete even in for sync loader because we may be in xdomainLoading mode;
						// but, if xd loading, then don't call checkComplete until out of the current sync traversal
						// in order to preserve order of execution of the dojo.required modules
						!syncExecStack.length && checkComplete();
					}else{
						checkComplete();
					}
				};
				cached = cache[mid] || cache[urlKeyPrefix + module.url];
				if(cached){
					req.trace("loader-inject", ["cache", module.mid, url]);
					evalModuleText(cached, module);
					onLoadCallback();
					return;
				}
				if( 0  && legacyMode){
					if(module.isXd){
						// switch to async mode temporarily; if current legacyMode!=sync, then is must be one of {legacyAsync, xd, false}
						legacyMode==sync && (legacyMode = xd);
						// fall through and load via script injection
					}else if(module.isAmd && legacyMode!=sync){
						// fall through and load via script injection
					}else{
						// mode may be sync, xd/legacyAsync, or async; module may be AMD or legacy; but module is always located on the same domain
						var xhrCallback = function(text){
							if(legacyMode==sync){
								// the top of syncExecStack gives the current synchronously executing module; the loader needs
								// to know this if it has to switch to async loading in the middle of evaluating a legacy module
								// this happens when a modules dojo.require's a module that must be loaded async because it's xdomain
								// (using unshift/shift because there is no back() methods for Javascript arrays)
								syncExecStack.unshift(module);
								evalModuleText(text, module);
								syncExecStack.shift();

								// maybe the module was an AMD module
								runDefQ(module);

								// legacy modules never get to defineModule() => cjs and injected never set; also evaluation implies executing
								if(!module.cjs){
									setArrived(module);
									finishExec(module);
								}

								if(module.finish){
									// while synchronously evaluating this module, dojo.require was applied referencing a module
									// that had to be loaded async; therefore, the loader stopped answering all dojo.require
									// requests so they could be answered completely in the correct sequence; module.finish gives
									// the list of dojo.requires that must be re-applied once all target modules are available;
									// make a synthetic module to execute the dojo.require's in the correct order

									// compute a guarnateed-unique mid for the synthetic finish module; remember the finish vector; remove it from the reference module
									// TODO: can we just leave the module.finish...what's it hurting?
									var finishMid = mid + "*finish",
										finish = module.finish;
									delete module.finish;

									def(finishMid, ["dojo", ("dojo/require!" + finish.join(",")).replace(/\./g, "/")], function(dojo){
										forEach(finish, function(mid){ dojo.require(mid); });
									});
									// unshift, not push, which causes the current traversal to be reattempted from the top
									execQ.unshift(getModule(finishMid));
								}
								onLoadCallback();
							}else{
								text = transformToAmd(module, text);
								if(text){
									evalModuleText(text, module);
									onLoadCallback();
								}else{
									// if transformToAmd returned falsy, then the module was already AMD and it can be script-injected
									// do so to improve debugability(even though it means another download...which probably won't happen with a good browser cache)
									injectingModule = module;
									req.injectUrl(fixupUrl(url), onLoadCallback, module);
									injectingModule = 0;
								}
							}
						};

						req.trace("loader-inject", ["xhr", module.mid, url, legacyMode!=sync]);
						if( 0 ){
							try{
								req.getText(url, legacyMode!=sync, xhrCallback);
							}catch(e){
								signal(error, makeError("xhrInjectFailed", [module, e]));
							}
						}else{
							req.getText(url, legacyMode!=sync, xhrCallback);
						}
						return;
					}
				} // else async mode or fell through in xdomain loading mode; either way, load by script injection
				req.trace("loader-inject", ["script", module.mid, url]);
				injectingModule = module;
				req.injectUrl(fixupUrl(url), onLoadCallback, module);
				injectingModule = 0;
			},

			defineModule = function(module, deps, def){
				req.trace("loader-define-module", [module.mid, deps]);

				if( 0  && module.plugin && module.plugin.isCombo){
					// the module is a plugin resource loaded by the combo service
					// note: check for module.plugin should be enough since normal plugin resources should
					// not follow this path; module.plugin.isCombo is future-proofing belt and suspenders
					module.result = isFunction(def) ? def() : def;
					setArrived(module);
					finishExec(module);
					return module;
				};

				var mid = module.mid;
				if(module.injected === arrived){
					signal(error, makeError("multipleDefine", module));
					return module;
				}
				mix(module, {
					deps: deps,
					def: def,
					cjs: {
						id: module.mid,
						uri: module.url,
						exports: (module.result = {}),
						setExports: function(exports){
							module.cjs.exports = exports;
						},
						config:function(){
							return module.config;
						}
					}
				});

				// resolve deps with respect to this module
				for(var i = 0; i < deps.length; i++){
					deps[i] = getModule(deps[i], module);
				}

				if( 0  && legacyMode && !waiting[mid]){
					// the module showed up without being asked for; it was probably in a <script> element
					injectDependencies(module);
					execQ.push(module);
					checkComplete();
				}
				setArrived(module);

				if(!isFunction(def) && !deps.length){
					module.result = def;
					finishExec(module);
				}

				return module;
			},

			runDefQ = function(referenceModule, mids){
				// defQ is an array of [id, dependencies, factory]
				// mids (if any) is a vector of mids given by a combo service
				var definedModules = [],
					module, args;
				while(defQ.length){
					args = defQ.shift();
					mids && (args[0]= mids.shift());
					// explicit define indicates possible multiple modules in a single file; delay injecting dependencies until defQ fully
					// processed since modules earlier in the queue depend on already-arrived modules that are later in the queue
					// TODO: what if no args[0] and no referenceModule
					module = (args[0] && getModule(args[0])) || referenceModule;
					definedModules.push([module, args[1], args[2]]);
				}
				consumePendingCacheInsert(referenceModule);
				forEach(definedModules, function(args){
					injectDependencies(defineModule.apply(null, args));
				});
			};
	}

	var timerId = 0,
		clearTimer = noop,
		startTimer = noop;
	if( 0 ){
		// Timer machinery that monitors how long the loader is waiting and signals an error when the timer runs out.
		clearTimer = function(){
			timerId && clearTimeout(timerId);
			timerId = 0;
		},

		startTimer = function(){
			clearTimer();
			if(req.waitms){
				timerId = window.setTimeout(function(){
					clearTimer();
					signal(error, makeError("timeout", waiting));
				}, req.waitms);
			}
		};
	}

	if( 1 ){
		// the typically unnecessary !! in front of doc.attachEvent is due to an opera bug; see	#15096
		has.add("ie-event-behavior", !!doc.attachEvent && (typeof opera === "undefined" || opera.toString() != "[object Opera]"));
	}

	if( 1  && ( 1  ||  1 )){
		var domOn = function(node, eventName, ieEventName, handler){
				// Add an event listener to a DOM node using the API appropriate for the current browser;
				// return a function that will disconnect the listener.
				if(!has("ie-event-behavior")){
					node.addEventListener(eventName, handler, false);
					return function(){
						node.removeEventListener(eventName, handler, false);
					};
				}else{
					node.attachEvent(ieEventName, handler);
					return function(){
						node.detachEvent(ieEventName, handler);
					};
				}
			},
			windowOnLoadListener = domOn(window, "load", "onload", function(){
				req.pageLoaded = 1;
				doc.readyState!="complete" && (doc.readyState = "complete");
				windowOnLoadListener();
			});

		if( 1 ){
			// if the loader is on the page, there must be at least one script element
			// getting its parent and then doing insertBefore solves the "Operation Aborted"
			// error in IE from appending to a node that isn't properly closed; see
			// dojo/tests/_base/loader/requirejs/simple-badbase.html for an example
			var sibling = doc.getElementsByTagName("script")[0],
				insertPoint= sibling.parentNode;
			req.injectUrl = function(url, callback, owner){
				// insert a script element to the insert-point element with src=url;
				// apply callback upon detecting the script has loaded.

				var node = owner.node = doc.createElement("script"),
					onLoad = function(e){
						e = e || window.event;
						var node = e.target || e.srcElement;
						if(e.type === "load" || /complete|loaded/.test(node.readyState)){
							loadDisconnector();
							errorDisconnector();
							callback && callback();
						}
					},
					loadDisconnector = domOn(node, "load", "onreadystatechange", onLoad),
					errorDisconnector = domOn(node, "error", "onerror", function(e){
						loadDisconnector();
						errorDisconnector();
						signal(error, makeError("scriptError", [url, e]));
					});

				node.type = "text/javascript";
				node.charset = "utf-8";
				node.src = url;
				insertPoint.insertBefore(node, sibling);
				return node;
			};
		}
	}

	if( 0 ){
		req.log = function(){
			try{
				for(var i = 0; i < arguments.length; i++){
					console.log(arguments[i]);
				}
			}catch(e){}
		};
	}else{
		req.log = noop;
	}

	if( 0 ){
		var trace = req.trace = function(
			group,	// the trace group to which this application belongs
			args	// the contents of the trace
		){
			///
			// Tracing interface by group.
			//
			// Sends the contents of args to the console iff (req.trace.on && req.trace[group])

			if(trace.on && trace.group[group]){
				signal("trace", [group, args]);
				for(var arg, dump = [], text= "trace:" + group + (args.length ? (":" + args[0]) : ""), i= 1; i<args.length;){
					arg = args[i++];
					if(isString(arg)){
						text += ", " + arg;
					}else{
						dump.push(arg);
					}
				}
				req.log(text);
				dump.length && dump.push(".");
				req.log.apply(req, dump);
			}
		};
		mix(trace, {
			on:1,
			group:{},
			set:function(group, value){
				if(isString(group)){
					trace.group[group]= value;
				}else{
					mix(trace.group, group);
				}
			}
		});
		trace.set(mix(mix(mix({}, defaultConfig.trace), userConfig.trace), dojoSniffConfig.trace));
		on("config", function(config){
			config.trace && trace.set(config.trace);
		});
	}else{
		req.trace = noop;
	}

	var def = function(
		mid,		  //(commonjs.moduleId, optional) list of modules to be loaded before running factory
		dependencies, //(array of commonjs.moduleId, optional)
		factory		  //(any)
	){
		///
		// Advises the loader of a module factory. //Implements http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition.
		///
		//note
		// CommonJS factory scan courtesy of http://requirejs.org

		var arity = arguments.length,
			defaultDeps = ["require", "exports", "module"],
			// the predominate signature...
			args = [0, mid, dependencies];
		if(arity==1){
			args = [0, (isFunction(mid) ? defaultDeps : []), mid];
		}else if(arity==2 && isString(mid)){
			args = [mid, (isFunction(dependencies) ? defaultDeps : []), dependencies];
		}else if(arity==3){
			args = [mid, dependencies, factory];
		}

		if( 0  && args[1]===defaultDeps){
			args[2].toString()
				.replace(/(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg, "")
				.replace(/require\(["']([\w\!\-_\.\/]+)["']\)/g, function(match, dep){
				args[1].push(dep);
			});
		}

		req.trace("loader-define", args.slice(0, 2));
		var targetModule = args[0] && getModule(args[0]),
			module;
		if(targetModule && !waiting[targetModule.mid]){
			// given a mid that hasn't been requested; therefore, defined through means other than injecting
			// consequent to a require() or define() application; examples include defining modules on-the-fly
			// due to some code path or including a module in a script element. In any case,
			// there is no callback waiting to finish processing and nothing to trigger the defQ and the
			// dependencies are never requested; therefore, do it here.
			injectDependencies(defineModule(targetModule, args[1], args[2]));
		}else if(!has("ie-event-behavior") || ! 1  || injectingCachedModule){
			// not IE path: anonymous module and therefore must have been injected; therefore, onLoad will fire immediately
			// after script finishes being evaluated and the defQ can be run from that callback to detect the module id
			defQ.push(args);
		}else{
			// IE path: possibly anonymous module and therefore injected; therefore, cannot depend on 1-to-1,
			// in-order exec of onLoad with script eval (since it's IE) and must manually detect here
			targetModule = targetModule || injectingModule;
			if(!targetModule){
				for(mid in waiting){
					module = modules[mid];
					if(module && module.node && module.node.readyState === 'interactive'){
						targetModule = module;
						break;
					}
				}
				if( 0  && !targetModule){
					for(var i = 0; i<combosPending.length; i++){
						targetModule = combosPending[i];
						if(targetModule.node && targetModule.node.readyState === 'interactive'){
							break;
						}
						targetModule= 0;
					}
				}
			}
			if( 0  && isArray(targetModule)){
				injectDependencies(defineModule(getModule(targetModule.shift()), args[1], args[2]));
				if(!targetModule.length){
					combosPending.splice(i, 1);
				}
			}else if(targetModule){
				consumePendingCacheInsert(targetModule);
				injectDependencies(defineModule(targetModule, args[1], args[2]));
			}else{
				signal(error, makeError("ieDefineFailed", args[0]));
			}
			checkComplete();
		}
	};
	def.amd = {
		vendor:"dojotoolkit.org"
	};

	if( 0 ){
		req.def = def;
	}

	// allow config to override default implemention of named functions; this is useful for
	// non-browser environments, e.g., overriding injectUrl, getText, log, etc. in node.js, Rhino, etc.
	// also useful for testing and monkey patching loader
	mix(mix(req, defaultConfig.loaderPatch), userConfig.loaderPatch);

	// now that req is fully initialized and won't change, we can hook it up to the error signal
	on(error, function(arg){
		try{
			console.error(arg);
			if(arg instanceof Error){
				for(var p in arg){
					console.log(p + ":", arg[p]);
				}
				console.log(".");
			}
		}catch(e){}
	});

	// always publish these
	mix(req, {
		uid:uid,
		cache:cache,
		packs:packs
	});


	if( 0 ){
		mix(req, {
			// these may be interesting to look at when debugging
			paths:paths,
			aliases:aliases,
			modules:modules,
			legacyMode:legacyMode,
			execQ:execQ,
			defQ:defQ,
			waiting:waiting,

			// these are used for testing
			// TODO: move testing infrastructure to a different has feature
			packs:packs,
			mapProgs:mapProgs,
			pathsMapProg:pathsMapProg,
			listenerQueues:listenerQueues,

			// these are used by the builder (at least)
			computeMapProg:computeMapProg,
			runMapProg:runMapProg,
			compactPath:compactPath,
			getModuleInfo:getModuleInfo_
		});
	}

	// the loader can be defined exactly once; look for global define which is the symbol AMD loaders are
	// *required* to define (as opposed to require, which is optional)
	if(global.define){
		if( 0 ){
			signal(error, makeError("defineAlreadyDefined", 0));
		}
		return;
	}else{
		global.define = def;
		global.require = req;
		if( 0 ){
			require= req;
		}
	}

	if( 0  && req.combo && req.combo.plugins){
		var plugins = req.combo.plugins,
			pluginName;
		for(pluginName in plugins){
			mix(mix(getModule(pluginName), plugins[pluginName]), {isCombo:1, executed:"executed", load:1});
		}
	}

	if( 1 ){
		forEach(delayedModuleConfig, function(c){ config(c); });
		var bootDeps = dojoSniffConfig.deps ||	userConfig.deps || defaultConfig.deps,
			bootCallback = dojoSniffConfig.callback || userConfig.callback || defaultConfig.callback;
		req.boot = (bootDeps || bootCallback) ? [bootDeps || [], bootCallback] : 0;
	}
	if(! 1 ){
		!req.async && req(["dojo"]);
		req.boot && req.apply(null, req.boot);
	}
})
(this.dojoConfig || this.djConfig || this.require || {}, {
		async:1,
		baseUrl:"./",
		hasCache:{
				'config-selectorEngine':"acme",
				'config-tlmSiblingOfDojo':1,
				'dojo-built':1,
				'dojo-loader':1,
				dom:1,
				'host-browser':1
		},
		packages:[
				{
					 location:"../frozen",
					 main:"GameCore",
					 name:"frozen"
				},
				{
					 location:".",
					 name:"dojo"
				},
				{
					 location:"../dcl",
					 main:"dcl",
					 name:"dcl"
				}
		]
});require({cache:{
'dist/frozen':function(){
define([], 1);

},
'frozen/box2d/Box':function(){
/**
 * This wraps the box2d world that contains bodies, shapes, and performs the physics calculations.
 * @name Box
 * @constructor Box
 */

define("frozen/box2d/Box", [
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang'
], function(dcl, Mixer, lang){

  'use strict';

  // box2d globals
  var B2Vec2 = Box2D.Common.Math.b2Vec2;
  var B2BodyDef = Box2D.Dynamics.b2BodyDef;
  var B2Body = Box2D.Dynamics.b2Body;
  var B2FixtureDef = Box2D.Dynamics.b2FixtureDef;
  var B2Fixture = Box2D.Dynamics.b2Fixture;
  var B2World = Box2D.Dynamics.b2World;
  var B2MassData = Box2D.Collision.Shapes.b2MassData;
  var B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  var B2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
  var B2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  return dcl(Mixer, {
    /**
     * The number of cycles per second expected in update calcuations
     * @type {Number}
     * @memberOf Box#
     * @default
     */
    intervalRate: 60,
    /**
     * Whether or not to try to compensate calculations based on performance
     * @type {Boolean}
     * @memberOf Box#
     * @default
     */
    adaptive: false,
    /**
     * A map of the bodies in the box2d world referenced by their given userData
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    bodiesMap: null,
    /**
     * A map of the fixtures in the box2d world referenced by their given userData
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    fixturesMap: null,
    /**
     * A map of the joints in the box2d world referenced by their given userData
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    jointsMap: null,
    /**
     * The instance of the Box2D.Dynamics.b2World world class that the bodies, fixtures, and joints are used in.
     * @type {B2World}
     * @memberOf Box#
     * @default
     */
    b2World: null,
    /**
     * The x component of the b2World's gravity in meters/second squared
     * @type {Number}
     * @memberOf Box#
     * @default
     */
    gravityX: 0,
    /**
     * The y component of the b2World's gravity in meters/second squared
     * @type {Number}
     * @memberOf Box#
     * @default
     */
    gravityY: 9.8,
    /**
     * Allow box2d to skip physics calculations on bodies at rest for performance
     * @type {Boolean}
     * @memberOf Box#
     * @default
     */
    allowSleep: true,
    /**
     * Whether to add a listener to collision events. Default behavior adds collision data to entities on update cycle
     * @type {Boolean}
     * @memberOf Box#
     * @default
     */
    resolveCollisions: false,
    /**
     * A contact listener for callbacks on collision events. Default is this box itself.
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    contactListener: null,
    /**
     * Map of collisions. Instantiated in update if resolveCollisions is true
     * @type {Object}
     * @memberOf Box#
     * @default
     */
    collisions: null,
    /**
     * The number of pixels that represnt one meter in the box2d world. (30 pixels ~ 1 meter in box2d)
     * @type {Number}
     * @memberOf Box#
     * @default
     */
    scale: 30,

    constructor: function(args){
      if(args && args.intervalRate){
        this.intervalRate = parseInt(args.intervalRate, 10);
      }
      this.bodiesMap = {};
      this.fixturesMap = {};
      this.jointsMap = {};

      this.b2World = new B2World(new B2Vec2(this.gravityX, this.gravityY), this.allowSleep);

      if(this.resolveCollisions){
        this.addContactListener(this.contactListener || this);
      }
    },

    /**
     * Update the box2d physics calculations
     * @function
     * @memberOf Box#
     * @param  {Number} millis The milliseconds used to determine framerate for box2d step
     * @return {Number} The amount of milliseconds the update took
     */
    update: function(millis) {
      // TODO: use window.performance.now()???

      if(this.resolveCollisions){
        this.collisions = {};
      }

      var start = Date.now();
      if(millis){
        this.b2World.Step(millis / 1000 /* frame-rate */, 10 /* velocity iterations */, 10 /*position iterations*/);
        this.b2World.ClearForces();
      }else{
        var stepRate = (this.adaptive) ? (start - this.lastTimestamp) / 1000 : (1 / this.intervalRate);
        this.b2World.Step(stepRate /* frame-rate */, 10 /* velocity iterations */, 10 /*position iterations*/);
        this.b2World.ClearForces();
      }

      return (Date.now() - start);
    },

    /**
     * Gets the current state of the objects in the box2d world.
     * @function
     * @memberOf Box#
     * @return {Object} The state of the box2d world
     */
    getState: function() {
      var state = {};
      for (var b = this.b2World.GetBodyList(); b; b = b.m_next) {
        if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() !== null) {
          state[b.GetUserData()] = {
            x: b.GetPosition().x,
            y: b.GetPosition().y,
            angle: b.GetAngle(),
            center: {
              x: b.GetWorldCenter().x,
              y: b.GetWorldCenter().y
            },
            linearVelocity: b.m_linearVelocity,
            angularVelocity: b.m_angularVelocity
          };
          if(this.resolveCollisions){
            state[b.GetUserData()].collisions = this.collisions[b.GetUserData()] || null;
          }
        }
      }
      return state;
    },

    /**
     * Updates the state in the Entity objects that are modified by box2d calculations.
     * @function
     * @memberOf Box#
     * @param {Object|Array} entities An array or map of Entity objects
     */
    updateExternalState: function(entities){
      //update the dyanmic shapes with box2d calculations
      var bodiesState = this.getState();
      for (var id in bodiesState) {
        var entity = entities[id];
        //update any dynamic bodies
        if (entity && !entity.staticBody){
          entity.update(bodiesState[id]);
        }
      }
    },

    /**
     * Add a map of entities to the Box
     * @function
     * @memberOf Box#
     * @param {Object} bodyEntities Map of entities
     */
    setBodies: function(bodyEntities) {
      for(var id in bodyEntities) {
        var entity = bodyEntities[id];
        this.addBody(entity);
      }
      this.ready = true;
    },

    /**
     * Add an Entity to the box2d world which will internally be converted to a box2d body and fixture (auto scaled with Box's scale property if the entity hasn't been scaled yet)
     * @function
     * @memberOf Box#
     * @param {Entity} entity Any Entity object
     */
    addBody: function(entity) {
      /*jshint eqnull:true */

      if(!entity.alreadyScaled){
        entity.scaleShape(1 / this.scale);
        entity.scale = this.scale;
      }

      var bodyDef = new B2BodyDef();
      var fixDef = new B2FixtureDef();
      var i,j,points,vec,vecs;
      fixDef.restitution = entity.restitution;
      fixDef.density = entity.density;
      fixDef.friction = entity.friction;


      //these three props are for custom collision filtering
      if(entity.maskBits != null){
        fixDef.filter.maskBits = entity.maskBits;
      }
      if(entity.categoryBits != null){
        fixDef.filter.categoryBits = entity.categoryBits;
      }
      if(entity.groupIndex != null){
        fixDef.filter.groupIndex = entity.groupIndex;
      }

      if(entity.staticBody){
        bodyDef.type =  B2Body.b2_staticBody;
      } else {
        bodyDef.type = B2Body.b2_dynamicBody;
      }

      bodyDef.position.x = entity.x;
      bodyDef.position.y = entity.y;
      bodyDef.userData = entity.id;
      bodyDef.angle = entity.angle;
      bodyDef.linearDamping = entity.linearDamping;
      bodyDef.angularDamping = entity.angularDamping;
      var body = this.b2World.CreateBody(bodyDef);


      if (entity.radius) { //circle
        fixDef.shape = new B2CircleShape(entity.radius);
        body.CreateFixture(fixDef);
      } else if (entity.points) { //polygon
        points = [];
        for (i = 0; i < entity.points.length; i++) {
          vec = new B2Vec2();
          vec.Set(entity.points[i].x, entity.points[i].y);
          points[i] = vec;
        }
        fixDef.shape = new B2PolygonShape();
        fixDef.shape.SetAsArray(points, points.length);
        body.CreateFixture(fixDef);
      } else if(entity.polys) { //complex object
          for (j = 0; j < entity.polys.length; j++) {
              points = entity.polys[j];
              vecs = [];
              for (i = 0; i < points.length; i++) {
                  vec = new B2Vec2();
                  vec.Set(points[i].x, points[i].y);
                  vecs[i] = vec;
              }
              fixDef.shape = new B2PolygonShape();
              fixDef.shape.SetAsArray(vecs, vecs.length);
              body.CreateFixture(fixDef);
          }
      } else { //rectangle
        fixDef.shape = new B2PolygonShape();
        fixDef.shape.SetAsBox(entity.halfWidth, entity.halfHeight);
        body.CreateFixture(fixDef);
      }


      this.bodiesMap[entity.id] = body;
    },

    /**
     * Set the position of an entity.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} x The new x coordinate in box2d space
     * @param {Number} y The new y coordinate in box2d space
     */
    setPosition: function(bodyId, x, y){
      var body = this.bodiesMap[bodyId];
      body.SetPosition(new B2Vec2(x, y));
    },

    /**
     * Set the angle of an entity.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} angle The new angle of the body in radians
     */
    setAngle: function(bodyId, angle){
      var body = this.bodiesMap[bodyId];
      body.SetAngle(angle);
    },

    /**
     * Set the linear velocity of an entity.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} x The new x component of the velocity
     * @param {Number} y The new y component of the velocity
     */
    setLinearVelocity: function(bodyId, x, y){
      var body = this.bodiesMap[bodyId];
      body.SetLinearVelocity(new B2Vec2(x, y));
    },

    /**
     * Apply an impulse to a body at an angle in degrees
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} degrees The angle in which to apply the impulse.
     * @param {Number} power The impulse power.
     */
    applyImpulseDegrees: function(bodyId, degrees, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyImpulse(
        new B2Vec2(Math.sin(degrees * (Math.PI / 180)) * power,
        Math.cos(degrees * (Math.PI / 180)) * power * -1),
        body.GetWorldCenter()
      );
    },

    /**
     * Apply a force to a body at an angle in degrees
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} degrees The angle in which to apply the force.
     * @param {Number} power The power of the force. (The ability to destroy a planet is insignificant next to this)
     */
    applyForceDegrees: function(bodyId, degrees, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyForce(
        new B2Vec2(Math.sin(degrees * (Math.PI / 180)) * power,
        Math.cos(degrees * (Math.PI / 180)) * power * -1),
        body.GetWorldCenter()
      );
    },

    /**
     * Apply an impulse to a body at an angle in radians
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} radians The angle in which to apply the impulse.
     * @param {Number} power The impulse power.
     */
    applyImpulse: function(bodyId, radians, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyImpulse(
        new B2Vec2(Math.sin(radians) * power,
        Math.cos(radians) * power * -1),
        body.GetWorldCenter()
      );
    },

    /**
     * Apply a force to a body at an angle in radians
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} radians The angle in which to apply the force.
     * @param {Number} power The power of the force. (The ability to destroy a planet is insignificant next to this)
     */
    applyForce: function(bodyId, radians, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyForce(
        new B2Vec2(Math.sin(radians) * power,
        Math.cos(radians) * power * -1),
        body.GetWorldCenter()
      );
    },

    /**
     * Apply torque (rotation force) to a body.
     * Positive values are clockwise, negative values are counter-clockwise.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     * @param {Number} power The power of the torque.
     */
    applyTorque: function(bodyId, power) {
      var body = this.bodiesMap[bodyId];
      body.ApplyTorque(power);
    },

    /**
     * Sets the world's gravity
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Object} vector An object with x and y values in meters per second squared.
     */
    setGravity: function(vector) {
      this.b2World.SetGravity(new B2Vec2(vector.x, vector.y));
    },

    /**
     * Remove a body from the box2d world
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     */
    removeBody: function(id) {
      if(this.bodiesMap[id]){
        if(this.fixturesMap[id]){
          this.bodiesMap[id].DestroyFixture(this.fixturesMap[id]);
        }
        this.b2World.DestroyBody(this.bodiesMap[id]);
        //delete this.fixturesMap[id];
        delete this.bodiesMap[id];
      }
    },

    /**
     * Wake up a body in the box2d world so that box2d will continue to run calculations on it.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Number} bodyId The id of the Entity/Body
     */
    wakeUpBody: function(id) {
      if(this.bodiesMap[id]){
        this.bodiesMap[id].SetAwake(true);
      }
    },

    /**
     * Add a contactListener to the b2World
     * @function
     * @memberOf Box#
     * @param {Object} callbacks Object containing a beginContant, endContact and/or postSolve keys and callbacks
     */
    addContactListener: function(callbacks) {
      var listener = new Box2D.Dynamics.b2ContactListener();
      if (callbacks.beginContact) {
        listener.BeginContact = function(contact) {
          callbacks.beginContact(contact.GetFixtureA().GetBody().GetUserData(),
                                 contact.GetFixtureB().GetBody().GetUserData());
          };
      }
      if (callbacks.endContact){

        listener.endContact = function(contact) {
          callbacks.endContact(contact.GetFixtureA().GetBody().GetUserData(),
                               contact.GetFixtureB().GetBody().GetUserData());
        };
      }
      if (callbacks.postSolve){

        listener.PostSolve = function(contact, impulse) {
          callbacks.postSolve(contact.GetFixtureA().GetBody().GetUserData(),
                               contact.GetFixtureB().GetBody().GetUserData(),
                               impulse.normalImpulses[0]);
        };
      }
      this.b2World.SetContactListener(listener);
    },

    /**
     * Remove a joint from the world.
     *
     * This must be done outside of the update() iteration, and BEFORE any bodies connected to the joint are removed!
     *
     * @function
     * @memberOf Box#
     * @param {Number} jointId The id of joint to be destroyed.
     */
    destroyJoint: function(jointId) {
      if(this.jointsMap[jointId]){
        this.b2World.DestroyJoint(this.jointsMap[jointId]);
        delete this.jointsMap[jointId];
      }
    },

    /**
     * Add a joint to the box2d world.
     *
     * This must be done outside of the update() iteration!
     *
     * @function
     * @memberOf Box#
     * @param {Joint} A joint definition.
     */
    addJoint: function(joint) {
      if(joint && joint.id && !this.jointsMap[joint.id]){

        if(!joint.alreadyScaled && joint.scaleJointLocation){
          joint.scaleJointLocation(1 / this.scale);
          joint.scale = this.scale;
        }

        var b2Joint = joint.createB2Joint(this);
        if(b2Joint){
          this.jointsMap[joint.id] = b2Joint;
        }
      }
    },

    beginContact: function(idA, idB){

    },
    endContact: function(idA, idB){

    },
    postSolve: function(idA, idB, impulse){
      this.collisions[idA] = this.collisions[idA] || [];
      this.collisions[idA].push({id: idB, impulse: impulse});
      this.collisions[idB] = this.collisions[idB] || [];
      this.collisions[idB].push({id: idA, impulse: impulse});
    }
  });

});
},
'dcl/dcl':function(){
(function(factory){
	if(typeof define != "undefined"){
		define(["./mini"], factory);
	}else if(typeof module != "undefined"){
		module.exports = factory(require("./mini"));
	}else{
		dcl = factory(dcl);
	}
})(function(dcl){
	"use strict";

	function nop(){}

	var Advice = dcl(dcl.Super, {
		//declaredClass: "dcl.Advice",
		constructor: function(){
			this.b = this.f.before;
			this.a = this.f.after;
			this.f = this.f.around;
		}
	});
	function advise(f){ return new Advice(f); }

	function makeAOPStub(b, a, f){
		var sb = b || nop,
			sa = a || nop,
			sf = f || nop,
			x = function(){
				var r;
				// running the before chain
				sb.apply(this, arguments);
				// running the around chain
				try{
					r = sf.apply(this, arguments);
				}catch(e){
					r = e;
				}
				// running the after chain
				sa.call(this, arguments, r);
				if(r instanceof Error){
					throw r;
				}
				return r;
			};
		x.advices = {b: b, a: a, f: f};
		return x;
	}

	function chain(id){
		return function(ctor, name){
			var m = ctor._m, c;
			if(m){
				c = (+m.w[name] || 0);
				if(c && c != id){
					dcl._e("set chaining", name, ctor, id, c);
				}
				m.w[name] = id;
			}
		};
	}

	dcl.mix(dcl, {
		// public API
		Advice: Advice,
		advise: advise,
		// expose helper methods
		before: function(f){ return new Advice({before: f}); },
		after: function(f){ return new Advice({after: f}); },
		around: dcl.superCall,
		// chains
		chainBefore: chain(1),
		chainAfter:  chain(2),
		isInstanceOf: function(o, ctor){
			if(o instanceof ctor){
				return true;
			}
			var t = o.constructor._m, i;
			if(t){
				for(t = t.b, i = t.length - 1; i >= 0; --i){
					if(t[i] === ctor){
						return true;
					}
				}
			}
			return false;
		},
		// protected API starts with _ (don't use it!)
		_sb: /*stub*/ function(id, bases, name, chains){
			var f = chains[name] = dcl._ec(bases, name, "f"),
				b = dcl._ec(bases, name, "b").reverse(),
				a = dcl._ec(bases, name, "a");
			f = id ? dcl._st(f, id == 1 ? function(f){ return dcl._sc(f.reverse()); } : dcl._sc, name) : dcl._ss(f, name);
			return !b.length && !a.length ? f || function(){} : makeAOPStub(dcl._sc(b), dcl._sc(a), f);
		}
	});

	return dcl;
});

},
'dcl/mini':function(){
(function(factory){
	if(typeof define != "undefined"){
		define([], factory);
	}else if(typeof module != "undefined"){
		module.exports = factory();
	}else{
		dcl = factory();
	}
})(function(){
	"use strict";

	var counter = 0, cname = "constructor", pname = "prototype",
		F = function(){}, empty = {}, mix, extractChain,
		stubSuper, stubChain, stubChainSuper, post;

	function dcl(superClass, props){
		var bases = [0], proto, base, ctor, m, o, r, b, i, j = 0, n;

		if(superClass){
			if(superClass instanceof Array){
				// mixins: C3 MRO
				m = {}; b = superClass.slice(0).reverse();
				for(i = b.length - 1; i >= 0; --i){
					base = b[i];
					// pre-process a base
					// 1) add a unique id
					base._u = base._u || counter++;
					// 2) build a connection map and the base list
					if((proto = base._m)){   // intentional assignment
						for(r = proto.b, j = r.length - 1; j > 0; --j){
							n = r[j]._u;
							m[n] = (m[n] || 0) + 1;
						}
						b[i] = r.slice(0);
					}else{
						b[i] = [base];
					}
				}
				// build output
				o = {};
				c: while(b.length){
					for(i = 0; i < b.length; ++i){
						r = b[i];
						base = r[0];
						n = base._u;
						if(!m[n]){
							if(!o[n]){
								bases.push(base);
								o[n] = 1;
							}
							r.shift();
							if(r.length){
								--m[r[0]._u];
							}else{
								b.splice(i, 1);
							}
							continue c;
						}
					}
					// error
					dcl._e("cycle", props, b);
				}
				// calculate a base class
				superClass = superClass[0];
				j = bases.length - ((m = superClass._m) && superClass === bases[bases.length - (j = m.b.length)] ? j : 1) - 1; // intentional assignments
			}else{
				// 1) add a unique id
				superClass._u = superClass._u || counter++;
				// 2) single inheritance
				bases = bases.concat((m = superClass._m) ? m.b : superClass);   // intentional assignment
			}
		}
		// create a base class
		proto = superClass ? dcl.delegate(superClass[pname]) : {};
		// the next line assumes that constructor is actually named "constructor", should be changed if desired
		r = superClass && (m = superClass._m) ? dcl.delegate(m.w) : {constructor: 2};   // intentional assignment

		// create prototype: mix in mixins and props
		for(; j > 0; --j){
			base = bases[j];
			m = base._m;
			mix(proto, m && m.h || base[pname]);
			if(m){
				for(n in (b = m.w)){    // intentional assignment
					r[n] = (+r[n] || 0) | b[n];
				}
			}
		}
		for(n in props){
			if(isSuper(m = props[n])){  // intentional assignment
				r[n] = +r[n] || 0;
			}else{
				proto[n] = m;
			}
		}

		// create stubs with fake constructor
		o = {b: bases, h: props, w: r, c: {}};
		bases[0] = {_m: o, prototype: proto};
		buildStubs(o, proto);
		ctor = proto[cname];

		// put in place all decorations and return a constructor
		ctor._m  = o;
		ctor[pname] = proto;
		//proto.constructor = ctor; // uncomment if constructor is not named "constructor"
		bases[0] = ctor;

		return dcl._p(ctor);    // fully prepared constructor
	}

	// decorators

	function Super(f){ this.f = f; }
	function isSuper(f){ return f instanceof Super; }

	// utilities

	(mix = function(a, b){
		for(var n in b){
			a[n] = b[n];
		}
	})(dcl, {
		// piblic API
		mix: mix,
		delegate: function(o){
			F[pname] = o;
			var t = new F;
			F[pname] = null;
			return t;
		},
		Super: Super,
		superCall: function(f){ return new Super(f); },
		// protected API starts with _ (don't use it!)
		_p: function(ctor){ return ctor; },   // identity, used to hang on advices
		_e: function(m){ throw Error("dcl: " + m); },  // error function, augmented by debug.js
		_f: function(f, a, n){ var t = f.f(a); t.ctr = f.ctr; return t; },  // supercall instantiation, augmented by debug.js
		// the "buildStubs()" helpers, can be overwritten
		_ec: extractChain = function(bases, name, advice){
			var i = bases.length - 1, r = [], b, f, around = advice == "f";
			for(; b = bases[i]; --i){
				// next line contains 5 intentional assignments
				if((f = b._m) ? (f = f.h).hasOwnProperty(name) && (isSuper(f = f[name]) ? (around ? f.f : (f = f[advice])) : around) : around && (f = b[pname][name]) && f !== empty[name]){
					f.ctr = b;
					r.push(f);
				}
			}
			return r;
		},
		_sc: stubChain = function(chain){ // this is "after" chain
			var l = chain.length, f;
			return !l ? 0 : l == 1 ?
				(f = chain[0], function(){
					f.apply(this, arguments);
				}) :
				function(){
					for(var i = 0; i < l; ++i){
						chain[i].apply(this, arguments);
					}
				};
		},
		_ss: stubSuper = function(chain, name){
			var i = 0, f, p = empty[name];
			for(; f = chain[i]; ++i){
				if(isSuper(f)){
					p = chain[i] = dcl._f(f, p, name);
				}else{
					p = f;
				}
			}
			return name != cname ? p : function(){ p.apply(this, arguments); };
		},
		_st: stubChainSuper = function(chain, stub, name){
			var i = 0, f, t, pi = 0;
			for(; f = chain[i]; ++i){
				if(isSuper(f)){
					t = i - pi;
					t = chain[i] = dcl._f(f, !t ? 0 : t == 1 ? chain[pi] : stub(chain.slice(pi, i)), name);
					pi = i;
				}
			}
			t = i - pi;
			return !t ? 0 : t == 1 && name != cname ? chain[pi] : stub(pi ? chain.slice(pi) : chain);
		},
		_sb: /*stub*/ function(id, bases, name, chains){
			var f = chains[name] = extractChain(bases, name, "f");
			return (id ? stubChainSuper(f, stubChain, name) : stubSuper(f, name)) || function(){};
		}
	});

	function buildStubs(meta, proto){
		var weaver = meta.w, bases = meta.b, chains = meta.c;
		for(var name in weaver){
			proto[name] = dcl._sb(weaver[name], bases, name, chains);
		}
	}

	return dcl;
});

},
'dcl/bases/Mixer':function(){
(function(factory){
	if(typeof define != "undefined"){
		define(["../mini"], factory);
	}else if(typeof module != "undefined"){
		module.exports = factory(require("../mini"));
	}else{
		dclBasesMixer = factory(dcl);
	}
})(function(dcl){
	"use strict";
	return dcl(null, {
		declaredClass: "dcl/bases/Mixer",
		constructor: function(x){
			dcl.mix(this, x);
		}
	});
});

},
'dojo/_base/lang':function(){
define(["./kernel", "../has", "../sniff"], function(dojo, has){
	// module:
	//		dojo/_base/lang

	has.add("bug-for-in-skips-shadowed", function(){
		// if true, the for-in iterator skips object properties that exist in Object's prototype (IE 6 - ?)
		for(var i in {toString: 1}){
			return 0;
		}
		return 1;
	});

	// Helper methods
	var _extraNames =
			has("bug-for-in-skips-shadowed") ?
				"hasOwnProperty.valueOf.isPrototypeOf.propertyIsEnumerable.toLocaleString.toString.constructor".split(".") : [],

		_extraLen = _extraNames.length,

		getProp = function(/*Array*/parts, /*Boolean*/create, /*Object*/context){
			var p, i = 0, dojoGlobal = dojo.global;
			if(!context){
				if(!parts.length){
					return dojoGlobal;
				}else{
					p = parts[i++];
					try{
						context = dojo.scopeMap[p] && dojo.scopeMap[p][1];
					}catch(e){}
					context = context || (p in dojoGlobal ? dojoGlobal[p] : (create ? dojoGlobal[p] = {} : undefined));
				}
			}
			while(context && (p = parts[i++])){
				context = (p in context ? context[p] : (create ? context[p] = {} : undefined));
			}
			return context; // mixed
		},

		opts = Object.prototype.toString,

		efficient = function(obj, offset, startWith){
			return (startWith||[]).concat(Array.prototype.slice.call(obj, offset||0));
		},

		_pattern = /\{([^\}]+)\}/g;

	// Module export
	var lang = {
		// summary:
		//		This module defines Javascript language extensions.

		// _extraNames: String[]
		//		Lists property names that must be explicitly processed during for-in iteration
		//		in environments that have has("bug-for-in-skips-shadowed") true.
		_extraNames:_extraNames,

		_mixin: function(dest, source, copyFunc){
			// summary:
			//		Copies/adds all properties of source to dest; returns dest.
			// dest: Object
			//		The object to which to copy/add all properties contained in source.
			// source: Object
			//		The object from which to draw all properties to copy into dest.
			// copyFunc: Function?
			//		The process used to copy/add a property in source; defaults to the Javascript assignment operator.
			// returns:
			//		dest, as modified
			// description:
			//		All properties, including functions (sometimes termed "methods"), excluding any non-standard extensions
			//		found in Object.prototype, are copied/added to dest. Copying/adding each particular property is
			//		delegated to copyFunc (if any); copyFunc defaults to the Javascript assignment operator if not provided.
			//		Notice that by default, _mixin executes a so-called "shallow copy" and aggregate types are copied/added by reference.
			var name, s, i, empty = {};
			for(name in source){
				// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
				// inherited from Object.prototype.	 For example, if dest has a custom toString() method,
				// don't overwrite it with the toString() method that source inherited from Object.prototype
				s = source[name];
				if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
					dest[name] = copyFunc ? copyFunc(s) : s;
				}
			}

			if(has("bug-for-in-skips-shadowed")){
				if(source){
					for(i = 0; i < _extraLen; ++i){
						name = _extraNames[i];
						s = source[name];
						if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
							dest[name] = copyFunc ? copyFunc(s) : s;
						}
					}
				}
			}

			return dest; // Object
		},

		mixin: function(dest, sources){
			// summary:
			//		Copies/adds all properties of one or more sources to dest; returns dest.
			// dest: Object
			//		The object to which to copy/add all properties contained in source. If dest is falsy, then
			//		a new object is manufactured before copying/adding properties begins.
			// sources: Object...
			//		One of more objects from which to draw all properties to copy into dest. sources are processed
			//		left-to-right and if more than one of these objects contain the same property name, the right-most
			//		value "wins".
			// returns: Object
			//		dest, as modified
			// description:
			//		All properties, including functions (sometimes termed "methods"), excluding any non-standard extensions
			//		found in Object.prototype, are copied/added from sources to dest. sources are processed left to right.
			//		The Javascript assignment operator is used to copy/add each property; therefore, by default, mixin
			//		executes a so-called "shallow copy" and aggregate types are copied/added by reference.
			// example:
			//		make a shallow copy of an object
			//	|	var copy = lang.mixin({}, source);
			// example:
			//		many class constructors often take an object which specifies
			//		values to be configured on the object. In this case, it is
			//		often simplest to call `lang.mixin` on the `this` object:
			//	|	declare("acme.Base", null, {
			//	|		constructor: function(properties){
			//	|			// property configuration:
			//	|			lang.mixin(this, properties);
			//	|
			//	|			console.log(this.quip);
			//	|			//	...
			//	|		},
			//	|		quip: "I wasn't born yesterday, you know - I've seen movies.",
			//	|		// ...
			//	|	});
			//	|
			//	|	// create an instance of the class and configure it
			//	|	var b = new acme.Base({quip: "That's what it does!" });
			// example:
			//		copy in properties from multiple objects
			//	|	var flattened = lang.mixin(
			//	|		{
			//	|			name: "Frylock",
			//	|			braces: true
			//	|		},
			//	|		{
			//	|			name: "Carl Brutanananadilewski"
			//	|		}
			//	|	);
			//	|
			//	|	// will print "Carl Brutanananadilewski"
			//	|	console.log(flattened.name);
			//	|	// will print "true"
			//	|	console.log(flattened.braces);

			if(!dest){ dest = {}; }
			for(var i = 1, l = arguments.length; i < l; i++){
				lang._mixin(dest, arguments[i]);
			}
			return dest; // Object
		},

		setObject: function(name, value, context){
			// summary:
			//		Set a property from a dot-separated string, such as "A.B.C"
			// description:
			//		Useful for longer api chains where you have to test each object in
			//		the chain, or when you have an object reference in string format.
			//		Objects are created as needed along `path`. Returns the passed
			//		value if setting is successful or `undefined` if not.
			// name: String
			//		Path to a property, in the form "A.B.C".
			// value: anything
			//		value or object to place at location given by name
			// context: Object?
			//		Optional. Object to use as root of path. Defaults to
			//		`dojo.global`.
			// example:
			//		set the value of `foo.bar.baz`, regardless of whether
			//		intermediate objects already exist:
			//	| lang.setObject("foo.bar.baz", value);
			// example:
			//		without `lang.setObject`, we often see code like this:
			//	| // ensure that intermediate objects are available
			//	| if(!obj["parent"]){ obj.parent = {}; }
			//	| if(!obj.parent["child"]){ obj.parent.child = {}; }
			//	| // now we can safely set the property
			//	| obj.parent.child.prop = "some value";
			//		whereas with `lang.setObject`, we can shorten that to:
			//	| lang.setObject("parent.child.prop", "some value", obj);

			var parts = name.split("."), p = parts.pop(), obj = getProp(parts, true, context);
			return obj && p ? (obj[p] = value) : undefined; // Object
		},

		getObject: function(name, create, context){
			// summary:
			//		Get a property from a dot-separated string, such as "A.B.C"
			// description:
			//		Useful for longer api chains where you have to test each object in
			//		the chain, or when you have an object reference in string format.
			// name: String
			//		Path to an property, in the form "A.B.C".
			// create: Boolean?
			//		Optional. Defaults to `false`. If `true`, Objects will be
			//		created at any point along the 'path' that is undefined.
			// context: Object?
			//		Optional. Object to use as root of path. Defaults to
			//		'dojo.global'. Null may be passed.
			return getProp(name.split("."), create, context); // Object
		},

		exists: function(name, obj){
			// summary:
			//		determine if an object supports a given method
			// description:
			//		useful for longer api chains where you have to test each object in
			//		the chain. Useful for object and method detection.
			// name: String
			//		Path to an object, in the form "A.B.C".
			// obj: Object?
			//		Object to use as root of path. Defaults to
			//		'dojo.global'. Null may be passed.
			// example:
			//	| // define an object
			//	| var foo = {
			//	|		bar: { }
			//	| };
			//	|
			//	| // search the global scope
			//	| lang.exists("foo.bar"); // true
			//	| lang.exists("foo.bar.baz"); // false
			//	|
			//	| // search from a particular scope
			//	| lang.exists("bar", foo); // true
			//	| lang.exists("bar.baz", foo); // false
			return lang.getObject(name, false, obj) !== undefined; // Boolean
		},

		// Crockford (ish) functions

		isString: function(it){
			// summary:
			//		Return true if it is a String
			// it: anything
			//		Item to test.
			return (typeof it == "string" || it instanceof String); // Boolean
		},

		isArray: function(it){
			// summary:
			//		Return true if it is an Array.
			//		Does not work on Arrays created in other windows.
			// it: anything
			//		Item to test.
			return it && (it instanceof Array || typeof it == "array"); // Boolean
		},

		isFunction: function(it){
			// summary:
			//		Return true if it is a Function
			// it: anything
			//		Item to test.
			return opts.call(it) === "[object Function]";
		},

		isObject: function(it){
			// summary:
			//		Returns true if it is a JavaScript object (or an Array, a Function
			//		or null)
			// it: anything
			//		Item to test.
			return it !== undefined &&
				(it === null || typeof it == "object" || lang.isArray(it) || lang.isFunction(it)); // Boolean
		},

		isArrayLike: function(it){
			// summary:
			//		similar to isArray() but more permissive
			// it: anything
			//		Item to test.
			// returns:
			//		If it walks like a duck and quacks like a duck, return `true`
			// description:
			//		Doesn't strongly test for "arrayness".  Instead, settles for "isn't
			//		a string or number and has a length property". Arguments objects
			//		and DOM collections will return true when passed to
			//		isArrayLike(), but will return false when passed to
			//		isArray().
			return it && it !== undefined && // Boolean
				// keep out built-in constructors (Number, String, ...) which have length
				// properties
				!lang.isString(it) && !lang.isFunction(it) &&
				!(it.tagName && it.tagName.toLowerCase() == 'form') &&
				(lang.isArray(it) || isFinite(it.length));
		},

		isAlien: function(it){
			// summary:
			//		Returns true if it is a built-in function or some other kind of
			//		oddball that *should* report as a function but doesn't
			return it && !lang.isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it)); // Boolean
		},

		extend: function(ctor, props){
			// summary:
			//		Adds all properties and methods of props to constructor's
			//		prototype, making them available to all instances created with
			//		constructor.
			// ctor: Object
			//		Target constructor to extend.
			// props: Object
			//		One or more objects to mix into ctor.prototype
			for(var i=1, l=arguments.length; i<l; i++){
				lang._mixin(ctor.prototype, arguments[i]);
			}
			return ctor; // Object
		},

		_hitchArgs: function(scope, method){
			var pre = lang._toArray(arguments, 2);
			var named = lang.isString(method);
			return function(){
				// arrayify arguments
				var args = lang._toArray(arguments);
				// locate our method
				var f = named ? (scope||dojo.global)[method] : method;
				// invoke with collected args
				return f && f.apply(scope || this, pre.concat(args)); // mixed
			}; // Function
		},

		hitch: function(scope, method){
			// summary:
			//		Returns a function that will only ever execute in the a given scope.
			//		This allows for easy use of object member functions
			//		in callbacks and other places in which the "this" keyword may
			//		otherwise not reference the expected scope.
			//		Any number of default positional arguments may be passed as parameters
			//		beyond "method".
			//		Each of these values will be used to "placehold" (similar to curry)
			//		for the hitched function.
			// scope: Object
			//		The scope to use when method executes. If method is a string,
			//		scope is also the object containing method.
			// method: Function|String...
			//		A function to be hitched to scope, or the name of the method in
			//		scope to be hitched.
			// example:
			//	|	lang.hitch(foo, "bar")();
			//		runs foo.bar() in the scope of foo
			// example:
			//	|	lang.hitch(foo, myFunction);
			//		returns a function that runs myFunction in the scope of foo
			// example:
			//		Expansion on the default positional arguments passed along from
			//		hitch. Passed args are mixed first, additional args after.
			//	|	var foo = { bar: function(a, b, c){ console.log(a, b, c); } };
			//	|	var fn = lang.hitch(foo, "bar", 1, 2);
			//	|	fn(3); // logs "1, 2, 3"
			// example:
			//	|	var foo = { bar: 2 };
			//	|	lang.hitch(foo, function(){ this.bar = 10; })();
			//		execute an anonymous function in scope of foo
			if(arguments.length > 2){
				return lang._hitchArgs.apply(dojo, arguments); // Function
			}
			if(!method){
				method = scope;
				scope = null;
			}
			if(lang.isString(method)){
				scope = scope || dojo.global;
				if(!scope[method]){ throw(['lang.hitch: scope["', method, '"] is null (scope="', scope, '")'].join('')); }
				return function(){ return scope[method].apply(scope, arguments || []); }; // Function
			}
			return !scope ? method : function(){ return method.apply(scope, arguments || []); }; // Function
		},

		delegate: (function(){
			// boodman/crockford delegation w/ cornford optimization
			function TMP(){}
			return function(obj, props){
				TMP.prototype = obj;
				var tmp = new TMP();
				TMP.prototype = null;
				if(props){
					lang._mixin(tmp, props);
				}
				return tmp; // Object
			};
		})(),
		/*=====
		delegate: function(obj, props){
			// summary:
			//		Returns a new object which "looks" to obj for properties which it
			//		does not have a value for. Optionally takes a bag of properties to
			//		seed the returned object with initially.
			// description:
			//		This is a small implementation of the Boodman/Crockford delegation
			//		pattern in JavaScript. An intermediate object constructor mediates
			//		the prototype chain for the returned object, using it to delegate
			//		down to obj for property lookup when object-local lookup fails.
			//		This can be thought of similarly to ES4's "wrap", save that it does
			//		not act on types but rather on pure objects.
			// obj: Object
			//		The object to delegate to for properties not found directly on the
			//		return object or in props.
			// props: Object...
			//		an object containing properties to assign to the returned object
			// returns:
			//		an Object of anonymous type
			// example:
			//	|	var foo = { bar: "baz" };
			//	|	var thinger = lang.delegate(foo, { thud: "xyzzy"});
			//	|	thinger.bar == "baz"; // delegated to foo
			//	|	foo.thud == undefined; // by definition
			//	|	thinger.thud == "xyzzy"; // mixed in from props
			//	|	foo.bar = "thonk";
			//	|	thinger.bar == "thonk"; // still delegated to foo's bar
		},
		=====*/

		_toArray: has("ie") ?
			(function(){
				function slow(obj, offset, startWith){
					var arr = startWith||[];
					for(var x = offset || 0; x < obj.length; x++){
						arr.push(obj[x]);
					}
					return arr;
				}
				return function(obj){
					return ((obj.item) ? slow : efficient).apply(this, arguments);
				};
			})() : efficient,
		/*=====
		 _toArray: function(obj, offset, startWith){
			 // summary:
			 //		Converts an array-like object (i.e. arguments, DOMCollection) to an
			 //		array. Returns a new Array with the elements of obj.
			 // obj: Object
			 //		the object to "arrayify". We expect the object to have, at a
			 //		minimum, a length property which corresponds to integer-indexed
			 //		properties.
			 // offset: Number?
			 //		the location in obj to start iterating from. Defaults to 0.
			 //		Optional.
			 // startWith: Array?
			 //		An array to pack with the properties of obj. If provided,
			 //		properties in obj are appended at the end of startWith and
			 //		startWith is the returned array.
		 },
		 =====*/

		partial: function(/*Function|String*/ method /*, ...*/){
			// summary:
			//		similar to hitch() except that the scope object is left to be
			//		whatever the execution context eventually becomes.
			// description:
			//		Calling lang.partial is the functional equivalent of calling:
			//		|	lang.hitch(null, funcName, ...);
			// method:
			//		The function to "wrap"
			var arr = [ null ];
			return lang.hitch.apply(dojo, arr.concat(lang._toArray(arguments))); // Function
		},

		clone: function(/*anything*/ src){
			// summary:
			//		Clones objects (including DOM nodes) and all children.
			//		Warning: do not clone cyclic structures.
			// src:
			//		The object to clone
			if(!src || typeof src != "object" || lang.isFunction(src)){
				// null, undefined, any non-object, or function
				return src;	// anything
			}
			if(src.nodeType && "cloneNode" in src){
				// DOM Node
				return src.cloneNode(true); // Node
			}
			if(src instanceof Date){
				// Date
				return new Date(src.getTime());	// Date
			}
			if(src instanceof RegExp){
				// RegExp
				return new RegExp(src);   // RegExp
			}
			var r, i, l;
			if(lang.isArray(src)){
				// array
				r = [];
				for(i = 0, l = src.length; i < l; ++i){
					if(i in src){
						r.push(lang.clone(src[i]));
					}
				}
				// we don't clone functions for performance reasons
				//		}else if(d.isFunction(src)){
				//			// function
				//			r = function(){ return src.apply(this, arguments); };
			}else{
				// generic objects
				r = src.constructor ? new src.constructor() : {};
			}
			return lang._mixin(r, src, lang.clone);
		},


		trim: String.prototype.trim ?
			function(str){ return str.trim(); } :
			function(str){ return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); },
		/*=====
		 trim: function(str){
			 // summary:
			 //		Trims whitespace from both sides of the string
			 // str: String
			 //		String to be trimmed
			 // returns: String
			 //		Returns the trimmed string
			 // description:
			 //		This version of trim() was selected for inclusion into the base due
			 //		to its compact size and relatively good performance
			 //		(see [Steven Levithan's blog](http://blog.stevenlevithan.com/archives/faster-trim-javascript)
			 //		Uses String.prototype.trim instead, if available.
			 //		The fastest but longest version of this function is located at
			 //		lang.string.trim()
		 },
		 =====*/

		replace: function(tmpl, map, pattern){
			// summary:
			//		Performs parameterized substitutions on a string. Throws an
			//		exception if any parameter is unmatched.
			// tmpl: String
			//		String to be used as a template.
			// map: Object|Function
			//		If an object, it is used as a dictionary to look up substitutions.
			//		If a function, it is called for every substitution with following parameters:
			//		a whole match, a name, an offset, and the whole template
			//		string (see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/replace
			//		for more details).
			// pattern: RegEx?
			//		Optional regular expression objects that overrides the default pattern.
			//		Must be global and match one item. The default is: /\{([^\}]+)\}/g,
			//		which matches patterns like that: "{xxx}", where "xxx" is any sequence
			//		of characters, which doesn't include "}".
			// returns: String
			//		Returns the substituted string.
			// example:
			//	|	// uses a dictionary for substitutions:
			//	|	lang.replace("Hello, {name.first} {name.last} AKA {nick}!",
			//	|		{
			//	|			nick: "Bob",
			//	|			name: {
			//	|				first:	"Robert",
			//	|				middle: "X",
			//	|				last:		"Cringely"
			//	|			}
			//	|		});
			//	|	// returns: Hello, Robert Cringely AKA Bob!
			// example:
			//	|	// uses an array for substitutions:
			//	|	lang.replace("Hello, {0} {2}!",
			//	|		["Robert", "X", "Cringely"]);
			//	|	// returns: Hello, Robert Cringely!
			// example:
			//	|	// uses a function for substitutions:
			//	|	function sum(a){
			//	|		var t = 0;
			//	|		arrayforEach(a, function(x){ t += x; });
			//	|		return t;
			//	|	}
			//	|	lang.replace(
			//	|		"{count} payments averaging {avg} USD per payment.",
			//	|		lang.hitch(
			//	|			{ payments: [11, 16, 12] },
			//	|			function(_, key){
			//	|				switch(key){
			//	|					case "count": return this.payments.length;
			//	|					case "min":		return Math.min.apply(Math, this.payments);
			//	|					case "max":		return Math.max.apply(Math, this.payments);
			//	|					case "sum":		return sum(this.payments);
			//	|					case "avg":		return sum(this.payments) / this.payments.length;
			//	|				}
			//	|			}
			//	|		)
			//	|	);
			//	|	// prints: 3 payments averaging 13 USD per payment.
			// example:
			//	|	// uses an alternative PHP-like pattern for substitutions:
			//	|	lang.replace("Hello, ${0} ${2}!",
			//	|		["Robert", "X", "Cringely"], /\$\{([^\}]+)\}/g);
			//	|	// returns: Hello, Robert Cringely!

			return tmpl.replace(pattern || _pattern, lang.isFunction(map) ?
				map : function(_, k){ return lang.getObject(k, false, map); });
		}
	};

	 1  && lang.mixin(dojo, lang);

	return lang;
});


},
'dojo/_base/kernel':function(){
define(["../has", "./config", "require", "module"], function(has, config, require, module){
	// module:
	//		dojo/_base/kernel

	// This module is the foundational module of the dojo boot sequence; it defines the dojo object.

	var
		// loop variables for this module
		i, p,

		// create dojo, dijit, and dojox
		// FIXME: in 2.0 remove dijit, dojox being created by dojo
		dijit = {},
		dojox = {},
		dojo = {
			// summary:
			//		This module is the foundational module of the dojo boot sequence; it defines the dojo object.

			// notice dojo takes ownership of the value of the config module
			config:config,
			global:this,
			dijit:dijit,
			dojox:dojox
		};


	// Configure the scope map. For a 100% AMD application, the scope map is not needed other than to provide
	// a _scopeName property for the dojo, dijit, and dojox root object so those packages can create
	// unique names in the global space.
	//
	// Built, legacy modules use the scope map to allow those modules to be expressed as if dojo, dijit, and dojox,
	// where global when in fact they are either global under different names or not global at all. In v1.6-, the
	// config variable "scopeMap" was used to map names as used within a module to global names. This has been
	// subsumed by the AMD map configuration variable which can relocate packages to different names. For backcompat,
	// only the "*" mapping is supported. See http://livedocs.dojotoolkit.org/developer/design/loader#legacy-cross-domain-mode for details.
	//
	// The following computations contort the packageMap for this dojo instance into a scopeMap.
	var scopeMap =
			// a map from a name used in a legacy module to the (global variable name, object addressed by that name)
			// always map dojo, dijit, and dojox
			{
				dojo:["dojo", dojo],
				dijit:["dijit", dijit],
				dojox:["dojox", dojox]
			},

		packageMap =
			// the package map for this dojo instance; note, a foreign loader or no pacakgeMap results in the above default config
			(require.map && require.map[module.id.match(/[^\/]+/)[0]]),

		item;


	// process all mapped top-level names for this instance of dojo
	for(p in packageMap){
		if(scopeMap[p]){
			// mapped dojo, dijit, or dojox
			scopeMap[p][0] = packageMap[p];
		}else{
			// some other top-level name
			scopeMap[p] = [packageMap[p], {}];
		}
	}

	// publish those names to _scopeName and, optionally, the global namespace
	for(p in scopeMap){
		item = scopeMap[p];
		item[1]._scopeName = item[0];
		if(!config.noGlobals){
			this[item[0]] = item[1];
		}
	}
	dojo.scopeMap = scopeMap;

	/*===== dojo.__docParserConfigureScopeMap(scopeMap); =====*/

	// FIXME: dojo.baseUrl and dojo.config.baseUrl should be deprecated
	dojo.baseUrl = dojo.config.baseUrl = require.baseUrl;
	dojo.isAsync = ! 1  || require.async;
	dojo.locale = config.locale;

	var rev = "$Rev: 30226 $".match(/\d+/);
	dojo.version = {
		// summary:
		//		Version number of the Dojo Toolkit
		// description:
		//		Hash about the version, including
		//
		//		- major: Integer: Major version. If total version is "1.2.0beta1", will be 1
		//		- minor: Integer: Minor version. If total version is "1.2.0beta1", will be 2
		//		- patch: Integer: Patch version. If total version is "1.2.0beta1", will be 0
		//		- flag: String: Descriptor flag. If total version is "1.2.0beta1", will be "beta1"
		//		- revision: Number: The SVN rev from which dojo was pulled

		major: 1, minor: 8, patch: 3, flag: "",
		revision: rev ? +rev[0] : NaN,
		toString: function(){
			var v = dojo.version;
			return v.major + "." + v.minor + "." + v.patch + v.flag + " (" + v.revision + ")";	// String
		}
	};

	// If  1  is truthy, then as a dojo module is defined it should push it's definitions
	// into the dojo object, and conversely. In 2.0, it will likely be unusual to augment another object
	// as a result of defining a module. This has feature gives a way to force 2.0 behavior as the code
	// is migrated. Absent specific advice otherwise, set extend-dojo to truthy.
	 1 || has.add("extend-dojo", 1);


	(Function("d", "d.eval = function(){return d.global.eval ? d.global.eval(arguments[0]) : eval(arguments[0]);}"))(dojo);
	/*=====
	dojo.eval = function(scriptText){
		// summary:
		//		A legacy method created for use exclusively by internal Dojo methods. Do not use this method
		//		directly unless you understand its possibly-different implications on the platforms your are targeting.
		// description:
		//		Makes an attempt to evaluate scriptText in the global scope. The function works correctly for browsers
		//		that support indirect eval.
		//
		//		As usual, IE does not. On IE, the only way to implement global eval is to
		//		use execScript. Unfortunately, execScript does not return a value and breaks some current usages of dojo.eval.
		//		This implementation uses the technique of executing eval in the scope of a function that is a single scope
		//		frame below the global scope; thereby coming close to the global scope. Note carefully that
		//
		//		dojo.eval("var pi = 3.14;");
		//
		//		will define global pi in non-IE environments, but define pi only in a temporary local scope for IE. If you want
		//		to define a global variable using dojo.eval, write something like
		//
		//		dojo.eval("window.pi = 3.14;")
		// scriptText:
		//		The text to evaluation.
		// returns:
		//		The result of the evaluation. Often `undefined`
	};
	=====*/


	if( 0 ){
		dojo.exit = function(exitcode){
			quit(exitcode);
		};
	}else{
		dojo.exit = function(){
		};
	}

	 0 && has.add("dojo-guarantee-console",
		// ensure that console.log, console.warn, etc. are defined
		1
	);
	if( 0 ){
		typeof console != "undefined" || (console = {});
		//	Be careful to leave 'log' always at the end
		var cn = [
			"assert", "count", "debug", "dir", "dirxml", "error", "group",
			"groupEnd", "info", "profile", "profileEnd", "time", "timeEnd",
			"trace", "warn", "log"
		];
		var tn;
		i = 0;
		while((tn = cn[i++])){
			if(!console[tn]){
				(function(){
					var tcn = tn + "";
					console[tcn] = ('log' in console) ? function(){
						var a = Array.apply({}, arguments);
						a.unshift(tcn + ":");
						console["log"](a.join(" "));
					} : function(){};
					console[tcn]._fake = true;
				})();
			}
		}
	}

	 0 && has.add("dojo-debug-messages",
		// include dojo.deprecated/dojo.experimental implementations
		!!config.isDebug
	);
	dojo.deprecated = dojo.experimental =  function(){};
	if( 0 ){
		dojo.deprecated = function(/*String*/ behaviour, /*String?*/ extra, /*String?*/ removal){
			// summary:
			//		Log a debug message to indicate that a behavior has been
			//		deprecated.
			// behaviour: String
			//		The API or behavior being deprecated. Usually in the form
			//		of "myApp.someFunction()".
			// extra: String?
			//		Text to append to the message. Often provides advice on a
			//		new function or facility to achieve the same goal during
			//		the deprecation period.
			// removal: String?
			//		Text to indicate when in the future the behavior will be
			//		removed. Usually a version number.
			// example:
			//	| dojo.deprecated("myApp.getTemp()", "use myApp.getLocaleTemp() instead", "1.0");

			var message = "DEPRECATED: " + behaviour;
			if(extra){ message += " " + extra; }
			if(removal){ message += " -- will be removed in version: " + removal; }
			console.warn(message);
		};

		dojo.experimental = function(/* String */ moduleName, /* String? */ extra){
			// summary:
			//		Marks code as experimental.
			// description:
			//		This can be used to mark a function, file, or module as
			//		experimental.	 Experimental code is not ready to be used, and the
			//		APIs are subject to change without notice.	Experimental code may be
			//		completed deleted without going through the normal deprecation
			//		process.
			// moduleName: String
			//		The name of a module, or the name of a module file or a specific
			//		function
			// extra: String?
			//		some additional message for the user
			// example:
			//	| dojo.experimental("dojo.data.Result");
			// example:
			//	| dojo.experimental("dojo.weather.toKelvin()", "PENDING approval from NOAA");

			var message = "EXPERIMENTAL: " + moduleName + " -- APIs subject to change without notice.";
			if(extra){ message += " " + extra; }
			console.warn(message);
		};
	}

	 0 && has.add("dojo-modulePaths",
		// consume dojo.modulePaths processing
		1
	);
	if( 0 ){
		// notice that modulePaths won't be applied to any require's before the dojo/_base/kernel factory is run;
		// this is the v1.6- behavior.
		if(config.modulePaths){
			dojo.deprecated("dojo.modulePaths", "use paths configuration");
			var paths = {};
			for(p in config.modulePaths){
				paths[p.replace(/\./g, "/")] = config.modulePaths[p];
			}
			require({paths:paths});
		}
	}

	 0 && has.add("dojo-moduleUrl",
		// include dojo.moduleUrl
		1
	);
	if( 0 ){
		dojo.moduleUrl = function(/*String*/module, /*String?*/url){
			// summary:
			//		Returns a URL relative to a module.
			// example:
			//	|	var pngPath = dojo.moduleUrl("acme","images/small.png");
			//	|	console.dir(pngPath); // list the object properties
			//	|	// create an image and set it's source to pngPath's value:
			//	|	var img = document.createElement("img");
			//	|	img.src = pngPath;
			//	|	// add our image to the document
			//	|	dojo.body().appendChild(img);
			// example:
			//		you may de-reference as far as you like down the package
			//		hierarchy.  This is sometimes handy to avoid lenghty relative
			//		urls or for building portable sub-packages. In this example,
			//		the `acme.widget` and `acme.util` directories may be located
			//		under different roots (see `dojo.registerModulePath`) but the
			//		the modules which reference them can be unaware of their
			//		relative locations on the filesystem:
			//	|	// somewhere in a configuration block
			//	|	dojo.registerModulePath("acme.widget", "../../acme/widget");
			//	|	dojo.registerModulePath("acme.util", "../../util");
			//	|
			//	|	// ...
			//	|
			//	|	// code in a module using acme resources
			//	|	var tmpltPath = dojo.moduleUrl("acme.widget","templates/template.html");
			//	|	var dataPath = dojo.moduleUrl("acme.util","resources/data.json");

			dojo.deprecated("dojo.moduleUrl()", "use require.toUrl", "2.0");

			// require.toUrl requires a filetype; therefore, just append the suffix "/*.*" to guarantee a filetype, then
			// remove the suffix from the result. This way clients can request a url w/out a filetype. This should be
			// rare, but it maintains backcompat for the v1.x line (note: dojo.moduleUrl will be removed in v2.0).
			// Notice * is an illegal filename so it won't conflict with any real path map that may exist the paths config.
			var result = null;
			if(module){
				result = require.toUrl(module.replace(/\./g, "/") + (url ? ("/" + url) : "") + "/*.*").replace(/\/\*\.\*/, "") + (url ? "" : "/");
			}
			return result;
		};
	}

	dojo._hasResource = {}; // for backward compatibility with layers built with 1.6 tooling

	return dojo;
});

},
'dojo/has':function(){
define("dojo/has", ["require", "module"], function(require, module){
	// module:
	//		dojo/has
	// summary:
	//		Defines the has.js API and several feature tests used by dojo.
	// description:
	//		This module defines the has API as described by the project has.js with the following additional features:
	//
	//		- the has test cache is exposed at has.cache.
	//		- the method has.add includes a forth parameter that controls whether or not existing tests are replaced
	//		- the loader's has cache may be optionally copied into this module's has cahce.
	//
	//		This module adopted from https://github.com/phiggins42/has.js; thanks has.js team!

	// try to pull the has implementation from the loader; both the dojo loader and bdLoad provide one
	// if using a foreign loader, then the has cache may be initialized via the config object for this module
	// WARNING: if a foreign loader defines require.has to be something other than the has.js API, then this implementation fail
	var has = require.has || function(){};
	if(! 1 ){
		var
			isBrowser =
				// the most fundamental decision: are we in the browser?
				typeof window != "undefined" &&
				typeof location != "undefined" &&
				typeof document != "undefined" &&
				window.location == location && window.document == document,

			// has API variables
			global = this,
			doc = isBrowser && document,
			element = doc && doc.createElement("DiV"),
			cache = (module.config && module.config()) || {};

		has = function(name){
			// summary:
			//		Return the current value of the named feature.
			//
			// name: String|Integer
			//		The name (if a string) or identifier (if an integer) of the feature to test.
			//
			// description:
			//		Returns the value of the feature named by name. The feature must have been
			//		previously added to the cache by has.add.

			return typeof cache[name] == "function" ? (cache[name] = cache[name](global, doc, element)) : cache[name]; // Boolean
		};

		has.cache = cache;

		has.add = function(name, test, now, force){
			// summary:
			//	 	Register a new feature test for some named feature.
			// name: String|Integer
			//	 	The name (if a string) or identifier (if an integer) of the feature to test.
			// test: Function
			//		 A test function to register. If a function, queued for testing until actually
			//		 needed. The test function should return a boolean indicating
			//	 	the presence of a feature or bug.
			// now: Boolean?
			//		 Optional. Omit if `test` is not a function. Provides a way to immediately
			//		 run the test and cache the result.
			// force: Boolean?
			//	 	Optional. If the test already exists and force is truthy, then the existing
			//	 	test will be replaced; otherwise, add does not replace an existing test (that
			//	 	is, by default, the first test advice wins).
			// example:
			//		A redundant test, testFn with immediate execution:
			//	|	has.add("javascript", function(){ return true; }, true);
			//
			// example:
			//		Again with the redundantness. You can do this in your tests, but we should
			//		not be doing this in any internal has.js tests
			//	|	has.add("javascript", true);
			//
			// example:
			//		Three things are passed to the testFunction. `global`, `document`, and a generic element
			//		from which to work your test should the need arise.
			//	|	has.add("bug-byid", function(g, d, el){
			//	|		// g	== global, typically window, yadda yadda
			//	|		// d	== document object
			//	|		// el == the generic element. a `has` element.
			//	|		return false; // fake test, byid-when-form-has-name-matching-an-id is slightly longer
			//	|	});

			(typeof cache[name]=="undefined" || force) && (cache[name]= test);
			return now && has(name);
		};

		// since we're operating under a loader that doesn't provide a has API, we must explicitly initialize
		// has as it would have otherwise been initialized by the dojo loader; use has.add to the builder
		// can optimize these away iff desired
		 1 || has.add("host-browser", isBrowser);
		 1 || has.add("dom", isBrowser);
		 1 || has.add("dojo-dom-ready-api", 1);
		 0 && has.add("dojo-sniff", 1);
	}

	if( 1 ){
		// Common application level tests
		 1 || has.add("dom-addeventlistener", !!document.addEventListener);
		has.add("touch", "ontouchstart" in document);
		// I don't know if any of these tests are really correct, just a rough guess
		has.add("device-width", screen.availWidth || innerWidth);

		// Tests for DOMNode.attributes[] behavior:
		//	 - dom-attributes-explicit - attributes[] only lists explicitly user specified attributes
		//	 - dom-attributes-specified-flag (IE8) - need to check attr.specified flag to skip attributes user didn't specify
		//	 - Otherwise, in IE6-7. attributes[] will list hundreds of values, so need to do outerHTML to get attrs instead.
		var form = document.createElement("form");
		has.add("dom-attributes-explicit", form.attributes.length == 0); // W3C
		has.add("dom-attributes-specified-flag", form.attributes.length > 0 && form.attributes.length < 40);	// IE8
	}

	has.clearElement = function(element){
		// summary:
		//	 Deletes the contents of the element passed to test functions.
		element.innerHTML= "";
		return element;
	};

	has.normalize = function(id, toAbsMid){
		// summary:
		//	 Resolves id into a module id based on possibly-nested tenary expression that branches on has feature test value(s).
		//
		// toAbsMid: Function
		//	 Resolves a relative module id into an absolute module id
		var
			tokens = id.match(/[\?:]|[^:\?]*/g), i = 0,
			get = function(skip){
				var term = tokens[i++];
				if(term == ":"){
					// empty string module name, resolves to 0
					return 0;
				}else{
					// postfixed with a ? means it is a feature to branch on, the term is the name of the feature
					if(tokens[i++] == "?"){
						if(!skip && has(term)){
							// matched the feature, get the first value from the options
							return get();
						}else{
							// did not match, get the second value, passing over the first
							get(true);
							return get(skip);
						}
					}
					// a module
					return term || 0;
				}
			};
		id = get();
		return id && toAbsMid(id);
	};

	has.load = function(id, parentRequire, loaded){
		// summary:
		//		Conditional loading of AMD modules based on a has feature test value.
		// id: String
		//		Gives the resolved module id to load.
		// parentRequire: Function
		//		The loader require function with respect to the module that contained the plugin resource in it's
		//		dependency list.
		// loaded: Function
		//	 Callback to loader that consumes result of plugin demand.

		if(id){
			parentRequire([id], loaded);
		}else{
			loaded();
		}
	};

	return has;
});

},
'dojo/_base/config':function(){
define(["../has", "require"], function(has, require){
	// module:
	//		dojo/_base/config

/*=====
return {
	// summary:
	//		This module defines the user configuration during bootstrap.
	// description:
	//		By defining user configuration as a module value, an entire configuration can be specified in a build,
	//		thereby eliminating the need for sniffing and or explicitly setting in the global variable dojoConfig.
	//		Also, when multiple instances of dojo exist in a single application, each will necessarily be located
	//		at an unique absolute module identifier as given by the package configuration. Implementing configuration
	//		as a module allows for specifying unique, per-instance configurations.
	// example:
	//		Create a second instance of dojo with a different, instance-unique configuration (assume the loader and
	//		dojo.js are already loaded).
	//		|	// specify a configuration that creates a new instance of dojo at the absolute module identifier "myDojo"
	//		|	require({
	//		|		packages:[{
	//		|			name:"myDojo",
	//		|			location:".", //assume baseUrl points to dojo.js
	//		|		}]
	//		|	});
	//		|
	//		|	// specify a configuration for the myDojo instance
	//		|	define("myDojo/config", {
	//		|		// normal configuration variables go here, e.g.,
	//		|		locale:"fr-ca"
	//		|	});
	//		|
	//		|	// load and use the new instance of dojo
	//		|	require(["myDojo"], function(dojo){
	//		|		// dojo is the new instance of dojo
	//		|		// use as required
	//		|	});

	// isDebug: Boolean
	//		Defaults to `false`. If set to `true`, ensures that Dojo provides
	//		extended debugging feedback via Firebug. If Firebug is not available
	//		on your platform, setting `isDebug` to `true` will force Dojo to
	//		pull in (and display) the version of Firebug Lite which is
	//		integrated into the Dojo distribution, thereby always providing a
	//		debugging/logging console when `isDebug` is enabled. Note that
	//		Firebug's `console.*` methods are ALWAYS defined by Dojo. If
	//		`isDebug` is false and you are on a platform without Firebug, these
	//		methods will be defined as no-ops.
	isDebug: false,

	// locale: String
	//		The locale to assume for loading localized resources in this page,
	//		specified according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt).
	//		Must be specified entirely in lowercase, e.g. `en-us` and `zh-cn`.
	//		See the documentation for `dojo.i18n` and `dojo.requireLocalization`
	//		for details on loading localized resources. If no locale is specified,
	//		Dojo assumes the locale of the user agent, according to `navigator.userLanguage`
	//		or `navigator.language` properties.
	locale: undefined,

	// extraLocale: Array
	//		No default value. Specifies additional locales whose
	//		resources should also be loaded alongside the default locale when
	//		calls to `dojo.requireLocalization()` are processed.
	extraLocale: undefined,

	// baseUrl: String
	//		The directory in which `dojo.js` is located. Under normal
	//		conditions, Dojo auto-detects the correct location from which it
	//		was loaded. You may need to manually configure `baseUrl` in cases
	//		where you have renamed `dojo.js` or in which `<base>` tags confuse
	//		some browsers (e.g. IE 6). The variable `dojo.baseUrl` is assigned
	//		either the value of `djConfig.baseUrl` if one is provided or the
	//		auto-detected root if not. Other modules are located relative to
	//		this path. The path should end in a slash.
	baseUrl: undefined,

	// modulePaths: [deprecated] Object
	//		A map of module names to paths relative to `dojo.baseUrl`. The
	//		key/value pairs correspond directly to the arguments which
	//		`dojo.registerModulePath` accepts. Specifying
	//		`djConfig.modulePaths = { "foo": "../../bar" }` is the equivalent
	//		of calling `dojo.registerModulePath("foo", "../../bar");`. Multiple
	//		modules may be configured via `djConfig.modulePaths`.
	modulePaths: {},

	// addOnLoad: Function|Array
	//		Adds a callback via dojo/ready. Useful when Dojo is added after
	//		the page loads and djConfig.afterOnLoad is true. Supports the same
	//		arguments as dojo/ready. When using a function reference, use
	//		`djConfig.addOnLoad = function(){};`. For object with function name use
	//		`djConfig.addOnLoad = [myObject, "functionName"];` and for object with
	//		function reference use
	//		`djConfig.addOnLoad = [myObject, function(){}];`
	addOnLoad: null,

	// parseOnLoad: Boolean
	//		Run the parser after the page is loaded
	parseOnLoad: false,

	// require: String[]
	//		An array of module names to be loaded immediately after dojo.js has been included
	//		in a page.
	require: [],

	// defaultDuration: Number
	//		Default duration, in milliseconds, for wipe and fade animations within dijits.
	//		Assigned to dijit.defaultDuration.
	defaultDuration: 200,

	// dojoBlankHtmlUrl: String
	//		Used by some modules to configure an empty iframe. Used by dojo/io/iframe and
	//		dojo/back, and dijit/popup support in IE where an iframe is needed to make sure native
	//		controls do not bleed through the popups. Normally this configuration variable
	//		does not need to be set, except when using cross-domain/CDN Dojo builds.
	//		Save dojo/resources/blank.html to your domain and set `djConfig.dojoBlankHtmlUrl`
	//		to the path on your domain your copy of blank.html.
	dojoBlankHtmlUrl: undefined,

	// ioPublish: Boolean?
	//		Set this to true to enable publishing of topics for the different phases of
	//		IO operations. Publishing is done via dojo/topic.publish(). See dojo/main.__IoPublish for a list
	//		of topics that are published.
	ioPublish: false,

	// useCustomLogger: Anything?
	//		If set to a value that evaluates to true such as a string or array and
	//		isDebug is true and Firebug is not available or running, then it bypasses
	//		the creation of Firebug Lite allowing you to define your own console object.
	useCustomLogger: undefined,

	// transparentColor: Array
	//		Array containing the r, g, b components used as transparent color in dojo.Color;
	//		if undefined, [255,255,255] (white) will be used.
	transparentColor: undefined,
	
	// deps: Function|Array
	//		Defines dependencies to be used before the loader has been loaded.
	//		When provided, they cause the loader to execute require(deps, callback) 
	//		once it has finished loading. Should be used with callback.
	deps: undefined,
	
	// callback: Function|Array
	//		Defines a callback to be used when dependencies are defined before 
	//		the loader has been loaded. When provided, they cause the loader to 
	//		execute require(deps, callback) once it has finished loading. 
	//		Should be used with deps.
	callback: undefined,
	
	// deferredInstrumentation: Boolean
	//		Whether deferred instrumentation should be loaded or included
	//		in builds.
	deferredInstrumentation: true,

	// useDeferredInstrumentation: Boolean|String
	//		Whether the deferred instrumentation should be used.
	//
	//		* `"report-rejections"`: report each rejection as it occurs.
	//		* `true` or `1` or `"report-unhandled-rejections"`: wait 1 second
	//			in an attempt to detect unhandled rejections.
	useDeferredInstrumentation: "report-unhandled-rejections"
};
=====*/

	var result = {};
	if( 1 ){
		// must be the dojo loader; take a shallow copy of require.rawConfig
		var src = require.rawConfig, p;
		for(p in src){
			result[p] = src[p];
		}
	}else{
		var adviseHas = function(featureSet, prefix, booting){
			for(p in featureSet){
				p!="has" && has.add(prefix + p, featureSet[p], 0, booting);
			}
		};
		result =  1  ?
			// must be a built version of the dojo loader; all config stuffed in require.rawConfig
			require.rawConfig :
			// a foreign loader
			this.dojoConfig || this.djConfig || {};
		adviseHas(result, "config", 1);
		adviseHas(result.has, "", 1);
	}
	return result;
});


},
'dojo/sniff':function(){
define(["./has"], function(has){
	// module:
	//		dojo/sniff

	/*=====
	return function(){
		// summary:
		//		This module sets has() flags based on the current browser.
		//		It returns the has() function.
	};
	=====*/

	if( 1 ){
		var n = navigator,
			dua = n.userAgent,
			dav = n.appVersion,
			tv = parseFloat(dav);

		has.add("air", dua.indexOf("AdobeAIR") >= 0),
		has.add("khtml", dav.indexOf("Konqueror") >= 0 ? tv : undefined);
		has.add("webkit", parseFloat(dua.split("WebKit/")[1]) || undefined);
		has.add("chrome", parseFloat(dua.split("Chrome/")[1]) || undefined);
		has.add("safari", dav.indexOf("Safari")>=0 && !has("chrome") ? parseFloat(dav.split("Version/")[1]) : undefined);
		has.add("mac", dav.indexOf("Macintosh") >= 0);
		has.add("quirks", document.compatMode == "BackCompat");
		has.add("ios", /iPhone|iPod|iPad/.test(dua));
		has.add("android", parseFloat(dua.split("Android ")[1]) || undefined);

		if(!has("webkit")){
			// Opera
			if(dua.indexOf("Opera") >= 0){
				// see http://dev.opera.com/articles/view/opera-ua-string-changes and http://www.useragentstring.com/pages/Opera/
				// 9.8 has both styles; <9.8, 9.9 only old style
				has.add("opera", tv >= 9.8 ? parseFloat(dua.split("Version/")[1]) || tv : tv);
			}

			// Mozilla and firefox
			if(dua.indexOf("Gecko") >= 0 && !has("khtml") && !has("webkit")){
				has.add("mozilla", tv);
			}
			if(has("mozilla")){
				//We really need to get away from this. Consider a sane isGecko approach for the future.
				has.add("ff", parseFloat(dua.split("Firefox/")[1] || dua.split("Minefield/")[1]) || undefined);
			}

			// IE
			if(document.all && !has("opera")){
				var isIE = parseFloat(dav.split("MSIE ")[1]) || undefined;

				//In cases where the page has an HTTP header or META tag with
				//X-UA-Compatible, then it is in emulation mode.
				//Make sure isIE reflects the desired version.
				//document.documentMode of 5 means quirks mode.
				//Only switch the value if documentMode's major version
				//is different from isIE's major version.
				var mode = document.documentMode;
				if(mode && mode != 5 && Math.floor(isIE) != mode){
					isIE = mode;
				}

				has.add("ie", isIE);
			}

			// Wii
			has.add("wii", typeof opera != "undefined" && opera.wiiremote);
		}
	}

	return has;
});

},
'frozen/box2d/BoxGame':function(){
/**
 * This is a convenience object that allows for quickly creating a box2d based game.
 * @name BoxGame
 * @constructor BoxGame
 * @extends GameCore
 */

 define("frozen/box2d/BoxGame", [
  '../GameCore',
  './Box',
  'dcl',
  'dcl/bases/Mixer'
], function(GameCore, Box, dcl, Mixer){

  'use strict';

  return dcl([GameCore, Mixer], {
    /**
     * The instance of Box used for this game.
     * @type {Box}
     * @memberOf BoxGame#
     * @default
     */
    box: null,
    /**
     * Whether the box should perform calculations during its update cycle
     * @type {Boolean}
     * @memberOf BoxGame#
     * @default
     */
    boxUpdating: true,
    /**
     * A map of Entity objects that have are added to the Box
     * @type {Object}
     * @memberOf BoxGame#
     * @default
     */
    entities: null,

    constructor: function(){
      if(!this.box){
        this.box = new Box();
      }

      if(!this.entities){
        this.entities = {};
      }
    },

    /**
     * Updates the Box before update() is called
     * @function
     * @memberOf BoxGame#
     * @param  {Number} millis The milliseconds that have passed since last iteration of gameLoop
     */
    preUpdate: function(millis){
      if(this.boxUpdating){
        this.box.update(millis);
        this.box.updateExternalState(this.entities);
      }
    }
  });

});
},
'frozen/GameCore':function(){
/**
 * The GameCore class provides the base to build games on.
 * @name GameCore
 * @constructor GameCore
 * @example
 * var myGame = new GameCore({
 *   canvasId: 'myCanvas',
 *   update: function(millis){
 *     // do updating of game state
 *   },
 *   draw: function(context){
 *     // do drawing of the game
 *   }
 * });
 *
 * //start the game
 * myGame.run();
 */

define("frozen/GameCore", [
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  'dojo/dom',
  './InputManager',
  './ResourceManager',
  './shims/RAF'
], function(dcl, Mixer, lang, dom, InputManager, ResourceManager){

  'use strict';

  return dcl(Mixer, {
    /**
     * A map of static constants for internal use
     * @type {Object}
     * @memberOf GameCore#
     * @property {Number} FONT_SIZE Default font size used in default draw functions
     */
    statics: {
      FONT_SIZE: 24
    },
    /**
     * Whether or not the game should be running its loop
     * @type {Boolean}
     * @memberOf GameCore#
     * @default
     */
    isRunning: false,
    /**
     * The id of the canvas element to use render the game on
     * @type {String}
     * @memberOf GameCore#
     * @default
     */
    canvasId: null,
    /**
     * Max number of milliseconds between updates. (in case user switches tabs and requestAnimationFrame pauses)
     * @type {Number}
     * @memberOf GameCore#
     * @default
     */
    maxStep: 40,
    /**
     * The type of context to request from the canvas.  2d or 3d
     * @type {String}
     * @memberOf GameCore#
     * @default
     */
    contextType: '2d',
    /**
     * The height of the Game and canvas
     * @type {Number}
     * @memberOf GameCore#
     * @default
     */
    height: 0,
    /**
     * The width of the Game and canvas
     * @type {Number}
     * @memberOf GameCore#
     * @default
     */
    width: 0,
    /**
     * The ResourceManager to be used for game
     * @type {ResourceManager}
     * @memberOf GameCore#
     * @default
     */
    resourceManager: null,
    /**
     * The InputManager to be used for game
     * @type {InputManager}
     * @memberOf GameCore#
     * @default
     */
    inputManager: null,
    /**
     * The style to be used for the foreground while game resources are loading
     * @type {String}
     * @memberOf GameCore#
     * @default
     */
    loadingForeground: '#00F',
    /**
     * The style to be used for the background while game resources are loading
     * @type {String}
     * @memberOf GameCore#
     * @default
     */
    loadingBackground: '#FFF',
    /**
     * The ID of a DOM element that contains the game's canvas
     * @type {String}
     * @memberOf GameCore#
     * @default
     */
    gameAreaId: null,
    /**
     * The percentage (0 to 1.0) of the height and width the canvas should use to fill in its container DOM element
     * @type {Number}
     * @memberOf GameCore#
     * @default
     */
    canvasPercentage: 0,

    /**
     * Sets the height on your GameCore instance and on your canvas reference
     * @function
     * @memberOf GameCore#
     * @param {Number} newHeight The new height desired
     */
    setHeight: function(newHeight){
      this.height = newHeight;
      this.canvas.height = newHeight;
    },

    /**
     * Sets the width on your GameCore instance and on your canvas reference
     * @function
     * @memberOf GameCore#
     * @param {Number} newWidth The new width desired
     */
    setWidth: function(newWidth){
      this.width = newWidth;
      this.canvas.width = newWidth;
    },

    /**
     * Signals the game loop that it's time to quit
     * @function
     * @memberOf GameCore#
     */
    stop: function() {
      this.isRunning = false;
    },

    /**
     * Launches the game.
     * @function
     * @memberOf GameCore#
     */
    run: function() {
      if(!this.isRunning){
        this.init();
        this.loadResources(this.resourceManager);
        this.initInput(this.inputManager);
        this.launchLoop();
      }
    },

    /**
     * Can be overidden in GameCore subclasses to load images and sounds
     * @function
     * @memberOf GameCore#
     * @param {ResourceManager} resourceManager
     */
    loadResources: function(resourceManager){},

    /**
     * Sets the screen mode and initiates and objects.
     * @function
     * @memberOf GameCore#
     */
    init: function() {
      if(!this.canvas){
        this.canvas = dom.byId(this.canvasId);
      }
      if(!this.canvas){
        alert('Sorry, your browser does not support canvas.  I recommend any browser but Internet Explorer');
        return;
      }
      if(!this.context){
        this.context = this.canvas.getContext(this.contextType);
      }
      if(!this.context){
        alert('Sorry, your browser does not support a ' + this.contextType + ' drawing surface on canvas.  I recommend any browser but Internet Explorer');
        return;
      }

      this.setHeight(this.height || this.canvas.height);
      this.setWidth(this.width || this.canvas.width);

      if(!this.inputManager){
        //handle resizing if gameArea and canvasPercentage are specified
        if(this.gameAreaId && this.canvasPercentage){
          this.inputManager = new InputManager({
            canvas: this.canvas,
            gameArea: dom.byId(this.gameAreaId),
            canvasPercentage: this.canvasPercentage
          });
        }else{
          this.inputManager = new InputManager({
            canvas: this.canvas
          });
        }
      }

      this.inputManager.resize();

      if(!this.resourceManager){
        this.resourceManager = new ResourceManager();
      }
      this.loadResources(this.resourceManager);

      this.isRunning = true;
    },

    /**
     * Can be overidden in the subclasses to map user input to actions
     * @function
     * @memberOf GameCore#
     * @param {InputManager} inputManager
     */
    initInput: function(inputManager) {},

    /**
     * Can be overidden in the subclasses to deal with user input before updating the game state
     * @function
     * @memberOf GameCore#
     * @param {InputManager} inputManager
     * @param {Number} elapsedTime Elapsed time in milliseconds
     */
    handleInput: function(inputManager,elapsedTime) {},

    /**
     * Runs through the game loop until stop() is called.
     * @function
     * @memberOf GameCore#
     */
    gameLoop: function() {
      this.currTime = new Date().getTime();
      this.elapsedTime = Math.min(this.currTime - this.prevTime, this.maxStep);
      this.prevTime = this.currTime;

      //it's using a resource manager, but resources haven't finished
      if(this.resourceManager && !this.resourceManager.resourcesReady()){
        this.updateLoadingScreen(this.elapsedTime);
        this.drawLoadingScreen(this.context);
      } else {
        this.handleInput(this.inputManager,this.elapsedTime);
        if(!this.paused){
          // update
          this.preUpdate(this.elapsedTime);
          this.update(this.elapsedTime);
        }
        // draw the screen
        this.context.save();
        this.draw(this.context);
        this.context.restore();
      }
    },

    /**
     * Launches the game loop.
     * @function
     * @memberOf GameCore#
     */
    launchLoop: function(){
      this.elapsedTime = 0;
      var startTime = Date.now();
      this.currTime = startTime;
      this.prevTime = startTime;

      //need to keep the context defined here so the game loop has access to it
      this.loopRunner = lang.hitch(this, this.loopRunner);
      window.requestAnimationFrame(this.loopRunner);
    },

    loopRunner: function(){
      this.gameLoop();
      window.requestAnimationFrame(this.loopRunner);
    },

    /**
     * Can be overriden to do things before the update is called, used by BoxGame to update Box state before update is called.
     * @function
     * @memberOf GameCore#
     * @param {Number} elapsedTime Elapsed time in milliseconds
     */
    preUpdate: function(elapsedTime) {},

    /**
     * Should be overridden to update the state of the game/animation based on the amount of elapsed time that has passed.
     * @function
     * @memberOf GameCore#
     * @param {Number} elapsedTime Elapsed time in milliseconds
     */
    update: function(elapsedTime) {},

    /**
     * Can be overridden to update the state of the game/animation while a custom loading screen is displayed.
     * @function
     * @memberOf GameCore#
     * @param {Number} elapsedTime Elapsed time in milliseconds
     */
    updateLoadingScreen: function(elapsedTime) {},

    /**
     * Draws to the screen. Subclasses or instances must override this method to paint items to the screen.
     * @function
     * @memberOf GameCore#
     * @param {Context} context An HTML5 canvas drawing context.
     */
    draw: function(context){
      if(this.contextType === '2d'){
        context.font = "14px sans-serif";
        context.fillText("This game does not have its own draw function!", 10, 50);
      }
    },

    /**
     * Draws the progress of the resource manger to the screen while loading.
     * Subclasses or instances may override for custom loading animations.
     * @function
     * @memberOf GameCore#
     * @param {Context} context An HTML5 canvas drawing context.
     */
    drawLoadingScreen: function(context){
      if(this.resourceManager && (this.contextType === '2d')){
        context.fillStyle = this.loadingBackground;
        context.fillRect(0,0, this.width,this.height);

        context.fillStyle = this.loadingForeground;
        context.strokeStyle = this.loadingForeground;

        var textPxSize = Math.floor(this.height/12);

        context.font = "bold " + textPxSize + "px sans-serif";

        context.fillText("Loading... " + this.resourceManager.getPercentComplete() + "%", this.width * 0.1, this.height * 0.55);

        context.strokeRect(this.width * 0.1, this.height * 0.7, this.width * 0.8, this.height * 0.1);
        context.fillRect(this.width * 0.1, this.height * 0.7, (this.width * 0.8) * this.resourceManager.getPercentComplete()/100, this.height * 0.1);

        context.lineWidth = 4;
      }
    }
  });

});

},
'dojo/dom':function(){
define(["./sniff", "./_base/window"],
		function(has, win){
	// module:
	//		dojo/dom

	// FIXME: need to add unit tests for all the semi-public methods

	if(has("ie") <= 7){
		try{
			document.execCommand("BackgroundImageCache", false, true);
		}catch(e){
			// sane browsers don't have cache "issues"
		}
	}

	// =============================
	// DOM Functions
	// =============================

	// the result object
	var dom = {
		// summary:
		//		This module defines the core dojo DOM API.
	};

	if(has("ie")){
		dom.byId = function(id, doc){
			if(typeof id != "string"){
				return id;
			}
			var _d = doc || win.doc, te = id && _d.getElementById(id);
			// attributes.id.value is better than just id in case the
			// user has a name=id inside a form
			if(te && (te.attributes.id.value == id || te.id == id)){
				return te;
			}else{
				var eles = _d.all[id];
				if(!eles || eles.nodeName){
					eles = [eles];
				}
				// if more than 1, choose first with the correct id
				var i = 0;
				while((te = eles[i++])){
					if((te.attributes && te.attributes.id && te.attributes.id.value == id) || te.id == id){
						return te;
					}
				}
			}
		};
	}else{
		dom.byId = function(id, doc){
			// inline'd type check.
			// be sure to return null per documentation, to match IE branch.
			return ((typeof id == "string") ? (doc || win.doc).getElementById(id) : id) || null; // DOMNode
		};
	}
	/*=====
	 dom.byId = function(id, doc){
		 // summary:
		 //		Returns DOM node with matching `id` attribute or falsy value (ex: null or undefined)
		 //		if not found.  If `id` is a DomNode, this function is a no-op.
		 //
		 // id: String|DOMNode
		 //		A string to match an HTML id attribute or a reference to a DOM Node
		 //
		 // doc: Document?
		 //		Document to work in. Defaults to the current value of
		 //		dojo.doc.  Can be used to retrieve
		 //		node references from other documents.
		 //
		 // example:
		 //		Look up a node by ID:
		 //	|	var n = dojo.byId("foo");
		 //
		 // example:
		 //		Check if a node exists, and use it.
		 //	|	var n = dojo.byId("bar");
		 //	|	if(n){ doStuff() ... }
		 //
		 // example:
		 //		Allow string or DomNode references to be passed to a custom function:
		 //	|	var foo = function(nodeOrId){
		 //	|		nodeOrId = dojo.byId(nodeOrId);
		 //	|		// ... more stuff
		 //	|	}
	 };
	 =====*/

	dom.isDescendant = function(/*DOMNode|String*/ node, /*DOMNode|String*/ ancestor){
		// summary:
		//		Returns true if node is a descendant of ancestor
		// node: DOMNode|String
		//		string id or node reference to test
		// ancestor: DOMNode|String
		//		string id or node reference of potential parent to test against
		//
		// example:
		//		Test is node id="bar" is a descendant of node id="foo"
		//	|	if(dojo.isDescendant("bar", "foo")){ ... }

		try{
			node = dom.byId(node);
			ancestor = dom.byId(ancestor);
			while(node){
				if(node == ancestor){
					return true; // Boolean
				}
				node = node.parentNode;
			}
		}catch(e){ /* squelch, return false */ }
		return false; // Boolean
	};


	// TODO: do we need setSelectable in the base?

	// Add feature test for user-select CSS property
	// (currently known to work in all but IE < 10 and Opera)
	has.add("css-user-select", function(global, doc, element){
		// Avoid exception when dom.js is loaded in non-browser environments
		if(!element){ return false; }
		
		var style = element.style;
		var prefixes = ["Khtml", "O", "ms", "Moz", "Webkit"],
			i = prefixes.length,
			name = "userSelect",
			prefix;

		// Iterate prefixes from most to least likely
		do{
			if(typeof style[name] !== "undefined"){
				// Supported; return property name
				return name;
			}
		}while(i-- && (name = prefixes[i] + "UserSelect"));

		// Not supported if we didn't return before now
		return false;
	});

	/*=====
	dom.setSelectable = function(node, selectable){
		// summary:
		//		Enable or disable selection on a node
		// node: DOMNode|String
		//		id or reference to node
		// selectable: Boolean
		//		state to put the node in. false indicates unselectable, true
		//		allows selection.
		// example:
		//		Make the node id="bar" unselectable
		//	|	dojo.setSelectable("bar");
		// example:
		//		Make the node id="bar" selectable
		//	|	dojo.setSelectable("bar", true);
	};
	=====*/

	var cssUserSelect = has("css-user-select");
	dom.setSelectable = cssUserSelect ? function(node, selectable){
		// css-user-select returns a (possibly vendor-prefixed) CSS property name
		dom.byId(node).style[cssUserSelect] = selectable ? "" : "none";
	} : function(node, selectable){
		node = dom.byId(node);

		// (IE < 10 / Opera) Fall back to setting/removing the
		// unselectable attribute on the element and all its children
		var nodes = node.getElementsByTagName("*"),
			i = nodes.length;

		if(selectable){
			node.removeAttribute("unselectable");
			while(i--){
				nodes[i].removeAttribute("unselectable");
			}
		}else{
			node.setAttribute("unselectable", "on");
			while(i--){
				nodes[i].setAttribute("unselectable", "on");
			}
		}
	};

	return dom;
});

},
'dojo/_base/window':function(){
define(["./kernel", "./lang", "../sniff"], function(dojo, lang, has){
// module:
//		dojo/_base/window

var ret = {
	// summary:
	//		API to save/set/restore the global/document scope.

	global: dojo.global,
	/*=====
	 global: {
		 // summary:
		 //		Alias for the current window. 'global' can be modified
		 //		for temporary context shifting. See also withGlobal().
		 // description:
		 //		Use this rather than referring to 'window' to ensure your code runs
		 //		correctly in managed contexts.
	 },
	 =====*/

	doc: this["document"] || null,
	/*=====
	doc: {
		// summary:
		//		Alias for the current document. 'doc' can be modified
		//		for temporary context shifting. See also withDoc().
		// description:
		//		Use this rather than referring to 'window.document' to ensure your code runs
		//		correctly in managed contexts.
		// example:
		//	|	n.appendChild(dojo.doc.createElement('div'));
	},
	=====*/

	body: function(/*Document?*/ doc){
		// summary:
		//		Return the body element of the specified document or of dojo/_base/window::doc.
		// example:
		//	|	win.body().appendChild(dojo.doc.createElement('div'));

		// Note: document.body is not defined for a strict xhtml document
		// Would like to memoize this, but dojo.doc can change vi dojo.withDoc().
		doc = doc || dojo.doc;
		return doc.body || doc.getElementsByTagName("body")[0]; // Node
	},

	setContext: function(/*Object*/ globalObject, /*DocumentElement*/ globalDocument){
		// summary:
		//		changes the behavior of many core Dojo functions that deal with
		//		namespace and DOM lookup, changing them to work in a new global
		//		context (e.g., an iframe). The varibles dojo.global and dojo.doc
		//		are modified as a result of calling this function and the result of
		//		`dojo.body()` likewise differs.
		dojo.global = ret.global = globalObject;
		dojo.doc = ret.doc = globalDocument;
	},

	withGlobal: function(	/*Object*/ globalObject,
							/*Function*/ callback,
							/*Object?*/ thisObject,
							/*Array?*/ cbArguments){
		// summary:
		//		Invoke callback with globalObject as dojo.global and
		//		globalObject.document as dojo.doc.
		// description:
		//		Invoke callback with globalObject as dojo.global and
		//		globalObject.document as dojo.doc. If provided, globalObject
		//		will be executed in the context of object thisObject
		//		When callback() returns or throws an error, the dojo.global
		//		and dojo.doc will be restored to its previous state.

		var oldGlob = dojo.global;
		try{
			dojo.global = ret.global = globalObject;
			return ret.withDoc.call(null, globalObject.document, callback, thisObject, cbArguments);
		}finally{
			dojo.global = ret.global = oldGlob;
		}
	},

	withDoc: function(	/*DocumentElement*/ documentObject,
						/*Function*/ callback,
						/*Object?*/ thisObject,
						/*Array?*/ cbArguments){
		// summary:
		//		Invoke callback with documentObject as dojo/_base/window::doc.
		// description:
		//		Invoke callback with documentObject as dojo/_base/window::doc. If provided,
		//		callback will be executed in the context of object thisObject
		//		When callback() returns or throws an error, the dojo/_base/window::doc will
		//		be restored to its previous state.

		var oldDoc = ret.doc,
			oldQ = has("quirks"),
			oldIE = has("ie"), isIE, mode, pwin;

		try{
			dojo.doc = ret.doc = documentObject;
			// update dojo.isQuirks and the value of the has feature "quirks".
			// remove setting dojo.isQuirks and dojo.isIE for 2.0
			dojo.isQuirks = has.add("quirks", dojo.doc.compatMode == "BackCompat", true, true); // no need to check for QuirksMode which was Opera 7 only

			if(has("ie")){
				if((pwin = documentObject.parentWindow) && pwin.navigator){
					// re-run IE detection logic and update dojo.isIE / has("ie")
					// (the only time parentWindow/navigator wouldn't exist is if we were not
					// passed an actual legitimate document object)
					isIE = parseFloat(pwin.navigator.appVersion.split("MSIE ")[1]) || undefined;
					mode = documentObject.documentMode;
					if(mode && mode != 5 && Math.floor(isIE) != mode){
						isIE = mode;
					}
					dojo.isIE = has.add("ie", isIE, true, true);
				}
			}

			if(thisObject && typeof callback == "string"){
				callback = thisObject[callback];
			}

			return callback.apply(thisObject, cbArguments || []);
		}finally{
			dojo.doc = ret.doc = oldDoc;
			dojo.isQuirks = has.add("quirks", oldQ, true, true);
			dojo.isIE = has.add("ie", oldIE, true, true);
		}
	}
};

 1  && lang.mixin(dojo, ret);

return ret;

});

},
'frozen/InputManager':function(){
/**
 * The InputManager handles DOM events for use in games.
 * @name InputManager
 * @constructor InputManager
 */

define("frozen/InputManager", [
  './GameAction',
  './MouseAction',
  './utils/insideCanvas',
  'dcl',
  'dcl/bases/Mixer',
  'dojo/has',
  'dojo/on',
  'dojo/dom-style',
  'dojo/dom-geometry',
  'dojo/_base/lang',
  'dojo/domReady!'
], function(GameAction, MouseAction, insideCanvas, dcl, Mixer, has, on, domStyle, domGeom, lang){

  'use strict';

  return dcl(Mixer, {
    /**
     * An array of keyActions being listened for
     * @type {Array}
     * @memberOf InputManager#
     * @default
     */
    keyActions: [],
    /**
     * The MouseAction to keep track of the mouse's state
     * @type {MouseAction}
     * @memberOf InputManager#
     * @default
     */
    mouseAction: null,
    /**
     * The MouseAction to keep track of touch events
     * @type {MouseAction}
     * @memberOf InputManager#
     * @default
     */
    touchAction: null,
    /**
     * The HTML5 canvas on which to listen for events
     * @type {Canvas}
     * @memberOf InputManager#
     * @default
     */
    canvas: null,
    /**
     * Whether or not to listen for mouse events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    handleMouse: true,
    /**
     * Whether or not to listen for touch events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    handleTouch: true,
    /**
     * Whether or not to listen for keyboard events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    handleKeys: true,
    /**
     * The DOM element that contains the game's canvas
     * @type {Element}
     * @memberOf InputManager#
     * @default
     */
    gameArea: null,
    /**
     * The percentage (0 to 1.0) of the height and width the canvas should use to fill in its container DOM element
     * @type {Number}
     * @memberOf InputManager#
     * @default
     */
    canvasPercentage: null,

    constructor: function(){
      if(this.handleKeys){
        on(document, 'keydown', lang.hitch(this, "keyDown"));
        on(document, 'keyup', lang.hitch(this, "keyReleased"));
      }

      if(this.handleMouse && !has('touch')){
        on(document, 'mousedown', lang.hitch(this, "mouseDown"));
        on(document, 'mousemove', lang.hitch(this, "mouseMove"));
        on(document, 'mouseup', lang.hitch(this, "mouseUp"));
      }

      if(this.handleTouch && has('touch')){
        on(document, 'touchstart', lang.hitch(this, "touchStart"));
        on(document, 'touchmove', lang.hitch(this, "touchMove"));
        on(document, 'touchend', lang.hitch(this, "touchEnd"));
      }

      if(!this.mouseAction){
        this.mouseAction = new MouseAction();
      }

      if(!this.touchAction){
        this.touchAction = new MouseAction();
      }

      if(this.gameArea && this.canvasPercentage){
        on(window, 'resize', lang.hitch(this, "resize"));
        on(window, 'orientationchange', lang.hitch(this, "resize"));
      }
    },

    /**
     * Maps a GameAction to a specific key. The key codes are defined in dojo.keys.
     * If the key already has a GameAction mapped to it, the new GameAction overwrites it.
     * @function
     * @memberOf InputManager#
     * @param {GameAction} gameAction the GameAction to map
     * @param {Object} keyCode dojo.keys key code, or character
     */
    mapToKey: function(gameAction, keyCode) {
      if(!this.keyActions){
        this.keyActions = [];
      }
      this.keyActions[keyCode] = gameAction;
    },

    /**
     * Adds a GameAction to a key
     * @function
     * @memberOf InputManager#
     * @param {Object} keyCode Key character or dojo/keys key code
     * @param {Boolean=} initialPressOnly Do only one fire of the action per keypress
     * @return {GameAction} GameAction that is mapped to keyCode
     */
    addKeyAction: function(keyCode, initialPressOnly){
      // TODO: Remove dependency on GameAction
      var ga = new GameAction();
      if(initialPressOnly){
        ga.behavior = ga.statics.DETECT_INITAL_PRESS_ONLY;
      }
      this.mapToKey(ga,keyCode);

      return ga;
    },

    /**
     * Sets the mouseAction to the gameAction
     * @function
     * @memberOf InputManager#
     * @param {GameAction} gameAction The GameAction to assign
     * @deprecated This method is deprecated because mouseAction is available on an instance and it will be removed in the future
     */
    setMouseAction: function(gameAction){
      this.mouseAction = gameAction;
    },

    /**
     * Sets the touchAction to the gameAction
     * @function
     * @memberOf InputManager#
     * @param {GameAction} gameAction The GameAction to assign
     * @deprecated This method is deprecated because touchAction is available on an instance and it will be removed in the future
     */
    setTouchAction: function(gameAction){
      this.touchAction = gameAction;
    },

    /**
     * Called upon mouseup event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mouseUp: function(e) {
      this.mouseAction.release();
      this.mouseAction.endPosition = this.getMouseLoc(e);
    },

    /**
     * Called upon mousedown event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mouseDown: function(e){
      var currentPoint = this.getMouseLoc(e);
      this.mouseAction.endPosition = null;
      this.mouseAction.insideCanvas = insideCanvas(currentPoint, this.canvas);
      if(this.mouseAction.insideCanvas){
        this.mouseAction.press();
        this.mouseAction.startPosition = currentPoint;
        this.mouseAction.position = currentPoint;
      } else {
        this.mouseAction.startPosition = null;
      }
    },

    /**
     * Called upon mousemove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mouseMove: function(e){
      this.mouseAction.position = this.getMouseLoc(e);
    },

    /**
     * Called upon touchstart event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchStart: function(e){
      var currentPoint = this.getMouseLoc(e.changedTouches[0]);
      this.touchAction.endPosition = null;
      this.touchAction.insideCanvas = insideCanvas(currentPoint, this.canvas);
      if(this.touchAction.insideCanvas){
        this.touchAction.press();
        this.touchAction.startPosition = currentPoint;
        this.touchAction.position = currentPoint;
      } else {
        this.touchAction.startPosition = null;
      }
    },

    /**
     * Called upon touchend event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchEnd: function(e){
      this.touchAction.release();
      this.touchAction.endPosition = this.getMouseLoc(e.changedTouches[0]);
    },

    /**
     * Called upon touchmove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchMove: function(e){
      this.touchAction.position = this.getMouseLoc(e.changedTouches[0]);
      if(this.touchAction.startPosition){
        e.preventDefault();
      }
    },

    /**
     * Retrieves the GameAction associated with the keyCode on the event object
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     * @return {GameAction|null} The GameAction associated with the keyCode else null
     */
    getKeyAction: function(e) {
      if (this.keyActions.length) {
        return this.keyActions[e.keyCode] || this.keyActions[String.fromCharCode(e.keyCode)];
      } else {
        return null;
      }
    },

    /**
     * Called upon keypress event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    keyPressed: function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction && !gameAction.isPressed()) {
        gameAction.press();
      }
    },

    /**
     * Called upon keydown event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    keyDown: function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction && !gameAction.isPressed()) {
        gameAction.press();
      }
    },

    /**
     * Called upon keyup event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    keyReleased : function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction) {
        gameAction.release();
      }
    },

    /**
     * Used to get a normalized point out of an Event object
     * @function
     * @memberOf InputManager#
     * @param  {Event} evt Event object
     * @return {Point} Normalized point
     */
    getMouseLoc: function(evt){
      var coordsM = domGeom.position(this.canvas);
      if(this.zoomRatio){
        return {
          x: Math.round((evt.clientX - coordsM.x) / this.zoomRatio),
          y: Math.round((evt.clientY - coordsM.y) / this.zoomRatio)
        };
      }else{
        return {
          x: Math.round(evt.clientX - coordsM.x),
          y: Math.round(evt.clientY - coordsM.y)
        };
      }
    },

    /**
     * Used to resize the canvas
     * @function
     * @memberOf InputManager#
     */
    resize: function(){
      if(this.gameArea && this.canvasPercentage && this.canvas){
        var canvasWidth = this.canvas.width;
        var canvasHeight = this.canvas.height;

        var bodyMargins = domGeom.getMarginExtents(document.body);

        var newWidth = window.innerWidth - bodyMargins.w;
        var newHeight = window.innerHeight - bodyMargins.h;

        var widthToHeight = canvasWidth / canvasHeight;
        var newWidthToHeight = newWidth / newHeight;

        var newWidthStyle = '';
        var newHeightStyle = '';
        if (newWidthToHeight > widthToHeight) {
          newWidth = newHeight * widthToHeight;
          newWidthStyle = newWidth + 'px';
          newHeightStyle = newHeight + 'px';
        } else {
          newWidthStyle = newWidth + 'px';
          newHeightStyle = Math.round(newWidth / widthToHeight) + 'px';
        }

        this.zoomRatio = newWidth / canvasWidth * this.canvasPercentage;

        domStyle.set(this.gameArea, {
          width: newWidthStyle,
          height: newHeightStyle
        });

        var canvasPercentageStyle = Math.floor(this.canvasPercentage * 100) + '%';
        domStyle.set(this.canvas, {
          width: canvasPercentageStyle,
          height: canvasPercentageStyle,
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto'
        });
      }
    }
  });

});

},
'frozen/GameAction':function(){
/**
 * The GameAction handles DOM events for use in games.
 * @name GameAction
 * @constructor GameAction
 */

define("frozen/GameAction", [
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    /**
     * A name to reference the GameAction with
     * @type {String}
     * @memberOf GameAction#
     * @default
     */
    name: null,
    /**
     * Whether or not to detect only the intial press of the game action
     * @type {Number}
     * @memberOf GameAction#
     * @default
     */
    behavior: 0,
    /**
     * How many times the GameAction has been pressed
     * @type {Number}
     * @memberOf GameAction#
     * @default
     */
    amount: 0,
    /**
     * The current state of the GameAction
     * @type {Number}
     * @memberOf GameAction#
     * @default
     */
    state: 0,
    /**
     * A map of static constants for internal use
     * @type {Object}
     * @memberOf GameAction#
     * @property {Number} NORMAL Normal behavior. The isPressed() method returns true as long as the key is held down.
     * @property {Number} DETECT_INITAL_PRESS_ONLY Initial press behavior. The isPressed() method returns true only after the key is first pressed, and not again until the key is released and pressed again.
     * @property {Number} STATE_RELEASED Value for released state
     * @property {Number} STATE_PRESSED Value for pressed state
     * @property {Number} STATE_WAITING_FOR_RELEASE Value for waiting for release state
     * @property {Number} STATE_MOVED Value for moved state
     */
    statics: {
      NORMAL: 0,
      DETECT_INITAL_PRESS_ONLY: 1,

      STATE_RELEASED: 0,
      STATE_PRESSED: 1,
      STATE_WAITING_FOR_RELEASE: 2,
      STATE_MOVED: 3
    },

    constructor: function(){
      this.reset();
    },

    /**
     * Returns the name of the GameAction
     * @function
     * @memberOf GameAction#
     * @return {String} The name of the GameAction
     * @deprecated This method is deprecated because name is accessible on the instance and will be removed in the future
     */
    getName: function() {
      return this.name;
    },

    /**
     * Resets this GameAction so that it appears like it hasn't been pressed.
     * @function
     * @memberOf GameAction#
     */
    reset: function() {
      this.state = this.statics.STATE_RELEASED;
      this.amount = 0;
    },

    /**
     * Taps this GameAction. Same as calling press() followed by release().
     * @function
     * @memberOf GameAction#
     */
    tap: function() {
      this.press();
      this.release();
    },

    /**
     * Signals that the key was pressed.
     * @function
     * @memberOf GameAction#
     */
    press: function() {
      this.state = this.statics.STATE_PRESSED;
      if(this.behavior === this.statics.DETECT_INITAL_PRESS_ONLY){
        this.pressAmt(1);
      }
    },

    /**
     * Signals that the key was pressed a specified number of times, or that the mouse move a specified distance.
     * @function
     * @memberOf GameAction#
     * @param {Number} amount the number of times the key is pressed
     */
    pressAmt: function(amount) {
      if (this.state !== this.statics.STATE_WAITING_FOR_RELEASE) {
        this.amount += amount;
        this.state = this.statics.STATE_WAITING_FOR_RELEASE;
      }
    },

    /**
     * Signals that the key was released
     * @function
     * @memberOf GameAction#
     */
    release: function() {
      this.state = this.statics.STATE_RELEASED;
    },

    /**
     * Returns whether the key was pressed or not since last checked.
     * @function
     * @memberOf GameAction#
     * @return {Boolean} True if the key is pressed, else false
     */
    isPressed: function() {
      if(this.state === this.statics.STATE_PRESSED){
        return true;
      } else {
        return false;
      }
    },

    /**
     * For keys, this is the number of times the key was pressed since it was last checked.
     * For mouse movement, this is the distance moved.
     *
     * This Resets the amount to zero after being checked!
     *
     * @function
     * @memberOf GameAction#
     * @return {Number} Number of times the key was pressed or distance mouse was moved
     */
    getAmount: function() {
      var retVal = this.amount;
      if (retVal !== 0) {
        if (this.state === this.statics.STATE_RELEASED) {
          this.amount = 0;
        } else if (this.behavior === this.statics.DETECT_INITAL_PRESS_ONLY) {
          this.state = this.statics.STATE_WAITING_FOR_RELEASE;
          this.amount = 0;
        }
      }
      return retVal;
    }
  });

});
},
'frozen/MouseAction':function(){
/**
 * A GameAction that handles Mouse events
 * @name MouseAction
 * @constructor MouseAction
 * @extends {GameAction}
 */

define("frozen/MouseAction", [
  'dcl',
  'dcl/bases/Mixer',
  './GameAction'
], function(dcl, Mixer, GameAction){

  'use strict';

  return dcl([Mixer, GameAction], {
    /**
     * Position where mousedown happened
     * @type {Point}
     * @memberOf MouseAction#
     * @default
     */
    startPosition: null,
    /**
     * Position where mouseup happened
     * @type {Point}
     * @memberOf MouseAction#
     * @default
     */
    endPosition: null,
    /**
     * Position where mousemove happened
     * @type {Point}
     * @memberOf MouseAction#
     * @default
     */
    position: null
  });

});
},
'frozen/utils/insideCanvas':function(){
define("frozen/utils/insideCanvas", function(){

  'use strict';

  function insideCanvas(pt, canvas){
    if((pt.x < 0) || (pt.x >  canvas.width) || (pt.y < 0) || (pt.y > canvas.height)){
      return false;
    } else {
      return true;
    }
  }

  return insideCanvas;

});
},
'dojo/on':function(){
define("dojo/on", ["require", "./_base/kernel", "./has"], function(aspect, dojo, has){

	"use strict";
	if( 1 ){ // check to make sure we are in a browser, this module should work anywhere
		var major = window.ScriptEngineMajorVersion;
		has.add("jscript", major && (major() + ScriptEngineMinorVersion() / 10));
		has.add("event-orientationchange", has("touch") && !has("android")); // TODO: how do we detect this?
		has.add("event-stopimmediatepropagation", window.Event && !!window.Event.prototype && !!window.Event.prototype.stopImmediatePropagation);
	}
	var on = function(target, type, listener, dontFix){
		// summary:
		//		A function that provides core event listening functionality. With this function
		//		you can provide a target, event type, and listener to be notified of
		//		future matching events that are fired.
		// target: Element|Object
		//		This is the target object or DOM element that to receive events from
		// type: String|Function
		//		This is the name of the event to listen for or an extension event type.
		// listener: Function
		//		This is the function that should be called when the event fires.
		// returns: Object
		//		An object with a remove() method that can be used to stop listening for this
		//		event.
		// description:
		//		To listen for "click" events on a button node, we can do:
		//		|	define(["dojo/on"], function(listen){
		//		|		on(button, "click", clickHandler);
		//		|		...
		//		Evented JavaScript objects can also have their own events.
		//		|	var obj = new Evented;
		//		|	on(obj, "foo", fooHandler);
		//		And then we could publish a "foo" event:
		//		|	on.emit(obj, "foo", {key: "value"});
		//		We can use extension events as well. For example, you could listen for a tap gesture:
		//		|	define(["dojo/on", "dojo/gesture/tap", function(listen, tap){
		//		|		on(button, tap, tapHandler);
		//		|		...
		//		which would trigger fooHandler. Note that for a simple object this is equivalent to calling:
		//		|	obj.onfoo({key:"value"});
		//		If you use on.emit on a DOM node, it will use native event dispatching when possible.

		if(typeof target.on == "function" && typeof type != "function"){
			// delegate to the target's on() method, so it can handle it's own listening if it wants
			return target.on(type, listener);
		}
		// delegate to main listener code
		return on.parse(target, type, listener, addListener, dontFix, this);
	};
	on.pausable =  function(target, type, listener, dontFix){
		// summary:
		//		This function acts the same as on(), but with pausable functionality. The
		//		returned signal object has pause() and resume() functions. Calling the
		//		pause() method will cause the listener to not be called for future events. Calling the
		//		resume() method will cause the listener to again be called for future events.
		var paused;
		var signal = on(target, type, function(){
			if(!paused){
				return listener.apply(this, arguments);
			}
		}, dontFix);
		signal.pause = function(){
			paused = true;
		};
		signal.resume = function(){
			paused = false;
		};
		return signal;
	};
	on.once = function(target, type, listener, dontFix){
		// summary:
		//		This function acts the same as on(), but will only call the listener once. The 
		//		listener will be called for the first
		//		event that takes place and then listener will automatically be removed.
		var signal = on(target, type, function(){
			// remove this listener
			signal.remove();
			// proceed to call the listener
			return listener.apply(this, arguments);
		});
		return signal;
	};
	on.parse = function(target, type, listener, addListener, dontFix, matchesTarget){
		if(type.call){
			// event handler function
			// on(node, touch.press, touchListener);
			return type.call(matchesTarget, target, listener);
		}

		if(type.indexOf(",") > -1){
			// we allow comma delimited event names, so you can register for multiple events at once
			var events = type.split(/\s*,\s*/);
			var handles = [];
			var i = 0;
			var eventName;
			while(eventName = events[i++]){
				handles.push(addListener(target, eventName, listener, dontFix, matchesTarget));
			}
			handles.remove = function(){
				for(var i = 0; i < handles.length; i++){
					handles[i].remove();
				}
			};
			return handles;
		}
		return addListener(target, type, listener, dontFix, matchesTarget);
	};
	var touchEvents = /^touch/;
	function addListener(target, type, listener, dontFix, matchesTarget){
		// event delegation:
		var selector = type.match(/(.*):(.*)/);
		// if we have a selector:event, the last one is interpreted as an event, and we use event delegation
		if(selector){
			type = selector[2];
			selector = selector[1];
			// create the extension event for selectors and directly call it
			return on.selector(selector, type).call(matchesTarget, target, listener);
		}
		// test to see if it a touch event right now, so we don't have to do it every time it fires
		if(has("touch")){
			if(touchEvents.test(type)){
				// touch event, fix it
				listener = fixTouchListener(listener);
			}
			if(!has("event-orientationchange") && (type == "orientationchange")){
				//"orientationchange" not supported <= Android 2.1, 
				//but works through "resize" on window
				type = "resize"; 
				target = window;
				listener = fixTouchListener(listener);
			} 
		}
		if(addStopImmediate){
			// add stopImmediatePropagation if it doesn't exist
			listener = addStopImmediate(listener);
		}
		// normal path, the target is |this|
		if(target.addEventListener){
			// the target has addEventListener, which should be used if available (might or might not be a node, non-nodes can implement this method as well)
			// check for capture conversions
			var capture = type in captures,
				adjustedType = capture ? captures[type] : type;
			target.addEventListener(adjustedType, listener, capture);
			// create and return the signal
			return {
				remove: function(){
					target.removeEventListener(adjustedType, listener, capture);
				}
			};
		}
		type = "on" + type;
		if(fixAttach && target.attachEvent){
			return fixAttach(target, type, listener);
		}
		throw new Error("Target must be an event emitter");
	}

	on.selector = function(selector, eventType, children){
		// summary:
		//		Creates a new extension event with event delegation. This is based on
		//		the provided event type (can be extension event) that
		//		only calls the listener when the CSS selector matches the target of the event.
		//
		//		The application must require() an appropriate level of dojo/query to handle the selector.
		// selector:
		//		The CSS selector to use for filter events and determine the |this| of the event listener.
		// eventType:
		//		The event to listen for
		// children:
		//		Indicates if children elements of the selector should be allowed. This defaults to 
		//		true
		// example:
		// |	require(["dojo/on", "dojo/mouse", "dojo/query!css2"], function(listen, mouse){
		// |		on(node, on.selector(".my-class", mouse.enter), handlerForMyHover);
		return function(target, listener){
			// if the selector is function, use it to select the node, otherwise use the matches method
			var matchesTarget = typeof selector == "function" ? {matches: selector} : this,
				bubble = eventType.bubble;
			function select(eventTarget){
				// see if we have a valid matchesTarget or default to dojo.query
				matchesTarget = matchesTarget && matchesTarget.matches ? matchesTarget : dojo.query;
				// there is a selector, so make sure it matches
				while(!matchesTarget.matches(eventTarget, selector, target)){
					if(eventTarget == target || children === false || !(eventTarget = eventTarget.parentNode) || eventTarget.nodeType != 1){ // intentional assignment
						return;
					}
				}
				return eventTarget;
			}
			if(bubble){
				// the event type doesn't naturally bubble, but has a bubbling form, use that, and give it the selector so it can perform the select itself
				return on(target, bubble(select), listener);
			}
			// standard event delegation
			return on(target, eventType, function(event){
				// call select to see if we match
				var eventTarget = select(event.target);
				// if it matches we call the listener
				return eventTarget && listener.call(eventTarget, event);
			});
		};
	};

	function syntheticPreventDefault(){
		this.cancelable = false;
	}
	function syntheticStopPropagation(){
		this.bubbles = false;
	}
	var slice = [].slice,
		syntheticDispatch = on.emit = function(target, type, event){
		// summary:
		//		Fires an event on the target object.
		// target:
		//		The target object to fire the event on. This can be a DOM element or a plain 
		//		JS object. If the target is a DOM element, native event emiting mechanisms
		//		are used when possible.
		// type:
		//		The event type name. You can emulate standard native events like "click" and 
		//		"mouseover" or create custom events like "open" or "finish".
		// event:
		//		An object that provides the properties for the event. See https://developer.mozilla.org/en/DOM/event.initEvent 
		//		for some of the properties. These properties are copied to the event object.
		//		Of particular importance are the cancelable and bubbles properties. The
		//		cancelable property indicates whether or not the event has a default action
		//		that can be cancelled. The event is cancelled by calling preventDefault() on
		//		the event object. The bubbles property indicates whether or not the
		//		event will bubble up the DOM tree. If bubbles is true, the event will be called
		//		on the target and then each parent successively until the top of the tree
		//		is reached or stopPropagation() is called. Both bubbles and cancelable 
		//		default to false.
		// returns:
		//		If the event is cancelable and the event is not cancelled,
		//		emit will return true. If the event is cancelable and the event is cancelled,
		//		emit will return false.
		// details:
		//		Note that this is designed to emit events for listeners registered through
		//		dojo/on. It should actually work with any event listener except those
		//		added through IE's attachEvent (IE8 and below's non-W3C event emiting
		//		doesn't support custom event types). It should work with all events registered
		//		through dojo/on. Also note that the emit method does do any default
		//		action, it only returns a value to indicate if the default action should take
		//		place. For example, emiting a keypress event would not cause a character
		//		to appear in a textbox.
		// example:
		//		To fire our own click event
		//	|	on.emit(dojo.byId("button"), "click", {
		//	|		cancelable: true,
		//	|		bubbles: true,
		//	|		screenX: 33,
		//	|		screenY: 44
		//	|	});
		//		We can also fire our own custom events:
		//	|	on.emit(dojo.byId("slider"), "slide", {
		//	|		cancelable: true,
		//	|		bubbles: true,
		//	|		direction: "left-to-right"
		//	|	});
		var args = slice.call(arguments, 2);
		var method = "on" + type;
		if("parentNode" in target){
			// node (or node-like), create event controller methods
			var newEvent = args[0] = {};
			for(var i in event){
				newEvent[i] = event[i];
			}
			newEvent.preventDefault = syntheticPreventDefault;
			newEvent.stopPropagation = syntheticStopPropagation;
			newEvent.target = target;
			newEvent.type = type;
			event = newEvent;
		}
		do{
			// call any node which has a handler (note that ideally we would try/catch to simulate normal event propagation but that causes too much pain for debugging)
			target[method] && target[method].apply(target, args);
			// and then continue up the parent node chain if it is still bubbling (if started as bubbles and stopPropagation hasn't been called)
		}while(event && event.bubbles && (target = target.parentNode));
		return event && event.cancelable && event; // if it is still true (was cancelable and was cancelled), return the event to indicate default action should happen
	};
	var captures = {};
	if(!has("event-stopimmediatepropagation")){
		var stopImmediatePropagation =function(){
			this.immediatelyStopped = true;
			this.modified = true; // mark it as modified so the event will be cached in IE
		};
		var addStopImmediate = function(listener){
			return function(event){
				if(!event.immediatelyStopped){// check to make sure it hasn't been stopped immediately
					event.stopImmediatePropagation = stopImmediatePropagation;
					return listener.apply(this, arguments);
				}
			};
		}
	} 
	if( 1 ){
		// normalize focusin and focusout
		captures = {
			focusin: "focus",
			focusout: "blur"
		};

		// emiter that works with native event handling
		on.emit = function(target, type, event){
			if(target.dispatchEvent && document.createEvent){
				// use the native event emiting mechanism if it is available on the target object
				// create a generic event				
				// we could create branch into the different types of event constructors, but 
				// that would be a lot of extra code, with little benefit that I can see, seems 
				// best to use the generic constructor and copy properties over, making it 
				// easy to have events look like the ones created with specific initializers
				var nativeEvent = target.ownerDocument.createEvent("HTMLEvents");
				nativeEvent.initEvent(type, !!event.bubbles, !!event.cancelable);
				// and copy all our properties over
				for(var i in event){
					var value = event[i];
					if(!(i in nativeEvent)){
						nativeEvent[i] = event[i];
					}
				}
				return target.dispatchEvent(nativeEvent) && nativeEvent;
			}
			return syntheticDispatch.apply(on, arguments); // emit for a non-node
		};
	}else{
		// no addEventListener, basically old IE event normalization
		on._fixEvent = function(evt, sender){
			// summary:
			//		normalizes properties on the event object including event
			//		bubbling methods, keystroke normalization, and x/y positions
			// evt:
			//		native event object
			// sender:
			//		node to treat as "currentTarget"
			if(!evt){
				var w = sender && (sender.ownerDocument || sender.document || sender).parentWindow || window;
				evt = w.event;
			}
			if(!evt){return evt;}
			if(lastEvent && evt.type == lastEvent.type){
				// should be same event, reuse event object (so it can be augmented)
				evt = lastEvent;
			}
			if(!evt.target){ // check to see if it has been fixed yet
				evt.target = evt.srcElement;
				evt.currentTarget = (sender || evt.srcElement);
				if(evt.type == "mouseover"){
					evt.relatedTarget = evt.fromElement;
				}
				if(evt.type == "mouseout"){
					evt.relatedTarget = evt.toElement;
				}
				if(!evt.stopPropagation){
					evt.stopPropagation = stopPropagation;
					evt.preventDefault = preventDefault;
				}
				switch(evt.type){
					case "keypress":
						var c = ("charCode" in evt ? evt.charCode : evt.keyCode);
						if (c==10){
							// CTRL-ENTER is CTRL-ASCII(10) on IE, but CTRL-ENTER on Mozilla
							c=0;
							evt.keyCode = 13;
						}else if(c==13||c==27){
							c=0; // Mozilla considers ENTER and ESC non-printable
						}else if(c==3){
							c=99; // Mozilla maps CTRL-BREAK to CTRL-c
						}
						// Mozilla sets keyCode to 0 when there is a charCode
						// but that stops the event on IE.
						evt.charCode = c;
						_setKeyChar(evt);
						break;
				}
			}
			return evt;
		};
		var lastEvent, IESignal = function(handle){
			this.handle = handle;
		};
		IESignal.prototype.remove = function(){
			delete _dojoIEListeners_[this.handle];
		};
		var fixListener = function(listener){
			// this is a minimal function for closing on the previous listener with as few as variables as possible
			return function(evt){
				evt = on._fixEvent(evt, this);
				var result = listener.call(this, evt);
				if(evt.modified){
					// cache the last event and reuse it if we can
					if(!lastEvent){
						setTimeout(function(){
							lastEvent = null;
						});
					}
					lastEvent = evt;
				}
				return result;
			};
		};
		var fixAttach = function(target, type, listener){
			listener = fixListener(listener);
			if(((target.ownerDocument ? target.ownerDocument.parentWindow : target.parentWindow || target.window || window) != top || 
						has("jscript") < 5.8) && 
					!has("config-_allow_leaks")){
				// IE will leak memory on certain handlers in frames (IE8 and earlier) and in unattached DOM nodes for JScript 5.7 and below.
				// Here we use global redirection to solve the memory leaks
				if(typeof _dojoIEListeners_ == "undefined"){
					_dojoIEListeners_ = [];
				}
				var emiter = target[type];
				if(!emiter || !emiter.listeners){
					var oldListener = emiter;
					emiter = Function('event', 'var callee = arguments.callee; for(var i = 0; i<callee.listeners.length; i++){var listener = _dojoIEListeners_[callee.listeners[i]]; if(listener){listener.call(this,event);}}');
					emiter.listeners = [];
					target[type] = emiter;
					emiter.global = this;
					if(oldListener){
						emiter.listeners.push(_dojoIEListeners_.push(oldListener) - 1);
					}
				}
				var handle;
				emiter.listeners.push(handle = (emiter.global._dojoIEListeners_.push(listener) - 1));
				return new IESignal(handle);
			}
			return aspect.after(target, type, listener, true);
		};

		var _setKeyChar = function(evt){
			evt.keyChar = evt.charCode ? String.fromCharCode(evt.charCode) : '';
			evt.charOrCode = evt.keyChar || evt.keyCode;
		};
		// Called in Event scope
		var stopPropagation = function(){
			this.cancelBubble = true;
		};
		var preventDefault = on._preventDefault = function(){
			// Setting keyCode to 0 is the only way to prevent certain keypresses (namely
			// ctrl-combinations that correspond to menu accelerator keys).
			// Otoh, it prevents upstream listeners from getting this information
			// Try to split the difference here by clobbering keyCode only for ctrl
			// combinations. If you still need to access the key upstream, bubbledKeyCode is
			// provided as a workaround.
			this.bubbledKeyCode = this.keyCode;
			if(this.ctrlKey){
				try{
					// squelch errors when keyCode is read-only
					// (e.g. if keyCode is ctrl or shift)
					this.keyCode = 0;
				}catch(e){
				}
			}
			this.defaultPrevented = true;
			this.returnValue = false;
		};
	}
	if(has("touch")){ 
		var Event = function(){};
		var windowOrientation = window.orientation; 
		var fixTouchListener = function(listener){ 
			return function(originalEvent){ 
				//Event normalization(for ontouchxxx and resize): 
				//1.incorrect e.pageX|pageY in iOS 
				//2.there are no "e.rotation", "e.scale" and "onorientationchange" in Andriod
				//3.More TBD e.g. force | screenX | screenX | clientX | clientY | radiusX | radiusY

				// see if it has already been corrected
				var event = originalEvent.corrected;
				if(!event){
					var type = originalEvent.type;
					try{
						delete originalEvent.type; // on some JS engines (android), deleting properties make them mutable
					}catch(e){} 
					if(originalEvent.type){
						// deleting properties doesn't work (older iOS), have to use delegation
						Event.prototype = originalEvent;
						var event = new Event;
						// have to delegate methods to make them work
						event.preventDefault = function(){
							originalEvent.preventDefault();
						};
						event.stopPropagation = function(){
							originalEvent.stopPropagation();
						};
					}else{
						// deletion worked, use property as is
						event = originalEvent;
						event.type = type;
					}
					originalEvent.corrected = event;
					if(type == 'resize'){
						if(windowOrientation == window.orientation){ 
							return null;//double tap causes an unexpected 'resize' in Andriod 
						} 
						windowOrientation = window.orientation;
						event.type = "orientationchange"; 
						return listener.call(this, event);
					}
					// We use the original event and augment, rather than doing an expensive mixin operation
					if(!("rotation" in event)){ // test to see if it has rotation
						event.rotation = 0; 
						event.scale = 1;
					}
					//use event.changedTouches[0].pageX|pageY|screenX|screenY|clientX|clientY|target
					var firstChangeTouch = event.changedTouches[0];
					for(var i in firstChangeTouch){ // use for-in, we don't need to have dependency on dojo/_base/lang here
						delete event[i]; // delete it first to make it mutable
						event[i] = firstChangeTouch[i];
					}
				}
				return listener.call(this, event); 
			}; 
		}; 
	}
	return on;
});

},
'dojo/dom-style':function(){
define(["./sniff", "./dom"], function(has, dom){
	// module:
	//		dojo/dom-style

	// =============================
	// Style Functions
	// =============================

	// getComputedStyle drives most of the style code.
	// Wherever possible, reuse the returned object.
	//
	// API functions below that need to access computed styles accept an
	// optional computedStyle parameter.
	// If this parameter is omitted, the functions will call getComputedStyle themselves.
	// This way, calling code can access computedStyle once, and then pass the reference to
	// multiple API functions.

	// Although we normally eschew argument validation at this
	// level, here we test argument 'node' for (duck)type,
	// by testing nodeType, ecause 'document' is the 'parentNode' of 'body'
	// it is frequently sent to this function even
	// though it is not Element.
	var getComputedStyle, style = {
		// summary:
		//		This module defines the core dojo DOM style API.
	};
	if(has("webkit")){
		getComputedStyle = function(/*DomNode*/ node){
			var s;
			if(node.nodeType == 1){
				var dv = node.ownerDocument.defaultView;
				s = dv.getComputedStyle(node, null);
				if(!s && node.style){
					node.style.display = "";
					s = dv.getComputedStyle(node, null);
				}
			}
			return s || {};
		};
	}else if(has("ie") && (has("ie") < 9 || has("quirks"))){
		getComputedStyle = function(node){
			// IE (as of 7) doesn't expose Element like sane browsers
			// currentStyle can be null on IE8!
			return node.nodeType == 1 /* ELEMENT_NODE*/ && node.currentStyle ? node.currentStyle : {};
		};
	}else{
		getComputedStyle = function(node){
			return node.nodeType == 1 /* ELEMENT_NODE*/ ?
				node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
		};
	}
	style.getComputedStyle = getComputedStyle;
	/*=====
	style.getComputedStyle = function(node){
		// summary:
		//		Returns a "computed style" object.
		//
		// description:
		//		Gets a "computed style" object which can be used to gather
		//		information about the current state of the rendered node.
		//
		//		Note that this may behave differently on different browsers.
		//		Values may have different formats and value encodings across
		//		browsers.
		//
		//		Note also that this method is expensive.  Wherever possible,
		//		reuse the returned object.
		//
		//		Use the dojo.style() method for more consistent (pixelized)
		//		return values.
		//
		// node: DOMNode
		//		A reference to a DOM node. Does NOT support taking an
		//		ID string for speed reasons.
		// example:
		//	|	dojo.getComputedStyle(dojo.byId('foo')).borderWidth;
		//
		// example:
		//		Reusing the returned object, avoiding multiple lookups:
		//	|	var cs = dojo.getComputedStyle(dojo.byId("someNode"));
		//	|	var w = cs.width, h = cs.height;
		return; // CSS2Properties
	};
	=====*/

	var toPixel;
	if(!has("ie")){
		toPixel = function(element, value){
			// style values can be floats, client code may want
			// to round for integer pixels.
			return parseFloat(value) || 0;
		};
	}else{
		toPixel = function(element, avalue){
			if(!avalue){ return 0; }
			// on IE7, medium is usually 4 pixels
			if(avalue == "medium"){ return 4; }
			// style values can be floats, client code may
			// want to round this value for integer pixels.
			if(avalue.slice && avalue.slice(-2) == 'px'){ return parseFloat(avalue); }
			var s = element.style, rs = element.runtimeStyle, cs = element.currentStyle,
				sLeft = s.left, rsLeft = rs.left;
			rs.left = cs.left;
			try{
				// 'avalue' may be incompatible with style.left, which can cause IE to throw
				// this has been observed for border widths using "thin", "medium", "thick" constants
				// those particular constants could be trapped by a lookup
				// but perhaps there are more
				s.left = avalue;
				avalue = s.pixelLeft;
			}catch(e){
				avalue = 0;
			}
			s.left = sLeft;
			rs.left = rsLeft;
			return avalue;
		};
	}
	style.toPixelValue = toPixel;
	/*=====
	style.toPixelValue = function(node, value){
		// summary:
		//		converts style value to pixels on IE or return a numeric value.
		// node: DOMNode
		// value: String
		// returns: Number
	};
	=====*/

	// FIXME: there opacity quirks on FF that we haven't ported over. Hrm.

	var astr = "DXImageTransform.Microsoft.Alpha";
	var af = function(n, f){
		try{
			return n.filters.item(astr);
		}catch(e){
			return f ? {} : null;
		}
	};

	var _getOpacity =
		has("ie") < 9 || (has("ie") < 10 && has("quirks")) ? function(node){
			try{
				return af(node).Opacity / 100; // Number
			}catch(e){
				return 1; // Number
			}
		} :
		function(node){
			return getComputedStyle(node).opacity;
		};

	var _setOpacity =
		has("ie") < 9 || (has("ie") < 10 && has("quirks")) ? function(/*DomNode*/ node, /*Number*/ opacity){
			var ov = opacity * 100, opaque = opacity == 1;
			node.style.zoom = opaque ? "" : 1;

			if(!af(node)){
				if(opaque){
					return opacity;
				}
				node.style.filter += " progid:" + astr + "(Opacity=" + ov + ")";
			}else{
				af(node, 1).Opacity = ov;
			}

			// on IE7 Alpha(Filter opacity=100) makes text look fuzzy so disable it altogether (bug #2661),
			//but still update the opacity value so we can get a correct reading if it is read later.
			af(node, 1).Enabled = !opaque;

			if(node.tagName.toLowerCase() == "tr"){
				for(var td = node.firstChild; td; td = td.nextSibling){
					if(td.tagName.toLowerCase() == "td"){
						_setOpacity(td, opacity);
					}
				}
			}
			return opacity;
		} :
		function(node, opacity){
			return node.style.opacity = opacity;
		};

	var _pixelNamesCache = {
		left: true, top: true
	};
	var _pixelRegExp = /margin|padding|width|height|max|min|offset/; // |border
	function _toStyleValue(node, type, value){
		//TODO: should we really be doing string case conversion here? Should we cache it? Need to profile!
		type = type.toLowerCase();
		if(has("ie")){
			if(value == "auto"){
				if(type == "height"){ return node.offsetHeight; }
				if(type == "width"){ return node.offsetWidth; }
			}
			if(type == "fontweight"){
				switch(value){
					case 700: return "bold";
					case 400:
					default: return "normal";
				}
			}
		}
		if(!(type in _pixelNamesCache)){
			_pixelNamesCache[type] = _pixelRegExp.test(type);
		}
		return _pixelNamesCache[type] ? toPixel(node, value) : value;
	}

	var _floatStyle = has("ie") ? "styleFloat" : "cssFloat",
		_floatAliases = {"cssFloat": _floatStyle, "styleFloat": _floatStyle, "float": _floatStyle};

	// public API

	style.get = function getStyle(/*DOMNode|String*/ node, /*String?*/ name){
		// summary:
		//		Accesses styles on a node.
		// description:
		//		Getting the style value uses the computed style for the node, so the value
		//		will be a calculated value, not just the immediate node.style value.
		//		Also when getting values, use specific style names,
		//		like "borderBottomWidth" instead of "border" since compound values like
		//		"border" are not necessarily reflected as expected.
		//		If you want to get node dimensions, use `dojo.marginBox()`,
		//		`dojo.contentBox()` or `dojo.position()`.
		// node: DOMNode|String
		//		id or reference to node to get style for
		// name: String?
		//		the style property to get
		// example:
		//		Passing only an ID or node returns the computed style object of
		//		the node:
		//	|	dojo.getStyle("thinger");
		// example:
		//		Passing a node and a style property returns the current
		//		normalized, computed value for that property:
		//	|	dojo.getStyle("thinger", "opacity"); // 1 by default

		var n = dom.byId(node), l = arguments.length, op = (name == "opacity");
		if(l == 2 && op){
			return _getOpacity(n);
		}
		name = _floatAliases[name] || name;
		var s = style.getComputedStyle(n);
		return (l == 1) ? s : _toStyleValue(n, name, s[name] || n.style[name]); /* CSS2Properties||String||Number */
	};

	style.set = function setStyle(/*DOMNode|String*/ node, /*String|Object*/ name, /*String?*/ value){
		// summary:
		//		Sets styles on a node.
		// node: DOMNode|String
		//		id or reference to node to set style for
		// name: String|Object
		//		the style property to set in DOM-accessor format
		//		("borderWidth", not "border-width") or an object with key/value
		//		pairs suitable for setting each property.
		// value: String?
		//		If passed, sets value on the node for style, handling
		//		cross-browser concerns.  When setting a pixel value,
		//		be sure to include "px" in the value. For instance, top: "200px".
		//		Otherwise, in some cases, some browsers will not apply the style.
		//
		// example:
		//		Passing a node, a style property, and a value changes the
		//		current display of the node and returns the new computed value
		//	|	dojo.setStyle("thinger", "opacity", 0.5); // == 0.5
		//
		// example:
		//		Passing a node, an object-style style property sets each of the values in turn and returns the computed style object of the node:
		//	|	dojo.setStyle("thinger", {
		//	|		"opacity": 0.5,
		//	|		"border": "3px solid black",
		//	|		"height": "300px"
		//	|	});
		//
		// example:
		//		When the CSS style property is hyphenated, the JavaScript property is camelCased.
		//		font-size becomes fontSize, and so on.
		//	|	dojo.setStyle("thinger",{
		//	|		fontSize:"14pt",
		//	|		letterSpacing:"1.2em"
		//	|	});
		//
		// example:
		//		dojo/NodeList implements .style() using the same syntax, omitting the "node" parameter, calling
		//		dojo.style() on every element of the list. See: `dojo.query()` and `dojo/NodeList`
		//	|	dojo.query(".someClassName").style("visibility","hidden");
		//	|	// or
		//	|	dojo.query("#baz > div").style({
		//	|		opacity:0.75,
		//	|		fontSize:"13pt"
		//	|	});

		var n = dom.byId(node), l = arguments.length, op = (name == "opacity");
		name = _floatAliases[name] || name;
		if(l == 3){
			return op ? _setOpacity(n, value) : n.style[name] = value; // Number
		}
		for(var x in name){
			style.set(node, x, name[x]);
		}
		return style.getComputedStyle(n);
	};

	return style;
});

},
'dojo/dom-geometry':function(){
define(["./sniff", "./_base/window","./dom", "./dom-style"],
		function(has, win, dom, style){
	// module:
	//		dojo/dom-geometry

	// the result object
	var geom = {
		// summary:
		//		This module defines the core dojo DOM geometry API.
	};

	// Box functions will assume this model.
	// On IE/Opera, BORDER_BOX will be set if the primary document is in quirks mode.
	// Can be set to change behavior of box setters.

	// can be either:
	//	"border-box"
	//	"content-box" (default)
	geom.boxModel = "content-box";

	// We punt per-node box mode testing completely.
	// If anybody cares, we can provide an additional (optional) unit
	// that overrides existing code to include per-node box sensitivity.

	// Opera documentation claims that Opera 9 uses border-box in BackCompat mode.
	// but experiments (Opera 9.10.8679 on Windows Vista) indicate that it actually continues to use content-box.
	// IIRC, earlier versions of Opera did in fact use border-box.
	// Opera guys, this is really confusing. Opera being broken in quirks mode is not our fault.

	if(has("ie") /*|| has("opera")*/){
		// client code may have to adjust if compatMode varies across iframes
		geom.boxModel = document.compatMode == "BackCompat" ? "border-box" : "content-box";
	}

	geom.getPadExtents = function getPadExtents(/*DomNode*/ node, /*Object*/ computedStyle){
		// summary:
		//		Returns object with special values specifically useful for node
		//		fitting.
		// description:
		//		Returns an object with `w`, `h`, `l`, `t` properties:
		//	|		l/t/r/b = left/top/right/bottom padding (respectively)
		//	|		w = the total of the left and right padding
		//	|		h = the total of the top and bottom padding
		//		If 'node' has position, l/t forms the origin for child nodes.
		//		The w/h are used for calculating boxes.
		//		Normally application code will not need to invoke this
		//		directly, and will use the ...box... functions instead.
		// node: DOMNode
		// computedStyle: Object?
		//		This parameter accepts computed styles object.
		//		If this parameter is omitted, the functions will call
		//		dojo.getComputedStyle to get one. It is a better way, calling
		//		dojo.computedStyle once, and then pass the reference to this
		//		computedStyle parameter. Wherever possible, reuse the returned
		//		object of dojo/dom-style.getComputedStyle().

		node = dom.byId(node);
		var s = computedStyle || style.getComputedStyle(node), px = style.toPixelValue,
			l = px(node, s.paddingLeft), t = px(node, s.paddingTop), r = px(node, s.paddingRight), b = px(node, s.paddingBottom);
		return {l: l, t: t, r: r, b: b, w: l + r, h: t + b};
	};

	var none = "none";

	geom.getBorderExtents = function getBorderExtents(/*DomNode*/ node, /*Object*/ computedStyle){
		// summary:
		//		returns an object with properties useful for noting the border
		//		dimensions.
		// description:
		//		- l/t/r/b = the sum of left/top/right/bottom border (respectively)
		//		- w = the sum of the left and right border
		//		- h = the sum of the top and bottom border
		//
		//		The w/h are used for calculating boxes.
		//		Normally application code will not need to invoke this
		//		directly, and will use the ...box... functions instead.
		// node: DOMNode
		// computedStyle: Object?
		//		This parameter accepts computed styles object.
		//		If this parameter is omitted, the functions will call
		//		dojo.getComputedStyle to get one. It is a better way, calling
		//		dojo.computedStyle once, and then pass the reference to this
		//		computedStyle parameter. Wherever possible, reuse the returned
		//		object of dojo/dom-style.getComputedStyle().

		node = dom.byId(node);
		var px = style.toPixelValue, s = computedStyle || style.getComputedStyle(node),
			l = s.borderLeftStyle != none ? px(node, s.borderLeftWidth) : 0,
			t = s.borderTopStyle != none ? px(node, s.borderTopWidth) : 0,
			r = s.borderRightStyle != none ? px(node, s.borderRightWidth) : 0,
			b = s.borderBottomStyle != none ? px(node, s.borderBottomWidth) : 0;
		return {l: l, t: t, r: r, b: b, w: l + r, h: t + b};
	};

	geom.getPadBorderExtents = function getPadBorderExtents(/*DomNode*/ node, /*Object*/ computedStyle){
		// summary:
		//		Returns object with properties useful for box fitting with
		//		regards to padding.
		// description:
		//		- l/t/r/b = the sum of left/top/right/bottom padding and left/top/right/bottom border (respectively)
		//		- w = the sum of the left and right padding and border
		//		- h = the sum of the top and bottom padding and border
		//
		//		The w/h are used for calculating boxes.
		//		Normally application code will not need to invoke this
		//		directly, and will use the ...box... functions instead.
		// node: DOMNode
		// computedStyle: Object?
		//		This parameter accepts computed styles object.
		//		If this parameter is omitted, the functions will call
		//		dojo.getComputedStyle to get one. It is a better way, calling
		//		dojo.computedStyle once, and then pass the reference to this
		//		computedStyle parameter. Wherever possible, reuse the returned
		//		object of dojo/dom-style.getComputedStyle().

		node = dom.byId(node);
		var s = computedStyle || style.getComputedStyle(node),
			p = geom.getPadExtents(node, s),
			b = geom.getBorderExtents(node, s);
		return {
			l: p.l + b.l,
			t: p.t + b.t,
			r: p.r + b.r,
			b: p.b + b.b,
			w: p.w + b.w,
			h: p.h + b.h
		};
	};

	geom.getMarginExtents = function getMarginExtents(node, computedStyle){
		// summary:
		//		returns object with properties useful for box fitting with
		//		regards to box margins (i.e., the outer-box).
		//
		//		- l/t = marginLeft, marginTop, respectively
		//		- w = total width, margin inclusive
		//		- h = total height, margin inclusive
		//
		//		The w/h are used for calculating boxes.
		//		Normally application code will not need to invoke this
		//		directly, and will use the ...box... functions instead.
		// node: DOMNode
		// computedStyle: Object?
		//		This parameter accepts computed styles object.
		//		If this parameter is omitted, the functions will call
		//		dojo.getComputedStyle to get one. It is a better way, calling
		//		dojo.computedStyle once, and then pass the reference to this
		//		computedStyle parameter. Wherever possible, reuse the returned
		//		object of dojo/dom-style.getComputedStyle().

		node = dom.byId(node);
		var s = computedStyle || style.getComputedStyle(node), px = style.toPixelValue,
			l = px(node, s.marginLeft), t = px(node, s.marginTop), r = px(node, s.marginRight), b = px(node, s.marginBottom);
		return {l: l, t: t, r: r, b: b, w: l + r, h: t + b};
	};

	// Box getters work in any box context because offsetWidth/clientWidth
	// are invariant wrt box context
	//
	// They do *not* work for display: inline objects that have padding styles
	// because the user agent ignores padding (it's bogus styling in any case)
	//
	// Be careful with IMGs because they are inline or block depending on
	// browser and browser mode.

	// Although it would be easier to read, there are not separate versions of
	// _getMarginBox for each browser because:
	// 1. the branching is not expensive
	// 2. factoring the shared code wastes cycles (function call overhead)
	// 3. duplicating the shared code wastes bytes

	geom.getMarginBox = function getMarginBox(/*DomNode*/ node, /*Object*/ computedStyle){
		// summary:
		//		returns an object that encodes the width, height, left and top
		//		positions of the node's margin box.
		// node: DOMNode
		// computedStyle: Object?
		//		This parameter accepts computed styles object.
		//		If this parameter is omitted, the functions will call
		//		dojo.getComputedStyle to get one. It is a better way, calling
		//		dojo.computedStyle once, and then pass the reference to this
		//		computedStyle parameter. Wherever possible, reuse the returned
		//		object of dojo/dom-style.getComputedStyle().

		node = dom.byId(node);
		var s = computedStyle || style.getComputedStyle(node), me = geom.getMarginExtents(node, s),
			l = node.offsetLeft - me.l, t = node.offsetTop - me.t, p = node.parentNode, px = style.toPixelValue, pcs;
		if(has("mozilla")){
			// Mozilla:
			// If offsetParent has a computed overflow != visible, the offsetLeft is decreased
			// by the parent's border.
			// We don't want to compute the parent's style, so instead we examine node's
			// computed left/top which is more stable.
			var sl = parseFloat(s.left), st = parseFloat(s.top);
			if(!isNaN(sl) && !isNaN(st)){
				l = sl;
				t = st;
			}else{
				// If child's computed left/top are not parseable as a number (e.g. "auto"), we
				// have no choice but to examine the parent's computed style.
				if(p && p.style){
					pcs = style.getComputedStyle(p);
					if(pcs.overflow != "visible"){
						l += pcs.borderLeftStyle != none ? px(node, pcs.borderLeftWidth) : 0;
						t += pcs.borderTopStyle != none ? px(node, pcs.borderTopWidth) : 0;
					}
				}
			}
		}else if(has("opera") || (has("ie") == 8 && !has("quirks"))){
			// On Opera and IE 8, offsetLeft/Top includes the parent's border
			if(p){
				pcs = style.getComputedStyle(p);
				l -= pcs.borderLeftStyle != none ? px(node, pcs.borderLeftWidth) : 0;
				t -= pcs.borderTopStyle != none ? px(node, pcs.borderTopWidth) : 0;
			}
		}
		return {l: l, t: t, w: node.offsetWidth + me.w, h: node.offsetHeight + me.h};
	};

	geom.getContentBox = function getContentBox(node, computedStyle){
		// summary:
		//		Returns an object that encodes the width, height, left and top
		//		positions of the node's content box, irrespective of the
		//		current box model.
		// node: DOMNode
		// computedStyle: Object?
		//		This parameter accepts computed styles object.
		//		If this parameter is omitted, the functions will call
		//		dojo.getComputedStyle to get one. It is a better way, calling
		//		dojo.computedStyle once, and then pass the reference to this
		//		computedStyle parameter. Wherever possible, reuse the returned
		//		object of dojo/dom-style.getComputedStyle().

		// clientWidth/Height are important since the automatically account for scrollbars
		// fallback to offsetWidth/Height for special cases (see #3378)
		node = dom.byId(node);
		var s = computedStyle || style.getComputedStyle(node), w = node.clientWidth, h,
			pe = geom.getPadExtents(node, s), be = geom.getBorderExtents(node, s);
		if(!w){
			w = node.offsetWidth;
			h = node.offsetHeight;
		}else{
			h = node.clientHeight;
			be.w = be.h = 0;
		}
		// On Opera, offsetLeft includes the parent's border
		if(has("opera")){
			pe.l += be.l;
			pe.t += be.t;
		}
		return {l: pe.l, t: pe.t, w: w - pe.w - be.w, h: h - pe.h - be.h};
	};

	// Box setters depend on box context because interpretation of width/height styles
	// vary wrt box context.
	//
	// The value of boxModel is used to determine box context.
	// boxModel can be set directly to change behavior.
	//
	// Beware of display: inline objects that have padding styles
	// because the user agent ignores padding (it's a bogus setup anyway)
	//
	// Be careful with IMGs because they are inline or block depending on
	// browser and browser mode.
	//
	// Elements other than DIV may have special quirks, like built-in
	// margins or padding, or values not detectable via computedStyle.
	// In particular, margins on TABLE do not seems to appear
	// at all in computedStyle on Mozilla.

	function setBox(/*DomNode*/ node, /*Number?*/ l, /*Number?*/ t, /*Number?*/ w, /*Number?*/ h, /*String?*/ u){
		// summary:
		//		sets width/height/left/top in the current (native) box-model
		//		dimensions. Uses the unit passed in u.
		// node:
		//		DOM Node reference. Id string not supported for performance
		//		reasons.
		// l:
		//		left offset from parent.
		// t:
		//		top offset from parent.
		// w:
		//		width in current box model.
		// h:
		//		width in current box model.
		// u:
		//		unit measure to use for other measures. Defaults to "px".
		u = u || "px";
		var s = node.style;
		if(!isNaN(l)){
			s.left = l + u;
		}
		if(!isNaN(t)){
			s.top = t + u;
		}
		if(w >= 0){
			s.width = w + u;
		}
		if(h >= 0){
			s.height = h + u;
		}
	}

	function isButtonTag(/*DomNode*/ node){
		// summary:
		//		True if the node is BUTTON or INPUT.type="button".
		return node.tagName.toLowerCase() == "button" ||
			node.tagName.toLowerCase() == "input" && (node.getAttribute("type") || "").toLowerCase() == "button"; // boolean
	}

	function usesBorderBox(/*DomNode*/ node){
		// summary:
		//		True if the node uses border-box layout.

		// We could test the computed style of node to see if a particular box
		// has been specified, but there are details and we choose not to bother.

		// TABLE and BUTTON (and INPUT type=button) are always border-box by default.
		// If you have assigned a different box to either one via CSS then
		// box functions will break.

		return geom.boxModel == "border-box" || node.tagName.toLowerCase() == "table" || isButtonTag(node); // boolean
	}

	geom.setContentSize = function setContentSize(/*DomNode*/ node, /*Object*/ box, /*Object*/ computedStyle){
		// summary:
		//		Sets the size of the node's contents, irrespective of margins,
		//		padding, or borders.
		// node: DOMNode
		// box: Object
		//		hash with optional "w", and "h" properties for "width", and "height"
		//		respectively. All specified properties should have numeric values in whole pixels.
		// computedStyle: Object?
		//		This parameter accepts computed styles object.
		//		If this parameter is omitted, the functions will call
		//		dojo.getComputedStyle to get one. It is a better way, calling
		//		dojo.computedStyle once, and then pass the reference to this
		//		computedStyle parameter. Wherever possible, reuse the returned
		//		object of dojo/dom-style.getComputedStyle().

		node = dom.byId(node);
		var w = box.w, h = box.h;
		if(usesBorderBox(node)){
			var pb = geom.getPadBorderExtents(node, computedStyle);
			if(w >= 0){
				w += pb.w;
			}
			if(h >= 0){
				h += pb.h;
			}
		}
		setBox(node, NaN, NaN, w, h);
	};

	var nilExtents = {l: 0, t: 0, w: 0, h: 0};

	geom.setMarginBox = function setMarginBox(/*DomNode*/ node, /*Object*/ box, /*Object*/ computedStyle){
		// summary:
		//		sets the size of the node's margin box and placement
		//		(left/top), irrespective of box model. Think of it as a
		//		passthrough to setBox that handles box-model vagaries for
		//		you.
		// node: DOMNode
		// box: Object
		//		hash with optional "l", "t", "w", and "h" properties for "left", "right", "width", and "height"
		//		respectively. All specified properties should have numeric values in whole pixels.
		// computedStyle: Object?
		//		This parameter accepts computed styles object.
		//		If this parameter is omitted, the functions will call
		//		dojo.getComputedStyle to get one. It is a better way, calling
		//		dojo.computedStyle once, and then pass the reference to this
		//		computedStyle parameter. Wherever possible, reuse the returned
		//		object of dojo/dom-style.getComputedStyle().

		node = dom.byId(node);
		var s = computedStyle || style.getComputedStyle(node), w = box.w, h = box.h,
		// Some elements have special padding, margin, and box-model settings.
		// To use box functions you may need to set padding, margin explicitly.
		// Controlling box-model is harder, in a pinch you might set dojo/dom-geometry.boxModel.
			pb = usesBorderBox(node) ? nilExtents : geom.getPadBorderExtents(node, s),
			mb = geom.getMarginExtents(node, s);
		if(has("webkit")){
			// on Safari (3.1.2), button nodes with no explicit size have a default margin
			// setting an explicit size eliminates the margin.
			// We have to swizzle the width to get correct margin reading.
			if(isButtonTag(node)){
				var ns = node.style;
				if(w >= 0 && !ns.width){
					ns.width = "4px";
				}
				if(h >= 0 && !ns.height){
					ns.height = "4px";
				}
			}
		}
		if(w >= 0){
			w = Math.max(w - pb.w - mb.w, 0);
		}
		if(h >= 0){
			h = Math.max(h - pb.h - mb.h, 0);
		}
		setBox(node, box.l, box.t, w, h);
	};

	// =============================
	// Positioning
	// =============================

	geom.isBodyLtr = function isBodyLtr(/*Document?*/ doc){
		// summary:
		//		Returns true if the current language is left-to-right, and false otherwise.
		// doc: Document?
		//		Optional document to query.   If unspecified, use win.doc.
		// returns: Boolean

		doc = doc || win.doc;
		return (win.body(doc).dir || doc.documentElement.dir || "ltr").toLowerCase() == "ltr"; // Boolean
	};

	geom.docScroll = function docScroll(/*Document?*/ doc){
		// summary:
		//		Returns an object with {node, x, y} with corresponding offsets.
		// doc: Document?
		//		Optional document to query.   If unspecified, use win.doc.
		// returns: Object

		doc = doc || win.doc;
		var node = win.doc.parentWindow || win.doc.defaultView;   // use UI window, not dojo.global window.   TODO: use dojo/window::get() except for circular dependency problem
		return "pageXOffset" in node ? {x: node.pageXOffset, y: node.pageYOffset } :
			(node = has("quirks") ? win.body(doc) : doc.documentElement) &&
				{x: geom.fixIeBiDiScrollLeft(node.scrollLeft || 0, doc), y: node.scrollTop || 0 };
	};

	if(has("ie")){
		geom.getIeDocumentElementOffset = function getIeDocumentElementOffset(/*Document?*/ doc){
			// summary:
			//		returns the offset in x and y from the document body to the
			//		visual edge of the page for IE
			// doc: Document?
			//		Optional document to query.   If unspecified, use win.doc.
			// description:
			//		The following values in IE contain an offset:
			//	|		event.clientX
			//	|		event.clientY
			//	|		node.getBoundingClientRect().left
			//	|		node.getBoundingClientRect().top
			//		But other position related values do not contain this offset,
			//		such as node.offsetLeft, node.offsetTop, node.style.left and
			//		node.style.top. The offset is always (2, 2) in LTR direction.
			//		When the body is in RTL direction, the offset counts the width
			//		of left scroll bar's width.  This function computes the actual
			//		offset.

			//NOTE: assumes we're being called in an IE browser

			doc = doc || win.doc;
			var de = doc.documentElement; // only deal with HTML element here, position() handles body/quirks

			if(has("ie") < 8){
				var r = de.getBoundingClientRect(), // works well for IE6+
					l = r.left, t = r.top;
				if(has("ie") < 7){
					l += de.clientLeft;	// scrollbar size in strict/RTL, or,
					t += de.clientTop;	// HTML border size in strict
				}
				return {
					x: l < 0 ? 0 : l, // FRAME element border size can lead to inaccurate negative values
					y: t < 0 ? 0 : t
				};
			}else{
				return {
					x: 0,
					y: 0
				};
			}
		};
	}

	geom.fixIeBiDiScrollLeft = function fixIeBiDiScrollLeft(/*Integer*/ scrollLeft, /*Document?*/ doc){
		// summary:
		//		In RTL direction, scrollLeft should be a negative value, but IE
		//		returns a positive one. All codes using documentElement.scrollLeft
		//		must call this function to fix this error, otherwise the position
		//		will offset to right when there is a horizontal scrollbar.
		// scrollLeft: Number
		// doc: Document?
		//		Optional document to query.   If unspecified, use win.doc.
		// returns: Number

		// In RTL direction, scrollLeft should be a negative value, but IE
		// returns a positive one. All codes using documentElement.scrollLeft
		// must call this function to fix this error, otherwise the position
		// will offset to right when there is a horizontal scrollbar.

		doc = doc || win.doc;
		var ie = has("ie");
		if(ie && !geom.isBodyLtr(doc)){
			var qk = has("quirks"),
				de = qk ? win.body(doc) : doc.documentElement,
				pwin = win.global;	// TODO: use winUtils.get(doc) after resolving circular dependency b/w dom-geometry.js and dojo/window.js
			if(ie == 6 && !qk && pwin.frameElement && de.scrollHeight > de.clientHeight){
				scrollLeft += de.clientLeft; // workaround ie6+strict+rtl+iframe+vertical-scrollbar bug where clientWidth is too small by clientLeft pixels
			}
			return (ie < 8 || qk) ? (scrollLeft + de.clientWidth - de.scrollWidth) : -scrollLeft; // Integer
		}
		return scrollLeft; // Integer
	};

	geom.position = function(/*DomNode*/ node, /*Boolean?*/ includeScroll){
		// summary:
		//		Gets the position and size of the passed element relative to
		//		the viewport (if includeScroll==false), or relative to the
		//		document root (if includeScroll==true).
		//
		// description:
		//		Returns an object of the form:
		//		`{ x: 100, y: 300, w: 20, h: 15 }`.
		//		If includeScroll==true, the x and y values will include any
		//		document offsets that may affect the position relative to the
		//		viewport.
		//		Uses the border-box model (inclusive of border and padding but
		//		not margin).  Does not act as a setter.
		// node: DOMNode|String
		// includeScroll: Boolean?
		// returns: Object

		node = dom.byId(node);
		var	db = win.body(node.ownerDocument),
			ret = node.getBoundingClientRect();
		ret = {x: ret.left, y: ret.top, w: ret.right - ret.left, h: ret.bottom - ret.top};

		if(has("ie") < 9){
			// On IE<9 there's a 2px offset that we need to adjust for, see dojo.getIeDocumentElementOffset()
			var offset = geom.getIeDocumentElementOffset(node.ownerDocument);

			// fixes the position in IE, quirks mode
			ret.x -= offset.x + (has("quirks") ? db.clientLeft + db.offsetLeft : 0);
			ret.y -= offset.y + (has("quirks") ? db.clientTop + db.offsetTop : 0);
		}

		// account for document scrolling
		// if offsetParent is used, ret value already includes scroll position
		// so we may have to actually remove that value if !includeScroll
		if(includeScroll){
			var scroll = geom.docScroll(node.ownerDocument);
			ret.x += scroll.x;
			ret.y += scroll.y;
		}

		return ret; // Object
	};

	// random "private" functions wildly used throughout the toolkit

	geom.getMarginSize = function getMarginSize(/*DomNode*/ node, /*Object*/ computedStyle){
		// summary:
		//		returns an object that encodes the width and height of
		//		the node's margin box
		// node: DOMNode|String
		// computedStyle: Object?
		//		This parameter accepts computed styles object.
		//		If this parameter is omitted, the functions will call
		//		dojo.getComputedStyle to get one. It is a better way, calling
		//		dojo.computedStyle once, and then pass the reference to this
		//		computedStyle parameter. Wherever possible, reuse the returned
		//		object of dojo/dom-style.getComputedStyle().

		node = dom.byId(node);
		var me = geom.getMarginExtents(node, computedStyle || style.getComputedStyle(node));
		var size = node.getBoundingClientRect();
		return {
			w: (size.right - size.left) + me.w,
			h: (size.bottom - size.top) + me.h
		};
	};

	geom.normalizeEvent = function(event){
		// summary:
		//		Normalizes the geometry of a DOM event, normalizing the pageX, pageY,
		//		offsetX, offsetY, layerX, and layerX properties
		// event: Object
		if(!("layerX" in event)){
			event.layerX = event.offsetX;
			event.layerY = event.offsetY;
		}
		if(! 1 ){
			// old IE version
			// FIXME: scroll position query is duped from dojo.html to
			// avoid dependency on that entire module. Now that HTML is in
			// Base, we should convert back to something similar there.
			var se = event.target;
			var doc = (se && se.ownerDocument) || document;
			// DO NOT replace the following to use dojo.body(), in IE, document.documentElement should be used
			// here rather than document.body
			var docBody = has("quirks") ? doc.body : doc.documentElement;
			var offset = geom.getIeDocumentElementOffset(doc);
			event.pageX = event.clientX + geom.fixIeBiDiScrollLeft(docBody.scrollLeft || 0, doc) - offset.x;
			event.pageY = event.clientY + (docBody.scrollTop || 0) - offset.y;
		}
	};

	// TODO: evaluate separate getters/setters for position and sizes?

	return geom;
});

},
'dojo/domReady':function(){
define("dojo/domReady", ['./has'], function(has){
	var global = this,
		doc = document,
		readyStates = { 'loaded': 1, 'complete': 1 },
		fixReadyState = typeof doc.readyState != "string",
		ready = !!readyStates[doc.readyState];

	// For FF <= 3.5
	if(fixReadyState){ doc.readyState = "loading"; }

	if(!ready){
		var readyQ = [], tests = [],
			detectReady = function(evt){
				evt = evt || global.event;
				if(ready || (evt.type == "readystatechange" && !readyStates[doc.readyState])){ return; }
				ready = 1;

				// For FF <= 3.5
				if(fixReadyState){ doc.readyState = "complete"; }

				while(readyQ.length){
					(readyQ.shift())(doc);
				}
			},
			on = function(node, event){
				node.addEventListener(event, detectReady, false);
				readyQ.push(function(){ node.removeEventListener(event, detectReady, false); });
			};

		if(! 1 ){
			on = function(node, event){
				event = "on" + event;
				node.attachEvent(event, detectReady);
				readyQ.push(function(){ node.detachEvent(event, detectReady); });
			};

			var div = doc.createElement("div");
			try{
				if(div.doScroll && global.frameElement === null){
					// the doScroll test is only useful if we're in the top-most frame
					tests.push(function(){
						// Derived with permission from Diego Perini's IEContentLoaded
						// http://javascript.nwbox.com/IEContentLoaded/
						try{
							div.doScroll("left");
							return 1;
						}catch(e){}
					});
				}
			}catch(e){}
		}

		on(doc, "DOMContentLoaded");
		on(global, "load");

		if("onreadystatechange" in doc){
			on(doc, "readystatechange");
		}else if(!fixReadyState){
			// if the ready state property exists and there's
			// no readystatechange event, poll for the state
			// to change
			tests.push(function(){
				return readyStates[doc.readyState];
			});
		}

		if(tests.length){
			var poller = function(){
				if(ready){ return; }
				var i = tests.length;
				while(i--){
					if(tests[i]()){
						detectReady("poller");
						return;
					}
				}
				setTimeout(poller, 30);
			};
			poller();
		}
	}

	function domReady(callback){
		// summary:
		//		Plugin to delay require()/define() callback from firing until the DOM has finished loading.
		if(ready){
			callback(doc);
		}else{
			readyQ.push(callback);
		}
	}
	domReady.load = function(id, req, load){
		domReady(load);
	};

	return domReady;
});

},
'frozen/ResourceManager':function(){
/**
 * The ResourceManager handles loading images and sounds for use in games.
 * @name ResourceManager
 * @constructor ResourceManager
 */

define("frozen/ResourceManager", [
  './sounds/Sound!',
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  'dojo/on'
], function(Sound, dcl, Mixer, lang, on){

  'use strict';

  // TODO: move this to its own module for unit testing?
  function normalizePath(baseDir, path){
    var joinedPath = path;
    if(baseDir){
      joinedPath = [baseDir, path].join('/');
    }
    return joinedPath.replace(/\/{2,}/g, '/');
  }

  return dcl(Mixer, {
    /**
     * The number of images requested
     * @type {Number}
     * @memberOf ResourceManager#
     * @default
     * @deprecated This property is no longer used internally and will be removed in the future
     */
    imageCount: 0,
    /**
     * The number of images loaded
     * @type {Number}
     * @memberOf ResourceManager#
     * @default
     * @deprecated This property is no longer used internally and will be removed in the future
     */
    loadedImages: 0,
    /**
     * Whether all the resources have been loaded
     * @type {Boolean}
     * @memberOf ResourceManager#
     * @default
     */
    allLoaded: false,
    /**
     * The base directory to load images from
     * @type {String}
     * @memberOf ResourceManager#
     * @default
     */
    imageDir: null,
    /**
     * The base directory to load sounds from
     * @type {String}
     * @memberOf ResourceManager#
     * @default
     */
    soundDir: null,
    /**
     * A map of all the resources by their URLs
     * @type {Object}
     * @memberOf ResourceManager#
     * @default
     */
    resourceList: {},

    /**
     * Loads an image (or a collection of images), and tracks if it has finished loading
     * @function
     * @memberOf ResourceManager#
     * @param {String|Array|Object} files Filename of the image relative the Game's HTML page.
     * @returns {Image|Array|Object} Return type based on argument: Image if String, Array of Images if Array, or Object of key-Image pairs if Object
     */
    loadImage: function(files){
      var singleFile = false;
      // Normalize arguments
      if(!Array.isArray(files)){
        if(typeof files === 'string'){
          singleFile = true;
          files = [files];
        } else if(typeof files !== 'object'){
          return;
        }
      }

      for(var key in files){
        if(!files.hasOwnProperty(key)){
          continue;
        }
        var filename = normalizePath(this.imageDir, files[key]);

        //if we already have the image, just return it
        if(this.resourceList[filename]){
          files[key] = this.resourceList[filename].img;
          continue;
        }

        this.allLoaded = false;

        var img = new Image();
        var imgWrapper = {
          name: filename,
          img: img,
          complete: false
        };

        var imageComplete = lang.partial(function(imgWrapper, evt){
          imgWrapper.complete = true;
        }, imgWrapper);
        on(img, 'load', imageComplete);
        img.src = filename;

        this.resourceList[filename] = imgWrapper;
        files[key] = img;
      }

      return singleFile ? files[0] : files;
    },

    /**
     * Loads a sound file (or a collection of sound files), and tracks if it has finished loading
     * @function
     * @memberOf ResourceManager#
     * @param {String|Array|Object} filename Filename of the sound relative the Game's HTML page.
     * @returns {Sound Object|Array|Object} Return type based on argument: Sound Object if String, Array of Sound Objects if Array, or Object of key-Sound Object pairs if Object
     */
    loadSound: function(files){
      var singleFile = false;
      // Normalize arguments
      if(!Array.isArray(files)){
        if(typeof files === 'string'){
          singleFile = true;
          files = [files];
        } else if(typeof files !== 'object'){
          return;
        }
      }

      for(var key in files){
        if(!files.hasOwnProperty(key)){
          continue;
        }
        var filename = normalizePath(this.soundDir, files[key]);

        //if we already have the sound, just return it
        if(this.resourceList[filename]){
          files[key] = this.resourceList[filename];
          continue;
        }

        this.allLoaded = false;

        var sound = new Sound(filename);
        this.resourceList[filename] = sound;

        files[key] = sound;
      }
      return singleFile ? files[0] : files;
    },

    /**
     * Plays a sound that was loaded from loadSound()
     * @function
     * @memberOf ResourceManager#
     * @param {Object} sound A sound object that was returned from loadSound()
     * @param {Boolean=} loop whether or not to loop the sound (default: false)
     * @param {Number=} noteOn The number of milliseconds from the beginning of the sound file to start (default: zero)
     * @param {Number=} gain The volume of the playback from 0 to 1.0
     * @deprecated This method is no longer needed because sounds have play() on them directly and it will be removed in the future
     */
    playSound: function(sound, loop, noteOn, gain){
      if(sound){
        if(loop){
          sound.loop(gain);
        } else {
          noteOn = noteOn || 0;
          sound.play(gain, noteOn);
        }
      }
    },

    /**
     * Checks whether the resources have finished loading
     * @function
     * @memberOf ResourceManager#
     */
    resourcesReady: function(){
      if(this.allLoaded){
        return true;
      }else{
        for(var filename in this.resourceList){
          var resource = this.resourceList[filename];
          if(!resource.complete){
            return false;
          }
        }
        this.allLoaded = true;
        return true;
      }
    },

    /**
     * Gets the percent of resources loaded.
     * @function
     * @memberOf ResourceManager#
     * @return {Number} The percent of resources loaded
     */
    getPercentComplete: function(){
      var numComplete = 0.0;
      var length = 0;
      for(var filename in this.resourceList){
        var resource = this.resourceList[filename];
        length++;
        if(resource.complete){
          numComplete = numComplete + 1.0;
        }
      }
      if(length === 0){
        return 0;
      }else{
        return Math.round((numComplete / length) * 100.0);
      }
    }
  });

});

},
'frozen/sounds/Sound':function(){
/**
 * AMD Plugin to load the correct Sound object
 * @module sounds/Sound
 * @example
 * define("frozen/sounds/Sound", [
 *   'frozen/sounds/Sound!'
 * ], function(Sound){
 *
 *   // Use the generic sound object API here - the correct Sound object will be used
 *
 * });
 */

define([
  './AudioBase',
  './WebAudio',
  './HTML5Audio',
  'dojo/has'
], function(AudioBase, WebAudio, HTML5Audio, has){

  'use strict';

  return {
    load: function(id, parentRequire, loaded, config){
      if(has('WebAudio')){
        return loaded(WebAudio);
      }

      if(has('HTML5Audio')){
        return loaded(HTML5Audio);
      }

      return loaded(AudioBase);
    }
  };

});
},
'frozen/sounds/AudioBase':function(){
/**
 * An Audio object that implements a generic API
 * @name AudioBase
 * @constructor AudioBase
 */

define("frozen/sounds/AudioBase", [
  'dcl'
], function(dcl){

  'use strict';

  return dcl(null, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf AudioBase#
     * @default
     */
    declaredClass: 'frozen/sounds/AudioBase',
    /**
     * The name of the Audio object - typically the filename
     * @type {String}
     * @memberOf AudioBase#
     * @default
     */
    name: null,
    /**
     * Signals if the Audio object has completed loading
     * @type {Boolean}
     * @memberOf AudioBase#
     * @default
     */
    complete: false,

    constructor: function(filename){
      if(typeof filename === 'string'){
        this.load(filename);
      }
    },

    /**
     * Load the sound by filename
     * @function
     * @memberOf AudioBase#
     * @param  {String} filename The filename of the file to load
     */
    load: function(filename){
      this.name = filename;
      this.complete = true;
    },

    /**
     * Loop the sound at a certain volume
     * @function
     * @memberOf AudioBase#
     * @param  {Number} volume Value of volume - between 0 and 1
     */
    loop: function(volume){},

    /**
     * Play the sound at a certain volume and start time
     * @function
     * @memberOf AudioBase#
     * @param  {Number} volume    Value of volume - between 0 and 1
     * @param  {Number} startTime Value of milliseconds into the track to start
     */
    play: function(volume, startTime){},

    /**
     * Method used to construct Audio objects internally
     * @function
     * @memberOf AudioBase#
     * @private
     * @param  {Number} volume Value of volume - between 0 and 1
     * @param  {Boolean} loop Whether or not to loop audio
     * @return {Audio} Audio object that was constructed
     */
    _initAudio: function(volume, loop){}
  });

});
},
'frozen/sounds/WebAudio':function(){
/**
 * An Audio object that implements WebAudio into a generic API
 * @name WebAudio
 * @constructor WebAudio
 * @extends AudioBase
 */

define("frozen/sounds/WebAudio", [
  './AudioBase',
  'dcl',
  'dojo/on',
  'dojo/has',
  'dojo/_base/lang',
  '../shims/AudioContext'
], function(AudioBase, dcl, on, has, lang){

  'use strict';

  has.add('WebAudio', function(global){
    return !!global.AudioContext;
  });

  var audioContext = null;
  if(has('WebAudio')){
    audioContext = new window.AudioContext();
  }

  return dcl(AudioBase, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf WebAudio#
     * @default
     */
    declaredClass: 'frozen/sounds/WebAudio',
    /**
     * The WebAudio AudioContext - used to perform operations on a sound
     * @type {AudioContext}
     * @memberOf WebAudio#
     * @default
     */
    audioContext: audioContext,
    /**
     * The sound buffer
     * @type {Buffer}
     * @memberOf WebAudio#
     * @default
     */
    buffer: null,

    load: function(filename){
      this.name = filename;

      var decodeAudioData = lang.partial(function(self, evt){
        // Decode asynchronously
        self.audioContext.decodeAudioData(this.response,
          function(buffer){
            self.buffer = buffer;
            self.complete = true;
          },
          function(err){
            console.info('error loading sound', err);
          }
        );
      }, this);

      //if the browser AudioContext, it's new enough for XMLHttpRequest
      var request = new XMLHttpRequest();
      request.open('GET', filename, true);
      request.responseType = 'arraybuffer';

      on(request, 'load', decodeAudioData);
      request.send();
    },

    loop: function(volume){
      var audio = this._initAudio(volume, true);
      audio.noteOn(0);
    },

    play: function(volume, startTime){
      startTime = startTime || 0;

      var audio = this._initAudio(volume, false);
      audio.noteOn(startTime);
    },

    _initAudio: function(volume, loop){
      loop = typeof loop === 'boolean' ? loop : false;

      var source = this.audioContext.createBufferSource();
      source.buffer = this.buffer;
      source.loop = loop;
      if(volume){
        var gainNode = this.audioContext.createGainNode();
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
      } else {
        source.connect(this.audioContext.destination);
      }
      return source;
    }
  });

});
},
'frozen/shims/AudioContext':function(){
define("frozen/shims/AudioContext", function(){

  'use strict';

  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for(var x = 0; x < vendors.length && !window.AudioContext; ++x) {
    window.AudioContext = window[vendors[x]+'AudioContext'];
  }

});
},
'frozen/sounds/HTML5Audio':function(){
/**
 * An Audio object that implements HTML5 Audio into a generic API
 * @name HTML5Audio
 * @constructor HTML5Audio
 * @extends AudioBase
 */

define("frozen/sounds/HTML5Audio", [
  './AudioBase',
  'dcl',
  'dojo/on',
  'dojo/has',
  'dojo/_base/lang'
], function(AudioBase, dcl, on, has, lang){

  'use strict';

  has.add('HTML5Audio', function(global){
    return !!global.Audio;
  });

  has.add('shittySound', (has('ios') || has('android')) && has('webkit'));

  return dcl(AudioBase, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf HTML5Audio#
     * @default
     */
    declaredClass: 'frozen/sounds/HTML5Audio',
    /**
     * The initial Audio object - used to load the sound prior to playing
     * @type {Audio}
     * @memberOf HTML5Audio#
     * @default
     */
    audio: null,

    load: function(filename){
      this.name = filename;

      this.audio = new Audio();
      if(has('shittySound')){
        on.once(document, 'touchstart', lang.hitch(this, function(e){
          this.audio.load();
        }));
        this._updateCurrentTime = null;
        on.once(this.audio, 'progress', lang.hitch(this, function(){
          if(this._updateCurrentTime !== null){
            this._updateCurrentTime();
          }
        }));
      }

      this.audio.pause();
      this.audio.preload = 'auto';
      on.once(this.audio, 'loadeddata, error', lang.hitch(this, function(e){
        this.complete = true;
      }));
      this.audio.src = filename;
    },

    loop: function(volume){
      var audio = this._initAudio(volume, true);
      on(audio, 'loadeddata', function(e){
        audio.play();
      });
    },

    play: function(volume, startTime){
      startTime = startTime || 0;

      if(has('shittySound')){
        try {
          this.audio.currentTime = startTime / 1000;
          return this.audio.play();
        } catch(err){
          this._updateCurrentTime = function(){
            this._updateCurrentTime = null;
            this.audio.currentTime = startTime / 1000;
            return this.audio.play();
          };
          return this.audio.play();
        }
      }

      var audio = this._initAudio(volume, false);
      on(audio, 'loadeddata', function(e){
        audio.currentTime = startTime / 1000;
        audio.play();
      });
    },

    _initAudio: function(volume, loop){
      loop = typeof loop === 'boolean' ? loop : false;

      var audio = new Audio();
      audio.pause();
      audio.volume = volume || 1;
      audio.loop = loop;
      audio.preload = 'auto';
      if(audio.mozLoadFrom){
        audio.mozLoadFrom(this.audio);
      } else {
        audio.src = this.name;
      }
      return audio;
    }
  });

});
},
'frozen/shims/RAF':function(){
define("frozen/shims/RAF", function(){

  'use strict';

  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame){
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame){
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

});
},
'frozen/box2d/CircleEntity':function(){
/**
 * This represents a Circle body and shape in a Box2d world
 * @name CircleEntity
 * @constructor CircleEntity
 * @extends Entity
 */

define("frozen/box2d/CircleEntity", [
  'dcl',
  'dcl/bases/Mixer',
  './Entity',
  '../utils/distance'
], function(dcl, Mixer, Entity, distance){

  'use strict';

  return dcl([Mixer, Entity], {
    /**
     * The radius of this circle.
     * @type {Number}
     * @memberOf CircleEntity#
     * @default
     */
    radius: 1,

    /**
     * Draws the CircleEntity at a given scale
     * @function
     * @memberOf CircleEntity#
     * @param {Context} ctx The drawing context
     * @param {Number} scale The scale at which to draw
     */
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        scale = scale || this.scale || 1;
        var ogLineWidth = ctx.lineWidth;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.beginPath();
        ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if(!this.staticBody){
          ctx.save();
          ctx.translate(this.x * scale, this.y * scale);
          ctx.rotate(this.angle);
          ctx.translate(-(this.x) * scale, -(this.y) * scale);
          ctx.beginPath();
          ctx.moveTo(this.x * scale, this.y * scale);
          ctx.lineTo(this.x * scale, (this.y * scale) - (this.radius * scale));
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
        ctx.lineWidth = ogLineWidth;
        sup.apply(this, [ctx, scale]);
      };
    }),

    /**
     * Scale this shape
     * @function
     * @memberOf CircleEntity#
     * @param {Number} scale The amount the shape should scale
     */
    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.radius = this.radius * scale;
        sup.apply(this, [scale]);
      };
    }),

    /**
     * Checks if a given point is contained within this Circle.
     * @function
     * @memberOf CircleEntity#
     * @param {Object} point An object with x and y values.
     * @return {Boolean} True if point is in shape else false
     */
    pointInShape: function(point){
      return (distance(point, this) <= this.radius);
    }
  });

});
},
'frozen/box2d/Entity':function(){
/**
 * This represents a body and shape in a Box2d world using positions and sizes relative to the Box2d world instance.
 * @name Entity
 * @constructor Entity
 */

define("frozen/box2d/Entity", [
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang'
], function(dcl, Mixer, lang){

  'use strict';

  return dcl(Mixer, {
    /**
     * The id in which to reference this object. Also the userData property for box2d bodies.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    id: 0,
    /**
     * The x component of the entity's location
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    x: 0,
    /**
     * The y component of the entity's location
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    y: 0,
    /**
     * The scale in pixels per meter in which to represent this Entity in the box2d world
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    scale: null,
    /**
     * The current angle that this entity is rotated at
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    angle: 0,
    /**
     * The x and y locations of what box2d considers the enity's center of mass
     * @type {Point}
     * @memberOf Entity#
     * @default
     */
    center: null,
    /**
     * The percentage of force in which the entity will bounce back from another based on its force pre-collision
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    restitution: 0.3,
    /**
     * The two-dimensional density of the entity.  Mass / area.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    density: 1.0,
    /**
     * The amount of friction on th surface of this entity
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    friction: 0.9,
    /**
     * The amount of linear velocity the entity should lose over time
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    linearDamping: 0,
    /**
     * The velocity in meters/second given to this entity by box2d calculations
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    linearVelocity: null,
    /**
     * The angular velocity in radians/second given to this entity by box2d calculations
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    angularVelocity: 0,
    /**
     * The of amount of angular velocity an entity should lose over time
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    angularDamping: 0,
    /**
     * If true, the entity does change its position and angle as the result of box2d calculations
     * @type {Boolean}
     * @memberOf Entity#
     * @default
     */
    staticBody: false,
    /**
     * The fillStyle to use for the entity's default renderer
     * @type {String}
     * @memberOf Entity#
     * @default
     */
    fillStyle: 'rgba(128,128,128,0.5)',
    /**
     * The strokeStyle to use for the entity's default renderer
     * @type {String}
     * @memberOf Entity#
     * @default
     */
    strokeStyle: '#000',
    /**
     * The line width to use for the entity's default renderer
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    lineWidth: 1,
    /**
     * Whether to render this object
     * @type {Boolean}
     * @memberOf Entity#
     * @default
     * @deprecated This property is no longer used and will be removed in the future
     */
    hidden: false,
    /* Used for collision filtering */
    /**
     * The 16 bit integer used in determining which other types of entities this body will collide with.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    maskBits: null,
    /**
     * The 16 bit integer used in describing the type that this enitity is for collisions.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    categoryBits: null,
    /**
     * The 16 bit integer used in overiding maskBits and categoryBits for collision detection.
     * @type {Number}
     * @memberOf Entity#
     * @default
     */
    groupIndex: null,

    /**
     * Update this entity with the state passed in
     * @function
     * @memberOf Entity#
     * @param {Object} state State to merge with this object
     */
    update: function(state){
      lang.mixin(this, state);
    },

    /**
     * Draws the Entity at a given scale
     * @function
     * @memberOf Entity#
     * @param {2dContext} ctx The HTML5 2d drawing context
     * @param {Number} scale The scale to draw the entity at
     */
    draw: function(ctx, scale){
      scale = scale || this.scale || 1;
      var ogLineWidth = ctx.lineWidth;
      ctx.lineWidth = this.lineWidth;
      // black circle in entity's location
      ctx.fillStyle = this.strokeStyle;
      ctx.beginPath();
      ctx.arc(this.x * scale, this.y * scale, 4, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();

      // yellow circle in entity's geometric center
      if(this.center){
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.center.x * scale, this.center.y * scale, 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      }

      ctx.lineWidth = ogLineWidth;
    },

    /**
     * Scales the position and dimensions of this shape.
     * @function
     * @memberOf Entity#
     * @param {Number} scale The scale to multiply the dimentions by
     */
    scaleShape: function(scale){
      this.x = this.x * scale;
      this.y = this.y * scale;
      this.alreadyScaled = true;
    }

  });

});
},
'frozen/utils/distance':function(){
define("frozen/utils/distance", function(){

  'use strict';

  return function(p1, p2){
    return Math.sqrt( ((p2.x - p1.x) * (p2.x - p1.x)) + ((p2.y - p1.y) * (p2.y - p1.y)) );
  };

});
},
'frozen/box2d/PolygonEntity':function(){
/**
 * This Entity represents a polygon which is build from an array of points.
 * @name PolygonEntity
 * @constructor PolygonEntity
 * @extends Entity
 */

define("frozen/box2d/PolygonEntity", [
  'dcl',
  'dcl/bases/Mixer',
  './Entity',
  '../utils/scalePoints',
  '../utils/pointInPolygon',
  '../utils/translatePoints'
], function(dcl, Mixer, Entity, scalePoints, pointInPolygon, translatePoints){

  'use strict';

  return dcl([Mixer, Entity], {
    /**
     * An array of objects that have x and y values.
     * @type {Array}
     * @memberOf PolygonEntity#
     * @default
     */
    points: [],

    /**
     * Draws the PolygonEntity at a given scale
     * @function
     * @memberOf PolygonEntity#
     * @param {Context} ctx The drawing context
     * @param {Number} scale The scale at which to draw
     */
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        scale = scale || this.scale || 1;
        var ogLineWidth = ctx.lineWidth;
        ctx.lineWidth = this.lineWidth;
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x) * scale, -(this.y) * scale);
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;

        ctx.beginPath();
        ctx.moveTo((this.x + this.points[0].x) * scale, (this.y + this.points[0].y) * scale);
        for (var i = 1; i < this.points.length; i++) {
           ctx.lineTo((this.points[i].x + this.x) * scale, (this.points[i].y + this.y) * scale);
        }
        ctx.lineTo((this.x + this.points[0].x) * scale, (this.y + this.points[0].y) * scale);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        ctx.lineWidth = ogLineWidth;
        sup.apply(this, [ctx, scale]);
      };
    }),

    /**
     * Scale this shape
     * @function
     * @memberOf PolygonEntity#
     * @param {Number} scale The amount the shape should scale
     */
    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.points = scalePoints(this.points, scale);
        sup.apply(this, [scale]);
      };
    }),

    /**
     * Checks if a given point is contained within this Polygon.
     * @function
     * @memberOf PolygonEntity#
     * @param {Object} point An object with x and y values.
     * @return {Boolean} True if point is in shape else false
     */
    pointInShape: function(point){
      return pointInPolygon(point, translatePoints(this.points, this));
    }
  });

});
},
'frozen/utils/scalePoints':function(){
define("frozen/utils/scalePoints", function(){

  'use strict';

  function scalePoints(points, scale){
    if(Array.isArray(points)){
      var newPoints = [];
      // TODO: move this to a faster forEach, possibly lo-dash's
      points.forEach(function(point){
        newPoints.push(scalePoints(point, scale));
      });
      points = newPoints;
    } else if(typeof scale === 'object'){
      points = {
        x: points.x * scale.x,
        y: points.y * scale.y
      };
    } else {
      points = {
        x: points.x * scale,
        y: points.y * scale
      };
    }
    return points;
  }

  return scalePoints;

});
},
'frozen/utils/pointInPolygon':function(){
define("frozen/utils/pointInPolygon", function(){

  'use strict';

  // Using Ray-Casting formula based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  // and https://github.com/substack/point-in-polygon/
  // Re-written for most readability and for use with point objects instead of arrays

  function pointInPoly(point, polygon){
    if(!point || !polygon){
      return false;
    }

    var poly = polygon.points || polygon;

    var insidePoly = false;
    var j = poly.length - 1;

    for(var i = 0; i < poly.length; j = i++){
      var xi = poly[i].x;
      var yi = poly[i].y;
      var xj = poly[j].x;
      var yj = poly[j].y;

      if(yi > point.y !== yj > point.y){
        if(point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi){
          insidePoly = !insidePoly;
        }
      }
    }

    return insidePoly;
  }

  return pointInPoly;
});
},
'frozen/utils/translatePoints':function(){
/*jshint eqnull:true */
define("frozen/utils/translatePoints", function(){

  'use strict';

  function translatePoints(points, translation){
    if(Array.isArray(points)){
      var newPoints = [];
      // TODO: move this to a faster forEach, possibly lo-dash's
      points.forEach(function(point){
        newPoints.push(translatePoints(point, translation));
      });
      points = newPoints;
    } else {
      points = {
        x: points.x,
        y: points.y
      };

      if(translation.x != null){
        points.x += translation.x;
      }

      if(translation.y != null){
        points.y += translation.y;
      }
    }
    return points;
  }

  return translatePoints;

});
},
'frozen/box2d/MultiPolygonEntity':function(){
/**
 * This Entity is for building complex and possibly concave shapes
 * @name MultiPolygonEntity
 * @constructor MultiPolygonEntity
 * @extends Entity
 */

define("frozen/box2d/MultiPolygonEntity", [
  'dcl',
  'dcl/bases/Mixer',
  './Entity',
  '../utils/scalePoints',
  '../utils/pointInPolygon',
  '../utils/translatePoints'
], function(dcl, Mixer, Entity, scalePoints, pointInPolygon, translatePoints){

  'use strict';

  return dcl([Mixer, Entity], {
    /**
     * An array of polygons
     * @type {Array}
     * @memberOf MultiPolygonEntity#
     * @default
     */
    polys: [],

    /**
     * Draws each polygon in the entity
     * @function
     * @memberOf MultiPolygonEntity#
     * @param {2dContext} ctx the HTML5 2d drawing context
     * @param {Number} scale the scale to draw the entity at
     */
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        scale = scale || this.scale || 1;
        var ogLineWidth = ctx.lineWidth;
        ctx.lineWidth = this.lineWidth;
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x) * scale, -(this.y) * scale);
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;

        for(var j = 0; j < this.polys.length; j++){
          ctx.beginPath();
          ctx.moveTo((this.x + this.polys[j][0].x) * scale, (this.y + this.polys[j][0].y) * scale);
          for (var i = 1; i < this.polys[j].length; i++) {
             ctx.lineTo((this.polys[j][i].x + this.x) * scale, (this.polys[j][i].y + this.y) * scale);
          }
          ctx.lineTo((this.x + this.polys[j][0].x) * scale, (this.y + this.polys[j][0].y) * scale);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
        ctx.lineWidth = ogLineWidth;
        sup.apply(this, [ctx, scale]);
      };
    }),

    /**
     * Scale this shape
     * @function
     * @memberOf MultiPolygonEntity#
     * @param {Number} scale The amount the shape should scale
     */
    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.polys = scalePoints(this.polys, scale);
        sup.apply(this, [scale]);
      };
    }),

    /**
     * Checks if a given point is contained within this MultiPolygon.
     * @function
     * @memberOf MultiPolygonEntity#
     * @param {Object} point An object with x and y values.
     * @return {Boolean} True if point is in shape else false
     */
    pointInShape: function(point){
      for(var j = 0; j < this.polys.length; j++){
        if(pointInPolygon(point, translatePoints(this.polys[j], this))){
          return true;
        }
      }
      return false;
    }
  });

});
},
'frozen/box2d/RectangleEntity':function(){
/**
 * This Entity represents a Rectangle
 * @name RectangleEntity
 * @constructor RectangleEntity
 * @extends Entity
 */

define("frozen/box2d/RectangleEntity", [
  'dcl',
  'dcl/bases/Mixer',
  './Entity'
], function(dcl, Mixer, Entity){

  'use strict';

  return dcl([Mixer, Entity], {
    /**
     * Half of the Rectangle's total width
     * @type {Number}
     * @memberOf RectangleEntity#
     * @default
     */
    halfWidth: 1,
    /**
     * Half of the Rectangle's total width
     * @type {Number}
     * @memberOf RectangleEntity#
     * @default
     */
    halfHeight: 1,

    /**
     * Draws the RectangleEntity at a given scale
     * @function
     * @memberOf RectangleEntity#
     * @param {Context} ctx The drawing context
     * @param {Number} scale The scale at which to draw
     */
    draw: dcl.superCall(function(sup){
      return function(ctx, scale){
        scale = scale || this.scale || 1;
        var ogLineWidth = ctx.lineWidth;
        ctx.lineWidth = this.lineWidth;
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x) * scale, -(this.y) * scale);
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillRect(
          (this.x-this.halfWidth) * scale,
          (this.y-this.halfHeight) * scale,
          (this.halfWidth*2) * scale,
          (this.halfHeight*2) * scale
        );
        ctx.strokeRect(
          (this.x-this.halfWidth) * scale,
          (this.y-this.halfHeight) * scale,
          (this.halfWidth*2) * scale,
          (this.halfHeight*2) * scale
        );
        ctx.restore();
        ctx.lineWidth = ogLineWidth;
        sup.apply(this, [ctx, scale]);
      };
    }),

    /**
     * Scale this shape
     * @function
     * @memberOf RectangleEntity#
     * @param {Number} scale The amount the shape should scale
     */
    scaleShape: dcl.superCall(function(sup){
      return function(scale){
        this.halfHeight = this.halfHeight * scale;
        this.halfWidth = this.halfWidth * scale;
        sup.apply(this, [scale]);
      };
    }),

    /**
     * Checks if a given point is contained within this Rectangle.
     * @function
     * @memberOf RectangleEntity#
     * @param {Object} point An object with x and y values.
     * @return {Boolean} True if point is in shape else false
     */
    pointInShape: function(point){
      return ((point.x >= (this.x - this.halfWidth)) && (point.x <= (this.x + this.halfWidth)) && (point.y >= (this.y - this.halfHeight)) && (point.y <= (this.y + this.halfHeight)));
    }
  });

});
},
'frozen/box2d/joints/Joint':function(){
/**
 * This represents a joint between two bodies.
 * @name Joint
 * @constructor Joint
 */

define("frozen/box2d/joints/Joint", [
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    /**
     * The id of the first entity that will be attached to this joint
     * @type {String}
     * @memberOf Joint#
     * @default
     */
    bodyId1: null,
    /**
     * The id of the second entity that will be attached to this joint
     * @type {String}
     * @memberOf Joint#
     * @default
     */
    bodyId2: null,
    /**
     * A point on the first entity where be attached to the second body. If no point is specified, the first body will be attached at its center point.
     * @type {Object}
     * @memberOf Joint#
     * @default
     */
    bodyPoint1: null,
    /**
     * An object with any other properties that should be mixed into the box2d joint definition.
     * @type {Object}
     * @memberOf Joint#
     * @default
     */
    jointAttributes: null,

    /**
     * Scales the position that on the first body that the joint is connected at.
     * @function
     * @memberOf Joint#
     * @param {Number} scale the scale to multiply the dimentions by
     */
    scaleJointLocation: function(scale){
      if(scale && this.bodyPoint1){
        this.bodyPoint1.x = this.bodyPoint1.x * scale;
        this.bodyPoint1.y = this.bodyPoint1.y * scale;
        this.alreadyScaled = true;
      }
    }

  });

});
},
'frozen/box2d/joints/Revolute':function(){
/**
 * This represents a revolute joint between two bodies.
 * This allow for rotation of one body around a point of another.
 * @name Revolute
 * @constructor Revolute
 * @extends Joint
 */

define("frozen/box2d/joints/Revolute", [
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  './Joint'
], function(dcl, Mixer, lang, Joint){

  'use strict';

  // box2d globals
  var B2Vec2 = Box2D.Common.Math.b2Vec2;
  var B2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

  return dcl([Mixer, Joint], {

    /**
     * Creates and adds this joint in the Box2d world.
     * @function
     * @memberOf Revolute#
     * @param {Box} the box in which to create the joint.
     * @return {b2Joint} Joint created by box2d
     */
    createB2Joint: function(box){
      if(box && box.bodiesMap && box.b2World && box.jointsMap && !box.jointsMap[this.id]){
        var body1 = box.bodiesMap[this.bodyId1];
        var body2 = box.bodiesMap[this.bodyId2];
        if(body1 && body2){
          var vec1;
          if(this.bodyPoint1){
            vec1 = new B2Vec2(this.bodyPoint1.x, this.bodyPoint1.y);
          }
          vec1 = vec1 || body1.GetWorldCenter();
          var joint = new B2RevoluteJointDef();
          var axis;
          joint.Initialize(body1, body2, vec1, axis);

          if (this.jointAttributes) {
            lang.mixin(joint, this.jointAttributes);
          }
          return box.b2World.CreateJoint(joint);
        }
      }
    }

  });

});
},
'frozen/box2d/joints/Distance':function(){
/**
 * This represents a distance joint between two bodies.
 * This type of joint forces two bodies to keep a constant distance for each other.
 * @name Distance
 * @constructor Distance
 * @extends Joint
 */

define("frozen/box2d/joints/Distance", [
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  './Joint'
], function(dcl, Mixer, lang, Joint){

  'use strict';

  // box2d globals
  var B2Vec2 = Box2D.Common.Math.b2Vec2;
  var B2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;

  return dcl([Mixer, Joint], {
    /**
     * A point on the second entity where the joint will be attached. If no point is specified, the second body will be attached at its center point.
     * @type {Object}
     * @memberOf Distance#
     * @default
     */
    bodyPoint2: null,

    /**
     * Scales the positions bodies that the joint are connected at.
     * @function
     * @memberOf Distance#
     * @param {Number} scale the scale to multiply the dimentions by
     */
    scaleJointLocation: dcl.superCall(function(sup){
      return function(scale){
        if(scale && this.bodyPoint2){
          this.bodyPoint2.x = this.bodyPoint2.x * scale;
          this.bodyPoint2.y = this.bodyPoint2.y * scale;
          this.alreadyScaled = true;
        }
        sup.apply(this, [scale]);
      };
    }),

    /**
     * Creates and adds this joint in the Box2d world.
     * @function
     * @memberOf Distance#
     * @param {Box} the box in which to create the joint.
     * @return {b2Joint} Joint created by box2d
     */
    createB2Joint: function(box){
      if(box && box.bodiesMap && box.b2World && box.jointsMap && !box.jointsMap[this.id]){
        var body1 = box.bodiesMap[this.bodyId1];
        var body2 = box.bodiesMap[this.bodyId2];
        if(body1 && body2){
          var vec1, vec2;
          if(this.bodyPoint1){
            vec1 = new B2Vec2(this.bodyPoint1.x, this.bodyPoint1.y);
          }
          if(this.bodyPoint2){
            vec2 = new B2Vec2(this.bodyPoint2.x, this.bodyPoint2.y);
          }
          vec1 = vec1 || body1.GetWorldCenter();
          vec2 = vec2 || body2.GetWorldCenter();
          var joint = new B2DistanceJointDef();
          joint.Initialize(body1, body2, vec1, vec2);

          if (this.jointAttributes) {
            lang.mixin(joint, this.jointAttributes);
          }
          return box.b2World.CreateJoint(joint);
        }
      }
    }

  });

});
},
'frozen/box2d/joints/Prismatic':function(){
/**
 * This represents a prismatic joint between two bodies.
 * This type of joint forces a body to keep its angle rotation consitent with another body
 * @name Prismatic
 * @constructor Prismatic
 * @extends Joint
 */

define("frozen/box2d/joints/Prismatic", [
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  './Joint'
], function(dcl, Mixer, lang, Joint){

  'use strict';

  // box2d globals
  var B2Vec2 = Box2D.Common.Math.b2Vec2;
  var B2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

  return dcl([Mixer, Joint], {
    /**
     * An object with x and y numeric components representing the line in which the entities can move relative to each other
     * @type {Object}
     * @memberOf Prismatic#
     * @default
     */
    axisScale: null,

    /**
     * Creates and adds this joint in the Box2d world.
     * @function
     * @memberOf Prismatic#
     * @param {Box} the box in which to create the joint.
     * @return {b2Joint} Joint created by box2d
     */
    createB2Joint: function(box){
      if(box && box.bodiesMap && box.b2World && box.jointsMap && !box.jointsMap[this.id]){
        var body1 = box.bodiesMap[this.bodyId1];
        var body2 = box.bodiesMap[this.bodyId2];
        if(body1 && body2){
          var vec1;
          if(this.bodyPoint1){
            vec1 = new B2Vec2(this.bodyPoint1.x, this.bodyPoint1.y);
          }
          vec1 = vec1 || body1.GetWorldCenter();
          var joint = new B2PrismaticJointDef();
          var axis;
          if(this.axisScale){
            axis = new B2Vec2(this.axisScale.x, this.axisScale.y);
          }else{
            axis = new B2Vec2(1, 0);
          }
          joint.Initialize(body1, body2, vec1, axis);

          if (this.jointAttributes) {
            lang.mixin(joint, this.jointAttributes);
          }
          return box.b2World.CreateJoint(joint);
        }
      }
    }

  });

});
},
'frozen/reiner/Creature':function(){
/**
 * This type of sprite is based off of the excellent images from Reiner's tilesets: http://www.reinerstilesets.de/
 * <br>
 * creatures have walking, idle, and dying animations in 8 isometric directions
 * The animations directions are in E,N,NE,NW,S,SE,SW,W (alphabetical) order simply because that's
 * how they were stitched together using ImageMagick.
 *
 * @name Creature
 * @constructor Creature
 * @extends Sprite
 */

define("frozen/reiner/Creature", [
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  '../Sprite',
  '../Animation'
], function(dcl, Mixer, lang, Sprite, Animation){

  'use strict';

  return dcl([Mixer, Sprite], {
    /**
    * A map of static constants for internal use
    * @type {Object}
    * @memberOf Creature#
    * @property {Number} EAST a direction the creature can face
    * @property {Number} NORTH a direction the creature can face
    * @property {Number} NORTHEAST a direction the creature can face
    * @property {Number} NORTHWEST a direction the creature can face
    * @property {Number} SOUTH a direction the creature can face
    * @property {Number} SOUTHEAST a direction the creature can face
    * @property {Number} SOUTHWEST a direction the creature can face
    * @property {Number} WEST a direction the creature can face
    * @property {Number} STATE_WALKING a state the creature can be in
    * @property {Number} STATE_DYING a state the creature can be in
    * @property {Number} STATE_IDLE a state the creature can be in
    */
    statics: {
      EAST: 0,
      NORTH: 1,
      NORTHEAST: 2,
      NORTHWEST: 3,
      SOUTH: 4,
      SOUTHEAST: 5,
      SOUTHWEST: 6,
      WEST: 7,
      STATE_WALKING: 0,
      STATE_DYING: 1,
      STATE_IDLE: 2
    },
    /**
    * The current state of the creature. Will be a value from the static constants.
    * @type {Number}
    * @memberOf Creature#
    * @default
    */
    state: 0,
    /**
    * An array of Animation objects (one for each direction) to display the creature in a walking state
    * @type {Array}
    * @memberOf Creature#
    * @default
    */
    walkingAnims: [],
    /**
    * An array of Animation objects (one for each direction) to display the creature in a dying state
    * @type {Array}
    * @memberOf Creature#
    * @default
    */
    dyingAnims: [],
    /**
    * An array of Animation objects (one for each direction) to display the creature in an idle state
    * @type {Array}
    * @memberOf Creature#
    * @default
    */
    idleAnims: [],
    /**
    * The current direction that the creature is pointed. Will be a value from the static constansts.
    * @type {Number}
    * @memberOf Creature#
    * @default
    */
    direction: 0,
    constructor: function(){
      this.state = this.statics.STATE_IDLE;
      this.direction = this.statics.EAST;
    },
    /**
     * Updates this creature's current image (frame), and changes which animation it should be using if neccesary.
     * @function
     * @memberOf Creature#
     * @param {Number} elapsedTime Elapsed time in milliseconds
     */
    update: function(elapsedTime){
      this.x += this.dx * elapsedTime;
      this.y += this.dy * elapsedTime;

      if(this.state !== this.statics.STATE_DYING){
        if(this.dx > 0 && this.dy === 0){
          this.direction = this.statics.EAST;
        } else if(this.dx === 0 && this.dy < 0){
          this.direction = this.statics.NORTH;
        } else if(this.dx > 0 && this.dy < 0){
          this.direction = this.statics.NORTHEAST;
        } else if(this.dx < 0 && this.dy < 0){
          this.direction = this.statics.NORTHWEST;
        } else if(this.dx === 0 && this.dy > 0){
          this.direction = this.statics.SOUTH;
        } else if(this.dx > 0 && this.dy > 0){
          this.direction = this.statics.SOUTHEAST;
        } else if(this.dx < 0 && this.dy > 0){
          this.direction = this.statics.SOUTHWEST;
        } else if(this.dx < 0 && this.dy === 0){
          this.direction = this.statics.WEST;
        }

        if(this.dx === 0 && this.dy === 0){
          this.state = this.statics.STATE_IDLE;
        } else {
          this.state = this.statics.STATE_WALKING;
        }
      }

      if(this.state === this.statics.STATE_WALKING){
        this.anim = this.walkingAnims[this.direction];
      } else if(this.state === this.statics.STATE_DYING){
        this.anim = this.dyingAnims[this.direction];
      } else {
        this.anim = this.idleAnims[this.direction];
      }
      this.anim.update(elapsedTime);
    },
    /**
     * Used to create animations from a sheet of tiles
     * @function
     * @memberOf Creature#
     * @param  {Number} frameCount Number of frames in the animation
     * @param  {Number|Array} frameTimes Value or array of values corresponding to amount of time per frame
     * @param  {Image} img Image sheet to create animation from
     * @param  {Number} w Width of each tile in pixels
     * @param  {Number} h Height of each tile in pixels
     * @param  {Number} ySlot Slot on Y axis to start creating tiles
     * @return {Array} Array of Animations generated using parameters
     */
    createAnimations: function(frameCount, frameTimes, img, h, w, ySlot){
      var anims = [];
      var isFTArray = lang.isArray(frameTimes);
      var currentFrameTime = 1;
      if(!ySlot){
        ySlot = 0;
      }
      for(var i = 0; i < 8; i++){
        anims[i] = new Animation({
          height: h,
          width: w,
          image: img
        });
        for(var j = 0; j < frameCount; j++){
          if(isFTArray){
            currentFrameTime = frameTimes[j];
          } else {
            currentFrameTime = frameTimes;
          }
          anims[i].addFrame(currentFrameTime, j + frameCount * i, ySlot);
        }
      }
      return anims;
    }
  });

});
},
'frozen/Sprite':function(){
/**
 * The Sprite class represents a simple animated character for a game
 * @name Sprite
 * @constructor Sprite
 */

define("frozen/Sprite", [
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  var Sprite = dcl(Mixer, {
    /**
     * The x position of the sprite in pixels
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    x: 0.0,
    /**
     * The y position of the sprite in pixels
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    y: 0.0,
    /**
     * The x component of the velocity in pixels per second
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    dx: 0.0,
    /**
     * The y component of the velocity in pixels per second
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    dy: 0.0,
    /**
     * The name of this Sprite
     * @type {String}
     * @memberOf Sprite#
     * @default
     */
    name: null,
    /**
     * The radius of this sprite in pixels for simple collision detection
     * @type {Number}
     * @memberOf Sprite#
     * @default
     */
    collisionRadius: 40,

    /**
     * Updates this Sprite's Animation and its position based on the velocity.
     * @function
     * @memberOf Sprite#
     * @param {Number} elapsedTime The elapsed time in milliseconds since the previous update
     */
    update: function(elapsedTime){
      this.x += this.dx * elapsedTime;
      this.y += this.dy * elapsedTime;
      this.anim.update(elapsedTime);
    },

    /**
     * Retrieves the X value
     * @memberOf Sprite#
     * @return {Number} The X value
     * @deprecated This method is deprecated because the x property is available on Sprite and it will be removed in the future
     */
    getX: function(){
      return this.x;
    },

    /**
     * Retrieves the Y value
     * @memberOf Sprite#
     * @return {Number} The Y value
     * @deprecated This method is deprecated because the y property is available on Sprite and it will be removed in the future
     */
    getY: function(){
      return this.y;
    },

    /**
     * Sets the X value
     * @memberOf Sprite#
     * @param {Number} x The new X value
     * @deprecated This method is deprecated because the x property is available on Sprite and it will be removed in the future
     */
    setX: function(x){
      this.x = x;
    },

    /**
     * Sets the Y value
     * @memberOf Sprite#
     * @param {Number} y The new Y value
     * @deprecated This method is deprecated because the y property is available on Sprite and it will be removed in the future
     */
    setY: function(y){
      this.y = y;
    },

    /**
     * Gets this Sprite's width, based on the size of the current image.
     * @function
     * @memberOf Sprite#
     * @return {Number} Width of the animation image
     * @deprecated This method is deprecated because the anim property is available on Sprite and it will be removed in the future
     */
    getWidth: function(){
      return this.anim.width;
    },

    /**
     * Gets this Sprite's height, based on the size of the current image.
     * @function
     * @memberOf Sprite#
     * @return {Number} Height of the animation image
     * @deprecated This method is deprecated because the anim property is available on Sprite and it will be removed in the future
     */
    getHeight: function(){
      return this.anim.height;
    },

    /**
     * Gets the horizontal velocity of this Sprite in pixels per millisecond.
     * @function
     * @memberOf Sprite#
     * @return {Number} The dx value
     * @deprecated This method is deprecated because the dx property is available on Sprite and it will be removed in the future
     */
    getVelocityX: function(){
      return this.dx;
    },

    /**
     * Gets the vertical velocity of this Sprite in pixels per millisecond.
     * @function
     * @memberOf Sprite#
     * @return {Number} The dy value
     * @deprecated This method is deprecated because the dy property is available on Sprite and it will be removed in the future
     */
    getVelocityY: function(){
      return this.dy;
    },

    /**
     * Sets the horizontal velocity of this Sprite in pixels per millisecond.
     * @function
     * @memberOf Sprite#
     * @param {Number} dx The x velocity in pixels per millisecond
     * @deprecated This method is deprecated because the dx property is available on Sprite and it will be removed in the future
     */
    setVelocityX: function(dx){
      this.dx = this.limitSpeed(dx);
    },

    /**
     * Sets the vertical velocity of this Sprite in pixels per millisecond.
     * @function
     * @memberOf Sprite#
     * @param {Number} dy the y velocity in pixels per millisecond
     * @deprecated This method is deprecated because the dy property is available on Sprite and it will be removed in the future
     */
    setVelocityY: function(dy) {
      this.dy = this.limitSpeed(dy);
    },

    /**
     * Returns the maxSpeed up to the speed limit
     * @function
     * @memberOf Sprite#
     * @param {Number} v Speed limit
     * @return {Number} maxSpeed up to speed limit
     */
    limitSpeed: function(v){
      if(this.getMaxSpeed()){
        if(Math.abs(v) > this.getMaxSpeed()){
          if(v > 0){
            return this.getMaxSpeed();
          }else if(v < 0){
            return this.getMaxSpeed();
          }else{
            return  0;
          }
        }else{
          return v;
        }
      }else{
        return v;
      }
    },

    /**
     * Retrieves the maxSpeed
     * @function
     * @memberOf Sprite#
     * @return {Number} The maxSpeed
     * @deprecated This method is deprecated because the maxSpeed property is available on Sprite and it will be removed in the future
     */
    getMaxSpeed: function(){
      return this.maxSpeed;
    },

    /**
     * Gets this Sprite's current animation frame.
     * @function
     * @memberOf Sprite#
     * @return {AnimationFrame} The current frame of the Animation
     */
    getCurrentFrame: function(){
      if(this.anim){
        return this.anim.getCurrentFrame();
      }
    },

    /**
     * Deprecated drawing function
     * @function
     * @memberOf Sprite#
     * @param {2dContext} context The HTML5 drawing context
     * @deprecated This method is deprecated because it was replaced by draw() and it will be removed in the future
     */
    drawCurrentFrame: function(context){
      var cf = this.anim.getCurrentFrame();
      context.drawImage(this.anim.image, cf.imgSlotX * this.anim.width, cf.imgSlotY * this.anim.height, this.anim.width, this.anim.height, this.x,this.y, this.anim.width, this.anim.height);
    },

    /**
     * Draws the sprite
     * @function
     * @memberOf Sprite#
     * @param {2dContext} context The HTML5 drawing context
     */
    draw: function(context){
      if(this.anim){
        this.anim.draw(context, this.x, this.y);
      }
    },

    /**
     * Clones the instance of Sprite it is called upon
     * @function
     * @memberOf Sprite#
     * @return {Sprite} A clone of the Sprite
     */
    clone: function() {
      return new Sprite({
        anim: this.anim.clone()
      });
    }
  });

  return Sprite;

});
},
'frozen/Animation':function(){
/**
 * Represents a series of frames that can be rendered as an animation.
 * @name Animation
 * @constructor Animation
 */

define("frozen/Animation", [
  './AnimFrame',
  'dcl',
  'dcl/bases/Mixer'
], function(AnimFrame, dcl, Mixer){

  'use strict';

  var Animation = dcl(Mixer, {
    /**
     * The index of the current frame being used to render this Animation
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    currFrameIndex: 0,
    /**
     * The current number of milliseconds that this animation has been running
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    animTime: 0,
    /**
     * The total number of milliseconds for a complete cycle
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    totalDuration: 0,
    /**
     * The height in pixels
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    height: 64,
    /**
     * The width in pixels
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    width: 64,
    /**
     * The image to render
     * @type {Image}
     * @memberOf Animation#
     * @default
     */
    image: null,
    /**
     * The offset of the of pixels in the x slot from the source image
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    offsetX: 0,
    /**
     * The offset of the of pixels in the y slot from the source image
     * @type {Number}
     * @memberOf Animation#
     * @default
     */
    offsetY: 0,

    constructor: function(){
      this.start();
    },

    /**
     * Used to create an animation from a sheet of tiles
     * @function
     * @memberOf Animation#
     * @param  {Number} frameCount Number of frames in the animation
     * @param  {Number|Array} frameTimes Value or array of values corresponding to amount of time per frame
     * @param  {Image} img Image sheet to create animation from
     * @param  {Number} h Height of each tile in pixels
     * @param  {Number} w Width of each tile in pixels
     * @param  {Number} ySlot Slot on Y axis to start creating tiles
     * @return {Animation} Animation generated using parameters
     * @deprecated This method has been renamed createFromSheet and will be removed in the future
     */
    createFromTile: function(frameCount, frameTimes, img, h, w, ySlot){
      return this.createFromSheet(frameCount, frameTimes, img, w, h, ySlot);
    },

    /**
     * Used to create an animation from a sheet of tiles
     * @function
     * @memberOf Animation#
     * @param  {Number} frameCount Number of frames in the animation
     * @param  {Number|Array} frameTimes Value or array of values corresponding to amount of time per frame
     * @param  {Image} img Image sheet to create animation from
     * @param  {Number} w Width of each tile in pixels
     * @param  {Number} h Height of each tile in pixels
     * @param  {Number} ySlot Slot on Y axis to start creating tiles
     * @return {Animation} Animation generated using parameters
     */
    createFromSheet: function(frameCount, frameTimes, img, w, h, ySlot){
      var anim = new Animation({
        image: img,
        height: h,
        width: w
      });

      var isFTArray = Array.isArray(frameTimes);

      var currentFrameTime = 1;
      if(!ySlot){
        ySlot = 0;
      }
      for(var j = 0; j < frameCount; j++){
        if(isFTArray){
          currentFrameTime = frameTimes[j];
        } else {
          currentFrameTime = frameTimes;
        }
        anim.addFrame(currentFrameTime, j, ySlot);
      }
      return anim;
    },

    /**
     * Creates a duplicate of this animation. The list of frames
     * are shared between the two Animations, but each Animation
     * can be animated independently.
     * @function
     * @memberOf Animation#
     */
    clone: function(){
      return new Animation({
        image: this.image,
        frames: this.frames,
        totalDuration: this.totalDuration
      });
    },

    /**
     * Adds an image to the animation with the specified duration (time to display the image).
     * @function
     * @memberOf Animation#
     * @param {Number} duration Duration of the frame
     * @param {Number} imageSlotX Slot on the X axis for the frame
     * @param {Number} imageSlotY Slot on the Y axis for the frame
     */
    addFrame: function(duration, imageSlotX, imageSlotY){
      if(!this.frames){
        this.frames = [];
      }
      this.totalDuration += duration;
      this.frames.push(new AnimFrame({
        endTime: this.totalDuration,
        image: this.image,
        imgSlotX: imageSlotX,
        imgSlotY: imageSlotY
      }));
    },

    /**
     * Starts this animation over from the beginning.
     * @function
     * @memberOf Animation#
     */
    start: function(){
      this.animTime = 0;
      this.currFrameIndex = 0;
    },

    /**
     * Updates this animation's current image (frame), if neccesary.
     * @function
     * @memberOf Animation#
     * @param {Number} elapsedTime Elapsed time in milliseconds
     */
    update: function(elapsedTime){
      if (this.frames.length > 1) {
        this.animTime += elapsedTime;

        if (this.animTime >= this.totalDuration) {
          this.animTime = this.animTime % this.totalDuration;
          this.currFrameIndex = 0;
        }

        while (this.animTime > this.getFrame(this.currFrameIndex).endTime) {
          this.currFrameIndex++;
        }
      }
    },

    /**
     * Retrieves the image used to create the animation
     * @function
     * @memberOf Animation#
     * @return {Image} The image used to create the animation
     * @deprecated This method is deprecated because the image is available on the instance and will be removed in the future
     */
    getImage: function(){
      return this.image;
    },

    /**
     * Retrieves the frame at the given index
     * @function
     * @memberOf Animation#
     * @param  {Number} i Index to retrieve frame at
     * @return {AnimationFrame} The animation frame at the given index
     * @deprecated This method is deprecated because the frames are available on the instance and will be removed in the future
     */
    getFrame: function(i){
      return this.frames[i];
    },

    /**
     * Gets this Animation's current animation frame. Returns null if this animation has no frames.
     * @function
     * @memberOf Animation#
     * @return {AnimationFrame|null} The animation frame at the current frame index or null if no frames are available
     */
    getCurrentFrame: function(){
      if (this.frames.length === 0) {
        return null;
      } else {
        return this.getFrame(this.currFrameIndex);
      }
    },

    /**
     * Draws the current frame into a 2d context.
     * @function
     * @memberOf Animation#
     * @param {2dContext} context The HTML5 drawing canvas
     * @param {Number} x The x coordinate in the graphics context
     * @param {Number} y The y coordinate in the graphics context
     */
    draw: function(context, x, y){
      var cf = this.getCurrentFrame();
      context.drawImage(this.image, cf.imgSlotX * this.width + this.offsetX, cf.imgSlotY * this.height + this.offsetY, this.width, this.height, x, y, this.width, this.height);
    }
  });

  return Animation;

});
},
'frozen/AnimFrame':function(){
/**
 * Represents a a single frame in an animation.
 * @name AnimationFrame
 * @constructor AnimationFrame
 * @param {Object} mixin Object containing properties to mixin
 */

define("frozen/AnimFrame", [
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    /**
     * The ending time in milliseconds of this frame relative to its Animation
     * @type {Number}
     * @memberOf AnimationFrame#
     * @default
     */
    endTime: 0,
    /**
     * The horizontal position of the group of frames contained in a single image
     * @type {Number}
     * @memberOf AnimationFrame#
     * @default
     */
    imgSlotX: 0,
    /**
     * The vertical position of the group of frames contained in a single image
     * @type {Number}
     * @memberOf AnimationFrame#
     * @default
     */
    imgSlotY: 0,
    /**
     * The image to render
     * @type {Image}
     * @memberOf AnimationFrame#
     * @default
     */
    image: null
  });

});
},
'frozen/utils':function(){
define("frozen/utils", [
  './utils/averagePoints',
  './utils/degreesToRadians',
  './utils/radiansToDegrees',
  './utils/pointInPolygon',
  './utils/distance',
  './utils/degreesFromCenter',
  './utils/radiansFromCenter',
  './utils/scalePoints',
  './utils/translatePoints',
  './utils/insideCanvas'
], function(averagePoints, degreesToRadians, radiansToDegrees, pointInPolygon, distance, degreesFromCenter, radiansFromCenter, scalePoints, translatePoints, insideCanvas){

  'use strict';

  /**
   * Math utility libraries
   * @exports utils
   */
  var utils = {
    /**
     * Gets the average point value in an array of points.
     * @function
     * @param {Array} points
     * @return {Object} An object with x and y values
     */
    averagePoints: averagePoints,

    /**
     * Convert degrees to raidans
     * @function
     * @param {Number} degrees
     * @return {Number} A value in radians
     */
    degreesToRadians: degreesToRadians,

    /**
     * Convert radians to degrees
     * @function
     * @param {Number} radians
     * @return {Number} A value in degrees
     */
    radiansToDegrees: radiansToDegrees,

    /**
     * Checks if a point is in a polygon
     * @function
     * @param {Object} point Object with an x and y value
     * @param {Array} polygon Array of points
     * @return {Boolean} True if the point is inside the polygon
     */
    pointInPolygon: pointInPolygon,

    /**
     * Returns the distance between 2 points
     * @function
     * @param {Object} point1 Object with an x and y value
     * @param {Object} point2 Object with an x and y value
     * @return {Number} The distance
     */
    distance: distance,

    /**
     * Degrees a point is offset from a center point
     * @function
     * @param {Object} center Object with an x and y value
     * @param {Object} point Object with an x and y value
     * @return {Number} A value in degrees
     */
    degreesFromCenter: degreesFromCenter,

    /**
     * Radians a point is offset from a center point
     * @function
     * @param {Object} center Object with an x and y value
     * @param {Object} point Object with an x and y value
     * @return {Number} A value in radians
     */
    radiansFromCenter: radiansFromCenter,

    /**
     * Scale a point or array of points.
     * @function
     * @param {Object|Array} points A point or array of points
     * @param {Object} scale Object with an x and y value
     * @return {Object|Array} A scaled point or array of points
     */
    scalePoints: scalePoints,

    /**
     * Translate a point or array of points
     * @function
     * @param {Object|Array} points A point or array of points
     * @param {Object} offset Object with an x and y value
     * @return {Object|Array} A translated point or array of points
     */
    translatePoints: translatePoints,

    /**
     * Check whether a point is inside a canvas
     * @function
     * @param {Object} point A point to test
     * @param {Object} canvas Object with height and width properties
     * @return {Boolean} True if inside canvas else false
     */
    insideCanvas: insideCanvas
  };

  return utils;

});
},
'frozen/utils/averagePoints':function(){
define("frozen/utils/averagePoints", function(){

  'use strict';

  function averagePoints(points){
    var retVal = {x: 0, y: 0};
    //TODO use lodash forEach
    points.forEach(function(point){
      retVal.x+= point.x;
      retVal.y+= point.y;
    });
    retVal.x = retVal.x / points.length;
    retVal.y = retVal.y / points.length;
    return retVal;
  }

  return averagePoints;

});
},
'frozen/utils/degreesToRadians':function(){
define("frozen/utils/degreesToRadians", function(){

  'use strict';

  var radConst = Math.PI / 180.0;

  return function(degrees){
    return degrees * radConst;
  };

});
},
'frozen/utils/radiansToDegrees':function(){
define("frozen/utils/radiansToDegrees", function(){

  'use strict';

  var degConst = 180.0 / Math.PI;

  return function(radians){
    return radians * degConst;
  };

});
},
'frozen/utils/degreesFromCenter':function(){
define("frozen/utils/degreesFromCenter", [
  './radiansToDegrees',
  './radiansFromCenter'
], function(radiansToDegrees, radiansFromCenter){

  'use strict';

  return function(center, pt){
    return radiansToDegrees(radiansFromCenter(center, pt));
  };

});
},
'frozen/utils/radiansFromCenter':function(){
define("frozen/utils/radiansFromCenter", function(){

  'use strict';

  var origin = {x: 0.0, y: 0.0};
  return function(center, pt){

    //if null or zero is passed in for center, we'll use the origin
    center = center || origin;

    //same point
    if((center.x === pt.x) && (center.y === pt.y)){
      return 0;
    }else if(center.x === pt.x){
      if(center.y > pt.y){
        return 0;
      }else{
        return Math.PI;
      }
    }else if(center.y === pt.y){
      if(center.x > pt.x){
        return 1.5 * Math.PI;
      }else{
        return Math.PI / 2;
      }
    }else if((center.x < pt.x) && (center.y > pt.y)){
      //quadrant 1
      //console.log('quad1',center.x,center.y,pt.x,pt.y,'o',pt.x - center.x,'a',pt.y - center.y);
      return Math.atan((pt.x - center.x)/(center.y - pt.y));
    }
    else if((center.x < pt.x) && (center.y < pt.y)){
      //quadrant 2
      //console.log('quad2',center.x,center.y,pt.x,pt.y);
      return Math.PI / 2 + Math.atan((pt.y - center.y)/(pt.x - center.x));
    }
    else if((center.x > pt.x) && (center.y < pt.y)){
      //quadrant 3
      //console.log('quad3',center.x,center.y,pt.x,pt.y);
      return Math.PI + Math.atan((center.x - pt.x)/(pt.y - center.y));
    }
    else{
      //quadrant 4
      //console.log('quad4',center.x,center.y,pt.x,pt.y);
      return 1.5 * Math.PI + Math.atan((center.y - pt.y)/(center.x - pt.x));
    }

  };

});
},
'frozen/utils/parseString':function(){
define("frozen/utils/parseString", function(){

  'use strict';

  return function parseString(resource){
    if(resource.indexOf('{') === 0 && resource.lastIndexOf('}') === resource.length - 1){
      resource = JSON.parse(resource.replace(/,/g, '","').replace(/:(?!\/\/)/g, '":"').replace(/\{/, '{"').replace(/\}/, '"}'));
    } else if(resource.indexOf('[') === 0 && resource.lastIndexOf(']') === resource.length - 1){
      resource = JSON.parse(resource.replace(/,/g, '","').replace(/\[/g, '["').replace(/\]/g, '"]'));
    }

    return resource;
  };

});
},
'frozen/plugins/loadImage':function(){
/**
 * AMD Plugin for loading Images
 * @module plugins/loadImage
 * @example
 * define("frozen/plugins/loadImage", [
 *   'frozen/plugins/loadImage!someImage.png'
 * ], function(someImage){
 *
 *   // Use someImage
 *
 * });
 */

define([
  '../ResourceManager',
  '../utils/parseString'
], function(ResourceManager, parseString){

  'use strict';

  var rm = new ResourceManager();

  return {
    load: function(resource, req, callback, config){
      resource = parseString(resource);
      var res = rm.loadImage(resource);
      callback(res);
    }
  };
});
},
'frozen/plugins/loadSound':function(){
/**
 * AMD Plugin for loading Images
 * @module plugins/loadSound
 * @example
 * define("frozen/plugins/loadSound", [
 *   'frozen/plugins/loadSound!someSound.wav'
 * ], function(someSound){
 *
 *   // Use someSound
 *
 * });
 */


define([
  '../ResourceManager',
  '../utils/parseString'
], function(ResourceManager, parseString){

  'use strict';

  var rm = new ResourceManager();

  return {
    load: function(resource, req, callback, config){
      resource = parseString(resource);
      var res = rm.loadSound(resource);
      callback(res);
    }
  };
});
},
'dojo/keys':function(){
define(["./_base/kernel", "./sniff"], function(dojo, has){

	// module:
	//		dojo/keys

	return dojo.keys = {
		// summary:
		//		Definitions for common key values.  Client code should test keyCode against these named constants,
		//		as the actual codes can vary by browser.

		BACKSPACE: 8,
		TAB: 9,
		CLEAR: 12,
		ENTER: 13,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		META: has("webkit") ? 91 : 224,		// the apple key on macs
		PAUSE: 19,
		CAPS_LOCK: 20,
		ESCAPE: 27,
		SPACE: 32,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		LEFT_ARROW: 37,
		UP_ARROW: 38,
		RIGHT_ARROW: 39,
		DOWN_ARROW: 40,
		INSERT: 45,
		DELETE: 46,
		HELP: 47,
		LEFT_WINDOW: 91,
		RIGHT_WINDOW: 92,
		SELECT: 93,
		NUMPAD_0: 96,
		NUMPAD_1: 97,
		NUMPAD_2: 98,
		NUMPAD_3: 99,
		NUMPAD_4: 100,
		NUMPAD_5: 101,
		NUMPAD_6: 102,
		NUMPAD_7: 103,
		NUMPAD_8: 104,
		NUMPAD_9: 105,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_PLUS: 107,
		NUMPAD_ENTER: 108,
		NUMPAD_MINUS: 109,
		NUMPAD_PERIOD: 110,
		NUMPAD_DIVIDE: 111,
		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,
		F13: 124,
		F14: 125,
		F15: 126,
		NUM_LOCK: 144,
		SCROLL_LOCK: 145,
		UP_DPAD: 175,
		DOWN_DPAD: 176,
		LEFT_DPAD: 177,
		RIGHT_DPAD: 178,
		// virtual key mapping
		copyKey: has("mac") && !has("air") ? (has("safari") ? 91 : 224 ) : 17
	};
});

}}});
(function(){ require({cache:{}}); require.boot && require.apply(null, require.boot); })();