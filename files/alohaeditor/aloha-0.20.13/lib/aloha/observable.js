/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright � 2010-2011 Gentics Software GmbH, aloha@gentics.com
* Contributors http://aloha-editor.org/contribution.php 
* Licensed unter the terms of http://www.aloha-editor.org/license.html
*//*
* Aloha Editor is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.*
*
* Aloha Editor is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

define(
['aloha/jquery'],
function(jQuery, undefined) {
	
	
	var
		$ = jQuery;

	return {
		_eventHandlers: null,

		/**
		 * Attach a handler to an event
		 *
		 * @param {String} eventType A string containing the event name to bind to
		 * @param {Function} handler A function to execute each time the event is triggered
		 * @param {Object} scope Optional. Set the scope in which handler is executed
		 */
		bind: function(eventType, handler, scope) {
			this._eventHandlers = this._eventHandlers || {};
			if (!this._eventHandlers[eventType]) {
				this._eventHandlers[eventType] = [];
			}
			this._eventHandlers[eventType].push({
				handler: handler,
				scope: (scope ? scope : window)
			});
		},

		/**
		 * Remove a previously-attached event handler
		 *
		 * @param {String} eventType A string containing the event name to unbind
		 * @param {Function} handler The function that is to be no longer executed. Optional. If not given, unregisters all functions for the given event.
		 */
		unbind: function(eventType, handler) {
			this._eventHandlers = this._eventHandlers || {};
			if (!this._eventHandlers[eventType]) {
				return;
			}
			if (!handler) {
				// No handler function given, unbind all event handlers for the eventType
				this._eventHandlers[eventType] = [];
			} else {
				this._eventHandlers[eventType] = $.grep(this._eventHandlers[eventType], function(element) {
					if (element.handler === handler) {
						return false;
					}
					return true;
				});
			}
		},

		/**
		 * Execute all handlers attached to the given event type.
		 * All arguments except the eventType are directly passed to the callback function.
		 *
		 * @param (String} eventType A string containing the event name for which the event handlers should be invoked.
		 */
		trigger: function(eventType) {
			this._eventHandlers = this._eventHandlers || {};
			if (!this._eventHandlers[eventType]) {
				return;
			}

			// preparedArguments contains all arguments except the first one.
			var preparedArguments = [];
			$.each(arguments, function(i, argument) {
				if (i>0) {
					preparedArguments.push(argument);
				}
			});

			$.each(this._eventHandlers[eventType], function(index, element) {
				element.handler.apply(element.scope, preparedArguments);
			});
		},

		/**
		 * Clears all event handlers. Call this method when cleaning up.
		 */
		unbindAll: function() {
			this._eventHandlers = null;
		}
	};
});