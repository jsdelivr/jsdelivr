/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

// Start Closure
(function(window, undefined) {
	
	var
		jQuery = window.alohaQuery, $ = jQuery,
		GENTICS = window.GENTICS,
		Aloha = window.Aloha;

	/**
	 * register the plugin with unique name
	 */
	Aloha.Hints = new (Aloha.Plugin.extend({
		_constructor: function(){
			this._super('hints');
		},
	
		/**
		 * Configure the available languages
		 */
		languages: ['en', 'de'],
		
		/**
		 * Initialize the plugin and set initialize flag on true
		 */
		init: function () {	
			$('body').bind('aloha',function (e) {
				// attach hint
				Aloha.editables[0].obj.poshytip({
					content: 'Move your mouse and click in the yellow outlined areas to start editing.',
					className: 'tip-twitter',
					showTimeout: 1,
					alignTo: 'target',
					alignX: 'left',
					alignY: 'center',
					offsetX: 15
				}).poshytip('show');
			});
	
		}
		
	}))();
})(window);
