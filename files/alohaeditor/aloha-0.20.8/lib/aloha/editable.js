/*!
 * This file is part of Aloha Editor Project http://aloha-editor.org
 * Copyright © 2010-2011 Gentics Software GmbH, aloha@gentics.com
 * Contributors http://aloha-editor.org/contribution.php
 * Licensed unter the terms of http://www.aloha-editor.org/license.html
 *
 * Aloha Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * ( at your option ) any later version.*
 *
 * Aloha Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

define( [
	'aloha/core',
	'util/class',
	'aloha/jquery',
	'aloha/pluginmanager',
	'aloha/floatingmenu',
	'aloha/selection',
	'aloha/markup',
	'aloha/contenthandlermanager',
	'aloha/console'
], function( Aloha, Class, jQuery, PluginManager, FloatingMenu, Selection,
	         Markup, ContentHandlerManager, console ) {
	

	var unescape = window.unescape,
	    GENTICS = window.GENTICS,

	    // True, if the next editable activate event should not be handled
	    ignoreNextActivateEvent = false;

	// default supported and custom content handler settings
	// @TODO move to new config when implemented in Aloha
	Aloha.defaults.contentHandler = {};
	Aloha.defaults.contentHandler.initEditable = [ 'sanitize' ];
	Aloha.defaults.contentHandler.getContents = [ 'sanitize' ];

	// The insertHtml contenthandler ( paste ) will, by default, use all
	// registered content handlers.
	//Aloha.defaults.contentHandler.insertHtml = void 0;

	if ( typeof Aloha.settings.contentHandler === 'undefined' ) {
		Aloha.settings.contentHandler = {};
	}

	var defaultContentSerializer = function(editableElement){
		return jQuery(editableElement).html();
	};

	var contentSerializer = defaultContentSerializer;

	/**
	 * Editable object
	 * @namespace Aloha
	 * @class Editable
	 * @method
	 * @constructor
	 * @param {Object} obj jQuery object reference to the object
	 */
	Aloha.Editable = Class.extend( {

		_constructor: function( obj ) {
			// check wheter the object has an ID otherwise generate and set
			// globally unique ID
			if ( !obj.attr( 'id' ) ) {
				obj.attr( 'id', GENTICS.Utils.guid() );
			}

			// store object reference
			this.obj = obj;
			this.originalObj = obj;
			this.ready = false;

			// delimiters, timer and idle for smartContentChange
			// smartContentChange triggers -- tab: '\u0009' - space: '\u0020' - enter: 'Enter'
			// backspace: U+0008 - delete: U+007F
			this.sccDelimiters = [ ':', ';', '.', '!', '?', ',',
				unescape( '%u0009' ), unescape( '%u0020' ), unescape( '%u0008' ), unescape( '%u007F' ), 'Enter' ];
			this.sccIdle = 5000;
			this.sccDelay = 500;
			this.sccTimerIdle = false;
			this.sccTimerDelay = false;

			// see keyset http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/keyset.html
			this.keyCodeMap = {
				 93 : 'Apps',         // The Application key
				 18 : 'Alt',          // The Alt ( Menu ) key.
				 20 : 'CapsLock',     // The Caps Lock ( Capital ) key.
				 17 : 'Control',      // The Control ( Ctrl ) key.
				 40 : 'Down',         // The Down Arrow key.
				 35 : 'End',          // The End key.
				 13 : 'Enter',        // The Enter key.
				112 : 'F1',           // The F1 key.
				113 : 'F2',           // The F2 key.
				114 : 'F3',           // The F3 key.
				115 : 'F4',           // The F4 key.
				116 : 'F5',           // The F5 key.
				117 : 'F6',           // The F6 key.
				118 : 'F7',           // The F7 key.
				119 : 'F8',           // The F8 key.
				120 : 'F9',           // The F9 key.
				121 : 'F10',          // The F10 key.
				122 : 'F11',          // The F11 key.
				123 : 'F12',          // The F12 key.

				// Anybody knows the keycode for F13-F24?
				 36 : 'Home',         // The Home key.
				 45 : 'Insert',       // The Insert ( Ins ) key.
				 37 : 'Left',         // The Left Arrow key.
				224 : 'Meta',         // The Meta key.
				 34 : 'PageDown',     // The Page Down ( Next ) key.
				 33 : 'PageUp',       // The Page Up key.
				 19 : 'Pause',        // The Pause key.
				 44 : 'PrintScreen',  // The Print Screen ( PrintScrn, SnapShot ) key.
				 39 : 'Right',        // The Right Arrow key.
				145 : 'Scroll',       // The scroll lock key
				 16 : 'Shift',        // The Shift key.
				 38 : 'Up',           // The Up Arrow key.
				 91 : 'Win',          // The left Windows Logo key.
				 92 : 'Win'           // The right Windows Logo key.
			};

			this.placeholderClass = 'aloha-placeholder';

			Aloha.registerEditable( this );

			this.init();
		},

		/**
		 * Initialize the editable
		 * @return void
		 * @hide
		 */
		init: function() {
			var me = this;

			// TODO make editables their own settings.
			this.settings = Aloha.settings;

			// smartContentChange settings
			// @TODO move to new config when implemented in Aloha
			if ( Aloha.settings && Aloha.settings.smartContentChange ) {
				if ( Aloha.settings.smartContentChange.delimiters ) {
					this.sccDelimiters = Aloha.settings.smartContentChange.delimiters;
				}

				if ( Aloha.settings.smartContentChange.idle ) {
					this.sccIdle = Aloha.settings.smartContentChange.idle;
				}

				if ( Aloha.settings.smartContentChange.delay ) {
					this.sccDelay = Aloha.settings.smartContentChange.delay;
				}
			}

			// check if Aloha can handle the obj as Editable
			if ( !this.check( this.obj ) ) {
				//Aloha.log( 'warn', this, 'Aloha cannot handle {' + this.obj[0].nodeName + '}' );
				this.destroy();
				return;
			}

			// apply content handler to clean up content
			if ( typeof Aloha.settings.contentHandler.initEditable === 'undefined' ) {
				Aloha.settings.contentHandler.initEditable = Aloha.defaults.contentHandler.initEditable;
			}
			
			var content = me.obj.html();
			content = ContentHandlerManager.handleContent( content, {
				contenthandler: Aloha.settings.contentHandler.initEditable
			} );
			me.obj.html( content );

			// only initialize the editable when Aloha is fully ready (including plugins)
			Aloha.bind( 'aloha-ready', function() {
				// initialize the object
				me.obj.addClass( 'aloha-editable' ).contentEditable( true );

				// add focus event to the object to activate
				me.obj.mousedown( function( e ) {
					// check whether the mousedown was already handled
					if ( !Aloha.eventHandled ) {
						Aloha.eventHandled = true;
						return me.activate( e );
					}
				} );

				me.obj.mouseup( function( e ) {
					Aloha.eventHandled = false;
				} );

				me.obj.focus( function( e ) {
					return me.activate( e );
				} );

				// by catching the keydown we can prevent the browser from doing its own thing
				// if it does not handle the keyStroke it returns true and therefore all other
				// events (incl. browser's) continue
				me.obj.keydown( function( event ) {
					var letEventPass = Markup.preProcessKeyStrokes( event );
					me.keyCode = event.which;
					if (!letEventPass) {
						// the event will not proceed to key press, therefore trigger smartContentChange
						me.smartContentChange( event );
					}
					return letEventPass;
				} );

				// handle keypress
				me.obj.keypress( function( event ) {
					// triggers a smartContentChange to get the right charcode
					// To test try http://www.w3.org/2002/09/tests/keys.html
					Aloha.activeEditable.smartContentChange( event );
				} );

				// handle shortcut keys
				me.obj.keyup( function( event ) {
					if ( event.keyCode === 27 ) {
						Aloha.deactivateEditable();
						return false;
					}
				} );

				// register the onSelectionChange Event with the Editable field
				me.obj.contentEditableSelectionChange( function( event ) {
					Selection.onChange( me.obj, event );
					return me.obj;
				} );

				// mark the editable as unmodified
				me.setUnmodified();

				// we don't do the sanitizing on aloha ready, since some plugins add elements into the content and bind events to it.
				// if we sanitize by replacing the html, all events would get lost. TODO: think about a better solution for the sanitizing, without
				// destroying the events
//				// apply content handler to clean up content
//				var content = me.obj.html();
//				if ( typeof Aloha.settings.contentHandler.initEditable === 'undefined' ) {
//					Aloha.settings.contentHandler.initEditable = Aloha.defaults.contentHandler.initEditable;
//				}
//				content = ContentHandlerManager.handleContent( content, {
//					contenthandler: Aloha.settings.contentHandler.initEditable
//				} );
//				me.obj.html( content );

				me.snapshotContent = me.getContents();

				// FF bug: check for empty editable contents ( no <br>; no whitespace )
				if ( jQuery.browser.mozilla ) {
					me.initEmptyEditable();
				}

				me.initPlaceholder();

				me.ready = true;

				// throw a new event when the editable has been created
				/**
				 * @event editableCreated fires after a new editable has been created, eg. via $( '#editme' ).aloha()
				 * The event is triggered in Aloha's global scope Aloha
				 * @param {Event} e the event object
				 * @param {Array} a an array which contains a reference to the currently created editable on its first position
				 */
				Aloha.trigger( 'aloha-editable-created', [ me ] );
			} );
		},

		/**
		 * True, if this editable is active for editing
		 * @property
		 * @type boolean
		 */
		isActive: false,

		/**
		 * stores the original content to determine if it has been modified
		 * @hide
		 */
		originalContent: null,

		/**
		 * every time a selection is made in the current editable the selection has to
		 * be saved for further use
		 * @hide
		 */
		range: undefined,

		/**
		 * Check if object can be edited by Aloha Editor
		 * @return {boolean } editable true if Aloha Editor can handle else false
		 * @hide
		 */
		check: function() {
			/* TODO check those elements
			'map', 'meter', 'object', 'output', 'progress', 'samp',
			'time', 'area', 'datalist', 'figure', 'kbd', 'keygen',
			'mark', 'math', 'wbr', 'area',
			*/

			// Extract El
			var	me = this,
			    obj = this.obj,
			    el = obj.get( 0 ),
			    nodeName = el.nodeName.toLowerCase(),

				// supported elements
			    textElements = [ 'a', 'abbr', 'address', 'article', 'aside',
						'b', 'bdo', 'blockquote',  'cite', 'code', 'command',
						'del', 'details', 'dfn', 'div', 'dl', 'em', 'footer',
						'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'i',
						'ins', 'menu', 'nav', 'p', 'pre', 'q', 'ruby',
						'section', 'small', 'span', 'strong', 'sub', 'sup',
						'var' ],
			    i, div;

			for ( i = 0; i < textElements.length; ++i ) {
				if ( nodeName === textElements[ i ] ) {
					return true;
				}
			}

			// special handled elements
			switch ( nodeName ) {
				case 'label':
				case 'button':
					// TODO need some special handling.
					break;
				case 'textarea':
					// Create a div alongside the textarea
					div = jQuery( '<div id="' + this.getId() +
							'-aloha" class="aloha-textarea" />' )
								.insertAfter( obj );

					// Resize the div to the textarea and
					// Populate the div with the value of the textarea
					// Then, hide the textarea
					div.height( obj.height() )
					   .width( obj.width() )
					   .html( obj.val() );

					obj.hide();

					// Attach a onsubmit to the form to place the HTML of the
					// div back into the textarea
					obj.parents( 'form:first' ).submit( function() {
						obj.val( me.getContents() );
					} );

					// Swap textarea reference with the new div
					this.obj = div;

					// Supported
					return true;
				default:
					break;
			}

			// the following elements are not supported
			/*
			'canvas', 'audio', 'br', 'embed', 'fieldset', 'hgroup', 'hr',
			'iframe', 'img', 'input', 'map', 'script', 'select', 'style',
			'svg', 'table', 'ul', 'video', 'ol', 'form', 'noscript',
			 */
			return false;
		},

		/**
		 * Init Placeholder
		 *
		 * @return void
		 */
		initPlaceholder: function() {
			if ( Aloha.settings.placeholder && this.isEmpty() ) {
				this.addPlaceholder();
			}
		},

		/**
		 * Check if the conteneditable is empty.
		 *
		 * @return {Boolean}
		 */
		isEmpty: function() {
			var editableTrimedContent = jQuery.trim( this.getContents() ),
				onlyBrTag = ( editableTrimedContent === '<br>' ) ? true : false;
			return ( editableTrimedContent.length === 0 || onlyBrTag );
		},

		/**
		 * Check if the editable div is not empty. Fixes a FF browser bug
		 * see issue: https://github.com/alohaeditor/Aloha-Editor/issues/269
		 *
		 * @return {undefined}
		 */
		initEmptyEditable: function( ) {
			var obj = this.obj;
			if ( this.empty( this.getContents() ) ) {
				jQuery( obj ).prepend( '<br class="aloha-cleanme" />' );
			}
		},

		/**
		 * Add placeholder in editable
		 *
		 * @return void
		 */
		addPlaceholder: function() {
			var div = jQuery( '<div>' ),
			    span = jQuery( '<span>' ),
			    el,
			    obj = this.obj;

			if ( GENTICS.Utils.Dom.allowsNesting( obj[0], div[0] ) ) {
				el = div;
			} else {
				el = span;
			}

			jQuery( obj ).append( el.addClass( this.placeholderClass ) );
			jQuery.each(
				Aloha.settings.placeholder,
				function( selector, selectorConfig ) {
					if ( obj.is( selector ) ) {
						el.html( selectorConfig );
					}
				}
			);

			// remove browser br
			jQuery( 'br', obj ).remove();

			// delete div, span, el;
		},

		/**
		 * remove placeholder from contenteditable. If setCursor is true,
		 * will also set the cursor to the start of the selection. However,
		 * this will be ASYNCHRONOUS, so if you rely on the fact that
		 * the placeholder is removed after calling this method, setCursor
		 * should be false ( or not set )
		 *
		 * @return void
		 */
		removePlaceholder: function( obj, setCursor ) {
			var placeholderClass = this.placeholderClass,
			    range;

			// remove browser br
			// jQuery( 'br', obj ).remove();

			// set the cursor // remove placeholder
			if ( setCursor === true ) {
				range = Selection.getRangeObject();
				if ( !range.select ) {
					return;
				}
				range.startContainer = range.endContainer = obj.get( 0 );
				range.startOffset = range.endOffset = 0;
				range.select();

				window.setTimeout( function() {
					jQuery( '.' + placeholderClass, obj ).remove();
				}, 20 );

			} else {
				jQuery( '.' + placeholderClass, obj ).remove();
			}
		},

		/**
		 * destroy the editable
		 * @return void
		 */
		destroy: function() {
			// leave the element just to get sure
			if ( this === Aloha.getActiveEditable() ) {
				this.blur();

				// also hide the floating menu if the current editable was active
				FloatingMenu.hide();
			}

			// special handled elements
			switch ( this.originalObj.get( 0 ).nodeName.toLowerCase() ) {
				case 'label':
				case 'button':
					// TODO need some special handling.
					break;
				case 'textarea':
					// restore content to original textarea
					this.originalObj.val( this.getContents() );
					this.obj.remove();
					this.originalObj.show();
					break;
				default:
					break;
			}

			// now the editable is not ready any more
			this.ready = false;

			// remove the placeholder if needed.
			this.removePlaceholder( this.obj );

			// initialize the object and disable contentEditable
			// unbind all events
			// TODO should only unbind the specific handlers.
			this.obj.removeClass( 'aloha-editable' )
			    .contentEditable( false )
			    .unbind( 'mousedown click dblclick focus keydown keypress keyup' );

			/* TODO remove this event, it should implemented as bind and unbind
			// register the onSelectionChange Event with the Editable field
			this.obj.contentEditableSelectionChange( function( event ) {
				Aloha.Selection.onChange( me.obj, event );
				return me.obj;
			} );
			*/

			// throw a new event when the editable has been created
			/**
			 * @event editableCreated fires after a new editable has been destroyes, eg. via $( '#editme' ).mahalo()
			 * The event is triggered in Aloha's global scope Aloha
			 * @param {Event} e the event object
			 * @param {Array} a an array which contains a reference to the currently created editable on its first position
			 */
			Aloha.trigger( 'aloha-editable-destroyed', [ this ] );

			// finally register the editable with Aloha
			Aloha.unregisterEditable( this );
		},

		/**
		 * marks the editables current state as unmodified. Use this method to inform the editable
		 * that it's contents have been saved
		 * @method
		 */
		setUnmodified: function() {
			this.originalContent = this.getContents();
		},

		/**
		 * check if the editable has been modified during the edit process#
		 * @method
		 * @return boolean true if the editable has been modified, false otherwise
		 */
		isModified: function() {
			return this.originalContent !== this.getContents();
		},

		/**
		 * String representation of the object
		 * @method
		 * @return Aloha.Editable
		 */
		toString: function() {
			return 'Aloha.Editable';
		},

		/**
		 * check whether the editable has been disabled
		 */
		isDisabled: function() {
			return !this.obj.contentEditable()
				|| this.obj.contentEditable() === 'false';
		},

		/**
		 * disable this editable
		 * a disabled editable cannot be written on by keyboard
		 */
		disable: function() {
			return this.isDisabled() || this.obj.contentEditable( false );
		},

		/**
		 * enable this editable
		 * reenables a disabled editable to be writteable again
		 */
		enable: function() {
			return this.isDisabled() && this.obj.contentEditable( true );
		},


		/**
		 * activates an Editable for editing
		 * disables all other active items
		 * @method
		 */
		activate: function( e ) {
			// get active Editable before setting the new one.
			var oldActive = Aloha.getActiveEditable();

			// We need to ommit this call when this flag is set to true.
			// This flag will only be set to true before the removePlaceholder method
			// is called since that method invokes a focus event which will again trigger
			// this method. We want to avoid double invokation of this method.
			if ( ignoreNextActivateEvent ) {
				ignoreNextActivateEvent = false;
				return;
			}

			// handle special case in which a nested editable is focused by a click
			// in this case the "focus" event would be triggered on the parent element
			// which actually shifts the focus away to it's parent. this if is here to
			// prevent this situation
			if ( e && e.type === 'focus' && oldActive !== null
			     && oldActive.obj.parent().get( 0 ) === e.currentTarget ) {
				return;
			}

			// leave immediately if this is already the active editable
			if ( this.isActive || this.isDisabled() ) {
				// we don't want parent editables to be triggered as well, so return false
				return;
			}

			this.obj.addClass( 'aloha-editable-active' );

			Aloha.activateEditable( this );

			ignoreNextActivateEvent = true;
			this.removePlaceholder ( this.obj, true );
			ignoreNextActivateEvent = false;

			this.isActive = true;

			/**
			 * @event editableActivated fires after the editable has been activated by clicking on it.
			 * This event is triggered in Aloha's global scope Aloha
			 * @param {Event} e the event object
			 * @param {Array} a an array which contains a reference to last active editable on its first position, as well
			 * as the currently active editable on it's second position
			 */
			// trigger a 'general' editableActivated event
			Aloha.trigger( 'aloha-editable-activated', {
				'oldActive' : oldActive,
				'editable'  : this
			} );
		},

		/**
		 * handle the blur event
		 * this must not be attached to the blur event, which will trigger far too often
		 * eg. when a table within an editable is selected
		 * @hide
		 */
		blur: function() {
			this.obj.blur();
			this.isActive = false;
			this.initPlaceholder();
			this.obj.removeClass( 'aloha-editable-active' );

			/**
			 * @event editableDeactivated fires after the editable has been activated by clicking on it.
			 * This event is triggered in Aloha's global scope Aloha
			 * @param {Event} e the event object
			 * @param {Array} a an array which contains a reference to this editable
			 */
			Aloha.trigger( 'aloha-editable-deactivated', { editable : this } );

			/**
			 * @event smartContentChanged
			 */
			Aloha.activeEditable.smartContentChange( { type : 'blur' }, null );
		},

		/**
		 * check if the string is empty
		 * used for zerowidth check
		 * @return true if empty or string is null, false otherwise
		 * @hide
		 */
		empty: function( str ) {
			// br is needed for chrome
			return ( null === str )
				|| ( jQuery.trim( str ) === '' || str === '<br/>' );
		},

		/**
		 * Get the contents of this editable as a HTML string
		 * @method
		 * @return contents of the editable
		 */
		getContents: function( asObject ) {
			var clonedObj = this.obj.clone( false );

			// do core cleanup
			clonedObj.find( '.aloha-cleanme' ).remove();
			this.removePlaceholder( clonedObj );
			PluginManager.makeClean( clonedObj );

			return asObject ? clonedObj.contents() : contentSerializer(clonedObj[0]);
		},

		/**
		 * Set the contents of this editable as a HTML string
		 * @param content as html
		 * @param return as object or html string
		 * @return contents of the editable
		 */
		setContents: function( content, asObject ) {
			var reactivate = null;

			if ( Aloha.getActiveEditable() === this ) {
				Aloha.deactivateEditable();
				reactivate = this;
			}

			this.obj.html( content );

			if ( null !== reactivate ) {
				reactivate.activate();
			}

			this.smartContentChange({type : 'set-contents'});

			return asObject ? this.obj.contents() : contentSerializer(this.obj[0]);
		},

		/**
		 * Get the id of this editable
		 * @method
		 * @return id of this editable
		 */
		getId: function() {
			return this.obj.attr( 'id' );
		},

		/**
		 * Generates and signals a smartContentChange event.
		 *
		 * A smart content change occurs when a special editing action, or a
		 * combination of interactions are performed by the user during the
		 * course of editing within an editable.
		 * The smart content change event would therefore signal to any
		 * component that is listening to this event, that content has been
		 * inserted into the editable that may need to be prococessed in a
		 * special way
		 * This is used for smart actions within the content/while editing.
		 * @param {Event} event
		 * @hide
		 */
		smartContentChange: function( event ) {
			var me = this,
			    uniChar = null,
			    re,
			    match;

			// ignore meta keys like crtl+v or crtl+l and so on
			if ( event && ( event.metaKey || event.crtlKey || event.altKey ) ) {
				return false;
			}

			if ( event && event.originalEvent ) {
				// regex to strip unicode
				re = new RegExp( "U\\+(\\w{4})" );
				match = re.exec( event.originalEvent.keyIdentifier );

				// Use keyIdentifier if available
				if ( event.originalEvent.keyIdentifier && 1 === 2 ) {
					// @fixme: Because of "&& 1 === 2" above, this block is
					// unreachable code
					if ( match !== null ) {
						uniChar = unescape( '%u' + match[1] );
					}
					if ( uniChar === null ) {
						uniChar = event.originalEvent.keyIdentifier;
					}

				// FF & Opera don't support keyIdentifier
				} else {
					// Use among browsers reliable which http://api.jquery.com/keypress
					uniChar = ( this.keyCodeMap[ this.keyCode ] ||
								String.fromCharCode( event.which ) || 'unknown' );
				}
			}

			// handle "Enter" -- it's not "U+1234" -- when returned via "event.originalEvent.keyIdentifier"
			// reference: http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/keyset.html
			if ( jQuery.inArray( uniChar, this.sccDelimiters ) >= 0 ) {
				clearTimeout( this.sccTimerIdle );
				clearTimeout( this.sccTimerDelay );

				this.sccTimerDelay = setTimeout( function() {
					Aloha.trigger( 'aloha-smart-content-changed', {
						'editable'        : me,
						'keyIdentifier'   : event.originalEvent.keyIdentifier,
						'keyCode'         : event.keyCode,
						'char'            : uniChar,
						'triggerType'     : 'keypress', // keypress, timer, blur, paste
						'snapshotContent' : me.getSnapshotContent()
					} );

					console.debug( 'Aloha.Editable',
						'smartContentChanged: event type keypress triggered' );
					/*
					var r = Aloha.Selection.rangeObject;
					if ( r.isCollapsed() && r.startContainer.nodeType == 3 ) {
						var posDummy = jQuery( '<span id="GENTICS-Aloha-PosDummy" />' );
						GENTICS.Utils.Dom.insertIntoDOM(
							posDummy,
							r,
							this.obj,
							null,
							false,
							false
						);
						console.log( posDummy.offset().top, posDummy.offset().left );
						GENTICS.Utils.Dom.removeFromDOM(
							posDummy,
							r,
							false
						);
						r.select();
					}
					*/
				}, this.sccDelay );

			} else if ( event && event.type === 'paste' ) {
				Aloha.trigger( 'aloha-smart-content-changed', {
					'editable'        : me,
					'keyIdentifier'   : null,
					'keyCode'         : null,
					'char'            : null,
					'triggerType'     : 'paste',
					'snapshotContent' : me.getSnapshotContent()
				} );

			} else if ( event && event.type === 'blur' ) {
				Aloha.trigger( 'aloha-smart-content-changed', {
					'editable'        : me,
					'keyIdentifier'   : null,
					'keyCode'         : null,
					'char'            : null,
					'triggerType'     : 'blur',
					'snapshotContent' : me.getSnapshotContent()
				} );

			} else if ( uniChar !== null ) {
				// in the rare case idle time is lower then delay time
				clearTimeout( this.sccTimerDelay );
				clearTimeout( this.sccTimerIdle );
				this.sccTimerIdle = setTimeout( function() {
					Aloha.trigger( 'aloha-smart-content-changed', {
						'editable'        : me,
						'keyIdentifier'   : null,
						'keyCode'         : null,
						'char'            : null,
						'triggerType'     : 'idle',
						'snapshotContent' : me.getSnapshotContent()
					} );
				}, this.sccIdle );
			}
		},

		/**
		 * Get a snapshot of the active editable as a HTML string
		 * @hide
		 * @return snapshot of the editable
		 */
		getSnapshotContent: function() {
			var ret = this.snapshotContent;
			this.snapshotContent = this.getContents();
			return ret;
		}
	} );

	/**
	 * Sets the serializer function to be used for the contents of all editables.
	 *
	 * The default content serializer will just call the jQuery.html()
	 * function on the editable element (which gets the innerHTML property).
	 *
	 * This method is a static class method and will affect the result
	 * of editable.getContents() for all editables that have been or
	 * will be constructed.
	 *
	 * @param serializerFunction
	 *        A function that accepts a DOM element and returns the serialized
	 *        XHTML of the element contents (excluding the start and end tag of
	 *        the passed element).
	 */
	Aloha.Editable.setContentSerializer = function( serializerFunction ) {
		contentSerializer = serializerFunction;
	};
} );
