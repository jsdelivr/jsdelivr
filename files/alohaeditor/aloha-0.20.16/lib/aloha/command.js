/*!
* CommandManager file is part of Aloha Editor Project http://aloha-editor.org
* Copyright (c) 2010-2011 Gentics Software GmbH, aloha@gentics.com
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
* along with CommandManager program. If not, see <http://www.gnu.org/licenses/>.
*/

define( [ 'aloha/core', 'aloha/registry', 'aloha/engine', 'util/dom', 'aloha/contenthandlermanager' ],
function( Aloha, Registry, Engine, Dom, ContentHandlerManager ) {

//			Action: What the command does when executed via execCommand(). Every command defined
//			in CommandManager specification has an action defined for it in the relevant section. For example, 
//			the bold command's action generally makes the current selection bold, or removes bold if 
//			the selection is already bold. An editing toolbar might provide buttons that execute the
//			action for a command if clicked, or a script might run an action without user interaction
//			to achieve some particular effect.
//			
//			Indeterminate: A boolean value returned by queryCommandIndeterm(), depending on the
//			current state of the document. Generally, a command that has a state defined will be 
//			indeterminate if the state is true for part but not all of the current selection, and a
//			command that has a value defined will be indeterminate if different parts of the 
//			selection have different values. An editing toolbar might display a button or control
//			in a special way if the command is indeterminate, like showing a "bold" button as 
//			partially depressed, or leaving a font size selector blank instead of showing the font
//			size of the current selection. As a rule, a command can only be indeterminate if its
//			state is false, supposing it has a state.
//			
//			State: A boolean value returned by queryCommandState(), depending on the current state
//			of the document. The state of a command is true if it is already in effect, in some 
//			sense specific to the command. Most commands that have a state defined will take opposite
//			actions depending on whether the state is true or false, such as making the selection
//			bold if the state is false and removing bold if the state is true. Others will just 
//			have no effect if the state is true, like the justifyCenter command. Still others will 
//			have the same effect regardless, like the styleWithCss command. An editing toolbar might
//			display a button or control differently depending on the state and indeterminacy of the
//			command.
//			
//			Value: A string returned by queryCommandValue(), depending on the current state of the 
//			document. A command usually has a value instead of a state if the property it modifies 
//			can take more than two different values, like the foreColor command. If the command is 
//			indeterminate, its value is generally based on the start of the selection. Otherwise, 
//			in most cases the value holds true for the entire selection, but see the justifyCenter 
//			command and its three companions for an exception. An editing toolbar might display the
//			value of a command as selected in a drop-down or filled in in a text box, if the command
//			isn't indeterminate.
//			
//			Relevant CSS property: CommandManager is defined for certain inline formatting commands, and 
//			is used in algorithms specific to those commands. It is an implementation detail, and 
//			is not exposed to authors. If a command does not have a relevant CSS property 
//			specified, it defaults to null.

	var CommandManager = {
			
		execCommand: function( commandId, showUi, value, range ) {
			
			// Read current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt( 0 );
			}
			
			// For the insertHTML command we provide contenthandler API
			if ( commandId == 'insertHTML' ) {
				//if (typeof Aloha.settings.contentHandler.insertHtml === 'undefined') {
				//	use all registered content handler; used for copy & paste atm (or write log message)
				//	Aloha.settings.contentHandler.insertHtml = Aloha.defaults.contentHandler.insertHtml;
				//}
				value = ContentHandlerManager.handleContent( value, {
					contenthandler: Aloha.settings.contentHandler.insertHtml
				});
			}

			Engine.execCommand( commandId, showUi, value, range );

			if ( Aloha.getSelection().getRangeCount() ) {
				// Read range after engine modification
				range = Aloha.getSelection().getRangeAt( 0 );

				// FIX: doCleanup should work with W3C range
				var startnode = range.commonAncestorContainer;
				var rangeObject = new window.GENTICS.Utils.RangeObject();
				rangeObject.startContainer = range.startContainer;
				rangeObject.startOffset = range.startOffset;
				rangeObject.endContainer = range.endContainer;
				rangeObject.endOffset = range.endOffset;
				Dom.doCleanup({merge:true, removeempty: false}, rangeObject, startnode);
				rangeObject.select();
			}

			Aloha.trigger('aloha-command-executed', commandId);
		},
		
		// If command is available and not disabled or the active range is not null 
		// the command is enabled
		queryCommandEnabled: function( commandId, range ) {

			// Take current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt(0);
			}
			return Engine.queryCommandEnabled( commandId, range );
		},

		// "Return true if command is indeterminate, otherwise false."
		queryCommandIndeterm: function( commandId, range ) {

			// Take current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt(0);
			}
			return Engine.queryCommandIndeterm( commandId, range );

		},
		
		queryCommandState: function( commandId, range ) {

			// Take current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt(0);
			}
			return Engine.queryCommandState( commandId, range );

		},
		
		// "When the queryCommandSupported(command) method on the HTMLDocument
		// interface is invoked, the user agent must return true if command is
		// supported, and false otherwise."
		queryCommandSupported: function( commandId ) {

			return Engine.queryCommandSupported( commandId );		
		},
		
		queryCommandValue: function( commandId, range ) {

			// Take current selection if not passed
			if ( !range ) {
				if ( !Aloha.getSelection().getRangeCount() ) {
					return;
				}
				range = Aloha.getSelection().getRangeAt(0);
			}

			// "Return command's value."
			return Engine.queryCommandValue( commandId, range );
		},
		querySupportedCommands: function() {

			var 
				commands = [],
				command;
			
			for ( command in Engine.commands ) {
				commands.push( command );
			}
			return commands;
		}
	};
	
	// create an instance
	CommandManager = new ( Registry.extend( CommandManager ) )();
	
	/**
	 * Executes a registered command.
	 * http://aryeh.name/spec/editing/editing.html#methods-of-the-htmldocument-interface
	 * @method
	 * @param command name of the command
	 * @param showUI has no effect for Aloha Editor and is only here because in spec...
	 * @param value depends on the used command and it impementation 
	 * @range optional a range on which the command will be executed if not specified 
	 * 		  the current selection will be used as range
	 */
	Aloha.execCommand = CommandManager.execCommand;
	
	/**
	 * Check wheater the command in enabled.
	 * If command is not supported, raise a NOT_SUPPORTED_ERR exception.
	 * @param command name of the command
	 * @return true if command is enabled, false otherwise.
	 */
	Aloha.queryCommandEnabled = CommandManager.queryCommandEnabled;
	
	/**
	 * Check if the command has an indetermed state. 
	 * If command is not supported, a NOT_SUPPORTED_ERR exception is thrown
	 * If command has no indeterminacy, INVALID_ACCESS_ERR exception is thrown
	 * If command is not enabled, return false.
	 * @param command name of the command
	 * @range optional a range on which the command will be executed if not specified 
	 * 		  the current selection will be used as range
	 * @return true if command is indeterminate, otherwise false.
	 */
	Aloha.queryCommandIndeterm = CommandManager.queryCommandIndeterm;
	
	/**
	 * Returns the state of a given command
	 * If command is not supported, a NOT_SUPPORTED_ERR exception is thrown
	 * If command has no state, an INVALID_ACCESS_ERR exception is thrown
	 * If command is not enabled, return false
	 * If the state override for command is set, it returns the state
	 * @param command name of the command
	 * @return state override or true if command's state is true, otherwise false.
	 */
	Aloha.queryCommandState = CommandManager.queryCommandState;

	/**
	 * Check if a given command is supported
	 * @return true if command is supported, and false otherwise.
	 */
	Aloha.queryCommandSupported = CommandManager.queryCommandSupported;

	/**
	 * Returns the Value of a given Command
	 * If command is not supported, a NOT_SUPPORTED_ERR exception is thrown
	 * If command is not enabled, returns an empty string
	 * If command is "fontSize" and its value override is set, an integer 
	 * number of pixels is returned as font size for the result.
	 * If the value override for command is set, it returns that.
	 * @return command's value.
	 */
	Aloha.queryCommandValue = CommandManager.queryCommandValue;
	
	Aloha.querySupportedCommands = CommandManager.querySupportedCommands;
	
	return CommandManager;
});
