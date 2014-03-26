YUI.add('gallery-event-binder', function(Y) {

/**
* <p>The Event Binder satisfies a very specific need. Binding user actions until a 
* particular YUI instance become ready, and the listeners defined before flushing those 
* events through a queue. This will help to catch some early user interactions due 
* the ondemand nature of YUI 3. 
* 
* <p>To use the Event Binder Module, you have to leverage YUI_config object first. More information
* about this object visit this page: http://developer.yahoo.com/yui/3/api/config.html<p>
* <p>There is a member of this global object that you have to set up, the member is called: "eventbinder". To get
* more information about this object, visit this page: http://yuilibrary.com/gallery/show/event-binder</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
*		//	Call the "use" method, passing in "gallery-event-binder".	 Then you can<br>
*		//	call Y.EventBinder.flush('click'); to flush all the events that might had happened<br>
*		//	before your listeners were defined. <br>
* <br>
*		YUI().use("gallery-event-binder", "event", function(Y) { <br>
* <br>
*			Y.on('click', function(e) {<br>
*				// do your stuff here...<br>
*			}, '#demo');<br>
* <br>
*			Y.EventBinder.flush('click');<br>
* <br>
*		});<br>
*});<br>
* <br>
* <br>		
*	&#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The Event Binder has a single method called "flush". This method accept one argument to
* identify what type of event should be flushed. The argument can be:</p>
* <ul>
* <li>click</li>
* <li>dblclick</li>
* <li>mouseover</li>
* <li>mouseout</li>
* <li>mousedown</li>
* <li>mouseup</li>
* <li>mousemove</li>
* <li>keydown</li>
* <li>keyup</li>
* <li>keypress</li>
* <li>...etc...</li>
* </ul>  
* <p>Keep in mind that before flushing any of these events, you have to add them to the 
* monitoring system through the configuration object (YUI_config.eventbinder), otherwise
* YUI will be unable to listen for any early user interaction.</p>
* </p>
*
* @module gallery-event-binder
*/

function _modulesReady (e, modules, handler) {
	var args = Y.Array(modules);
	
	// stopping the module inmidiately
	e.halt();
	
	// adding the loading class
	e.target.addClass('yui3-waiting');

	args.push(function() {
		// once the modules gets ready, let's remove the original binder
		handler.detach();
		// removing the loading class
		e.target.removeClass('yui3-waiting');
		// let's simulate the new event based on the original facade
		Y.Event.simulate(e.target._node, e.type, e);
	});

	Y.use.apply (Y, args);
	
}

Y.EventBinder = {
	/*
	 * Filter all the events in the queue by type, and simulate those that match.
	 * @method flush
	 * @param type {string} The type of event to flush
	 */
	flush: function (type) {
		var config = Y.config.eventbinder || {};

		config.q = config.q || [];
		type = type || 'click';

		if (config.fn) {
			// once you call flush, the original listener should be removed
			YUI.Env.remove(Y.config.doc, type, config.fn);
		}
		// filtering all the events in the queue by type
		Y.each(config.q, function(o) {

			if (type == o.type) {
				// removing the loading class
				Y.get(o.target).removeClass('yui3-waiting');
				// let's simulate the new event based on the backup object described by "e" in the configuration
				Y.Event.simulate(o.target, type, o);
			}

		});
	},
	/*
	 * Adds an event listener. This method is an wrap for Y.on, and instead of supporting
	 * a regular callback, it loads a set of modules and simulate the same event once those
	 * modules become available.
	 * @method on
	 * @param type {string} The type of event to append 
	 * @param modules {string|array} a module or a list of modules that should be loaded when this event happens
	 * @param el {String|HTMLElement|Array|NodeList} An id, an element reference, or a collection of ids and/or elements to assign the listener to.
	 * @return {EventHandle} the detach handle
	 */
	on: function (type, modules, el) {
		// setting the event listener
		var handler = Y.on (type, function(e) {
			return _modulesReady(e, modules, handler);
		}, el);
		return handler;
	},
	/*
	 * Adds an event listener. This method is an wrap for Y.on, and instead of supporting
	 * a regular callback, it loads a set of modules and simulate the same event once those
	 * modules become available.
	 * @method delegate
	 * @param type {string} the event type to delegate
	 * @param modules {string|array} a module or a list of modules that should be loaded when this event happens
	 * @param el {String|HTMLElement|Array|NodeList} An id, an element reference, or a collection of ids and/or elements representing the delegation container.
	 * @param spec {string} a selector that must match the target of the event.
	 * @return {EventHandle} the detach handle
	 */
	delegate: function (type, modules, el, spec) {
		// setting the delegate listener
		var handler = Y.delegate (type, function(e) {
			return _modulesReady(e, modules, handler);
		}, el, spec);
		return handler;
	}
};


}, 'gallery-2010.06.30-19-54' ,{requires:['event-simulate','event-base','event-delegate']});
