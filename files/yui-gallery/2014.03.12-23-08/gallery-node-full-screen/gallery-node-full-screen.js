YUI.add('gallery-node-full-screen', function(Y) {

/**
 * Provides a Node Plugin that enables Nodes to become full screen.
 *
 * @module gallery-node-full-screen
 **/

'use strict';

var FullScreen = Y.FullScreen,
	doc = Y.config.doc,
	prefix = FullScreen._vendorPrefix,
	EVENT_NAME = (prefix + 'fullscreenchange');
	
/**
 * FullScreen Node Plugin
 *
 * @class NodeFullScreen
 * @namespace Plugin
 * @constructor
 * @extends Plugin.Base
 **/
Y.namespace('Plugin').NodeFullScreen = Y.Base.create('NodeFullScreen', Y.Plugin.Base, [], {
	/**
	 * @property _listener
	 * @type EventListener
	 * @private
	 **/
	_listener: null,
	
	/**
	 * @method request
	 **/
	request: function() {
		var node = this.get('host'),
		
			el = node.getDOMNode(),
			
			target = (prefix === 'moz') ? doc : el;
		
		if (!FullScreen.isSupported()) {
			return;
		}
		
		this._listener = function() {
			FullScreen.fire('change', { node: node });

			FullScreen.once('change', function() {
				if (!FullScreen.isEnabled()) {
					target.removeEventListener(EVENT_NAME, this._listener, true);
				}
			});
		};
		
		// Use addEventListener and removeEventListener because browsers that support FullScreen
		// also support DOM Events
		target.addEventListener(EVENT_NAME, Y.bind(this._listener, this), true);
		
		switch (prefix) {
			case 'webkit':
				el.webkitRequestFullScreen();
				break;
			case 'moz':
				el.mozRequestFullScreen();
				break;
			default:
				el.requestFullScreen();
		}
	}
}, {
	NS: 'fullScreen'
});


}, 'gallery-2012.05.02-20-10' ,{requires:['gallery-full-screen', 'plugin', 'base-build', 'node-pluginhost'], skinnable:false});
