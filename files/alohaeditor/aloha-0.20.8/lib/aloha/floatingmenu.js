/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
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
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
define(
['aloha/core', 'aloha/jquery', 'aloha/ext', 'util/class', 'aloha/console', 'vendor/jquery.store'],
function(Aloha, jQuery, Ext, Class, console) {
	
	var GENTICS = window.GENTICS;

	/**
	 * Constructor for a floatingmenu tab
	 * @namespace Aloha.FloatingMenu
	 * @class Tab
	 * @constructor
	 * @param {String} label label of the tab
	 */
	var Tab = Class.extend({
		_constructor: function(label) {
			this.label = label;
			this.groups = [];
			this.groupMap = {};
			this.visible = true;
		},

		/**
		 * Get the group with given index. If it does not yet exist, create a new one
		 * @method
		 * @param {int} group group index of the group to get
		 * @return group object
		 */
		getGroup: function(group) {
			var groupObject = this.groupMap[group];
			if (typeof groupObject === 'undefined') {
				groupObject = new Group();
				this.groupMap[group] = groupObject;
				this.groups.push(groupObject);
				// TODO resort the groups
			}

			return groupObject;
		},

		/**
		 * Get the EXT component representing the tab
		 * @return EXT component (EXT.Panel)
		 * @hide
		 */
		getExtComponent: function () {
			var that = this;

			if (typeof this.extPanel === 'undefined') {
				// generate the panel here
				this.extPanel = new Ext.Panel({
					'tbar' : [],
					'title' : this.label,
					'style': 'margin-top:0px',
					'bodyStyle': 'display:none',
					'autoScroll': true
				});

				// add the groups
				jQuery.each(this.groups, function(index, group) {
					// let each group generate its ext component and add them to the panel
					that.extPanel.getTopToolbar().add(group.getExtComponent());
				});
			}

			return this.extPanel;
		},

		/**
		 * Recalculate the visibility of all groups within the tab
		 * @hide
		 */
		doLayout: function() {
			var that = this;

			if (Aloha.Log.isDebugEnabled()) {
				Aloha.Log.debug(this, 'doLayout called for tab ' + this.label);
			}
			this.visible = false;

			// check all groups in this tab
			jQuery.each(this.groups, function(index, group) {
				that.visible |= group.doLayout();
			});

			if (Aloha.Log.isDebugEnabled()) {
				Aloha.Log.debug(this, 'tab ' + this.label + (this.visible ? ' is ' : ' is not ') + 'visible now');
			}

			return this.visible;
		}
	});

	/**
	 * Constructor for a floatingmenu group
	 * @namespace Aloha.FloatingMenu
	 * @class Group
	 * @constructor
	 */
	var Group = Class.extend({
		_constructor: function() {
			this.buttons = [];
			this.fields = [];
		},

		/**
		 * Add a button to this group
		 * @param {Button} buttonInfo to add to the group
		 */
		addButton: function(buttonInfo) {
			if (buttonInfo.button instanceof Aloha.ui.AttributeField) {
				if (this.fields.length < 2) {
					this.fields.push(buttonInfo);
				} else {
					throw new Error("Too much fields in this group");
				}
			} else {
				// Every plugin API entryPoint (method) should be securised enough
				// to avoid Aloha to block at startup even
				// if a plugin is badly designed
				if (typeof buttonInfo.button !== "undefined"){
					this.buttons.push(buttonInfo);
				}
			}
		},

		/**
		 * Get the EXT component representing the group (Ext.ButtonGroup)
		 * @return the Ext.ButtonGroup
		 * @hide
		 */
		getExtComponent: function () {
			var that = this, l,
				items = [],
				buttonCount = 0,
				columnCount = 0,
				len, idx, half;


			if (typeof this.extButtonGroup === 'undefined') {
			
				if (this.fields.length > 1) {
					columnCount = 1;
				}

				jQuery.each(this.buttons, function(index, button) {
					// count the number of buttons (large buttons count as 2)
					buttonCount += button.button.size == 'small' ? 1 : 2;
				});
				columnCount = columnCount + Math.ceil(buttonCount / 2);

				len = this.buttons.length;
				idx = 0;
				half =  Math.ceil(this.buttons.length / 2) - this.buttons.length % 2 ;

				if (this.fields.length > 0) {
					that.buttons.push(this.fields[0]);
					items.push(this.fields[0].button.getExtConfigProperties());
				}

				while (--len >= half) {
					items.push(this.buttons[idx++].button.getExtConfigProperties());
				}
				++len;
				if (this.fields.length > 1) {
					that.buttons.push(this.fields[1]);
					items.push(this.fields[1].button.getExtConfigProperties());
				}
				while (--len >=0) {
					items.push(this.buttons[idx++].button.getExtConfigProperties());
				}

				this.extButtonGroup = new Ext.ButtonGroup({
					'columns' : columnCount,
					'items': items
				});
	//			jQuery.each(this.fields, function(id, field){
	//				that.buttons.push(field);
	//			});
				// now find the Ext.Buttons and set to the GENTICS buttons
				jQuery.each(this.buttons, function(index, buttonInfo) {
					buttonInfo.button.extButton = that.extButtonGroup.findById(buttonInfo.button.id);
					// the following code is a work arround because ExtJS initializes later.
					// The ui wrapper store the information and here we use it... ugly.
					// if there are any listeners added before initializing the extButtons
					if ( buttonInfo.button.listenerQueue && buttonInfo.button.listenerQueue.length > 0 ) {
						while ( true ) {
							l = buttonInfo.button.listenerQueue.shift();
							if ( !l ) {break;}
							buttonInfo.button.extButton.addListener(l.eventName, l.handler, l.scope, l.options);
						}
					}
					if (buttonInfo.button.extButton.setObjectTypeFilter) {
						if (buttonInfo.button.objectTypeFilter) {
							buttonInfo.button.extButton.noQuery = false;
						}
						if ( buttonInfo.button.objectTypeFilter == 'all' ) {
							buttonInfo.button.objectTypeFilter = null;
						}
						buttonInfo.button.extButton.setObjectTypeFilter(buttonInfo.button.objectTypeFilter);
						if ( buttonInfo.button.displayField) {
							buttonInfo.button.extButton.displayField = buttonInfo.button.displayField;
						}
						if ( buttonInfo.button.tpl ) {
							buttonInfo.button.extButton.tpl = buttonInfo.button.tpl;
						}
					}
				});
			}

			return this.extButtonGroup;
		},

		/**
		 * Recalculate the visibility of the buttons and the group
		 * @hide
		 */
		doLayout: function () {
			var groupVisible = false,
				that = this;
			jQuery.each(this.buttons, function(index, button) {
				if (typeof button.button !== "undefined") {
					var extButton = that.extButtonGroup.findById(button.button.id),
					buttonVisible = button.button.isVisible() && button.scopeVisible;
					
					if (!extButton) {
						return;
					}
				
					if (buttonVisible && extButton.hidden) {
						extButton.show();
					} else if (!buttonVisible && extButton && !extButton.hidden) {
						extButton.hide();
					}
				
					groupVisible |= buttonVisible;
				}
			});
			if (groupVisible && this.extButtonGroup.hidden) {
				this.extButtonGroup.show();
			} else if (!groupVisible && !this.extButtonGroup.hidden) {
				this.extButtonGroup.hide();
			}
		
			return groupVisible;

		}
	});

	//=========================================================================
	//
	// Floating Menu
	//
	//=========================================================================

	var lastFloatingMenuPos = {
		top: null,
		left: null
	};

	/**
	 * Handler for window scroll event.  Positions the floating menu
	 * appropriately.
	 *
	 * @param {Aloha.FloatingMenu} floatingmenu
	 */
	function onWindowScroll( floatingmenu ) {
		if ( !Aloha.activeEditable ) {
			return;
		}

		var element = floatingmenu.obj;
		var editablePos = Aloha.activeEditable.obj.offset();
		var isTopAligned = floatingmenu.behaviour === 'topalign';
		var isAppended = floatingmenu.behaviour === 'append';
		var isManuallyPinned = floatingmenu.pinned
							 && ( parseInt( element.css( 'left' ), 10 )
								  != ( editablePos.left
									   + floatingmenu.horizontalOffset
									 ) );

		// no calculation when pinned manually or has behaviour 'append'
		if ( isTopAligned && isManuallyPinned || isAppended ) {
			return;
		}

		var floatingmenuHeight = element.height();
		var scrollTop = jQuery( document ).scrollTop();

		// This value is what the top position of the floating menu *would* be
		// if we tried to position it above the active editable.
		var floatingmenuTop = editablePos.top - floatingmenuHeight
		                    + floatingmenu.marginTop
		                    - floatingmenu.topalignOffset;

		// The floating menu does not fit in the space between the top of the
		// viewport and the editable, so position it at the top of the viewport
		// and over the editable.
		if ( scrollTop > floatingmenuTop ) {
			editablePos.top = isTopAligned
							? scrollTop + floatingmenu.marginTop
							: floatingmenu.marginTop;

		// There is enough space on top of the editable to fit the entire
		// floating menu, so we do so.
		} else if ( scrollTop <= floatingmenuTop ) {
			editablePos.top -= floatingmenuHeight
							 + ( isTopAligned
								 ? floatingmenu.marginTop +
								   floatingmenu.topalignOffset
								 : 0 );
		}

		floatingmenu.floatTo( editablePos );
	}

	/**
	 * Aloha's Floating Menu
	 * @namespace Aloha
	 * @class FloatingMenu
	 * @singleton
	 */
	var FloatingMenu = Class.extend({
		/**
		 * Define the default scopes
		 * @property
		 * @type Object
		 */
		scopes: {
			'Aloha.empty' : {
				'name' : 'Aloha.empty',
				'extendedScopes' : [],
				'buttons' : []
			},
			'Aloha.global' : {
				'name' : 'Aloha.global',
				'extendedScopes' : ['Aloha.empty'],
				'buttons' : []
			},
			'Aloha.continuoustext' : {
				'name' : 'Aloha.continuoustext',
				'extendedScopes' : ['Aloha.global'],
				'buttons' : []
			}
		},

		/**
		 * Array of tabs within the floatingmenu
		 * @hide
		 */
		tabs: [],

		/**
		 * 'Map' of tabs (for easy access)
		 * @hide
		 */
		tabMap: {},

		/**
		 * Flag to mark whether the floatingmenu is initialized
		 * @hide
		 */
		initialized: false,

		/**
		 * Array containing all buttons
		 * @hide
		 */
		allButtons: [],

		/**
		 * top part of the floatingmenu position
		 * @hide
		 */
		top: 100,

		/**
		 * left part of the floatingmenu position
		 * @hide
		 */
		left: 100,

		/**
		 * store pinned status - true, if the FloatingMenu is pinned
		 * @property
		 * @type boolean
		 */
		pinned: false,

		/**
		 * just a reference to the jQuery(window) object, which is used quite often
		 */
		window: jQuery(window),

		/**
		 * Aloha.settings.floatingmenu.behaviour
		 * 
		 * Is used to define the floating menu (fm) float behaviour.
		 *
		 * available: 
		 *  'float' (default) the fm will float next to the position where the caret is,
		 *  'topalign' the fm is fixed above the contentEditable which is active,
		 *  'append' the fm is appended to the defined 'element' element position (top/left)
		 */
		behaviour: 'float',

		/**
		 * Aloha.settings.floatingmenu.element
		 *
		 * Is used to define the element where the floating menu is positioned when
		 * Aloha.settings.floatingmenu.behaviour is set to 'append'
		 * 
		 */
		element: 'floatingmenu',

		/**
		 * topalign offset to be used for topalign behavior
		 */
		topalignOffset: 0,
		
		/**
		 * topalign offset to be used for topalign behavior
		 */
		horizontalOffset: 0,
		
		/**
		 * will only be hounoured when behaviour is set to 'topalign'. Adds a margin,
		 * so the floating menu is not directly attached to the top of the page
		 */
		marginTop: 10,
		
		/**
		 * Define whether the floating menu shall be draggable or not via Aloha.settings.floatingmanu.draggable
		 * Default is: true 
		 */
		draggable: true,
		
		/**
		 * Define whether the floating menu shall be pinned or not via Aloha.settings.floatingmanu.pin
		 * Default is: false 
		 */
		pin: false,
		
		/**
		 * A list of all buttons that have been added to the floatingmenu
		 * This needs to be tracked, as adding buttons twice will break the fm
		 */
		buttonsAdded: [],
		
		/**
		 * Will be initialized by checking Aloha.settings.toolbar, which will contain the config for
		 * the floating menu. If there is no config, tabs and groups will be generated programmatically
		 */
		fromConfig: false,

		/**
		 * Initialize the floatingmenu
		 * @hide
		 */
		init: function() {

			// check for behaviour setting of the floating menu
		    if ( Aloha.settings.floatingmenu ) {
		    	if ( typeof Aloha.settings.floatingmenu.draggable ===
				         'boolean' ) {
		    		this.draggable = Aloha.settings.floatingmenu.draggable;
		    	}

				if ( typeof Aloha.settings.floatingmenu.behaviour ===
				         'string' ) {
					this.behaviour = Aloha.settings.floatingmenu.behaviour;
				}

				if ( typeof Aloha.settings.floatingmenu.topalignOffset !==
					    'undefined' ) {
					this.topalignOffset = parseInt(
						Aloha.settings.floatingmenu.topalignOffset, 10 );
				}

				if ( typeof Aloha.settings.floatingmenu.horizontalOffset !==
				         'undefined' ) {
					this.horizontalOffset = parseInt(
						Aloha.settings.floatingmenu.horizontalOffset , 10 );
				}

				if ( typeof Aloha.settings.floatingmenu.marginTop ===
				         'number' ) {
				    this.marginTop = parseInt(
						Aloha.settings.floatingmenu.marginTop , 10 );
				}

				if ( typeof Aloha.settings.floatingmenu.element ===
						'string' ) {
					this.element = Aloha.settings.floatingmenu.element;
				}
				if ( typeof Aloha.settings.floatingmenu.pin ===
						'boolean' ) {
					this.pin = Aloha.settings.floatingmenu.pin;
				}


				if ( typeof Aloha.settings.floatingmenu.width !==
				         'undefined' ) {
					this.width = parseInt( Aloha.settings.floatingmenu.width,
						10 );
				}
		    }

			jQuery.storage = new jQuery.store();

			this.currentScope = 'Aloha.global';

			var that = this;

			this.window.unload(function () {
				// store fm position if the panel is pinned to be able to restore it next time
				if (that.pinned) {
					jQuery.storage.set('Aloha.FloatingMenu.pinned', 'true');
					jQuery.storage.set('Aloha.FloatingMenu.top', that.top);
					jQuery.storage.set('Aloha.FloatingMenu.left', that.left);
					if (Aloha.Log.isInfoEnabled()) {
						Aloha.Log.info(this, 'stored FloatingMenu pinned position {' + that.left
								+ ', ' + that.top + '}');
					}
				} else {
					// delete old localStorages
					jQuery.storage.del('Aloha.FloatingMenu.pinned');
					jQuery.storage.del('Aloha.FloatingMenu.top');
					jQuery.storage.del('Aloha.FloatingMenu.left');
				}
				if (that.userActivatedTab) {
					jQuery.storage.set('Aloha.FloatingMenu.activeTab', that.userActivatedTab);
				}
			}).resize(function () {
				if (that.behaviour === 'float') {
					if (that.pinned) {
						that.fixPinnedPosition();
						that.refreshShadow();
						that.extTabPanel.setPosition(that.left, that.top);
					} else {
						var target = that.calcFloatTarget(Aloha.Selection.getRangeObject());
						if (target) {
							that.floatTo(target);
						}
					}
				}
			});
			Aloha.bind('aloha-ready', function() {
				that.generateComponent();
				that.initialized = true;
			});
			
			if (typeof Aloha.settings.toolbar === 'object') {
				this.fromConfig = true;
			}
		},

		/**
		 * jQuery reference to the extjs tabpanel
		 * @hide
		 */
		obj: null,

		/**
		 * jQuery reference to the shadow obj
		 * @hide
		 */
		shadow: null,

		/**
		 * jQuery reference to the panels body wrap div
		 * @hide
		 */
		panelBody: null,
		
		/**
		 * The panels width
		 * @hide
		 */
		width: 400,

		/**
		 * initialize tabs and groups according to the current configuration
		 */
		initTabsAndGroups: function () {
			var that = this;
			
			// if there is no toolbar config tabs and groups have been initialized before
			if (!this.fromConfig) {
				return;
			}
			
			jQuery.each(Aloha.settings.toolbar.tabs, function (tab, groups) {
				// generate or retrieve tab
				var tabObject = that.tabMap[tab];
				if (typeof tabObject === 'undefined') {
					// the tab object does not yet exist, so create a new tab and add it to the list
					tabObject = new Tab(tab);
					that.tabs.push(tabObject);
					that.tabMap[tab] = tabObject;
				}
				
				// generate groups for current tab
				jQuery.each(groups, function (group, buttons) {
					var groupObject = tabObject.getGroup(group),
						i;

					// now get all the buttons for that group
					jQuery.each(buttons, function (j, button) {
						if (jQuery.inArray(button, that.buttonsAdded) !== -1) {
							// buttons must not be added twice
							console.warn('Skipping button {' + button + '}. A button can\'t be added ' + 
								'to the floating menu twice. Config key: {Aloha.settings.toolbar.' + 
									tab + '.' + group + '}');
									return;
						}
						
						// now add the button to the group
						for (i = 0; i < that.allButtons.length; i++) {
							if (button === that.allButtons[i].button.name) {
								groupObject.addButton(that.allButtons[i]);
								// remember that we've added the button
								that.buttonsAdded.push(that.allButtons[i].button.name);
								break;
							}
						}
					});
				});
			});
		},

		/**
		 * Generate the rendered component for the floatingmenu
		 * @hide
		 */
		generateComponent: function () {
			var that = this, pinTab;

			// initialize tabs and groups first
			this.initTabsAndGroups();

			// Initialize and configure the tooltips
			Ext.QuickTips.init();
			Ext.apply(Ext.QuickTips.getQuickTip(), {
				minWidth : 10
			});

			
			
			if (this.extTabPanel) {
				// TODO dispose of the ext component
			} else {
				
				// Enable or disable the drag functionality
				var dragConfiguration = false;

				if ( that.draggable ) {
					dragConfiguration = {
						insertProxy: false,
						onDrag : function(e) {
							var pel = this.proxy.getEl();
							this.x = pel.getLeft(true);
							this.y = pel.getTop(true);
							this.panel.shadow.hide();
						},
						endDrag : function(e) {
							var top = (that.pinned) ? this.y - jQuery(document).scrollTop() : this.y;
					
							that.left = this.x;
							that.top = top;

							// store the last floating menu position when the floating menu was dragged around
							lastFloatingMenuPos.left = that.left;
							lastFloatingMenuPos.top = that.top;

							this.panel.setPosition(this.x, top);
							that.refreshShadow();
							this.panel.shadow.show();
						}
					};
				}
				// generate the tabpanel object
				this.extTabPanel = new Ext.TabPanel({
					activeTab: 0,
					width: that.width, // 336px this fits the multisplit button and 6 small buttons placed in 3 cols
					plain: false,
					draggable: dragConfiguration,
					floating: {shadow: false},
					defaults: {
						autoScroll: true
					},
					layoutOnTabChange : true,
					shadow: false,
					cls: 'aloha-floatingmenu ext-root',
					listeners : {
						'tabchange' : {
							'fn' : function(tabPanel, tab) {
								if (tab.title != that.autoActivatedTab) {
									if (Aloha.Log.isDebugEnabled()) {
										Aloha.Log.debug(that, 'User selected tab ' + tab.title);
									}
									// remember the last user-selected tab
									that.userActivatedTab = tab.title;
								} else {
									if (Aloha.Log.isDebugEnabled()) {
										Aloha.Log.debug(that, 'Tab ' + tab.title + ' was activated automatically');
									}
								}
								that.autoActivatedTab = undefined;
						
								// ok, this is kind of a hack: when the tab changes, we check all buttons for multisplitbuttons (which have the method setActiveDOMElement).
								// if a DOM Element is queued to be set active, we try to do this now.
								// the reason for this is that the active DOM element can only be set when the multisplit button is currently visible.
								jQuery.each(that.allButtons, function(index, buttonInfo) {
									if (typeof buttonInfo.button !== 'undefined'
										&& typeof buttonInfo.button.extButton !== 'undefined'
										&& buttonInfo.button.extButton !== null
										&& typeof buttonInfo.button.extButton.setActiveDOMElement === 'function') {
										if (typeof buttonInfo.button.extButton.activeDOMElement !== 'undefined') {
											buttonInfo.button.extButton.setActiveDOMElement(buttonInfo.button.extButton.activeDOMElement);
										}
									}
								});
						
								// adapt the shadow
								that.extTabPanel.shadow.show();
								that.refreshShadow();
							}
						}
					},
					enableTabScroll : true
				});
		
		
			}
			// add the tabs
			jQuery.each(this.tabs, function(index, tab) {
				// let each tab generate its ext component and add them to the panel
				try {
					that.extTabPanel.add(tab.getExtComponent());
				} catch(e) {
					Aloha.Log.error(that,"Error while inserting tab: " + e);
				}
			});

			// add the dropshadow
			this.extTabPanel.shadow = jQuery('<div id="aloha-floatingmenu-shadow" class="aloha-shadow">&#160;</div>');
			jQuery('body').append(this.extTabPanel.shadow);

			// add an empty pin tab item, store reference
			pinTab = this.extTabPanel.add({
				title : '&#160;'
			});

			// finally render the panel to the body
			this.extTabPanel.render(document.body);

			// finish the pin element after the FM has rendered (before there are noe html contents to be manipulated
			jQuery(pinTab.tabEl)
				.addClass('aloha-floatingmenu-pin')
				.html('&#160;')
				.mousedown(function (e) {
					that.togglePin();
					// Note: this event is deliberately stopped here, although normally,
					// we would set the flag GENTICS.Aloha.eventHandled instead.
					// But when the event bubbles up, no tab would be selected and
					// the floatingmenu would be rather thin.
					e.stopPropagation();
				});

			// a reference to the panels body needed for shadow size & position
			this.panelBody = jQuery('div.aloha-floatingmenu div.x-tab-panel-bwrap');

			// do the visibility
			this.doLayout();

			// bind jQuery reference to extjs obj
			// this has to be done AFTER the tab panel has been rendered
			this.obj = jQuery(this.extTabPanel.getEl().dom);

			if (jQuery.storage.get('Aloha.FloatingMenu.pinned') == 'true') {
				//this.togglePin();

				this.top = parseInt(jQuery.storage.get('Aloha.FloatingMenu.top'),10);
				this.left = parseInt(jQuery.storage.get('Aloha.FloatingMenu.left'),10);

				// do some positioning fixes
				this.fixPinnedPosition();

				if (Aloha.Log.isInfoEnabled()) {
					Aloha.Log.info(this, 'restored FloatingMenu pinned position {' + this.left + ', ' + this.top + '}');
				}

				this.refreshShadow();
			}

			// set the user activated tab stored in a localStorage
			if (jQuery.storage.get('Aloha.FloatingMenu.activeTab')) {
				this.userActivatedTab = jQuery.storage.get('Aloha.FloatingMenu.activeTab');
			}

			// for now, position the panel somewhere
			this.extTabPanel.setPosition(this.left, this.top);

			// mark the event being handled by aloha, because we don't want to recognize
			// a click into the floatingmenu to be a click into nowhere (which would
			// deactivate the editables)
			this.obj.mousedown(function (e) {
				e.originalEvent.stopSelectionUpdate = true;
				Aloha.eventHandled = true;
				//e.stopSelectionUpdate = true;
			});

			this.obj.mouseup(function (e) {
				e.originalEvent.stopSelectionUpdate = true;
				Aloha.eventHandled = false;
			});

			jQuery( window ).scroll(function() {
				onWindowScroll( that );
			});

			// don't display the drag handle bar / pin when floating menu is not draggable
			if ( !that.draggable ) {
				jQuery('.aloha-floatingmenu').hover( function() {
					jQuery(this).css({background: 'none'});
					jQuery('.aloha-floatingmenu-pin').hide();
				});
			}

			// adjust float behaviour
			if (this.behaviour === 'float') {
				// listen to selectionChanged event
				Aloha.bind('aloha-selection-changed',function(event, rangeObject) {
					if (!that.pinned) {
						var pos = that.calcFloatTarget(rangeObject);
						if (pos) {
							that.floatTo(pos);
						}
					}
				});
			} else if (this.behaviour === 'append' ) {
				var p = jQuery( "#" + that.element );
				var position = p.offset();

				if ( !position ) {
					Aloha.Log.warn(that, 'Invalid element HTML ID for floating menu: ' + that.element);
					return false;
				}

				// set the position so that it does not float on the first editable activation
				this.floatTo( position );
				
				if ( this.pin ) {
					this.togglePin( true );
				}

				Aloha.bind( 'aloha-editable-activated', function( event, data ) {
					if ( that.pinned ) {
						return;
					}
					that.floatTo( position );
				});
				
		    } else if ( this.behaviour === 'topalign' ) {
				// topalign will retain the user's pinned status
				// TODO maybe the pin should be hidden in that case?
				this.togglePin( false );

				// Float the menu to the editable that is activated.
				Aloha.bind( 'aloha-editable-activated', function( event, data ) {
					if ( that.pinned ) {
						return;
					}

					// FIXME: that.obj.height() does not return the correct
					//        height of the editable.  We need to fix this, and
					//        not hard-code the height as we currently do.
					var editable = data.editable.obj;
					var floatingmenuHeight = 90;
					var editablePos = editable.offset();
					var isFloatingmenuAboveViewport = ( (
						editablePos.top - floatingmenuHeight )
						    < jQuery( document ).scrollTop() );

					if ( isFloatingmenuAboveViewport ) {
						// Since we don't have space to place the floatingmenu
						// above the editable, we want to place it over the
						// editable instead.  But if the editable is shorter
						// than the floatingmenu, it would be completely
						// covered by it, and so, in such cases, we position
						// the editable at the bottom of the short editable.
						editablePos.top = ( editable.height()
						         < floatingmenuHeight )
							? editablePos.top + editable.height()
							: jQuery( document ).scrollTop();

						editablePos.top += that.marginTop;
					} else {
						editablePos.top -= floatingmenuHeight
						                 + that.topalignOffset;
					}

					editablePos.left += that.horizontalOffset;

					var HORIZONTAL_PADDING = 10;
					// Calculate by how much the floating menu is pocking
					// outside the width of the viewport.  A positive number
					// means that it is outside the viewport, negative means
					// it is within the viewport.
					var overhang = ( ( editablePos.left + that.width
						+ HORIZONTAL_PADDING ) - jQuery(window).width() );

					if ( overhang > 0 ) {
						editablePos.left -= overhang;	
					}

					that.floatTo( editablePos );
				});
			}
		},

		/**
		 * Fix the position of the pinned floatingmenu to keep it visible
		 */
		fixPinnedPosition: function() {
			// if not pinned, do not fix the position
			if (!this.pinned) {
				return;
			}

			// fix the position of the floatingmenu, to keep it visible
			if (this.top < 30) {
				// from top position, we want to have 30px margin
				this.top = 30;
			} else if (this.top > this.window.height() - this.extTabPanel.getHeight()) {
				this.top = this.window.height() - this.extTabPanel.getHeight();
			}
			if (this.left < 0) {
				this.left = 0;
			} else if (this.left > this.window.width() - this.extTabPanel.getWidth()) {
				this.left = this.window.width() - this.extTabPanel.getWidth();
			}
		},

		/**
		 * reposition & resize the shadow
		 * the shadow must not be repositioned outside this method!
		 * position calculation is based on this.top and this.left coordinates
		 * @method
		 */
		refreshShadow: function (resize) {
			if (this.panelBody) {
				var props = {
					'top': this.top + 24, // 24px top offset to reflect tab bar height
					'left': this.left
				};

				if(typeof resize === 'undefined' || !resize) {
					props.width = this.panelBody.width() + 'px';
					props.height = this.panelBody.height() + 'px';
				}

				this.extTabPanel.shadow.css(props);
			}
		},

		/**
		 * toggles the pinned status of the floating menu
		 * @method
		 * @param {boolean} pinned set to true to activate pin, or set to false to deactivate pin. 
		 *             leave undefined to toggle pin status automatically
		 */
		togglePin: function(pinned) {
			var el = jQuery('.aloha-floatingmenu-pin');
		       
		    if (typeof pinned === 'boolean') {
			this.pinned = !pinned;
		    }
		       
			if (this.pinned) {
				el.removeClass('aloha-floatingmenu-pinned');
				this.top = this.obj.offset().top;

				this.obj.removeClass('fixed').css({
					'top': this.top
				});

				this.extTabPanel.shadow.removeClass('fixed');
				this.refreshShadow();

				this.pinned = false;
			} else {
				el.addClass('aloha-floatingmenu-pinned');
				this.top = this.obj.offset().top - this.window.scrollTop();

				this.obj.addClass('fixed').css({
					'top': this.top // update position for fixed position
				});

				// do the same for the shadow
				this.extTabPanel.shadow.addClass('fixed');//props.start
				this.refreshShadow();

				this.pinned = true;
			}
		},

		/**
		 * Create a new scopes
		 * @method
		 * @param {String} scope name of the new scope (should be namespaced for uniqueness)
		 * @param {String} extendedScopes Array of scopes this scope extends. Can also be a single String if
		 *            only one scope is extended, or omitted if the scope should extend
		 *            the empty scope
		 */
		createScope: function(scope, extendedScopes) {
			if (typeof extendedScopes === 'undefined') {
				extendedScopes = ['Aloha.empty'];
			} else if (typeof extendedScopes === 'string') {
				extendedScopes = [extendedScopes];
			}

			// TODO check whether the extended scopes already exist

			if (this.scopes[scope]) {
				// TODO what if the scope already exists?
			} else {
				// generate the new scope
				this.scopes[scope] = {'name' : scope, 'extendedScopes' : extendedScopes, 'buttons' : []};
			}
		},

		/**
		 * Adds a button to the floatingmenu
		 * @method
		 * @param {String} scope the scope for the button, should be generated before (either by core or the plugin)
		 * @param {Button} button instance of Aloha.ui.button to add at the floatingmenu
		 * @param {String} tab label of the tab to which the button is added
		 * @param {int} group index of the button group in the tab, lowest index is left
		 */
		addButton: function(scope, button, tab, group) {
			// check whether the scope exists
			var
				scopeObject = this.scopes[scope],
				buttonInfo, tabObject, groupObject;
		
			if (!button.name) {
				console.warn('Added button with iconClass {' + button.iconClass + '} which has no property "name"');
			}
	
			if (typeof scopeObject === 'undefined') {
				Aloha.Log.error("Can't add button to given scope since the scope has not yet been initialized.", scope);
				return false;
			}

			// generate a buttonInfo object
			buttonInfo = { 'button' : button, 'scopeVisible' : false };

			// add the button to the list of all buttons
			this.allButtons.push(buttonInfo);

			// add the button to the scope
			scopeObject.buttons.push(buttonInfo);

			// if there is no toolbar config tabs and groups will be generated right away
			if (!this.fromConfig) {
				// get the tab object
				tabObject = this.tabMap[tab];
				if (typeof tabObject === 'undefined') {
					// the tab object does not yet exist, so create a new tab and add it to the list
					tabObject = new Tab(tab);
					this.tabs.push(tabObject);
					this.tabMap[tab] = tabObject;
				}

				// get the group
				groupObject = tabObject.getGroup(group);

				// now add the button to the group
				groupObject.addButton(buttonInfo);
			}

			// finally, when the floatingmenu is already initialized, we need to create the ext component now
			if (this.initialized) {
				this.generateComponent();
			}
		},

		/**
		 * Recalculate the visibility of tabs, groups and buttons (depending on scope and button hiding)
		 * @hide
		 */
		doLayout: function () {
			if (Aloha.Log.isDebugEnabled()) {
				Aloha.Log.debug(this, 'doLayout called for FloatingMenu, scope is ' + this.currentScope);
			}

			// if there's no floatingmenu don't do anything
			if ( typeof this.extTabPanel === 'undefined' ) {
				return false;
			}

			var that = this,
				firstVisibleTab = false,
				activeExtTab = this.extTabPanel.getActiveTab(),
				activeTab = false,
				floatingMenuVisible = false,
				showUserActivatedTab = false,
				pos;
			
			// let the tabs layout themselves
			jQuery.each(this.tabs, function(index, tab) {
				// remember the active tab
				if (tab.extPanel == activeExtTab) {
					activeTab = tab;
				}

				// remember whether the tab is currently visible
				var tabVisible = tab.visible;

				// let each tab generate its ext component and add them to the panel
				if (tab.doLayout()) {
					// found a visible tab, so the floatingmenu needs to be visible as well
					floatingMenuVisible = true;

					// make sure the tabstrip is visible
					if (!tabVisible) {
						if (Aloha.Log.isDebugEnabled()) {
							Aloha.Log.debug(that, 'showing tab strip for tab ' + tab.label);
						}
						that.extTabPanel.unhideTabStripItem(tab.extPanel);
					}

					// remember the first visible tab
					if (!firstVisibleTab) {
						// this is the first visible tab (in case we need to switch to it)
						firstVisibleTab = tab;
					}

					// check whether this visible tab is the last user activated tab and currently not active
					if (that.userActivatedTab == tab.extPanel.title && tab.extPanel != activeExtTab) {
						showUserActivatedTab = tab;
					}
				} else {
					// make sure the tabstrip is hidden
					if (tabVisible) {
						if (Aloha.Log.isDebugEnabled()) {
							Aloha.Log.debug(that, 'hiding tab strip for tab ' + tab.label);
						}
						that.extTabPanel.hideTabStripItem(tab.extPanel);
					}
				}
			});

			// check whether the last tab which was selected by the user is visible and not the active tab
			if (showUserActivatedTab) {
				if (Aloha.Log.isDebugEnabled()) {
					Aloha.Log.debug(this, 'Setting active tab to ' + showUserActivatedTab.label);
				}
				this.extTabPanel.setActiveTab(showUserActivatedTab.extPanel);
			} else if (typeof activeTab === 'object' && typeof firstVisibleTab === 'object') {
				// now check the currently visible tab, whether it is visible and enabled
				if (!activeTab.visible) {
					if (Aloha.Log.isDebugEnabled()) {
						Aloha.Log.debug(this, 'Setting active tab to ' + firstVisibleTab.label);
					}
					this.autoActivatedTab = firstVisibleTab.extPanel.title;
					this.extTabPanel.setActiveTab(firstVisibleTab.extPanel);
				}
			}

			// set visibility of floatingmenu
			if (floatingMenuVisible && this.extTabPanel.hidden) {
				// set the remembered position
				this.extTabPanel.show();
				this.refreshShadow();
				this.extTabPanel.shadow.show();
				this.extTabPanel.setPosition(this.left, this.top);
			} else if (!floatingMenuVisible && !this.extTabPanel.hidden) {
				// remember the current position
				pos = this.extTabPanel.getPosition(true);
				// restore previous position if the fm was pinned
				this.left = pos[0] < 0 ? 100 : pos[0];
				this.top = pos[1] < 0 ? 100 : pos[1];
				this.extTabPanel.hide();
				this.extTabPanel.shadow.hide();
			} /*else {
				var target = that.calcFloatTarget(Aloha.Selection.getRangeObject());
				if (target) {
					this.left = target.left;
					this.top = target.top;
					this.extTabPanel.show();
					this.refreshShadow();
					this.extTabPanel.shadow.show();
					this.extTabPanel.setPosition(this.left, this.top);

					that.floatTo(target);
				}
			}*/

			// let the Ext object render itself again
			this.extTabPanel.doLayout();
		},

		/**
		 * Set the current scope
		 * @method
		 * @param {String} scope name of the new current scope
		 */
		setScope: function(scope) {
			// get the scope object
			var scopeObject = this.scopes[scope];

			if (typeof scopeObject === 'undefined') {
				// TODO log an error
			} else if (this.currentScope != scope) {
				this.currentScope = scope;

				// first hide all buttons
				jQuery.each(this.allButtons, function(index, buttonInfo) {
					buttonInfo.scopeVisible = false;
				});

				// now set the buttons in the given scope to be visible
				this.setButtonScopeVisibility(scopeObject);

				// finally refresh the layout
				this.doLayout();
			}
		},

		/**
		 * Set the scope visibility of the buttons for the given scope. This method will call itself for the motherscopes of the given scope.
		 * @param scopeObject scope object
		 * @hide
		 */
		setButtonScopeVisibility: function(scopeObject) {
			var that = this;

			// set all buttons in the given scope to be visible
			jQuery.each(scopeObject.buttons, function(index, buttonInfo) {
				buttonInfo.scopeVisible = true;
			});

			// now do the recursion for the motherscopes
			jQuery.each(scopeObject.extendedScopes, function(index, scopeName) {
				var motherScopeObject = that.scopes[scopeName];
				if (typeof motherScopeObject === 'object') {
					that.setButtonScopeVisibility(motherScopeObject);
				}
			});
		},

		/**
		 * returns the next possible float target dom obj
		 * the floating menu should only float to h1-h6, p, div, td and pre elements
		 * if the current object is not valid, it's parentNode will be considered, until
		 * the limit object is hit
		 * @param obj the dom object to start from (commonly this would be the commonAncestorContainer)
		 * @param limitObj the object that limits the range (this would be the editable)
		 * @return dom object which qualifies as a float target
		 * @hide
		 */
		nextFloatTargetObj: function (obj, limitObj) {
			// if we've hit the limit object we don't care for it's type
			if (!obj || obj == limitObj) {
				return obj;
			}

			// fm will only float to h1-h6, p, div, td
			switch (obj.nodeName.toLowerCase()) {
				case 'h1':
				case 'h2':
				case 'h3':
				case 'h4':
				case 'h5':
				case 'h6':
				case 'p':
				case 'div':
				case 'td':
				case 'pre':
				case 'ul':
				case 'ol':
					return obj;
				default:
					return this.nextFloatTargetObj(obj.parentNode, limitObj);
			}
		},

		/**
		 * calculates the float target coordinates for a range
		 * @param range the fm should float to
		 * @return object containing left and top coordinates, like { left : 20, top : 43 }
		 * @hide
		 */
		calcFloatTarget: function(range) {
			var
				i, documentWidth, editableLength, left, target,
				targetObj, scrollTop, top;

			// TODO in IE8 somteimes a broken range is handed to this function - investigate this
			if (!Aloha.activeEditable || typeof range.getCommonAncestorContainer === 'undefined') {
				return false;
			}

			// check if the designated editable is disabled
			for ( i = 0, editableLength = Aloha.editables.length; i < editableLength; i++) {
				if (Aloha.editables[i].obj.get(0) == range.limitObject &&
						Aloha.editables[i].isDisabled()) {
					return false;
				}
			}

			target = this.nextFloatTargetObj(range.getCommonAncestorContainer(), range.limitObject);
			if ( ! target ) {
				return false;
			}

			targetObj = jQuery(target);
			scrollTop = GENTICS.Utils.Position.Scroll.top;
			if (!targetObj || !targetObj.offset()) {
				return false;
			}
			top = targetObj.offset().top - this.obj.height() - 50; // 50px offset above the current obj to have some space above

			// if the floating menu would be placed higher than the top of the screen...
			if ( top < scrollTop) {
				top += 80 + GENTICS.Utils.Position.ScrollCorrection.top;
				// 80px if editable element is eg h1; 50px was fine for p;
				// todo: maybe just use GENTICS.Utils.Position.ScrollCorrection.top with a better value?
				// check where this is also used ...
			}

			// if the floating menu would float off the bottom of the screen
			// we don't want it to move, so we'll return false
			if (top > this.window.height() + this.window.scrollTop()) {
				return false;
			}

			// check if the floating menu does not float off the right side
			left = Aloha.activeEditable.obj.offset().left;
			documentWidth = jQuery(document).width();
			if ( documentWidth - this.width < left ) {
					left = documentWidth - this.width - GENTICS.Utils.Position.ScrollCorrection.left;
			}
			
			return {
				left : left,
				top : top
			};
		},

		/**
		 * float the fm to the desired position
		 * the floating menu won't float if it is pinned
		 * @method
		 * @param {Object} coordinate object which has a left and top property
		 */
		floatTo: function(position) {
			// no floating if the panel is pinned
			if (this.pinned) {
				return;
			}

			var floatingmenu = this,
			    fmpos = this.obj.offset(),
				lastLeft,
				lastTop;
			
			if ( lastFloatingMenuPos.left === null ) {
				lastLeft = fmpos.left;
				lastTop = fmpos.top;
			} else {
				lastLeft = lastFloatingMenuPos.left;
				lastTop = lastFloatingMenuPos.top;
			}

			// Place the floatingmenu to the last place the user had seen it,
			// then animate it into its new position.
			if ( lastLeft != position.left || lastTop != position.top ) {
				this.obj.offset({
					left: lastLeft,
					top: lastTop
				});

				this.obj.animate( {
					top: position.top,
					left: position.left
				}, {
					queue : false,
					step : function( step, props ) {
						// update position reference
						if ( props.prop === 'top' ) {
							floatingmenu.top = props.now;
						} else if ( props.prop === 'left' ) {
							floatingmenu.left = props.now;
						}

						floatingmenu.refreshShadow( false );
					},
					complete: function() {
						// When the animation is over, remember the floatingmenu's
						// final resting position.
						lastFloatingMenuPos.left = floatingmenu.left;
						lastFloatingMenuPos.top = floatingmenu.top;
					}
				});
			}
		},

		/**
		 * Hide the floatingmenu
		 */
		hide: function() {
			if (this.obj) {
				this.obj.hide();
			}
			if (this.shadow) {
				this.shadow.hide();
			}
		},

		/**
		 * Activate the tab containing the button with given name.
		 * If the button with given name is not found, nothing changes
		 * @param name name of the button
		 */
		activateTabOfButton: function(name) {
			var tabOfButton = null;

			// find the tab containing the button
			for (var t = 0; t < this.tabs.length && !tabOfButton; t++) {
				var tab = this.tabs[t];
				for (var g = 0; g < tab.groups.length && !tabOfButton; g++) {
					var group = tab.groups[g];
					for (var b = 0; b < group.buttons.length && !tabOfButton; b++) {
						var button = group.buttons[b];
						if (button.button.name == name) {
							tabOfButton = tab;
							break;
						}
					}
				}
			}

			if (tabOfButton) {
				this.userActivatedTab = tabOfButton.label;
				this.doLayout();
			}
		}
	});
	
	var menu =  new FloatingMenu();
	menu.init();
	
	// set scope to empty if deactivated
	Aloha.bind('aloha-editable-deactivated', function() {
		menu.setScope('Aloha.empty');
	});
	
	// set scope to empty if the user selectes a non contenteditable area
	Aloha.bind('aloha-selection-changed', function() {
		if ( !Aloha.Selection.isSelectionEditable() && !Aloha.Selection.isFloatingMenuVisible() ) {
			menu.setScope('Aloha.empty');
		}
	});
	
	return menu;
});

