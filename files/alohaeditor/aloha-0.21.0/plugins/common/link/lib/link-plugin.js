/* link-plugin.js is part of Aloha Editor project http://aloha-editor.org
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
/* Aloha Link Plugin
 * -----------------
 * This plugin provides an interface to allow the user to insert, edit and
 * remove links within an active editable.
 * It presents its user interface in the Toolbar, in a Sidebar panel.
 * Clicking on any links inside the editable activates the this plugin's
 * floating menu scope.
 */
define( [
	'aloha',
	'aloha/plugin',
	'jquery',
	'ui/port-helper-attribute-field',
	'ui/ui',
	'ui/scopes',
	'ui/surface',
	'ui/button',
	'ui/toggleButton',
	'i18n!link/nls/i18n',
	'i18n!aloha/nls/i18n',
	'aloha/console',
	'link/../extra/linklist'
], function (
	Aloha,
	Plugin,
	jQuery,
	AttributeField,
	Ui,
	Scopes,
	Surface,
	Button,
	ToggleButton,
	i18n,
	i18nCore,
	console
) {
	
	
	var GENTICS = window.GENTICS,
	    pluginNamespace = 'aloha-link',
	    oldValue = '',
	    newValue;
	
	return Plugin.create( 'link', {
		/**
		 * Configure the available languages
		 */
		languages: [ 'en', 'de', 'fr', 'ru', 'pl' ],
		
		/**
		 * Default configuration allows links everywhere
		 */
		config: [ 'a' ],
		
		/**
		 * all links that match the targetregex will get set the target
		 * e.g. ^(?!.*aloha-editor.com).* matches all href except aloha-editor.com
		 */
		targetregex: '',
		
		/**
		  * this target is set when either targetregex matches or not set
		  * e.g. _blank opens all links in new window
		  */
		target: '',
		
		/**
		 * all links that match the cssclassregex will get set the css class
		 * e.g. ^(?!.*aloha-editor.com).* matches all href except aloha-editor.com
		 */
		cssclassregex: '',
		
		/**
		  * this target is set when either cssclassregex matches or not set
		  */
		cssclass: '',
		
		/**
		 * the defined object types to be used for this instance
		 */
		objectTypeFilter: [],
		
		/**
		 * handle change on href change
		 * called function ( obj, href, item );
		 */
		onHrefChange: null,
		
		/**
		 * This variable is used to ignore one selection changed event. We need
		 * to ignore one selectionchanged event when we set our own selection.
		 */
		ignoreNextSelectionChangedEvent: false,
		
		/**
		 * Internal update interval reference to work around an ExtJS bug
		 */
		hrefUpdateInt: null,
		
		/**
		 * HotKeys used for special actions
		*/
		hotKey: {
			insertLink: i18n.t('insertLink', 'ctrl+k')
		},
		
		/**
		 * Default input value for a new link
		*/
		hrefValue: 'http://',
		
		/**
		 * Initialize the plugin
		 */
		init: function () {
			var that = this;
			
			if ( typeof this.settings.targetregex != 'undefined' ) {
				this.targetregex = this.settings.targetregex;
			}
			if ( typeof this.settings.target != 'undefined' ) {
				this.target = this.settings.target;
			}
			if ( typeof this.settings.cssclassregex != 'undefined' ) {
				this.cssclassregex = this.settings.cssclassregex;
			}
			if ( typeof this.settings.cssclass != 'undefined' ) {
				this.cssclass = this.settings.cssclass;
			}
			if ( typeof this.settings.objectTypeFilter != 'undefined' ) {
				this.objectTypeFilter = this.settings.objectTypeFilter;
			}
			if ( typeof this.settings.onHrefChange != 'undefined' ) {
				this.onHrefChange = this.settings.onHrefChange;
			}
			if ( typeof this.settings.hotKey != 'undefined' ) {
				jQuery.extend(true, this.hotKey, this.settings.hotKey);
			}
			if ( typeof this.settings.hrefValue != 'undefined' ) {
				this.hrefValue = this.settings.hrefValue;
			}
			
			this.createButtons();
			this.subscribeEvents();
			this.bindInteractions();
			
			Aloha.ready( function () { 
				that.initSidebar( Aloha.Sidebar.right ); 
			} );
		},

		nsSel: function () {
			var stringBuilder = [], prefix = pluginNamespace;
			jQuery.each( arguments, function () {
				stringBuilder.push( '.' + ( this == '' ? prefix : prefix + '-' + this ) );
			} );
			return jQuery.trim(stringBuilder.join(' '));
		},

		//Creates string with this component's namepsace prefixed the each classname
		nsClass: function () {
			var stringBuilder = [], prefix = pluginNamespace;
			jQuery.each( arguments, function () {
				stringBuilder.push( this == '' ? prefix : prefix + '-' + this );
			} );
			return jQuery.trim(stringBuilder.join(' '));
		},

		initSidebar: function ( sidebar ) {
			var pl = this;
			pl.sidebar = sidebar;
			sidebar.addPanel( {
				
				id       : pl.nsClass( 'sidebar-panel-target' ),
				title    : i18n.t( 'floatingmenu.tab.link' ),
				content  : '',
				expanded : true,
				activeOn : 'a, link',
				
				onInit: function () {
					 var that = this,
						 content = this.setContent(
							'<div class="' + pl.nsClass( 'target-container' ) + '"><fieldset><legend>' + i18n.t( 'link.target.legend' ) + '</legend><ul><li><input type="radio" name="targetGroup" class="' + pl.nsClass( 'radioTarget' ) + '" value="_self" /><span>' + i18n.t( 'link.target.self' ) + '</span></li>' + 
							'<li><input type="radio" name="targetGroup" class="' + pl.nsClass( 'radioTarget' ) + '" value="_blank" /><span>' + i18n.t( 'link.target.blank' ) + '</span></li>' + 
							'<li><input type="radio" name="targetGroup" class="' + pl.nsClass( 'radioTarget' ) + '" value="_parent" /><span>' + i18n.t( 'link.target.parent' ) + '</span></li>' + 
							'<li><input type="radio" name="targetGroup" class="' + pl.nsClass( 'radioTarget' ) + '" value="_top" /><span>' + i18n.t( 'link.target.top' ) + '</span></li>' + 
							'<li><input type="radio" name="targetGroup" class="' + pl.nsClass( 'radioTarget' ) + '" value="framename" /><span>' + i18n.t( 'link.target.framename' ) + '</span></li>' + 
							'<li><input type="text" class="' + pl.nsClass( 'framename' ) + '" /></li></ul></fieldset></div>' + 
							'<div class="' + pl.nsClass( 'title-container' ) + '" ><fieldset><legend>' + i18n.t( 'link.title.legend' ) + '</legend><input type="text" class="' + pl.nsClass( 'linkTitle' ) + '" /></fieldset></div>'
						).content; 
					 
					 jQuery( pl.nsSel( 'framename' ) ).live( 'keyup', function () {
						jQuery( that.effective ).attr( 'target', jQuery( this ).val().replace( '\"', '&quot;' ).replace( "'", "&#39;" ) );
					 } );
					 
					 jQuery( pl.nsSel( 'radioTarget' ) ).live( 'change', function () {
						if ( jQuery( this ).val() == 'framename' ) {
							jQuery( pl.nsSel( 'framename' ) ).slideDown();
						} else {
							jQuery( pl.nsSel( 'framename' ) ).slideUp().val( '' );
							jQuery( that.effective ).attr( 'target', jQuery( this ).val() );
						}
					 } );
					 
					 jQuery( pl.nsSel( 'linkTitle' ) ).live( 'keyup', function () {
						jQuery( that.effective ).attr( 'title', jQuery( this ).val().replace( '\"', '&quot;' ).replace( "'", "&#39;" ) );
					 } );
				},
				
				onActivate: function ( effective ) {
					var that = this;
					that.effective = effective;
					if ( jQuery( that.effective ).attr( 'target' ) != null ) {
						var isFramename = true;
						jQuery( pl.nsSel( 'framename' ) ).hide().val( '' );
						jQuery( pl.nsSel( 'radioTarget' ) ).each( function () {
							jQuery( this ).removeAttr('checked');
							if ( jQuery( this ).val() === jQuery( that.effective ).attr( 'target' ) ) {
								isFramename = false;
								jQuery( this ).attr( 'checked', 'checked' );
							}
						} );
						if ( isFramename ) {
							jQuery( pl.nsSel( 'radioTarget[value="framename"]' ) ).attr( 'checked', 'checked' );
							jQuery( pl.nsSel( 'framename' ) )
								.val( jQuery( that.effective ).attr( 'target' ) )
								.show();
						}
					} else {
						jQuery( pl.nsSel( 'radioTarget' ) ).first().attr( 'checked', 'checked' );
						jQuery( that.effective ).attr( 'target', jQuery( pl.nsSel( 'radioTarget' ) ).first().val() );
					}
					
					var that = this;
					that.effective = effective;
					jQuery( pl.nsSel( 'linkTitle' ) ).val( jQuery( that.effective ).attr( 'title' ) );
				}
				
			} );
			
			sidebar.show();
		},
		
		/**
		 * Subscribe for events
		 */
		subscribeEvents: function () {
			var that = this,
			    isEnabled = {};

			// add the event handler for creation of editables
			Aloha.bind('aloha-editable-created', function (event, editable) {
				var config = that.getEditableConfig(editable.obj),
				    enabled = (jQuery.inArray('a', config) !== -1);

				isEnabled[editable.getId()] = enabled;

				if (!enabled) {
					return;
				}

				// enable hotkey for inserting links
				editable.obj.bind('keydown', that.hotKey.insertLink, function() {
					if ( that.findLinkMarkup() ) {
						// open the tab containing the href
						that.hrefField.foreground();
						that.hrefField.focus();
					} else {
						that.insertLink(true);
					}
					return false;
				} );

				editable.obj.find('a').each(function() {
					that.addLinkEventHandlers(this);
				});
			});

			Aloha.bind('aloha-editable-activated', function() {
				if (isEnabled[Aloha.activeEditable.getId()]) {
					that._formatLinkButton.show(true);
					that._insertLinkButton.show(true);
				} else {
					that._formatLinkButton.show(false);
					that._insertLinkButton.show(false);
				}
			});

			var insideLinkScope = false;

			Aloha.bind('aloha-selection-changed', function(event, rangeObject){
				var enteredLinkScope = false;
				if (Aloha.activeEditable && isEnabled[Aloha.activeEditable.getId()]) {
					enteredLinkScope = selectionChangeHandler(that, rangeObject);
					// Only foreground the tab containing the href field
					// the first time the user enters the link scope to
					// avoid intefering with the user's manual tab
					// selection.
					if (enteredLinkScope && insideLinkScope !== enteredLinkScope) {
						that.hrefField.foreground();
					}
				}
				insideLinkScope = enteredLinkScope;
			});
		},

		/**
		 * lets you toggle the link scope to true or false
		 * @param show bool
		 */
		toggleLinkScope: function ( show ) {
			// Check before doing anything as a performance improvement.
			if (this._isScopeActive === show) {
				return;
			}
			this._isScopeActive = show;
			if ( show ) {
				this.hrefField.show();
				this._insertLinkButton.show(false);
				this._removeLinkButton.show(true);
				this._formatLinkButton.setState(true);
				Scopes.enterScope(this.name);
			} else {
				this.hrefField.hide();
				this._insertLinkButton.show(true);
				this._removeLinkButton.show(false);
				this._formatLinkButton.setState(false);
				Scopes.leaveScope(this.name);
			}
		},
		
		/**
		 * Add event handlers to the given link object
		 * @param link object
		 */
		addLinkEventHandlers: function ( link ) {
			var that = this;

			// show pointer on mouse over
			jQuery( link ).mouseenter( function ( e ) {
				Aloha.Log.debug( that, 'mouse over link.' );
				that.mouseOverLink = link;
				that.updateMousePointer();
			} );

			// in any case on leave show text cursor
			jQuery( link ).mouseleave( function ( e ) {
				Aloha.Log.debug( that, 'mouse left link.' );
				that.mouseOverLink = null;
				that.updateMousePointer();
			} );

			// follow link on ctrl or meta + click
			jQuery( link ).click( function ( e ) {
				if ( e.metaKey ) {
					// blur current editable. user is waiting for the link to load
					Aloha.activeEditable.blur();
					// hack to guarantee a browser history entry
					window.setTimeout( function () {
						location.href = e.target;
					}, 0 );
					e.stopPropagation();
					
					return false;
				}
			} );
		},

		/**
		 * Initialize the buttons
		 */
		createButtons: function () {
			var that = this;

			this._formatLinkButton = Ui.adopt("formatLink", ToggleButton, {
				tooltip: i18n.t("button.addlink.tooltip"),
				icon: "aloha-icon aloha-icon-link",
				scope: 'Aloha.continuoustext',
				click: function() {
					that.formatLink();
				}
			});

			this._insertLinkButton = Ui.adopt("insertLink", Button, {
				tooltip: i18n.t("button.addlink.tooltip"),
				icon: "aloha-icon aloha-icon-link",
				scope: 'Aloha.continuoustext',
				click: function() {
					that.insertLink(false);
				}
			});
			
			this.hrefField = AttributeField( {
				name: 'editLink',
				width: 320,
				valueField: 'url',
				cls: 'aloha-link-href-field',
				scope: 'Aloha.continuoustext'
			} );
			this.hrefField.setTemplate( '<span><b>{name}</b><br/>{url}</span>' );
			this.hrefField.setObjectTypeFilter( this.objectTypeFilter );

			this._removeLinkButton = Ui.adopt("removeLink", Button, {
				tooltip: i18n.t("button.removelink.tooltip"),
				icon: "aloha-icon aloha-icon-unlink",
				scope: 'Aloha.continuoustext',
				click: function() {
					that.removeLink();
				}
			});
		},

		/**
		 * Parse a all editables for links and bind an onclick event
		 * Add the link short cut to all edtiables
		 */
		bindInteractions: function () {
			var that = this;

			// update link object when src changes
			this.hrefField.addListener( 'keyup', function ( event ) {
				// Handle ESC key press: We do a rough check to see if the user
				// has entered a link or searched for something
				if ( event.keyCode == 27 ) {
					var curval = that.hrefField.getValue();
					if ( curval[ 0 ] == '/' || // local link
						 curval[ 0 ] == '#' || // inner document link
						 curval.match( /^.*\.([a-z]){2,4}$/i ) || // local file with extension
						 curval.match( /^([a-z]){3,10}:\/\/.+/i ) || // external link (http(s), ftp(s), ssh, file, skype, ... )
						 curval.match( /^(mailto|tel):.+/i ) // mailto / tel link
					) {
						// could be a link better leave it as it is
					} else {
						// the user searched for something and aborted
						var hrefValue = that.hrefField.getValue();
						
						// restore original value and hide combo list
						that.hrefField.setValue( hrefValue );
						
						if ( hrefValue == that.hrefValue || hrefValue == '' ) {
							that.removeLink( false );
						}
						
					}
				}
				
				that.hrefChange();
				
				// Handle the enter key. Terminate the link scope and show the final link.
				if ( event.keyCode == 13 ) {
					// Update the selection and place the cursor at the end of the link.
					var	range = Aloha.Selection.getRangeObject();
					
					// workaround to keep the found markup otherwise removelink won't work
//					var foundMarkup = that.findLinkMarkup( range );
//					console.dir(foundMarkup);
//					that.hrefField.setTargetObject(foundMarkup, 'href');
					
					// We have to ignore the next 2 onselectionchange events.
					// The first one we need to ignore is the one trigger when
					// we reposition the selection to right at the end of the
					// link.
					// Not sure what the next event is yet but we need to
					// ignore it as well, ignoring it prevents the value of
					// hrefField from being set to the old value.
					that.ignoreNextSelectionChangedEvent = true;
					range.startContainer = range.endContainer;
					range.startOffset = range.endOffset;
					range.select();
					that.ignoreNextSelectionChangedEvent = true;
					
					var hrefValue = jQuery( that.hrefField.getInputElem() ).attr( 'value' );
					
					if ( hrefValue == that.hrefValue || hrefValue == '' ) {
						that.removeLink( false );
					}
					
					window.setTimeout( function () {
						Scopes.setScope('Aloha.continuoustext');
					}, 100 );
				} else {
					// Check whether the value in the input field has changed
					// because if it has, then the ui-attribute object's store
					// needs to be cleared. The reason we need to do this
					// clearing is because once the auto-suggeset combo box is
					// shown and/or populated, the next enter keypress event
					// would be handled as if the user is selecting one of the
					// elements in the down down list.
					newValue = jQuery( that.hrefField.getInputElem() ).attr( 'value' );
					if ( oldValue != newValue ) {
						oldValue = newValue;
					}
				}
			} );
			
			jQuery( document )
				.keydown( function ( e ) {
					Aloha.Log.debug( that, 'Meta key down.' );
					that.metaKey = e.metaKey;
					that.updateMousePointer();
				} ).keyup( function ( e ) {
					Aloha.Log.debug( that, 'Meta key up.' );
					that.metaKey = e.metaKey;
					that.updateMousePointer();
				} );
		},
		
		/**
		 * Updates the mouse pointer
		 */
		updateMousePointer: function () {
			if ( this.metaKey && this.mouseOverLink ) {
				Aloha.Log.debug( this, 'set pointer' );
				jQuery( this.mouseOverLink ).removeClass( 'aloha-link-text' );
				jQuery( this.mouseOverLink ).addClass( 'aloha-link-pointer' );
			} else {
				jQuery( this.mouseOverLink ).removeClass( 'aloha-link-pointer' );
				jQuery( this.mouseOverLink ).addClass( 'aloha-link-text' );
			}
		},

		/**
		 * Check whether inside a link tag
		 * @param {GENTICS.Utils.RangeObject} range range where to insert the
		 *			object (at start or end)
		 * @return markup
		 * @hide
		 */
		findLinkMarkup: function ( range ) {
			if ( typeof range == 'undefined' ) {
				range = Aloha.Selection.getRangeObject();
			}
			if ( Aloha.activeEditable ) {
				return range.findMarkup( function () {
					return this.nodeName.toLowerCase() == 'a';
				}, Aloha.activeEditable.obj );
			} else {
				return null;
			}
		},

		/**
		 * Format the current selection or if collapsed the current word as
		 * link. If inside a link tag the link is removed.
		 */
		formatLink: function () {
			if ( Aloha.activeEditable ) {
				if ( this.findLinkMarkup( Aloha.Selection.getRangeObject() ) ) {
					this.removeLink();
				} else {
					this.insertLink();
				}
			}
		},

		/**
		 * Insert a new link at the current selection. When the selection is
		 * collapsed, the link will have a default link text, otherwise the
		 * selected text will be the link text.
		 */
		insertLink: function ( extendToWord ) {
			var that = this,
			    range = Aloha.Selection.getRangeObject(),
			    linkText,
			    newLink;
			
			// There are occasions where we do not get a valid range, in such
			// cases we should not try and add a link
			if ( !( range.startContainer && range.endContainer ) ) {
				return;
			}
			
			// do not nest a link inside a link
			if ( this.findLinkMarkup( range ) ) {
				return;
			}
			
			// activate floating menu tab
			this.hrefField.foreground();
			
			// if selection is collapsed then extend to the word.
			if ( range.isCollapsed() && extendToWord !== false ) {
				GENTICS.Utils.Dom.extendToWord( range );
			}
			if ( range.isCollapsed() ) {
				// insert a link with text here
				linkText = i18n.t( 'newlink.defaulttext' );
				newLink = jQuery( '<a href="' + that.hrefValue + '" class="aloha-new-link">' + linkText + '</a>' );
				GENTICS.Utils.Dom.insertIntoDOM( newLink, range, jQuery( Aloha.activeEditable.obj ) );
				range.startContainer = range.endContainer = newLink.contents().get( 0 );
				range.startOffset = 0;
				range.endOffset = linkText.length;
			} else {
				newLink = jQuery( '<a href="' + that.hrefValue + '" class="aloha-new-link"></a>' );
				GENTICS.Utils.Dom.addMarkup( range, newLink, false );
			}

			Aloha.activeEditable.obj.find( 'a.aloha-new-link' ).each( function ( i ) {
				that.addLinkEventHandlers( this );
				jQuery(this).removeClass( 'aloha-new-link' );
			} );

			range.select();

			// focus has to become before prefilling the attribute, otherwise
			// Chrome and Firefox will not focus the element correctly.
			this.hrefField.focus();
			
			// prefill and select the new href
			// We need this guard because sometimes the element has not yet been initialized
			if ( this.hrefField.hasInputElem() ) {
				jQuery( this.hrefField.getInputElem() ).attr( 'value', that.hrefValue ).select();
			}
			
			this.hrefChange();
		},

		/**
		 * Remove an a tag and clear the current item from the hrefField
		 */
		removeLink: function ( terminateLinkScope ) {
			var	range = Aloha.Selection.getRangeObject(),
			    foundMarkup = this.findLinkMarkup();
			
			// clear the current item from the href field
			this.hrefField.setItem(null);
			if ( foundMarkup ) {
				// remove the link
				GENTICS.Utils.Dom.removeFromDOM( foundMarkup, range, true );

				range.startContainer = range.endContainer;
				range.startOffset = range.endOffset;

				// select the (possibly modified) range
				range.select();
				
				if ( typeof terminateLinkScope == 'undefined' ||
						terminateLinkScope === true ) {
					Scopes.setScope('Aloha.continuoustext');
				}
			}
		},

		/**
		 * Updates the link object depending on the src field
		 */
		hrefChange: function () {
			var that = this;

			// For now hard coded attribute handling with regex.
			// Avoid creating the target attribute, if it's unnecessary, so
			// that XSS scanners (AntiSamy) don't complain.
			if ( this.target != '' ) {
				this.hrefField.setAttribute(
					'target',
					this.target,
					this.targetregex,
					this.hrefField.getValue()
				);
			}
			
			this.hrefField.setAttribute(
				'class',
				this.cssclass,
				this.cssclassregex,
				this.hrefField.getValue()
			);
			
			Aloha.trigger( 'aloha-link-href-change', {
				 obj: that.hrefField.getTargetObject(),
				 href: that.hrefField.getValue(),
				 item: that.hrefField.getItem()
			} );
			
			if ( typeof this.onHrefChange == 'function' ) {
				this.onHrefChange.call(
					this,
					this.hrefField.getTargetObject(),
					this.hrefField.getValue(),
					this.hrefField.getItem()
				);
			}
		},
		
		/**
		 * Make the given jQuery object (representing an editable) clean for saving
		 * Find all links and remove editing objects
		 * @param obj jQuery object to make clean
		 * @return void
		 */
		makeClean: function ( obj ) {
			// find all link tags
			obj.find( 'a' ).each( function () {
				jQuery( this )
					.removeClass( 'aloha-link-pointer' )
					.removeClass( 'aloha-link-text' );
			} );
		}
	} );

	function selectionChangeHandler(that, rangeObject) {
		var foundMarkup,
		    enteredLinkScope = false;

		// Check if we need to ignore this selection changed event for
		// now and check whether the selection was placed within a
		// editable area.
		if (   !that.ignoreNextSelectionChangedEvent
			&& Aloha.Selection.isSelectionEditable()
			&& Aloha.activeEditable != null ) {
			
			foundMarkup = that.findLinkMarkup(rangeObject);
			
			if (foundMarkup) {
				that.toggleLinkScope(true);

				// now we are ready to set the target object
				that.hrefField.setTargetObject(foundMarkup, 'href');

				// if the selection-changed event was raised by the first click interaction on this page
				// the hrefField component might not be initialized. When the user switches to the link
				// tab to edit the link the field would be empty. We check for that situation and add a
				// special interval check to set the value once again
				if (jQuery('#' + that.hrefField.getInputId()).length == 0) {
					// there must only be one update interval running at the same time
					if (that.hrefUpdateInt !== null) {
						clearInterval(that.hrefUpdateInt);
					}
					
					// register a timeout that will set the value as soon as the href field was initialized
					that.hrefUpdateInt = setInterval( function () {
						if (jQuery( '#' + that.hrefField.getInputId()).length > 0) { // the object was finally created
							that.hrefField.setTargetObject(foundMarkup, 'href');
							clearInterval(that.hrefUpdateInt);
						}
					}, 200);
				}
				Aloha.trigger('aloha-link-selected');
				enteredLinkScope = true;
			} else {
				that.toggleLinkScope(false);
				that.hrefField.setTargetObject(null);
				Aloha.trigger('aloha-link-unselected');
			}
		} else {
			that.toggleLinkScope(false);
		}
		
		that.ignoreNextSelectionChangedEvent = false;
		return enteredLinkScope;
	}
} );
