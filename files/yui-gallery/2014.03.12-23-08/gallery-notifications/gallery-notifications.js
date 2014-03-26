YUI.add('gallery-notifications', function(Y) {



	/*
	 * Copyright (c) 2010 Ricardo Ramirez. All rights reserved.
	 *
	 * Holds information about a Notification. The Notifications (plural) class has a collection of
	 * Notification that are then displayed. This maps the needed information for the notification like a
	 * date and the content of the notification itself
	 * @param {string} content	The content of the notification. It can be any valid html
	 * @param {int} dateline	The date for the notification. This is used to figure out if it's new for the user
	 * @param {string} link		An optional link. The content will be wrapped around this
	 */
	var Notification = function(content, dateline, link) {
		this.content = content;
		this.dateline = dateline;
		this.link = link;
	};
	
	/**
	 * @class Notifications
	 * Notifications component. This is meant to be instantiated, so it is provided as a function-constructor and is
	 * later extended with the additional functions. The user will most likely call
	 *		new Y.Notifications(), to create a new component with no notifications, or
	 *		new Y.Notifications(id), to create a new component based off existing markup
	 * 
	 * @param {String|DomElement} domElement	The domElement to use as existing markup
	 */
	Y.Notifications = function (sourceNode) {
	    if (typeof(sourceNode) === 'string') {	// if String, try to find the corresponding node
			sourceNode = Y.DOM.byId(sourceNode);
			if (!sourceNode) {
			}
		}
	
	    this.sourceNode = sourceNode;		// may be undefined
	    this.parseNotifications();
	    this.render();
	}; // Y.Notifications
	
	/*
	 * Declaration of constants used inside the component
	 */
	Y.Notifications.prototype.LABEL_NOTIFICATIONS = 'Notifications (%1)';
	Y.Notifications.prototype.DAY_LABEL = '%1 day ago';
	Y.Notifications.prototype.DAYS_LABEL = '%1 days ago';
	Y.Notifications.prototype.HOUR_LABEL = '%1 hour ago';
	Y.Notifications.prototype.HOURS_LABEL = '%1 hours ago';
	Y.Notifications.prototype.MINUTE_LABEL = '%1 minute ago';
	Y.Notifications.prototype.MINUTES_LABEL = '%1 minutes ago';
	Y.Notifications.prototype.SECOND_LABEL = '%1 second ago';
	Y.Notifications.prototype.SECONDS_LABEL = '%1 seconds ago';
	Y.Notifications.prototype.sourceNode = null;
	Y.Notifications.prototype.container = null;				// a stored reference to the master <div>
	Y.Notifications.prototype.notificationsNode = null;		// a stored reference to the <ul> with the notifications
	Y.Notifications.prototype.unreadNode = null;			// a stored reference to the <div> that holds the unread text
	Y.Notifications.prototype.notifications = [];
	Y.Notifications.prototype.unread = 0;
	
	/**
	 * This function will parse all notifications found in the node. This is called by the constructor to parse the contained notifications and
	 * add the to the internal state. This method would iterate over whatever element is already configured in the class (inside the sourceNode attribute)
	 * and add each child as a notification 
	 */
	Y.Notifications.prototype.parseNotifications = function() {
		if (!this.sourceNode) {		// undefined, nothing to parse
			return;
		}
		
		var regexpDate = new RegExp("notification:([0-9]+)");
		var dateline = 0;
		var totalChildren = this.sourceNode.children.length;
		
		for (var i = 0; i < totalChildren; i++) {
			var n = this.sourceNode.children[i];
			if (n.tagName.toUpperCase() !== 'LI') {
				continue;
			}
			if (regexpDate.test(n.id)) {
				var results = regexpDate.exec(n.id);
				dateline = results[1];
			}
			this.notifications.push(new Notification(n.innerHTML, dateline));
		}
		this.unread = this.notifications.length;
	};
	
	/**
	 * Special method used to parse time. It receives the time from the notification configuration in a unix timestamp, and from the current time calculates
	 * the difference in hours, minutes and seconds.
	 */
	Y.Notifications.prototype.parseTime = function(present) {
	
		var future = new Date().getTime();
		if (present < 1E12) {		// adjust if only seconds and not millis
			present *= 1000;
		}
		
		var diff = Math.floor(Math.abs(future - present) / 1000);
		var days = Math.floor(diff / 86400);
		var hours = Math.floor(diff % 86400 / 3600);
		var minutes = Math.floor(diff % 3600 / 60);
		var seconds = Math.floor(diff % 3600 % 60);
		
		if (days > 0)
		{
			return days == 1 ?
				this.DAY_LABEL.replace('%1', days) : 
				this.DAYS_LABEL.replace('%1', days); 
		}
		if (hours > 0)
		{
			return hours == 1 ?
				this.HOUR_LABEL.replace('%1', hours) :
				this.HOURS_LABEL.replace('%1', hours); 
		}
		if (minutes > 0)
		{
			return minutes == 1 ? 
				this.MINUTE_LABEL.replace('%1', minutes) : 
				this.MINUTES_LABEL.replace('%1', minutes);
		}
		if (seconds > 0)
		{
			return seconds == 1 ?
				this.SECOND_LABEL.replace('%1', seconds) :
				this.SECONDS_LABEL.replace('%1', seconds);
		}
		return '';
	};
	
	/**
	 * Create the row that will be used to display a single notification. This method checks if the notification should be
	 * linked to something, if it should be added the time detail, and takes care of the format of the notification row
	 * @param {object} n		The details of the notification. This object must at least have a content attribute. Optional attributes are dateline and link. See definition of Notification
	 * @return					A DomElement of type li with the notification content
	 */	
	Y.Notifications.prototype.getNotificationBit = function(n) {
		var li = document.createElement("li");
		var html = '';
		if (n.link) {
			html += '<a href="' + n.link + '" target="_blank">';
		}
		html += n.content;
		if (n.link) {
			html += '</a>';
		}		
		
		html += "<div class=\"time\">" + this.parseTime(n.dateline) + "</div>";
		li.innerHTML = html;
		return li;
	};
	
	/**
	 * The widget displays a message to the user with the amount of notifications that are unread. Since we can add
	 * new notifications programatically, this method can be used to update the "unread" messages part of the UI
	 * and show the actual number of unread messages. This method is called by the addNotification method, so it is
	 * not needed to call it directly, unless you want to change the amount of messages unread to whatever number
	 * @param {int} amount	The amount of unread messages. If ommited, it will just use the store value in the object
	 */
	Y.Notifications.prototype.updateUnread = function(amount) {
		if (amount !== undefined) {
			this.unread = amount;
		}
		if (this.unreadNode) {
			this.unreadNode.innerHTML = this.LABEL_NOTIFICATIONS.replace('%1', this.unread);
		}
	};
	
	/**
	 * Render the notification bar. This method will append to the body of the document a fixed element on the bottom, that holds the notifications
	 * on clicking that element the notifications would be shown
	 */
	Y.Notifications.prototype.render = function() {
	
		var container = document.createElement("div");
		Y.DOM.addClass(container, 'yui3-notifications');
		
		var tab = document.createElement("div");
		Y.DOM.addClass(tab, 'yui3-notifications-tab');
		Y.DOM.addClass(tab, 'closed');
		container.appendChild(tab);
	
		var pop = document.createElement("div");
		Y.DOM.addClass(pop, 'yui3-notifications-pop');
		Y.DOM.setStyle(pop, 'visibility', 'hidden');
		container.appendChild(pop);
	
		var notificationsObj = this;
		tab.onclick = function() { notificationsObj.switchStatus(tab, pop); };
		
		/*
		var border = document.createElement("div");
		Y.DOM.addClass(border, 'border');
		pop.appendChild(border);
		*/
		
		var ul = document.createElement("ul");
		pop.appendChild(ul);
		
		var totalNotifications = this.notifications.length;
		for (var i = 0; i < totalNotifications; i++) {
			var n = this.notifications[i];
			var li = this.getNotificationBit(n);
			ul.appendChild(li);
		}
		
		// append the notifications to the DOM, and remove the source node
		this.container = container;
		this.notificationsNode = ul;
		this.unreadNode = tab;
		
		// update notification status
		this.updateUnread();
		
		// finally append the child
		document.body.appendChild(this.container);
		if (this.sourceNode) {
			this.sourceNode.parentNode.removeChild(this.sourceNode);
		}
	};
	
	/**
	 * This method is called when the user clicks on the tab for notifications,
	 * it shows or hides the notifications depending on the current status
	 */
	Y.Notifications.prototype.switchStatus = function(tab, pop) {
		var tabNode = Y.get(tab);
		var popNode = Y.get(pop);
	
		if (popNode.getStyle('visibility') === 'hidden')	 // opening
		{
			tabNode.addClass('open');
			tabNode.removeClass('closed');

			var oldHeight = pop.offsetHeight;
			popNode.setStyle('visibility', 'visible');
			//popNode.setStyle('height', '0px');
			
			//popNode.setStyle('overflow-y', 'hidden');
			
			/*
			var anim = new Y.Anim({
		        node: popNode,
		        to: {
		            height: oldHeight
		        }});
			anim.set('duration', 0.2);
			anim.on('end', function() {
				//popNode.setStyle('overflow-y', 'auto');			
				});
			anim.run();
			*/
		}
		else
		{
			popNode.setStyle('visibility', 'hidden');
			tabNode.removeClass('open');
			tabNode.addClass('closed');
		}	
	};

	
	/**
	 * Programatically add a new notification. This method is called to insert a new notification into the notifications window. The notification will be added
	 * to the list, and displayed the next time that the user clicks on the tab. We need to send this method an object, containing the properties:
	 *
	 *	content - the content of the notification. Accepts HTML, but should be kept as brief as possible as the space is reduced
	 *  dateline - a unix timestamp, of the date the notification is valid for. This parameter is mandatory, but might receive 0 if you don't want to use it
	 *  link - an optional parameter, with a URL that the notification will be linked to
	 *
	 * @param {object} notification		The details of the notification. This object must at least have a content attribute. Optional attributes are dateline and link. See definition of Notification
	 */
	Y.Notifications.prototype.addNotification = function(notification) {
		if (typeof(notification) !== 'object') {
			return;
		}
		if (!notification.content) {
			return;
		}
		if (!notification.dateline) {
			return;
		}
	
		var n = new Notification(notification.content, notification.dateline, notification.link);
		this.notifications.push(n);
			
		var notificationBit = this.getNotificationBit(n);			
		this.notificationsNode.appendChild(notificationBit);
		
		// update the unread status
		this.unread++;
		this.updateUnread();
	};
	
	
	/*
	 * This method is used to add notifications to the component after an AJAX callback. If the AJAX response is a
	 * notifications object or array, the component is updated with the new notifications. If the response is invalid
	 * in any way no update is made
	 * 
	 * Usually this method is called after you call registerSource() on any notifications object
	 * See the registerSource method for details
	 *
	 * @param {int} transactionId	Unused, the identifier of the AJAX transaction	 
	 * @param {object} response		The AJAX response, with the JSON information
	 */
	Y.Notifications.prototype.addNotificationsFromCallback = function(transactionId, response) {
	
		var obj = null;
		try {
			obj = Y.JSON.parse(response.responseText);
		} catch (ex) {
		}
		
		if (obj.length) {
			for (var i = 0; i < obj.length; i++) {
				this.addNotification(obj[i]);
			}
		}
		else {
			this.addNotification(obj);
		}
	};
	
	/**
	 * Call this method to register a source for updates for the notification. If you need to dynamically update the notifications
	 * area with new content, that comes from the server side, call this method with either a function or a string. The component
	 * will then do an AJAX request to the provided URL and fetch the results. If the results are a valid notification list then
	 * the component will be updated.
	 *
	 * You can either provide a url as the source or a function. If a function is provided, the return value of the function will be
	 * used as the url. This is done to provide flexibility to the caller component for generating the url with as many parameters
	 * as needed
	 *
	 * The url called MUST return a JSON object, in the following format
	 * { content: <content>, dateline: <unix_timestamp>, link: link } 
	 *
	 * If several notifications are included in the same requests, they MUST come in the following format
	 * {[
	 *   { content: <content>, dateline: <unix_timestamp>, link: link },
	 *   { content: <content>, dateline: <unix_timestamp>, link: link }
	 * ]}
	 *
	 * The optional periodicity parameter is the time, in minutes, between requests. If not provided, the default is 1
	 *
	 * @param {string|function} source	The url used for the requests	
	 * @param {int} periodicity			Periodicity for request updates, in minutes
	 */
	Y.Notifications.prototype.registerSource = function(source, periodicity) {
	
		// setup the source for the callback
		var fnSource = null;
		if (typeof(source) === 'string') {
			fnSource = function() { return source; };
		}
		if (typeof(source) === 'function') {
			fnSource = source;
		}
		
		// do an asynchronous callback
		var thisObj = this;
		var callbackFn = function() {
			Y.io(fnSource(), {
					on: {
						complete: thisObj.addNotificationsFromCallback
					},
					context: thisObj
				});			
			};
			
		// register the timeout and do a first call
		this.timeoutId = setInterval(callbackFn, (periodicity || 1) * 60 * 1000);
		callbackFn();
	};



}, 'gallery-2010.04.14-19-47' ,{requires:['dom','node','json-parse','io-base']});
