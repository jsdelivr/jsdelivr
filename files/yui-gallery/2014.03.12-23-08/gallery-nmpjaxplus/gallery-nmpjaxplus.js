YUI.add('gallery-nmpjaxplus', function (Y, NAME) {

Y.PjaxPlus = Y.Base.create('pjaxplus', Y.Widget, [], { 
	initializer : function( config ) {
		// error checking for missing required variables
		
		this.set('history', new Y.History());
		this.set('historyhash', new Y.HistoryHash());
		this.set('html5support', Y.HistoryBase.html5);
		//this.set('html5support', false);
		this.ppCache = new Y.Cache({max:this.get('cacheNum')});
		this.domain = new RegExp('^(http|https):\/\/' + window.location.hostname.replace('.','\.'));
		
		// remove leading dot from omitLinkClass, if any
		if (this.get('omitLinkClass').match(/^\./)) {
			this.set('omitLinkClass', this.get('omitLinkClass').replace(/^\./,''));
		}
	},
	
	initAjaxLinks : function() {
		var clickedLink,
		clickedTarget;
		
		if (this.get('html5support')) {
			// attach yui3-pjax class to links with REST-like URLs or URLs with permitted file extensions
			this.addPjaxClass(false);
			
			var PjaxLoader = new Y.Pjax({
				addPjaxParam : this.get('addPjaxParam'),
				container: this.get('container'),
				contentSelector: this.get('contentSelector'),
				linkSelector: this.get('linkSelector'),
				navigateOnHash: this.get('navigateOnHash'),
				scrollToTop: this.get('scrollToTop'),
				timeout: this.get('timeout'),
				titleSelector: this.get('titleSelector')
			});
		
			// trigger start callback
			PjaxLoader.on('navigate', function(e) {
				// set var for currently clicked link
				clickedLink = e.originEvent.target.get('href');
				var html5support = this.get('html5support');			
				
				if (this.get('startCallbackFunc')) {		
					this.get('startCallbackFunc').call(null, {
						clickTarget:e.originEvent.target,
						path:e.originEvent.target.get('pathname'),
				    	url:e.originEvent.target.get('href'),
						queryString:e.originEvent.target.get('search'),
						html5support:html5support
					}, this);
				}
			}, this);
		
			// trigger callback
			PjaxLoader.after('load', function(e) {
				var html5support = this.get('html5support');
				
				if (this.get('callbackFunc')) {
					this.get('callbackFunc').call(null, {
						clickTarget:clickedTarget,
						path:clickedTarget.get('pathname'),
				    	url:clickedTarget.get('href'),
						queryString:clickedTarget.get('search'),
						html5support:html5support
					}, this);
				}
			
				this.addPjaxClass(true);
				
				// add content to cache
				this.ppCache.add(clickedLink, Y.one(this.get('contentSelector')).getHTML());
			}, this);
			
			Y.delegate('click', function(e) {
				clickedTarget = e.target;
				
				if (this.ppCache.retrieve(e.target.get('href'))) {
					Y.one(this.get('contentSelector')).setHTML(this.ppCache.retrieve(e.target.get('href')).response);
				}
			}, document.body, 'a.yui3-pjax', this);
		}
		else {
			Y.delegate('click', function(e) {
				var html5support = this.get('html5support');
				
				if (typeof e.target.get('pathname') !== "undefined") {
					var historyhash = e.target.get('pathname').replace(/_/g,'-');
					historyhash = e.target.get('pathname').replace(/\//g,'_');	
				
					if (this.ppCache.retrieve(e.target.get('href'))) {
						// output cache, set history token
						Y.one(this.get('contentSelector')).setHTML(this.ppCache.retrieve(e.target.get('href')).response);
					
						this.get('history').add({
							page:historyhash
						});
						
						if (this.get('callbackFunc')) {	
							// invoke custom function
						    this.get('callbackFunc').call(null, {
								clickTarget:e.target,
								path:e.target.get('pathname'),
						    	url:e.target.get('href'),
								queryString:e.target.get('search'),
								historyhash:historyhash,
								html5support:html5support
						    }, this);
						}
						return;
					}	
				}
				
				var goodext = false;
				if (typeof e.target.get('pathname') == "undefined") {
					// no path provided, default to homepage
					e.preventDefault();
					this.startAjaxLoad({
						clickTarget:e.target,
						url:'/'
					});
				}
				else {
					var pathnamearr = e.target.get('pathname').split(/\//);
					var pathnameidx = pathnamearr.length - 1;
					var filename = pathnamearr[pathnameidx];
					
					if (!filename.match(/\./)) {
						// no file extension, valid REST-like URL
						goodext = true;
					}
					else {
						// URL contains file extensions, look for permitted file extensions
						goodext = Y.Array.some(this.get('permittedFileExts'), function(ext) {
							var thisregex = new RegExp('\.' + ext + '$');
							if (filename.match(thisregex)) {
								return true;
							}
						});
					}	
					
					if (goodext && !e.target.get('href').match(/^(mailto|javascript):/) && !e.target.get('href').match(/^#/) && 
						e.target.get('href').match(this.domain) && !e.target.hasClass(this.get('omitLinkClass'))) {
							e.preventDefault();
							this.startAjaxLoad({
								clickTarget:e.target,
								path:e.target.get('pathname'),
								url:e.target.get('href'),
								queryString:e.target.get('search'),
								historyhash:historyhash,
								html5support:html5support
							});
						}
				}
							
			}, this.get('findLinksIn'), 'a:not(.' + this.get('omitLinkClass') + ')', this);
			
		}
	},
	
	addPjaxClass : function(usecontainer) {
		var goodext = false;
		var searchelem = usecontainer ? this.get('container') + ' a:not(.' + this.get('omitLinkClass') + ')' : 'a:not(.' + this.get('omitLinkClass') + ')';
		
		Y.all(searchelem).each(function(node) {
			var pathnamearr = node.get('pathname').split(/\//);
			var pathnameidx = pathnamearr.length - 1;
			var filename = pathnamearr[pathnameidx];
			
			if (!filename.match(/\./)) {
				// no file extension, valid REST-like URL
				goodext = true;
			}
			else {
				// URL contains file extensions, look for permitted file extensions
				goodext = Y.Array.some(this.get('permittedFileExts'), function(ext) {
					var thisregex = new RegExp('\.' + ext + '$');
					if (filename.match(thisregex)) {
						return true;
					}
				});
			}
			
			if (goodext && !node.get('href').match(/^(mailto|javascript):/) && !node.get('href').match(/^#/) && 
				node.get('href').match(this.domain) && !node.hasClass(this.get('omitLinkClass'))) {
					node.addClass('yui3-pjax');
				}
			
		}, this);
	},
	
	startAjaxLoad : function(configObj) {
		if (this.get('startCallbackFunc')) {
			this.get('startCallbackFunc').call(null, configObj, this);
		}
		if (!configObj.path.match(/^\//)) {
			// make sure path has leading slash (IE seems to handle this differently)
			configObj.path = "/" + configObj.path;
		}
		var loadpath = configObj.queryString ? configObj.path + configObj.queryString : configObj.path;
		if (this.get('nofrags')) {
			// add query string to XHR URL for stripping header and footer on backend
			loadpath += configObj.queryString ? '&nofrag=1' : '?nofrag=1';
		}
		
		var cfg = {
			timeout: this.get('timeout'),
			on : {
				complete:Y.bind(function(id, transport) {
					if (this.get('nofrags')) {
						var output = transport.responseText;
						Y.one(this.get('contentSelector')).set('innerHTML', output);
					}
					else {
						var frag = Y.Node.create(transport.responseText);
						Y.one(this.get('contentSelector')).setHTML(frag.one(this.get('contentSelector')).getHTML());
						var output = frag.one(this.get('contentSelector')).getHTML();
					}
					
					// set history token
					this.get('history').add({
						page:configObj.historyhash
					});
					
					// cache output
					this.ppCache.add(configObj.url, output);
					
				}, this),
				
				success:Y.bind(function(id, transport) {
					configObj.transport = transport;
					
					if (this.get('callbackFunc')) {	
						// invoke custom function
					    this.get('callbackFunc').call(null, configObj, this);
					}
				}, this)
			}
		};
		
		Y.io(loadpath, cfg);
	}
	        
}, {
    ATTRS : { 
		findLinksIn : {
			value : document.body
		},
		
		container : {

		},
		
		timeout : {
			value : 30000
		},
		
		addPjaxParam : {
			value : true
		},
		
		linkSelector : {
			value : 'a.yui3-pjax'
		},
		
		scrollToTop : {
			value : true
		},
		
		navigateOnHash : {
			value : false
		},
		
		titleSelector : {
			value : 'title'
		},
		
		contentSelector : {
			
		},
		
		omitLinkClass : {

		},
		
		permittedFileExts : {
			
		},
		
		startCallbackFunc : {

		},
		
		callbackFunc : {
			
		},
		
		cacheNum : {
			value : 10
		},
		
		nofrags : {
			value : false
		}
	}
});



}, 'gallery-2013.05.10-00-54', {
    "supersedes": [
        ""
    ],
    "skinnable": "false",
    "requires": [
        "base-build",
        "widget",
        "node",
        "io",
        "history",
        "pjax",
        "event-delegate",
        "cache-base",
        "selector-css3"
    ],
    "optional": [
        ""
    ]
});
