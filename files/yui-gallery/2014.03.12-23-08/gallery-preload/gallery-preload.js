YUI.add('gallery-preload', function(Y) {

/**
 * Y.preload() function for YUI3
 * Preload images, CSS and JavaScript files without executing them
 * Port of Stoyan Stefanov's Script ??? http://www.phpied.com/preload-cssjavascript-without-execution/
 * Note that since this script relies on YUI Loader, the preloading process will not start until YUI has finished loading.
 * 
 * @module gallery-preload
 */

var _idleQueue = [];

/**
 * Preload images, CSS and JavaScript files without executing them
 * @namespace Y
 * @class preload
 * @static
 * @param {String|Array} files		Collection of files to be loaded
 * @return {YUI} Y instance for chaining
 */
Y.preload = function(files) {
	var o, ie = Y.UA.ie, doc = Y.config.doc;
	
	// If the first argument is not an array, we can assume the user is trying to load one
	// single file or a list of files like: Y.preload ('file1.js', 'file2.css');
	files = (Y.Lang.isArray(files)?files:Y.Array(arguments, 0, true));
	
	
	Y.Array.each(files, function (f) {
		if (ie) {
            (new Image()).src = f;
        } else {
	        o = doc.createElement('object');
	        o.data = f;
	        o.width = o.height = 0;
	        doc.body.appendChild(o);
        }
    });
	
	return Y;
};

/**
 * Wait until the user become idle to preload files without executing them. It uses 
 * Idle Timer Module (by Nicholas) to monitor user actions.
 * @namespace Y
 * @class preloadOnIdle
 * @static
 * @param {Array} files 		Collection of files to be loaded
 * @param {int} t (Optional) 	A new value for the timeout period in ms.
 * @return {YUI} Y instance for chaining
 */
Y.preloadOnIdle = function(files, t) {
	// Loading Idle Timer Module (by Nicholas) on-demand to avoid setting it
	// as a dependency when most of the users will not use it...
	
	
	// adding the set of files into the queue
	_idleQueue.push (files);
	
	Y.use('gallery-idletimer', function(Y) {
	
	    Y.IdleTimer.subscribe("idle", function(){
	    	// collecting the first file from the list
	    	var fs = files.shift();
	    	if (fs) {
		    	Y.preload(fs);
	    	} else {
	    		Y.IdleTimer.stop();
	    	}
	    });
	
	    //start the timer with a default timeout of 30s
	    Y.IdleTimer.start(t);
	
	});
	
	return Y;
};


}, 'gallery-2010.05.05-19-39' ,{requires:['yui']});
