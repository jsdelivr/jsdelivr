/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/

define(
['aloha', 'aloha/jquery', 'aloha/plugin', 'css!highlighteditables/css/highlighteditables.css'],
function(Aloha, jQuery, Plugin) {
	

	var
		GENTICS = window.GENTICS;

	return Plugin.create('highlighteditables', {

		/**
		 * default button configuration
		 */
		config: [ 'highlight' ],

		init: function () {

			// remember refernce to this class for callback
			var that = this,
				config;

			// highlight editables as long as the mouse is moving
			GENTICS.Utils.Position.addMouseMoveCallback(function () {
				var i,
					editable;

				for ( i = 0; i < Aloha.editables.length; i++) {
					editable = Aloha.editables[i];
					config = that.getEditableConfig( editable.obj );

					if ( !Aloha.activeEditable && !editable.isDisabled() && config == 'highlight' ) {
						editable.obj.addClass('aloha-editable-highlight');
					}
				}
			});

			// fade editable borders when mouse stops moving
			GENTICS.Utils.Position.addMouseStopCallback(function () {
				that.fade();
			});

			// mark active Editable with a css class
			Aloha.bind(
					"aloha-editable-activated",
					function (jEvent, aEvent) {
						that.fade();
					}
			);

		},
		/**
		 * fades all highlighted editables
		 */
		fade: function () {
			var
				i, editable,
				animateEnd = function () {
					jQuery(this).css('outline', '');
				};
			for ( i = 0; i < Aloha.editables.length; i++) {
				editable = Aloha.editables[i].obj;
				if (editable.hasClass('aloha-editable-highlight')) {
					editable.css('outline', editable.css('outlineColor') + ' ' + editable.css('outlineStyle') + ' ' + editable.css('outlineWidth'))
						.removeClass('aloha-editable-highlight')
						.animate({
							outlineWidth : '0px'
						}, 300, 'swing', animateEnd);
				}
			}
		}

	});
});

