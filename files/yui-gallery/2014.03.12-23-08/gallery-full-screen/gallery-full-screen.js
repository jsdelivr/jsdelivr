YUI.add('gallery-full-screen', function(Y) {

/**
 * Provides a browser FullScreen API inspired by the W3C Recommendation 
 * http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
 *
 * @module gallery-full-screen
 **/

'use strict';

var doc = Y.config.doc,
	docNode = Y.one(doc.documentElement),
	Lang = Y.Lang;

/**
 * FullScreen API
 *
 * @class FullScreen
 * @constructor
 * @extends Base
 **/
function FullScreen(config) {
	FullScreen.superclass.constructor.apply(this, arguments);
}

FullScreen.NAME = 'fullScreen';

FullScreen.ATTRS = {
	/**
	 * FullScreen Node if FullScreen mode is enabled otherwise null.
	 *
	 * @attribute node
	 * @type Node
	 **/
	'node': {
		value: null,
		readOnly: true
	}
};

/**
 * @event change
 * @param node
 **/

Y.extend(FullScreen, Y.Base, {
	/**
	 * @property _isSupported
	 * @type Boolean
	 * @private
	 **/
	_isSupported: false,
	
	/**
	 * @property _vendorPrefix
	 * @type String
	 * @private
	 **/
	_vendorPrefix: '',
	
	initializer: function() {
		this.publish('change', {
			emitFacade: true,
			broadcast: 2
		});
	
		this.before('change', function(e) {
			var isEnabled = this.get('enabled');
		
			this._set('node', isEnabled ? e.node : null);
		});
	},
	
	/**
	 * Indicates if FullScreen mode is supported by this browser.
	 * 
	 * @method isSupported
	 * @return {Boolean}
	 **/
	isSupported: function() {
		return this._isSupported;
	},
	
	/**
	 * Indicates if FullScreen mode is enabled.
	 * 
	 * @method isEnabled
	 * @return {Boolean}
	 **/
	isEnabled: function() {
		return false;
	},
	
	/**
	 * Exit FullScreen mode.
	 *
	 * @method exit
	 **/
	exit: function() {
	}
});

Y.FullScreen = new FullScreen();

(function() {
	var VENDOR_PREFIXES = new Y.ArrayList(['webkit', 'moz']);
	
	if (!Lang.isUndefined(doc.cancelFullScreen) || !Lang.isUndefined(doc.exitFullScreen)) {
		Y.FullScreen._isSupported = true;
	} else {
		// TODO: use the functional programming module to do a .some()
		VENDOR_PREFIXES.each(function(item) {
			if (!Y.FullScreen._isSupported && !Lang.isUndefined(doc[item + 'CancelFullScreen'])) {
				Y.FullScreen._isSupported = true;
				Y.FullScreen._vendorPrefix = item;
			}
		});
	}
}());

if (Y.FullScreen.isSupported()) {
	switch (Y.FullScreen._vendorPrefix) {
		case 'webkit':
			Y.mix(FullScreen.prototype, {
				isEnabled: function() {
					return doc.webkitIsFullScreen;
				},

				exit: function() {
					doc.webkitCancelFullScreen();

					this.fire('change', { node: null });
				}	
			}, true);
			
			break;
		case 'moz':
			Y.mix(FullScreen.prototype, {
				isEnabled: function() {
					return doc.mozFullScreen;
				},
			
				exit: function() {
					doc.mozCancelFullScreen();

					this.fire('change', { node: null });
				}
			}, true);
			
			break;
		default:
			Y.mix(FullScreen.prototype, {
				isEnabled: function() {
					return Lang.isUndefined(doc.fullscreenEnabled) ? doc.fullScreen : doc.fullscreenEnabled;
				},
			
				exit: function() {
					doc.exitFullscreen();

					this.fire('change', { node: null });
				}
			}, true);
	}
}

if (Y.FullScreen.isSupported()) {
	docNode.addClass('fullscreen');
	docNode.removeClass('no-fullscreen');
} else {
	docNode.removeClass('fullscreen');
	docNode.addClass('no-fullscreen');
}


}, 'gallery-2012.05.30-21-22' ,{requires:['arraylist', 'base-build', 'node-core', 'node-base'], skinnable:false});
