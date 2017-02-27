/*
QUICK.JS

Copyright 2016 Michael Krause

Licensed under the Apache License, Version 2.0 (the "License"); you may not use 
this file except in compliance with the License. You may obtain a copy of the 
License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed 
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
CONDITIONS OF ANY KIND, either express or implied. See the License for the 
specific language governing permissions and limitations under the License.
*/
var qk = new function(){

	var pages;
	var datas;
	var currentPage;

	this.go = function(args){
		main.go(args);
	};

	var protos = new function(){
		this.show = function(){
			this.style.display = "block";
		};
		this.hide = function(){
			this.style.display = "none";
		};
	};

	var nav = new function(){

		this.goto = function(to){
			pages[currentPage].hide();
			currentPage = main.pageById(to);
			pages[currentPage].show();
			history.pushState(null, null, "#"+to);
		};

	};

	var dataBind = new function(){

		/**********************************************START OBJECT.WATCH POLYFILL*************************/
		/*
		 * By Eli Grey, http://eligrey.com
		 * Public Domain.
		 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
		 */

		// object.watch
		if (!Object.prototype.watch) {
			Object.defineProperty(Object.prototype, "watch", {
				  enumerable: false
				, configurable: true
				, writable: false
				, value: function (prop, handler) {
					var
					  oldval = this[prop]
					, newval = oldval
					, getter = function () {
						return newval;
					}
					, setter = function (val) {
						oldval = newval;
						return newval = handler.call(this, prop, oldval, val);
					}
					;
					
					if (delete this[prop]) { // can't watch constants
						Object.defineProperty(this, prop, {
							  get: getter
							, set: setter
							, enumerable: true
							, configurable: true
						});
					}
				}
			});
		}

		// object.unwatch
		if (!Object.prototype.unwatch) {
			Object.defineProperty(Object.prototype, "unwatch", {
				  enumerable: false
				, configurable: true
				, writable: false
				, value: function (prop) {
					var val = this[prop];
					delete this[prop]; // remove accessors
					this[prop] = val;
				}
			});
		}

		/**********************************************END OBJECT.WATCH POLYFILL*************************/


		var varsBound = {};

		this.inputToBind = function(bindFrom){
			var pathToVar = bindFrom.getAttribute("qk-datato");
			var pathToParent = pathToVar.substring(0, pathToVar.lastIndexOf("."));
			var varname = pathToVar.substring(pathToVar.lastIndexOf(".")+1);
			var parent = parseDataSource(pathToParent, window);
			parent[varname] = bindFrom.value;
		};

		this.bind = function(bindTo, dataPath){
			var children = bindTo.childNodes;
			if(dataPath === undefined)
				dataPath = bindTo.getAttribute("qk-datafrom");
			for(var i = 0, l = children.length; i < l; i++){
				if(children[i].nodeName === "#text"){
					var unbound = children[i].data;
					var dataObj = parseDataSource(dataPath, window);
					var bound = getBoundString(dataObj, unbound, bindTo);
					children[i].data = bound;
				}
				else{
					this.bind(children[i], dataPath);
				}
			}
		};

		var registerVarToWatch = function(parent, value, element, unbound){
			parent.watch(String(value), function(varName, oldVal, newVal){
				varsBound[varName].e.innerHTML = varsBound[varName].u;
				setTimeout(dataBind.bind, 0, varsBound[varName].e);
				return newVal;
			});
			varsBound[String(value)] = {"e" : element, "u" : unbound};
		};

		var getBoundString = function(dataObj, unbound, element){
			var bound = "";
			var origUnbound = unbound;
			var toks = unbound.split("");

			var tokData = {"wasOpenBracket" : false, "inExp" : false, "wasCloseBracket" : false, "activePath" : ""};
			while(toks.length > 0){
				tok = toks.shift();
				if(tok === "["){
					if(tokData.wasOpenBracket){
						tokData.inExp = true;
						tokData.wasOpenBracket = false;
					}
					else{
						tokData.wasOpenBracket = true;
					}
				}
				else if(tok === "]"){
					if(tokData.wasCloseBracket){
						tokData.inExp = false;
						tokData.wasCloseBracket = false;
						var varToBind = parseDataSource(tokData.activePath.substring(tokData.activePath.indexOf("data.")+5), dataObj);
						registerVarToWatch(dataObj, tokData.activePath.substring(tokData.activePath.indexOf("data.")+5), element, origUnbound);
						bound += varToBind;
					}
					else{
						tokData.wasCloseBracket = true;
					}	
				}
				else if(tokData.inExp){
					tokData.activePath += tok;
				}
				else{
					bound += tok;
				}
			}
			if(bound.indexOf("[[") > -1){
				bound = getBoundString(dataObj, bound, element);
			}
			return bound;
		};

		var parseDataSource = function(path, root){
			var loc = path.split('.');
			var obj = root;
			while(loc.length > 0){
				obj = obj[loc.shift()];
			}
			return obj;
		};
	};

	var main = new function(){

		var moduleArgs = {};

		var registerElements = function(){
			/**Define qk-page's prototype **/
			var qkpageProto = Object.create(HTMLElement.prototype);
			qkpageProto.show = protos.show;
			qkpageProto.hide = protos.hide;
			/**End qk-page's prototype **/

			/**Define qk-const's prototype **/
			var qkconstProto = Object.create(HTMLElement.prototype);
			qkconstProto.show = protos.show;
			qkconstProto.hide = protos.hide;
			/**End qk-const's prototype **/

			document.registerElement('qk-page', {
				prototype: qkpageProto
			});
			document.registerElement('qk-const', {
				prototype: qkconstProto
			});

		};

		var registerListeners = function(){
			Array.prototype.slice.call(document.querySelectorAll('a[qk-linkto]')).forEach(function(current){
				//current.setAttribute("href", "javascript:;");
				current.addEventListener('click', function(){
					nav.goto(current.getAttribute("qk-linkto"));
				})
			});

			Array.prototype.slice.call(document.querySelectorAll('input[qk-datato]')).forEach(function(current){
				current.addEventListener('input', function(){
					dataBind.inputToBind(current);
				})
			});

			window.onhashchange = displayPage;
		};

		var displayPage = function(){
			if(window.location.hash === "" || window.location.hash === undefined || window.location.hash === "#"){
				var hId = currentPage = main.pageById(moduleArgs.home);
				for(var i = 0, l = pages.length; i < l; i++){
					pages[i].hide();
				}
				pages[hId].show();
				window.location.hash = moduleArgs.home;		
			}
			else{
				var hId = currentPage = main.pageById(window.location.hash.substring(1));
				for(var i = 0, l = pages.length; i < l; i++){
					pages[i].hide();
				}
				pages[hId].show();	
			}
		};

		var fetchPagesAndData = function(){
			pages = document.querySelectorAll('qk-page[qk-pageid]');
			datas = document.querySelectorAll('[qk-datafrom]');
		};

		var triggerDataBind = function(){
			for(var i = 0, l = datas.length; i < l; i++){
				dataBind.bind(datas[i]);
			}
		};

		this.pageById = function(id){
			for(var i = 0, l = pages.length; i < l; i++){
				if(pages[i].getAttribute("qk-pageid")===id)
					return i;
			}
			return -1;
		};

		this.go = function(args){
			registerElements();
			registerListeners();
			fetchPagesAndData();
			triggerDataBind();
			moduleArgs = args;
			displayPage();	
		};
	};

};