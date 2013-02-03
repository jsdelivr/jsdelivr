/*
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*
*/

define(
['aloha/jquery', 'aloha/plugin', 'aloha/floatingmenu', 'i18n!aloha/nls/i18n'],
	function(jQuery, Plugin, FloatingMenu, i18nCore) {
	
	var
		$ = jQuery,
		GENTICS = window.GENTICS,
		Aloha = window.Aloha;

	/**
	 * register the plugin with unique name
	 */
	var ribbon = Plugin.create('ribbon', {

		
		/**
		 * Initialize the plugin and set initialize flag on true
		 */
		init: function () {

			// Check if the ribbon is enabled
			if (typeof this.settings.enable == 'undefined' || this.settings.enable === true) {
				var that = this;
				
				// flag to mark whether ribbon is visible
				this.visible = false;

				// the ribbon
				this.toolbar = new Ext.Toolbar({
					height: '25px',
					cls: 'ext-root',
					id: 'aloha-ribbon'
				});

				// left spacer to gain some space from the left screen border
				this.toolbar.add(new Ext.Toolbar.Spacer({width: '5'}));
				// icon
				this.icon = new Ext.Toolbar.Spacer();
				this.toolbar.add(this.icon);
				// fill so Aloha.Ribbon everything after it is aligned right
				this.toolbar.add(new Ext.Toolbar.Fill());
				// seperator before the fade out button
				this.toolbar.add(new Ext.Toolbar.Separator());
				// fade out button
				var fadeButton = new Ext.Button({
					iconCls : 'aloha-fade-out',
					handler : function (button) {
						var toolbar = jQuery(that.toolbar.getEl().dom);

						if (button.iconCls == 'aloha-fade-out') {
							toolbar.animate({
								left: '-100%',
								marginLeft: '34px'
							});
							jQuery('body').animate({
								paddingTop: 0
							});
							button.setIconClass('aloha-fade-in');
						} else {
							toolbar.animate({
								left: 0,
								marginLeft: 0
							});
							jQuery('body').animate({
								paddingTop: '30px'
							});
							button.setIconClass('aloha-fade-out');
						}
						that.toolbar.doLayout();
					}
				});
				this.toolbar.add(fadeButton);
				// spacer to gain some space from the right screen border
				this.toolbar.add(new Ext.Toolbar.Spacer({width: '5'}));

				this.toolbar.render(document.body, 0);

				jQuery('body').css('paddingTop', '30px');
			}
		},
		
		/**
		 * Sets the icon class for the ribbon icon
		 * @param {String} iconClass CSS class for the icon
		 */
		setIcon: function (iconClass) {
			if (typeof this.icon.cls !== 'undefined') {
				this.icon.removeClass(this.icon.cls);
			}

			this.icon.addClass(iconClass);
		},

		/**
		 * Adds a Aloha.ui.Button the Ribbon
		 * @param {Button} button Button to be added to the Ribbon
		 */
		addButton: function (button) {
			if (button.menu != null && typeof button.menu === 'object') {
				// build the drop down menu
				var menu = new Ext.menu.Menu();
				jQuery.each(button.menu, function(index, entry) {
					menu.addItem(new Ext.menu.Item({
						text: entry.label,
						icon: entry.icon,
						iconCls: entry.iconClass,
						handler: function() {
							entry.onclick.apply(entry);
						}
					}));
				});
			}

			// configuration for the button
			var buttonConfig = {
				text : button.label,
				enableToggle: button.toggle,
				icon: button.icon,
				pressed : button.pressed,
				iconCls: button.iconClass,
				menu : menu,
				handler : function() {
					if (typeof button.onclick === 'function') {
						button.onclick.apply(button);
					}
					button.pressed = !button.pressed;
				}
			}

			var extButton;

			// Build a split button if we have a menu and a handler
			if (menu && typeof button.onclick == 'function') {
				// build the split button for the menu
				extButton = new Ext.SplitButton(buttonConfig);
			} else {
				// build a normal button
				extButton = new Ext.Button(buttonConfig);
			}

			this.toolbar.insert(this.toolbar.items.getCount() - 3, extButton);
			this.toolbar.doLayout();
		},

		/**
		 * Adds a seperator to the Ribbon.
		 */
		addSeparator: function() {
			this.toolbar.insert(this.toolbar.items.getCount() - 3, new Ext.Toolbar.Separator());
		},

		/**
		 * Shows the ribbAloha.Ribbonon
		 */
		hide: function () {
			jQuery('#aloha-ribbon').fadeOut();
			this.visible = false;
		},

		/**
		 * Hides the ribbon
		 */
		show: function () {
			jQuery('#aloha-ribbon').fadeIn();
			this.visible = true;
		},

		/**
		 * Check whether the ribbon is visible right now
		 * @return true when the ribbon is visible, false when not
		 */
		isVisible: function () {
			return this.visible;
		}
	});

	return ribbon;
});