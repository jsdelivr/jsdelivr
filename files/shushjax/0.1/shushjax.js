/**
 * shushjax
 * A standalone implementation of Pushstate AJAX, for non-JQuery webpages.
 * @version 0.1
 * @author JC Hulce
 * @source https://github.com/Team-Pr0xy/shushjax
 * @license MIT
 */
// BatchDom, based on FastDom by Wilson Page <wilsonpage@me.com> https://github.com/wilsonpage/fastdom
// Eliminates layout thrashing by batching DOM read/write interactions.
/* jshint bitwise:false */
;(function(batchdom){
  'use strict';
  // Normalize rAF
  var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(cb) { return window.setTimeout(cb, 1000 / 60); };
  // Normalize cAF
  var caf = window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame || function(id) { window.clearTimeout(id); };
  /**
   * Creates a fresh
   * BatchDom instance.
   *
   * @constructor
   */
  function BatchDom() {
    this.frames = [];
    this.lastId = 0;
    // Placing the rAF method
    // on the instance allows
    // us to replace it with
    // a stub for testing.
    this.raf = raf;
    this.batch = {
      hash: {},
      read: [],
      write: [],
      mode: null
    };
  }
  /**
   * Adds a job to the read batch and schedules a new frame if need be.
   * @param  {Function} fn
   * @api public
   */
  BatchDom.prototype.read = function(fn, ctx) {
    var job = this.add('read', fn, ctx);
    var id = job.id;
    // Add this job to the read queue
    this.batch.read.push(job.id);
    // We should *not* schedule a new frame if:
    // 1. We're 'reading'
    // 2. A frame is already scheduled
    var doesntNeedFrame = this.batch.mode === 'reading' || this.batch.scheduled;
    // If a frame isn't needed, return
    if (doesntNeedFrame) return id;
    // Schedule a new frame, then return
    this.scheduleBatch();
    return id;
  };
  /**
   * Adds a job to the write batch and schedules a new frame if need be.
   * @param  {Function} fn
   * @api public
   */
  BatchDom.prototype.write = function(fn, ctx) {
    var job = this.add('write', fn, ctx);
    var mode = this.batch.mode;
    var id = job.id;
    // Push the job id into the queue
    this.batch.write.push(job.id);
    // We should *not* schedule a new frame if:
    // 1. We are 'writing'
    // 2. We are 'reading'
    // 3. A frame is already scheduled.
    var doesntNeedFrame = mode === 'writing' || mode === 'reading' || this.batch.scheduled;
    // If a frame isn't needed, return
    if (doesntNeedFrame) return id;
    // Schedule a new frame, then return
    this.scheduleBatch();
    return id;
  };
  /**
   * Adds a console.log() job to the write batch
   * @param {logged text}
   * @api public
   */
  BatchDom.prototype.writelog = function(logtext){
    var self = this;
    return this.write(function(){
    (console.log(logtext));
    });
  };
  /**
   * Adds a console.info() job to the write batch
   * @param {logged text}
   * @api public
   */
  BatchDom.prototype.writeinfo = function(logtext){
    var self = this;
    return this.write(function(){
    (console.info(logtext));
    });
  };
  /**
   * Adds a console.error() job to the write batch
   * @param {logged text}
   * @api public
   */
  BatchDom.prototype.writeerror = function(logtext){
    var self = this;
    return this.write(function(){
    (console.error(logtext));
    });
  };
  /**
   * Defers the given job by the number of frames specified.
   * If no frames are given then the job is run in the next free frame.
   * @param  {Number}   frame
   * @param  {Function} fn
   * @api public
   */
  BatchDom.prototype.defer = function(frame, fn, ctx) {
    // Accepts two arguments
    if (typeof frame === 'function') {
      ctx = fn;
      fn = frame;
      frame = 1;
    }
    var self = this;
    var index = frame - 1;
    return this.schedule(index, function() {
      self.run({
        fn: fn,
        ctx: ctx
      });
    });
  };
  /**
   * Clears a scheduled 'read', 'write' or 'defer' job.
   * @param  {Number} id
   * @api public
   */
  BatchDom.prototype.clear = function(id) {
    // Defer jobs are cleared differently
    if (typeof id === 'function') {
      return this.clearFrame(id);
    }
    var job = this.batch.hash[id];
    if (!job) return;
    var list = this.batch[job.type];
    var index = list.indexOf(id);
    // Clear references
    delete this.batch.hash[id];
    if (~index) list.splice(index, 1);
  };
  /**
   * Clears a scheduled frame.
   * @param  {Function} frame
   * @api private
   */
  BatchDom.prototype.clearFrame = function(frame) {
    var index = this.frames.indexOf(frame);
    if (~index) this.frames.splice(index, 1);
  };
  /**
   * Schedules a new read/write batch if one isn't pending.
   * @api private
   */
  BatchDom.prototype.scheduleBatch = function() {
    var self = this;
    // Schedule batch for next frame
    this.schedule(0, function() {
      self.batch.scheduled = false;
      self.runBatch();
    });
    // Set flag to indicate a frame has been scheduled
    this.batch.scheduled = true;
  };
  /**
   * Generates a unique id for a job.
   * @return {Number}
   * @api private
   */
  BatchDom.prototype.uniqueId = function() {
    return ++this.lastId;
  };
  /**
   * Calls each job in the list passed.
   * If a context has been stored on the function then it is used, else the current `this` is used.
   * @param  {Array} list
   * @api private
   */
  BatchDom.prototype.flush = function(list) {
    var id;
    while (!!(id = list.shift())) {
      this.run(this.batch.hash[id]);
    }
  };
  /**
   * Runs any 'read' jobs followed by any 'write' jobs.
   * We run this inside a try catch so that if any jobs error, we are able to recover and continue to flush the batch until it's empty.
   * @api private
   */
  BatchDom.prototype.runBatch = function() {
    try {
      // Set the mode to 'reading',
      // then empty all read jobs
      this.batch.mode = 'reading';
      this.flush(this.batch.read);
      // Set the mode to 'writing'
      // then empty all write jobs
      this.batch.mode = 'writing';
      this.flush(this.batch.write);
      this.batch.mode = null;
    } catch (e) {
      this.runBatch();
      throw e;
    }
  };
  /**
   * Adds a new job to the given batch.
   * @param {Array}   list
   * @param {Function} fn
   * @param {Object}   ctx
   * @returns {Number} id
   * @api private
   */
  BatchDom.prototype.add = function(type, fn, ctx) {
    var id = this.uniqueId();
    var result = this.batch.hash[id] = {
      id: id,
      fn: fn,
      ctx: ctx,
      type: type
    };
    return result;
  };
  /**
   * Runs a given job.
   * Applications using BatchDom have the options of setting `batchdom.onError`.
   * This will catch any errors that may throw inside callbacks, which
   * is useful as often DOM nodes have been removed since a job was scheduled.
   *
   * Example:
   *   batchdom.onError = function(e) {
   *     // Runs when jobs error
   *   };
   * @param  {Object} job
   * @api private
   */
  BatchDom.prototype.run = function(job){
    var ctx = job.ctx || this;
    var fn = job.fn;
    // Clear reference to the job
    delete this.batch.hash[job.id];
    // If no `onError` handler has been registered, just run the job normally.
    if (!this.onError) {
      return fn.call(ctx);
    }
    // If an `onError` handler has been registered, catch errors that throw inside
    // callbacks, and run the handler instead.
    try { fn.call(ctx); } catch (e) {
      this.onError(e);
    }
  };
  /**
   * Starts a rAF loop to empty the frame queue.
   * @api private
   */
  BatchDom.prototype.loop = function() {
    var self = this;
    var raf = this.raf;
    // Don't start more than one loop
    if (this.looping) return;
    raf(function frame() {
      var fn = self.frames.shift();
      // If no more frames, stop looping
      if (!self.frames.length) {
        self.looping = false;
      // Otherwise, schedule the next frame
      } else {
        raf(frame);
      }
      // Run the frame.  Note that this may throw an error in user code, but all batchdom tasks are dealt
      // with already so the code will continue to iterate
      if (fn) fn();
    });
    this.looping = true;
  };
  /**
   * Adds a function to a specified index of the frame queue. 
   * @param  {Number}   index
   * @param  {Function} fn
   * @return {Function}
   */
  BatchDom.prototype.schedule = function(index, fn) {
    // Make sure this slot hasn't already been taken. If it has, try re-scheduling for the next slot
    if (this.frames[index]) {
      return this.schedule(index + 1, fn);
    }
    // Start the rAF loop to empty the frame queue
    this.loop();
    // Insert this function into the frames queue and return
    var result = this.frames[index] = fn;
    return result;
  };
  // We only ever want there to be one instance of BatchDom in an app
  batchdom = batchdom || new BatchDom();
  /**
   * Expose 'batchdom'
   */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = batchdom;
  } else if (typeof define === 'function' && define.amd) {
    define(function(){ return batchdom; });
  } else {
    window.batchdom = batchdom;
  }
})(window.batchdom);
// Start of shushjax
(function(){
	// Object to store private values/methods.
	var internal = {
		// Is this the first usage of shushjax? (Ensure history entry has required values if so.)
		"firstrun": true,
		// Attempt to check that a device supports pushstate before attempting to use it.
		"is_supported": window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/)
	};
	/**
	 * AddEvent
	 * Cross browser compatable method to add event listeners
	 * @scope private
	 * @param obj Object to listen on
	 * @param event Event to listen for.
	 * @param callback Method to run when event is detected.
	 */
	internal.addEvent = function(obj, event, callback){
		if(window.addEventListener){
				// Browsers that don't suck
				batchdom.writelog("Adding event listener to " + obj + " on event " + event);
				batchdom.write(function() {
				obj.addEventListener(event, callback, false);
				});
		}else{
				// IE8/7
				batchdom.writeinfo("Adding fallback event listeners for old IE versions");
				batchdom.writelog("Adding event listener to " + obj + " on event " + event);
				obj.attachEvent('on'+event, callback);
		}
	};
	/**
	 * Clone
	 * Util method to create copies of the options object (so they do not share references)
	 * This allows custom settings on differnt links.
	 * @scope private
	 * @param obj
	 * @return obj
	 */
	internal.clone = function(obj){
		object = {};
		//For every option in object, create it in the duplicate.
		for (var i in obj) {
                        if (obj.hasOwnProperty(i)){
			object[i] = obj[i];
			}
		}
		return object;
	};
	/**
	 * triggerEvent
	 * Fire an event on a given object (used for callbacks)
	 * @scope private
	 * @param node. Objects to fire event on
	 * @return event_name. type of event
	 */
	internal.triggerEvent = function(node, event_name){
		if (document.createEvent) {
		// Good browsers
		evt = document.createEvent("HTMLEvents");
		evt.initEvent(event_name, true, true);
		node.dispatchEvent(evt);
		}else{
		// old IE versions
		evt = document.createEventObject();
		evt.eventType = 'on'+ event_name;
		node.fireEvent(evt.eventType, evt);
		batchdom.writeinfo("Using createEvent fallbacks for old IE versions");
		}
		batchdom.writelog("Firing event " + event_name);
	};
	/**
	 * popstate listener
	 * Listens for back/forward button events and updates page accordingly.
	 */
	internal.addEvent(window, 'popstate', function(st){
		if(st.state !== null){
			var opt = {	
				'url': st.state.url, 
				'container': st.state.container, 
				'history': false
			};
                        // Merge original in original connect options
                        if(typeof internal.options !== 'undefined'){
                                for(var a in internal.options){ 
                                        if(typeof opt[a] === 'undefined') opt[a] = internal.options[a];
                                }         
                        }

                        // Convert state data to shushjax options
                        var options = internal.parseOptions(opt);
			// If somthing went wrong, return.
			if(options === false){
			batchdom.writeerror("Failed to read state data " + st);
			internal.triggerEvent(options.container,'generalError');
			return;
			}
			// If there is a state object, handle it as a page load.
			internal.handle(options);
			batchdom.writelog("Handling state " + st);
		}
	});
	/**
	 * attach
	 * Attach shushjax listeners to a link.
	 * @scope private
	 * @param link_node. link that will be clicked.
	 * @param content_node. 
	 */
	internal.attach = function(node, options){
		// if no pushstate support, dont attach and let stuff work as normal.
		if(!internal.is_supported){
		batchdom.writeinfo("No pushstate support in browser, shushjax is disabled");
		return;
		}
		// Ignore external links.
		if ( node.protocol !== document.location.protocol ||
			node.host !== document.location.host ){
			batchdom.writelog("Ignoring external anchor " + node.href);
			return;
		}
		// Ignore anchors on the same page
                if(node.pathname === location.pathname && node.hash.length > 0) {
                        batchdom.writelog("Ignoring same-page anchor " + node.hash);
                        return true;
                 }
		// Add link href to object
		options.url = node.href;
		// If data-shushjax is specified, use as container
		if(node.getAttribute('data-shushjax')){
			options.container = node.getAttribute('data-shushjax');
			batchdom.writelog("Using " + options.container + " as container for " + node.href + " as specified with data-shushjax");
		}
		// If data-title is specified, use as title.
		if(node.getAttribute('data-title')){
			options.title = node.getAttribute('data-title');
			batchdom.writelog("Using " + options.title + " as title for " + node.href + " as specified with data-title");
		}
		// Check options are valid.
		options = internal.parseOptions(options);
		if(options === false){
                        batchdom.writeerror("Invalid options error");
                        internal.triggerEvent(options.container,'generalError');
		return;
		}
		// Attach event.
		internal.addEvent(node, 'click', function(event){
			// Allow middle click (pages in new windows)
			if ( event.which > 1 || event.metaKey ) return;
			// Dont fire normal event
			if(event.preventDefault){event.preventDefault();}else{event.returnValue = false;}
			// Take no action if we are already on said page?
			if(document.location.href === options.url){
			batchdom.writelog("Ignoring same-page anchor " + options.url);
			return false;
			}
			// handle the load.
			internal.handle(options);
		});
	};
	/**
	 * parseLinks
	 * Parse all links within a dom node, using settings provided in options.
	 * @scope private
	 * @param dom_obj. Dom node to parse for links.
	 * @param options. Valid Options object.
	 */
	internal.parseLinks = function(dom_obj, options){
		if(typeof options.useClass !== "undefined"){
			// Get all nodes with the provided classname.
			nodes = dom_obj.getElementsByClassName(options.useClass);
			batchdom.writelog("Attaching to links with class " + options.useClass);
		}else{  // If no class was provided, just get all the links
			nodes = dom_obj.getElementsByTagName('a');
			batchdom.writelog("Attaching to all links, useClass is unspecified");
		}
		// For all returned nodes
		for(var i=0,tmp_opt; i < nodes.length; i++){
			node = nodes[i];
			// Override options history to true, else link parsing could be triggered by backbutton (which runs in no-history mode)
			tmp_opt = internal.clone(options);
			tmp_opt.history = true;
			internal.attach(node, tmp_opt);
		}
	};
	/**
	 * SmartLoad
	 * Smartload checks the returned HTML to ensure shushjax ready content has been provided rather than
	 * a full HTML page. If a full HTML has been returned, it will attempt to scan the page and extract
	 * the correct html to update our container with in order to ensure shushjax still functions as expected.
	 * @scope private
	 * @param html (HTML returned from AJAX)
	 * @param options (Options object used to request page)
	 * @return HTML to append to our page.
	 */
	internal.smartLoad = function(html, options){
		// Create tmp node (So we can interact with it via the DOM)
		var tmp = document.createElement('div');
		// Add html
		tmp.innerHTML = html; 
		// Grab the title if there is one (maintain IE7 compatability)
		var title = tmp.getElementsByTagName('title')[0].innerHTML;
		if(title){
		batchdom.writelog("Using returned document title: " + title);
		document.title = title;
		}
		//Look through all returned divs.
		tmpNodes = tmp.getElementsByTagName('div');
		for(var i=0;i<tmpNodes.length;i++){
			if(tmpNodes[i].id === options.container.id){
				// If our container div is within the returned HTML, we both know the returned content is
				// not partial pages ready, but instead likely the full HTML content. In addition we can also guess that
				// the content of this node is what we want to update our container with.
				// Thus use this content as the HTML to append in to our page via shushjax.
				batchdom.writeinfo("Found container div in the returned HTML, treating as full HTML content and processing with smartLoad");
				// break;
				return tmpNodes[i].innerHTML;
			}else batchdom.writelog("Didn't find container div in the returned HTML, processing as a partial page");
		}
		// If our container was not found, HTML will be returned as is.
		return html;
	};
	/**
	 * handle
	 * Handle requests to load content via shushjax.
	 * @scope private
	 * @param url. Page to load.
	 * @param node. Dom node to add returned content in to.
	 * @param addtohistory. Does this load require a history event.
	 */
	internal.handle = function(options){
		// Fire beforeSend Event.
		internal.triggerEvent(options.container, 'beforeSend');
		// Do the request
		internal.request(options.url, options.partial, function(html){
                        if (! html ){
				internal.triggerEvent(options.container,'requestError');
				return;
			}
			// Ensure we have the correct HTML to apply to our container.
			batchdom.writelog("smartLoad is " + options.smartLoad);
			if(options.smartLoad) html = internal.smartLoad(html, options);
			// Update the dom with the new content
			options.container.innerHTML = html;
			// Initalise any links found within document (if enabled).
			batchdom.writelog("parseLinksOnLoad is " + options.parseLinksOnload);
			if(options.parseLinksOnload){
				internal.parseLinks(options.container, options);
			}
			// If no title was provided
			if(typeof options.title === "undefined"){
				// Attempt to grab title from page contents.
				if(options.container.getElementsByTagName('title').length !== 0){
					options.title = options.container.getElementsByTagName('title')[0].innerHTML;
				}else{
					options.title = document.title;
				}
			}
			// Do we need to add this to the history?
			if(options.history){
				// If this is the first time shushjax has run, create a state object for the current page.
				if(internal.firstrun){
					window.history.replaceState({'url': document.location.href, 'container':  options.container.id}, document.title);
					internal.firstrun = false;
				}
				// Update browser history
				window.history.pushState({'url': options.url, 'container': options.container.id }, options.title , options.url);
			}
			// Fire Events
			internal.triggerEvent(options.container,'complete');
			if (xmlhttp.status !== 200){ // Got a page with an error
                                internal.triggerEvent(options.container,'requestError');
                                batchdom.writeerror("Request finished with HTTP error " + xmlhttp.status);
                                return;
			}
			if(html === false || html === "undefined"){ // Somthing went wrong
				internal.triggerEvent(options.container,'requestError');
				return;
			}else{ //got what we expected.
				internal.triggerEvent(options.container,'success');
			}
			// If Google analytics is detected push a trackPageView, so shushjax pages can be tracked successfully.
			if(window._gaq){
			batchdom.writelog("Pushing Google Analytics pageview");
			_gaq.push(['_trackPageview']);
			}
			// Set new title
			document.title = options.title;
		});
	};
	/**
	 * Request
	 * Performs AJAX request to page and returns the result.
	 * @scope private
	 * @param location. Page to request.
	 * @param partial. Use partial pages?
	 * @param callback. Method to call when a page is loaded.
	 */
	internal.request = function(location, partial, callback){
		batchdom.writelog("Requesting page " + location);
		// Create xmlHttpRequest object.
		xmlhttp = window.XMLHttpRequest?new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");
			// Check if the browser supports XHR2
			if (typeof xmlhttp.onload !== "undefined"){
			batchdom.writelog("Using XHR2");
			xmlhttp.onloadend = function(){ // Finished load
			batchdom.writelog("Fetch complete, HTTP status code " + xmlhttp.status);
			if (xmlhttp.status !== 200){
			}
			callback(xmlhttp.responseText, xmlhttp.status); // Success, Return HTML
			};
			xmlhttp.onerror = function(){ // Error during loading
			if (xmlhttp.status === 0){
			batchdom.writeerror("Failed to connect to the server, network error " + xmlhttp.status);
			}else{
			batchdom.writeerror("Fetch error, HTTP status code " + xmlhttp.status);
			}
			// return error page if present
			callback(xmlhttp.responseText, xmlhttp.status);
			return false; // Failure, return false
			};
			}else{ // old browsers that don't support XHR2
			batchdom.writeinfo("Falling back to basic XHR");
			// Add the old state listener
			xmlhttp.onreadystatechange = function(){
				if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200)) {
					// Success, Return html
					callback(xmlhttp.responseText);
					batchdom.writelog("Fetch complete");
				}else if((xmlhttp.readyState === 4) && (xmlhttp.status !== 200)){
					// error, return error page if present
					batchdom.writeerror("Fetch error, HTTP status code " + xmlhttp.status);
					callback(xmlhttp.responseText);
					return false;} // Failure, return false
				};
			}
			// re-format the URL so we can modify it
			// Check for browser support of URL()
			if (typeof(URL) === "function"){
			formaturl = new URL(location);
			batchdom.writelog("Using URL() to process location");
			// Some browsers implement URL() as webkitURL()
			}else{
			if (typeof(webkitURL) === "function"){
			formaturl = new webkitURL(location);
			batchdom.writeinfo("Using webkitURL() instead of URL()");
			// if the client doesn't support URL() or webkitURL(), disable partial file support
			}else{
			partial = false;
			batchdom.writeinfo("Disabling partial file support, browser does not support URL()");
			}}
			// Use partial file support if it's enabled
			if(partial === true){
			getlocation = formaturl.protocol + "//" + formaturl.host + "/partials" + formaturl.pathname;
			batchdom.writelog("Fetching a partial HTML file");
			}else{
			getlocation = location;
			batchdom.writelog("Fetching a full HTML file");
			}
			// Actually send the request
			batchdom.writelog("Fetching " + getlocation);
			xmlhttp.open("GET", getlocation, true);
			// Add headers so things can tell the request is being performed via AJAX.
			xmlhttp.setRequestHeader('X-shushjax', 'true'); // shushjax header, kept so you can see usage in server logs
			xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // Standard AJAX header.
			xmlhttp.send(null);
	};
	/**
	 * parseOptions
	 * Validate and correct options object while connecting up any listeners.
	 * @scope private
	 * @param options
	 * @return false | valid options object
	 */
	internal.parseOptions = function(options){
		// Defaults. (if somthing isn't provided)
		opt = {};
		opt.history = true;
		opt.parseLinksOnload = true;
		opt.smartLoad = true;
		opt.partial = false;
		// Ensure a url and container have been provided.
		if(typeof options.url === "undefined" || typeof options.container === "undefined"){
			batchdom.writeerror("URL and Container must be provided");
			internal.triggerEvent(options.container,'generalError');
			return false;
		}
		// Find out if history has been provided
		if(typeof options.history === 'undefined'){
			// use default
			options.history = opt.history;
		}else{
			// Ensure its bool.
			options.history = (!(options.history === false));
		}
		// Parse Links on load? Enabled by default.
		// (Proccess pages loaded via shushjax and setup shushjax on any links found.)
		if(typeof options.parseLinksOnload === "undefined"){
			options.parseLinksOnload = opt.parseLinksOnload;
		}
		// Use partial file support? Disabled by default
		if(typeof options.partial === "undefined"){
			options.partial = opt.partial;
		}
		// Smart load (enabled by default). Tries to ensure the correct HTML is loaded.
		// If you are certain your backend will only return shushjax ready content this can be disabled
		// for a slight perfomance boost.
		if(typeof options.smartLoad === "undefined"){
			options.smartLoad = opt.smartLoad;
		}
		// Get container (if its an id, convert it to a dom node.)
		if(typeof options.container === 'string' ) {
			container = document.getElementById(options.container);
			if(container === null){
				batchdom.writeerror("Could not find container with id:" + options.container);
				internal.triggerEvent(options.container,'generalError');
				return false;
			}
			options.container = container;
		}
		// If everything went ok thus far, connect up listeners
		if(typeof options.beforeSend === 'function'){
			internal.addEvent(options.container, 'beforeSend', options.beforeSend);
			batchdom.writelog("shushjax request initiating");
		}
		if(typeof options.complete === 'function'){
			internal.addEvent(options.container, 'complete', options.complete);
			batchdom.writelog("shushjax request complete");
		}
		if(typeof options.generalError === 'function'){
			internal.addEvent(options.container, 'generalError', options.generalError);
			batchdom.writeerror("An error occurred");
		}
		if(typeof options.requestError === 'function'){
			internal.addEvent(options.container, 'requestError', options.requestError);
			batchdom.writeerror("An error occurred during the shushjax request");
		}
		if(typeof options.success === 'function'){
			internal.addEvent(options.container, 'success', options.success);
			batchdom.writelog("shushjax request completed successfully");
		}
		// Return valid options
		return options;
	};
	/**
	 * connect
	 * Attach links to shushjax handlers.
	 * @scope public
	 * Can be called in 3 ways.
	 * Calling as connect(); will look for links with the data-shushjax attribute.
	 * Calling as connect(container_id) will try to attach to all links, using the container_id as the target.
	 * Calling as connect(container_id, class_name) will try to attach any links with the given classname, using container_id as the target.
	 * Calling as connect({	
	 * 'url':'somepage.php',
	 * 'container':'somecontainer',
	 * 'beforeSend': function(){console.log("sending");}
	 * })
	 * Will use the provided json to configure the script in full (including callbacks)
	 */
	this.connect = function(/* options */){
		// connect();
		var options = {};
		// connect(container, class_to_apply_to)
		if(arguments.length === 2){
			options.container = arguments[0];
			options.useClass = arguments[1];
		}
		// Either json or container id
		if(arguments.length === 1){
			if(typeof arguments[0] === 'string' ) {
				// connect(container_id)
				options.container = arguments[0];
			}else{
				// Else connect({url:'', container: ''});
				options = arguments[0];
			}
		}
		// Delete history and title if provided. These options should only be provided via invoke();
		delete options.title;
		delete options.history;
		internal.options = options;
		if(document.readyState === 'complete') {
			internal.parseLinks(document, options);
		} else {
			// Dont run until the window is ready.
			internal.addEvent(window, 'load', function(){	
				// Parse links using specified options
				internal.parseLinks(document, options);
			});
		}
	};
	/**
	 * invoke
	 * Directly invoke a shushjax page load.
	 * invoke({url: 'file.php', 'container':'content'});
	 * @scope public
	 * @param options  
	 */
	this.invoke = function(/* options */){
		// url, container
		if(arguments.length === 2){
			options = {};
			options.url = arguments[0];
			options.container = arguments[1];
		}else{
			options = arguments[0];
		}
		// If shushjax isn't supported by the current browser, push user to specified page.
		if(!internal.is_supported){
			document.location = options.url;
			batchdom.writeinfo("Browser does not support shushjax. Pushing user directly to the specified page instead");
			return;	
		} 
		// Proccess options
		options = internal.parseOptions(options);
		// If everything went ok, activate shushjax.
		if(options !== false) internal.handle(options);
		batchdom.writelog("Everything is okay, activating shushjax");
	};
	var shushjax_obj = this;
        if (typeof define === 'function' && define.amd) {
                // register shushjax as AMD module
                define( function() {
            return shushjax_obj;
        });
        }else{
                // Make shushjax object accessible in global namespace
                window.shushjax = shushjax_obj;
        }
}).call({});
