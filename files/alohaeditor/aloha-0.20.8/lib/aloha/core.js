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

[
	'aloha/jquery',
	'aloha/pluginmanager'
],

function ( jQuery, PluginManager ) {
	

	// Aloha Editor does not support Internet Explorer 6.  ExtJS style fixes for
	// IE6 which are applied through the "ext-ie6" class cause visual bugs in
	// IE9, and so we remove it so that IE6 fixes are not applied.
	Aloha.ready(function() {
		jQuery('.ext-ie6').removeClass('ext-ie6');
	});

	//----------------------------------------
	// Private variables
	//----------------------------------------
	
	/**
	 * Hash table that will be populated through the loadPlugins method.
	 * Maps the names of plugins with their urls for easy assess in the getPluginsUrl method
	 */
	var pluginPaths = {};

	/**
	 * Base Aloha Object
	 * @namespace Aloha
	 * @class Aloha The Aloha base object, which contains all the core functionality
	 * @singleton
	 */
	jQuery.extend(true, Aloha, {

		/**
		 * The Aloha Editor Version we are using
		 * It should be set by us and updated for the particular branch
		 * @property
		 */
		version: '0.10.0',

		/**
		 * Array of editables that are managed by Aloha
		 * @property
		 * @type Array
		 */
		editables: [],

		/**
		 * The currently active editable is referenced here
		 * @property
		 * @type Aloha.Editable
		 */
		activeEditable: null,

		/**
		 * settings object, which will contain all Aloha settings
		 * @cfg {Object} object Aloha's settings
		 */
		settings: {},
		
		/**
		 * defaults object, which will contain all Aloha defaults
		 * @cfg {Object} object Aloha's settings
		 */
		defaults: {},
		
		/**
		 * Namespace for ui components
		 */
		ui: {},
		
		/**
		 * This represents the name of the users OS. Could be:
		 * 'Mac', 'Linux', 'Win', 'Unix', 'Unknown'
		 * @property
		 * @type string
		 */
		OSName: 'Unknown',

		/**
		 * Which stage is the aloha init process at?
		 * @property
		 * @type string
		 */
		stage: 'loadingAloha',

		/**
		 * A list of loaded plugin names. Available after the
		 * "loadPlugins" stage.
		 *
		 * @property
		 * @type array
		 * @internal
		 */
		loadedPlugins: [],

		requirePaths: [],
		/**
		 * Initialize the initialization process
		 */
		init: function () {
				
			// merge defaults and settings and provide all in settings
			Aloha.settings = jQuery.extendObjects( true, {}, Aloha.defaults, Aloha.settings );

			// initialize rangy. This is probably necessary here,
			// because due to the current loading mechanism, rangy
			// doesn't initialize itself in all browsers
			if (window.rangy) {
				window.rangy.init();
			}
			
			// Load & Initialise
			Aloha.stage = 'loadPlugins';
			Aloha.loadPlugins(function(){
				Aloha.stage = 'initAloha';
				Aloha.initAloha(function(){
					Aloha.stage = 'initPlugins';
					Aloha.initPlugins(function(){
						Aloha.stage = 'initGui';
						Aloha.initGui(function(){
							Aloha.stage = 'alohaReady';
							Aloha.trigger('aloha-ready');
						});
					});
				});
			});
		},

		/**
		 * Load Plugins
		 */
		loadPlugins: function (next) {
			// contains an array like [common/format, common/block]
			var configuredPluginsWithBundle = this.getPluginsToBeLoaded();

			if (configuredPluginsWithBundle.length) {
				var paths = {},
				    pluginNames = [],
				    requiredInitializers = [],
				    pathsToPlugins = {};

				// Background: We do not use CommonJS packages for our Plugins
				// as this breaks the loading order when these modules have
				// other dependencies.
				// We "emulate" the commonjs modules with the path mapping.
				/* require(
				 *  { paths: {
				 *      'format': 'plugins/common/format/lib',
				 *      'format/nls': 'plugins/common/format/nls',
				 *      ... for every plugin ...
				 *    }
				 *  },
				 *  ['format/format-plugin', ... for every plugin ...],
				 *  next <-- when everything is loaded, we continue
				 */
				jQuery.each(configuredPluginsWithBundle, function (i, configuredPluginWithBundle) {
					var tmp, bundleName, pluginName, bundlePath = '';

					tmp = configuredPluginWithBundle.split('/');
					bundleName = tmp[0];
					pluginName = tmp[1];

					// TODO assertion if pluginName or bundleName NULL _-> ERROR!!

					if (Aloha.settings.basePath) {
						bundlePath = Aloha.settings.basePath;
					}

					if (Aloha.settings.bundles && Aloha.settings.bundles[bundleName]) {
						bundlePath += Aloha.settings.bundles[bundleName];
					} else {
						bundlePath += '../plugins/' + bundleName;
					}

					pluginNames.push(pluginName);
					paths[pluginName] = bundlePath + '/' + pluginName + '/lib';

					pathsToPlugins[pluginName] = bundlePath + '/' + pluginName;

					// As the "nls" path lies NOT inside /lib/, but is a sibling to /lib/, we need
					// to register it explicitely. The same goes for the "css" folder.
					jQuery.each(['nls', 'css', 'vendor', 'res'], function() {
						paths[pluginName + '/' + this] = bundlePath + '/' + pluginName + '/' + this;
					});

					requiredInitializers.push(pluginName + '/' + pluginName + '-plugin');
				});

				this.loadedPlugins = pluginNames;
				this.requirePaths = paths;
				
				// Main Require.js loading call, which fetches all the plugins.
				require(
					{
						context: 'aloha',
						paths: paths,
						locale: this.settings.locale || this.defaults.locale || 'en'
					},
					requiredInitializers,
					next
				);

				pluginPaths = pathsToPlugins;
			} else {
				next();
			}
		},

		/**
		 * Fetches plugins the user wants to have loaded. Returns all plugins the user
		 * has specified with the data-plugins property as array, with the bundle
		 * name in front.
		 * It's also possible to use 'Aloha.settings.plugins.load' to define the plugins
		 * to load.
		 *
		 * @return array
		 * @internal
		 */
		getPluginsToBeLoaded: function() {
			// look for data-aloha-plugins attributes and load values
			var
				plugins = jQuery('[data-aloha-plugins]').data('aloha-plugins');

			// load aloha plugins from config
			if ( typeof Aloha.settings.plugins != 'undefined' && typeof Aloha.settings.plugins.load != 'undefined' ) {
				plugins = Aloha.settings.plugins.load;
				if (plugins instanceof Array) {
					return plugins;
				}
			}

			// Determine Plugins
			if ( typeof plugins === 'string' && plugins !== "") {
				return plugins.replace(/\s+/g, '').split(',');
			}
			// Return
			return [];
		},

		/**
		 * Returns list of loaded plugins (without Bundle name)
		 *
		 * @return array
		 */
		getLoadedPlugins: function() {
			return this.loadedPlugins;
		},

		/**
		 * Returns true if a certain plugin is loaded, false otherwise.
		 */
		isPluginLoaded: function(pluginName) {
			var found = false;
			jQuery.each(this.loadedPlugins, function() {
				if (pluginName.toString() === this.toString()) {
					found = true;
				}
			});
			return found;
		},

		/**
		 * Initialise Aloha
		 */
		initAloha: function(next){
			// check browser version on init
			// this has to be revamped, as
			if (jQuery.browser.webkit && parseFloat(jQuery.browser.version) < 532.5 || // Chrome/Safari 4
				jQuery.browser.mozilla && parseFloat(jQuery.browser.version) < 1.9 || // FF 3.5
				jQuery.browser.msie && jQuery.browser.version < 7 || // IE 7
				jQuery.browser.opera && jQuery.browser.version < 11 ) { // right now, Opera needs some work
				if (window.console && window.console.log) {
					window.console.log( 'Your browser is not supported.' );
				}
			}

			// register the body click event to blur editables
			jQuery('html').mousedown(function(e) {
				// if an Ext JS modal is visible, we don't want to loose the focus on
				// the editable as we assume that the user must have clicked somewhere
				// in the modal... where else could he click?
				// loosing the editable focus in this case hinders correct table
				// column/row deletion, as the table module will clean it's selection
				// as soon as the editable is deactivated. Fusubscriberthermore you'd have to
				// refocus the editable again, which is just strange UX
				if (Aloha.activeEditable && !Aloha.isMessageVisible() && !Aloha.eventHandled) {
					Aloha.activeEditable.blur();
					Aloha.activeEditable = null;
				}
			}).mouseup(function(e) {
				Aloha.eventHandled = false;
			});
			
			// Initialise the base path to the aloha files
			Aloha.settings.base = Aloha.getAlohaUrl();

			// initialize the Log
			Aloha.Log.init();

			// initialize the error handler for general javascript errors
			if ( Aloha.settings.errorhandling ) {
				window.onerror = function (msg, url, linenumber) {
					Aloha.Log.error(Aloha, 'Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
					// TODO eventually add a message to the message line?
					return true;
				};
			}

			// OS detection
			if (navigator.appVersion.indexOf('Win') != -1) {
				Aloha.OSName = 'Win';
			}
			if (navigator.appVersion.indexOf('Mac') != -1) {
				Aloha.OSName = 'Mac';
			}
			if (navigator.appVersion.indexOf('X11') != -1) {
				Aloha.OSName = 'Unix';
			}
			if (navigator.appVersion.indexOf('Linux') != -1) {
				Aloha.OSName = 'Linux';
			}

			try {
				// this will disable browsers image resizing facilities
				// disable resize handles
				var supported;
				try {
					supported = document.queryCommandSupported( 'enableObjectResizing' );
				} catch ( e ) {
					supported = false;
					Aloha.Log.log( 'enableObjectResizing is not supported.' );
				}
				
				if ( supported ) {
					document.execCommand( 'enableObjectResizing', false, false);
					Aloha.Log.log( 'enableObjectResizing disabled.' );
				}
			} catch (e) {
				Aloha.Log.error( e, 'Could not disable enableObjectResizing' );
				// this is just for others, who will not support disabling enableObjectResizing
			}
			// Forward
			next();
		},

		/**
		 * Loads plugins Aloha
		 * @return void
		 */
		initPlugins: function (next) {
			PluginManager.init(function(){
				next();
			}, this.getLoadedPlugins() );
		},

		/**
		 * Loads GUI components
		 * @return void
		 */
		initGui: function (next) {
			
			Aloha.RepositoryManager.init();

			// activate registered editables
			for (var i = 0, editablesLength = Aloha.editables.length; i < editablesLength; i++) {
				if ( !Aloha.editables[i].ready ) {
					Aloha.editables[i].init();
				}
			}

			// Forward
			next();
		},

		/**
		 * Activates editable and deactivates all other Editables
		 * @param {Editable} editable the Editable to be activated
		 * @return void
		 */
		activateEditable: function (editable) {

			// blur all editables, which are currently active
			for (var i = 0, editablesLength = Aloha.editables.length; i < editablesLength; i++) {
				if (Aloha.editables[i] != editable && Aloha.editables[i].isActive) {
					Aloha.editables[i].blur();
				}
			}

			Aloha.activeEditable = editable;
		},

		/**
		 * Returns the current Editable
		 * @return {Editable} returns the active Editable
		 */
		getActiveEditable: function() {
			return Aloha.activeEditable;
		},

		/**
		 * deactivated the current Editable
		 * @return void
		 */
		deactivateEditable: function () {

			if ( typeof Aloha.activeEditable === 'undefined' || Aloha.activeEditable === null ) {
				return;
			}

			// blur the editable
			Aloha.activeEditable.blur();
			Aloha.activeEditable = null;
		},

		/**
		 * Gets an editable by an ID or null if no Editable with that ID registered.
		 * @param {string} id the element id to look for.
		 * @return {Aloha.Editable} editable
		 */
		getEditableById: function (id) {

			// if the element is a textarea than route to the editable div
			if (jQuery('#'+id).get(0).nodeName.toLowerCase() === 'textarea' ) {
				id = id + '-aloha';
			}

			// serach all editables for id
			for (var i = 0, editablesLength = Aloha.editables.length; i < editablesLength; i++) {
				if (Aloha.editables[i].getId() == id) {
					return Aloha.editables[i];
				}
			}

			return null;
		},

		/**
		 * Checks wheater an object is a registered Aloha Editable.
		 * @param {jQuery} obj the jQuery object to be checked.
		 * @return {boolean}
		 */
		isEditable: function (obj) {
			for (var i=0, editablesLength = Aloha.editables.length; i < editablesLength; i++) {
				if ( Aloha.editables[i].originalObj.get(0) === obj ) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Logs a message to the console
		 * @param level Level of the log ("error", "warn" or "info", "debug")
		 * @param component Component that calls the log
		 * @param message log message
		 * @return void
		 * @hide
		 */
		log: function(level, component, message) {
			if (typeof Aloha.Log !== "undefined")
				Aloha.Log.log(level, component, message);
		},
		
		/**
		 * Register the given editable
		 * @param editable editable to register
		 * @return void
		 * @hide
		 */
		registerEditable: function (editable) {
			Aloha.editables.push(editable);
		},

		/**
		 * Unregister the given editable. It will be deactivated and removed from editables.
		 * @param editable editable to unregister
		 * @return void
		 * @hide
		 */
		unregisterEditable: function (editable) {

			// Find the index
			var id = Aloha.editables.indexOf( editable );
			// Remove it if really found!
			if (id != -1) {
				Aloha.editables.splice(id, 1);
			}
		},

		/**
		 * String representation
		 * @hide
		 */
		toString: function () {
			return 'Aloha';
		},

		/**
		 * Check whether at least one editable was modified
		 * @method
		 * @return {boolean} true when at least one editable was modified, false if not
		 */
		isModified: function () {
			// check if something needs top be saved
			for (var i = 0; i < Aloha.editables.length; i++) {
				if (Aloha.editables[i].isModified && Aloha.editables[i].isModified()) {
					return true;
				}
			}

			return false;
		},

		/**
		 * Determines the Aloha Url
		 * Uses Aloha.settings.baseUrl if set.
		 * @method
		 * @return {String} alohaUrl
		 */
		getAlohaUrl: function( suffix ) {
			// aloha base path is defined by a script tag with 2 data attributes
			var requireJs = jQuery('[data-aloha-plugins]'),
				baseUrl = ( requireJs.length ) ? requireJs[0].src.replace( /\/?aloha.js$/ , '' ) : '';
			
			if ( typeof Aloha.settings.baseUrl === "string" ) {
				baseUrl = Aloha.settings.baseUrl;
			}
			
			return baseUrl;
		},

		/**
		 * Gets the Plugin Url
		 * @method
		 * @param {String} name
		 * @return {String} url
		 */
		getPluginUrl: function (name) {
			var url;

			if (name) {
				url = pluginPaths[name];
				if(url) {
					//Check if url is absolute and attach base url if it is not
					if(!url.match("^(\/|http[s]?:).*")) {
						url = Aloha.getAlohaUrl() + '/' + url;
					}
				}
			}

			return url;
		}

	});

	return Aloha;
});