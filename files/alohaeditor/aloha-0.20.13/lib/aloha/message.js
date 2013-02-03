/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright © 2010-2011 Gentics Software GmbH, aloha@gentics.com
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
['aloha/core', 'util/class', 'aloha/jquery'],
function( Aloha, Class, jQuery ) {
	
	
	var
//		Aloha = window.Aloha,
//		Class = window.Class,
		GENTICS = window.GENTICS;

/**
 * Message Object
 * @namespace Aloha
 * @class Message
 * @constructor
 * @param {Object} data object which contains the parts of the message
 *		title: the title
 *		text: the message text to be displayed
 *		type: one of Aloha.Message.Type
 *		callback: callback function, which will be triggered after the message was confirmed, closed or accepted
 */
Aloha.Message = Class.extend({
	_constructor: function (data) {
		this.title = data.title;
		this.text = data.text;
		this.type = data.type;
		this.callback = data.callback;
	},



	/**
	 * Returns a textual representation of the message
	 * @return textual representation of the message
	 * @hide
	 */
	toString: function () {
	  return this.type + ': ' + this.message;
	}
});

/**
 * Message types enum. Contains all allowed types of messages
 * @property
 */
Aloha.Message.Type = {
	// reserved for messages
	//	SUCCESS : 'success',
	//	INFO : 'info',
	//	WARN : 'warn',
	//	CRITICAL : 'critical',
	CONFIRM : 'confirm', // confirm dialog, like js confirm()
	ALERT : 'alert', // alert dialog like js alert()
	WAIT : 'wait' // wait dialog with loading bar. has to be hidden via Aloha.hideMessage()
};

/**
 * This is the message line
 * @hide
 */
Aloha.MessageLine = Class.extend({
	messages: [],

	/**
	 * Add a new message to the message line
	 * @param message message to add
	 * @return void
	 * @hide
	 */
	add: function(message) {
		var messageline = '',
			messagesLength = this.messages.length,
			i;
		
		// dummy implementation to add a message
		this.messages[messagesLength] = message;
		while(messagesLength > 4) {
			this.messages.shift();
			--messagesLength;
		}

		for ( i = 0; i < messagesLength; i++) {
			messageline += this.messages[i].toString() + '<br/>';
		}
		jQuery('#gtx_aloha_messageline').html(messageline);
	}
});

/**
 * Message Line Object
 * @hide
 */
Aloha.MessageLine = new Aloha.MessageLine();

});
