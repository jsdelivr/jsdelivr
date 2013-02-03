/* position.js is part of Aloha Editor project http://aloha-editor.org
 *
 * Aloha Editor is a WYSIWYG HTML5 inline editing library and editor. 
 * Copyright (c) 2010-2012 Gentics Software GmbH, Vienna, Austria.
 * Contributors http://aloha-editor.org/contribution.php 
 * 
 * Aloha Editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or any later version.
 *
 * Aloha Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * 
 * As an additional permission to the GNU GPL version 2, you may distribute
 * non-source (e.g., minimized or compacted) forms of the Aloha-Editor
 * source code without the copy of the GNU GPL normally required,
 * provided you include this license notice and a URL through which
 * recipients can access the Corresponding Source.
 */
// Start Closure
// Ensure GENTICS Namespace
GENTICS = window.GENTICS || {};
GENTICS.Utils = GENTICS.Utils || {};
define(['jquery'],
function(jQuery) {
	
	
	var
		$ = jQuery,
		GENTICS = window.GENTICS,
		Class = window.Class,
		console = window.console;

/**
 * position utility, which will provide scroll and mouse positions
 * please note that the positions provided by this class are not
 * realtime - instead they are calculated with a 0.5 second delay
 */
GENTICS.Utils.Position = {};

/**
 * jquery reference to the window object
 */
GENTICS.Utils.Position.w = jQuery(window);

/**
 * contains the current scroll top and left position, and indicates if the user is currently scrolling
 * @api
 */
GENTICS.Utils.Position.Scroll = {
		top : 0,
		left : 0,
		isScrolling : false
};

/**
 * contains the scroll corrections to apply on special cases (ribbon for example)
 * @api
 */
GENTICS.Utils.Position.ScrollCorrection = {
		top : 100,
		left : 50
};

/**
 * contains the current mouse position (x,y) as well as an indicator if the mouse is moving
 * @api
 */
GENTICS.Utils.Position.Mouse = {
		x : 0,
		y : 0,
		oldX : 0,
		oldY : 0,
		isMoving : false,
		triggeredMouseStop : true
};

/**
 * contains all mousestop callbacks
 */
GENTICS.Utils.Position.mouseStopCallbacks = [];

/**
 * contains all mousemove callbacks
 */
GENTICS.Utils.Position.mouseMoveCallbacks = [];

/**
 * updates scroll position and the scrolling status
 */
GENTICS.Utils.Position.update = function () {
	// update scroll position
	var
		st = this.w.scrollTop(),
		sl = this.w.scrollLeft(),
		i;

	if (this.Scroll.isScrolling) {
		if (this.Scroll.top == st && this.Scroll.left == sl) {
			// stopped scrolling
			this.Scroll.isScrolling = false;
		}
	} else {
		if (this.Scroll.top != st || this.Scroll.left != sl) {
			// started scrolling
			this.Scroll.isScrolling = true;
		}
	}

	// update scroll positions
	this.Scroll.top = st;
	this.Scroll.left = sl;

	// check wether the user has stopped moving the mouse
	if (this.Mouse.x == this.Mouse.oldX && this.Mouse.y == this.Mouse.oldY) {
		this.Mouse.isMoving = false;
		// now check if we've triggered the mousestop event
		if (!this.Mouse.triggeredMouseStop) {
			this.Mouse.triggeredMouseStop = true;
			// iterate callbacks
			for (i=0; i<this.mouseStopCallbacks.length; i++) {
				this.mouseStopCallbacks[i].call();
			}
		}
	} else {
		this.Mouse.isMoving = true;
		this.Mouse.triggeredMouseStop = false;
		// iterate callbacks
		for (i=0; i<this.mouseMoveCallbacks.length; i++) {
			this.mouseMoveCallbacks[i].call();
		}
	}

	// update mouse positions
	this.Mouse.oldX = this.Mouse.x;
	this.Mouse.oldY = this.Mouse.y;
};

/**
 * adds a callback method which is invoked when the mouse has stopped moving
 * @param	callback	the callback method to be invoked
 * @return	index of the callback
 */
GENTICS.Utils.Position.addMouseStopCallback = function (callback) {
	this.mouseStopCallbacks.push(callback);
	return (this.mouseStopCallbacks.length - 1);
};

/**
 * adds a callback method which is invoked when the mouse is moving
 * @param	callback	the callback method to be invoked
 * @return	index of the callback
 */
GENTICS.Utils.Position.addMouseMoveCallback = function (callback) {
	this.mouseMoveCallbacks.push(callback);
	return (this.mouseMoveCallbacks.length - 1);
};


// Mousemove Hooks
jQuery(function () {
	window.setInterval(function (){
		GENTICS.Utils.Position.update();
	}, 500);
});

jQuery('html').mousemove(function (e) {
	GENTICS.Utils.Position.Mouse.x = e.pageX;
	GENTICS.Utils.Position.Mouse.y = e.pageY;
});

});
